+++
date = "2017-02-12T11:11:13+05:30"
title = "Running Native kdb Queries in Spring JDBC"
tags = ["kdb", "java", "spring", "nativeJDBC"]
description = "How to query using kdb native queries while using Spring JDBC framework"
+++

In my last post on [accessing a kdb+ server from spring]({{< relref "posts/kdb-and-spring.md" >}}), we configured Spring to listen to a kdb+ gateway via jdbc. One drawback of using jdbc is queries will now have to be written as single-line sql strings to match the type of JdbcTemplate query arguments. This strips away some advantages `c.java` style querying has. In this post we'll go over a way to use the native kdb executor method in spring jdbc so that we can use `c.java` style queries and at the same time retain some advantages of jdbc, such as, simple connection configuration, effortless connection management etc.

Let's take an example. In a trading system, quotes data is periodically updated with new of snapshots received from exchanges. Let’s make a barebones kdb quote store server. We will define a simple bid-ask quote table and a `upd` function to insert list of records into it. The update time will also be recorded along with the new values.

`/q/server.q`:
{{<highlight q "linenos=True">}}

quote:flip `time`sym`bid`ask!()

upd:{[arg]
 t:arg[0];                   /saves the table name to t
 x:arg[1];                   /saves the data received to x
 z:(count x)#.z.T;           /creates a list with current time (time of receiving x)
 t insert (enlist z),flip x; /insert time and data into t
 }

{{</highlight>}}

## kdb Server

First let’s start the server. The java client will connect to it over TCP port 7000.

{{<highlight bash "linenos=True">}}

$ q server.q -p 7000
KDB+ 3.4 2016.12.08 Copyright (C) 1993-2016 Kx Systems
m32/ 4()core 8192MB subha tuchanka.local 192.168.0.104 NONEXPIRE

q)

{{</highlight>}}

## Poking inside the JDBC Class

Within the code of [jdbc.jar](https://a.kx.com/q/c/jdbc.java) you will find that the connection to kdb gateway is handled by the sub-class `co` and in that class there is pretty interesting method which is actually managing executing `JdbcTemplte`'s query calls.


{{<highlight java "linenos=True">}}

public Object ex(String s,Object[]p)throws SQLException{
    try {
        return 0<c.n(p)?c.k(s,p):c.k(".o.ex",s.toCharArray());
    } catch(Exception e) {
        q(e);
        return null;
    }
}

{{</highlight>}}

So, If `h` is a handle of a kdb gateway `ex(String arg0,Object[] arg1)` is essentially equivalent to running the following kdb command:

{{<highlight q "linenos=True">}}

q) h "{value of arg0} {value of arg1}"

{{</highlight>}}

To run a kdb function using `ex` you need to pass the function's name to `arg0`, and all the required arguments for that function as a list to `arg1`. For example, arguments for `ex` to run the q expression ``count (`SYM;99.0;101.0)`` is:

{{<highlight java "linenos=True">}}
// conn is the connection object
Long ret = (Long) conn.ex("count", new Object[]{"SYM",new Double(99),new Double(101)}); 
System.out.print(ret);
{{</highlight>}}


## Extracting the underlying `co` object from jdbcTemplate


`JdbcTemplate` uses `org.apache.tomcat.jdbc.pool.PooledConnection` to manage connections. So we need to get a connection from the pool and then extract the `co` connection object within. Be careful to use try-with-resources with the pooled connection, because then at the end of the statement the underlying kdb connection will be returned to the pool and it will be reused in the next loops. 

{{<highlight java "linenos=True">}}
Connection c = jdbcTemplate.getDataSource().getConnection()
co conn = (co) c.getMetaData().getConnection();
{{</highlight>}}



I am using the [jdbc.jar](https://a.kx.com/q/c/) from kx site, in which, for some reason, the `jdbc` class resides in a default package. That means we cannot import `jdbc` with an import statement. We'll have to use reflection to get a handle to the `ex` method and invoke that. The class `co` is inside `jdbc` class, so the fully qualified name for it would be `jdbc$co`.


{{<highlight java "linenos=True">}}

Method executeQuery = Class.forName("jdbc$co").getMethod("ex", String.class, Object[].class);
Connection c = jdbcTemplate.getDataSource().getConnection()
Object conn = c.getMetaData().getConnection();
executeQuery.invoke(conn, arg0, arg1); 

{{</highlight>}}


## Spring Java Clent

Maven configurations are same as the previous post. In `application.properties` we need to add tomcat datapool specific configurations. 

`/src/main/resources/application.properties`:
{{<highlight java "linenos=True">}}

spring.datasource.url=jdbc:q:localhost:7000
spring.datasource.driverClassName=jdbc
spring.datasource.tomcat.initSql=q)1
spring.datasource.tomcat.validationQuery=q)1
spring.datasource.tomcat.testOnBorrow=true
spring.datasource.tomcat.testOnConnect=true
spring.datasource.tomcat.testOnIdle=true
spring.datasource.tomcat.validationInterval = 30000
spring.datasource.tomcat.maxIdle=10

{{</highlight>}}


We'll make an CLI application by implementing `CommandLineRunner` interface. 

We are going to connect to the gateway and use the `upd` function defined in `server.q` to insert records into quote. For this example, I'll create dummy datafeed using a list of price and stocks (example below) and randomizing it a bit to create bid/ask columns. 

`stocks.list`:
{{<highlight java "linenos=True">}}
GOOG=808.38
GOOGL=829.88
AAPL=132.04
FB=134.2
MSFT=63.34
{{</highlight>}}

Here is the complete code incorporating all the things we have discussed:
`src/main/java/hello/Application.java`:
{{<highlight java "linenos=True">}}
package hello;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

@SpringBootApplication
public class Application implements CommandLineRunner {

    @Autowired
    JdbcTemplate jdbcTemplate;

    private Map<String, Double> stocksList;
    private Method executeQuery;

    public static void main(String args[]) {
        SpringApplication.run(Application.class, args);
    }



    @Override
    public void run(String... strings) {

        stocksList = getStockList();

        try {
            executeQuery = Class.forName("jdbc$co").getMethod("ex", String.class, Object[].class);
        } catch (NoSuchMethodException | ClassNotFoundException e) {
            System.err.println("kdb+ JDBC driver has not loaded properly");
            e.printStackTrace();
            System.exit(1);
        }

        while(true) {


            try(Connection c = jdbcTemplate.getDataSource().getConnection()){
                executeQuery.invoke(c.getMetaData().getConnection(), "upd", new Object[]{"quote", getDummyData()});
                Thread.sleep(1000);

            } catch (  IllegalAccessException | InvocationTargetException | InterruptedException | SQLException e) {
                e.printStackTrace();
            }
        }

    }

    private Object[] getDummyData() {
        List<Object[]> l = new ArrayList<>();
        stocksList.forEach((k,v) -> l.add(new Object[]{k, v-2*Math.round(100*Math.random())/100.0, v+2*Math.round(100*Math.random())/100.0}));
        return l.toArray();
    }

    private Map<String, Double> getStockList() {
        Map<String, Double> ret = new HashMap<>();
        try {
            Properties props = new Properties();
            FileInputStream in = new FileInputStream(new ClassPathResource("stocks.list").getFile());
            props.load(in);
            props.forEach((k,v) -> ret.put((String)k, Double.parseDouble((String)v)));
            in.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

        return ret;
    }
}


{{</highlight>}}


## Run Instructions

 Open the project in IntelliJ IDEA/Eclipse. Add [this jar](http://kx.com/q/c/jdbc.jar) to your build path and run the client.

 Now if you query quote you should see new data coming in every second
  
{{<highlight text>}}

  ~/Workspace/sping-kdb-native/q $ rlwrap q server.q -p 7000
  KDB+ 3.4 2016.12.08 Copyright (C) 1993-2016 Kx Systems
  m32/ 4()core 8192MB subha tuchanka.local 192.168.0.101 NONEXPIRE
      
  q)quote
  time         sym   bid    ask
  --------------------------------
  20:19:51.463 CERN  52.93  53.93
  20:19:51.463 VMW   87.76  90.76
  20:19:51.463 GOOGL 829.88 829.88
  20:19:51.463 AAPL  132.04 132.04
  20:19:51.463 YHOO  44.07  45.07
  20:19:51.463 ADI   77.48  78.48
  20:19:51.463 BIDU  181.5  181.5
  20:19:51.463 INFO  38.71  40.71
  20:19:51.463 ITW   127.12 128.12
  20:19:51.463 ADP   95.58  96.58
  20:19:51.463 STM   13.94  14.94
  20:19:51.463 CHKP  99.56  100.56
  20:19:51.463 PNR   57.96  58.96
  20:19:51.463 STX   44.8   46.8
  20:19:51.463 WDC   76.08  78.08
  20:19:51.463 XLNX  58.23  59.23
  20:19:51.463 AMD   13.56  14.56
  20:19:51.463 CTSH  56.45  57.45
  20:19:51.463 DVMT  64.84  65.84
  20:19:51.463 INFY  13.11  15.11
  ..
  q)count quote
  192225
  q)
  
{{</highlight>}}


You can find the complete project [here](https://github.com/subhc/blogcodes/tree/master/spring-kdb-native).











