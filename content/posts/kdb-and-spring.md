+++
date = "2016-03-24T10:53:13+05:30"
title = "Interfacing Java Spring with kdb"
tags = ["kdb", "java", "spring"]
description = "How to access an KDB server from Spring Framework"
+++

The classic way to access a kdb server from java is via the [c class](https://github.com/KxSystems/javakdb/blob/master/src/kx/c.java). The jdbc implementation makes it easy to interface with a kdb database providing higher level methods to establish a database connection, parse the returned object. One drawback is that it does not support retrieving result that is not a table. Let's go over a short guide on how to use jdbc to connect to kdb.

## kdb Server

First let’s start a kdb process to which the java client will connect over TCP port 7000. You can choose any port you like.

{{<highlight bash "linenos=True">}}

$ ./q
KDB+ 3.3 2016.03.14 Copyright (C) 1993-2016 Kx Systems
m32/ 4()core 8192MB subha tuchanka.local 192.168.0.101 NONEXPIRE

q)\p 7000
q)

{{</highlight>}}

## Spring Java Clent

### Maven Configuration

We are going to use Spring Boot with jdbc starter. Spring boot further simplifies the code by configuring Spring automatically wherever possible. `spring-boot-starter-jdbc` provides support for jdbc.

```pom.xml```:

{{<highlight xml "linenos=True">}}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                        http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>spring-kdb</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>spring-kdb</name>
    <description>Demo project for Spring kdb Integration</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.3.3.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
{{</highlight>}}

### Configuring Datasource

The jdbc driver for kdb not available in maven. It can be downloaded from [kx repository](http://kx.com/q/c/jdbc.jar). You can add it as a [build dependency](http://stackoverflow.com/questions/3280353/how-to-import-a-jar-in-eclipse) or [add to your local maven repo](http://www.mkyong.com/maven/how-to-include-library-manully-into-maven-local-repository/) and use it as a maven dependency. I am going to use the first approach.

Configure the driver class name and server URL in the `application.properties` file.

`/src/main/resources/application.properties`:

{{<highlight text "linenos=True">}}
spring.datasource.driverClassName=jdbc
spring.datasource.url=jdbc:q:localhost:7000
{{</highlight>}}


### Connecting to kdb

Spring boot will automatically configure the datasource class from the `application.properties` and you can use `@Autowired` annotation to pass it to a `jdbcTemplate`.

Let's make a kdb terminal in Java.

``src/main/java/hello/Application.java``:

{{<highlight java "linenos=True">}}
package hello;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.BufferedReader;




import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
//tab:flip `items`sales`prices!(`nut`bolt`cam`cog;6 8 0 3;10 20 15 20)
@SpringBootApplication
public class Application implements CommandLineRunner {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public static void main(String args[]) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... strings) throws IOException {
        InputStreamReader isr = new InputStreamReader(System.in);
        BufferedReader br = new BufferedReader(isr);
        while (true) {
            System.out.print("q) ");
            String sql = "q)" + br.readLine();
            try {
                jdbcTemplate.query(sql, (ResultSet rowSet) -> {
                        ResultSetMetaData m;
                        m = rowSet.getMetaData();
                        int columnCount = m.getColumnCount();
                        String fmt[] = new String[columnCount + 1];
                        int width = 0;

                        for (int i = 1; i <= columnCount; i++) {
                            fmt[i] = "%-" + m.getColumnDisplaySize(i) + "s";
                            System.out.format(fmt[i], m.getColumnLabel(i));
                            width += rowSet.getMetaData().getColumnDisplaySize(i);
                        }
                        System.out.print("\n");

                        for (int i = 1; i <= width; i++) {
                            System.out.print("-");
                        }
                        System.out.print("\n");

                        do{
                            for (int i = 1; i <= columnCount; i++) {
                                System.out.format(fmt[i], rowSet.getString(i));
                            }
                            System.out.print("\n");
                            if (rowSet.getRow() > 10) {
                                System.out.println("...");
                                rowSet.afterLast();
                            }
                        }while (rowSet.next());
                    });
            } catch (RuntimeException e) {
                if(e.getCause() instanceof SQLException) {
                    System.out.println(e.getCause().getMessage());
                }
            }
        }
    }
}
{{</highlight>}}

We are using `RowCallbackHandler` as we shall be processing the rows immediately. You can do away with all the SQL cuteness and run q statements directly by prefixing q statements with `q)`. All the exceptions from the jdbc class are thrown as runtime exceptions. An `SQLException` is generated if execution of the query fails. Apart from that `NullPointerException` is generated if a statement returns nothing upon execution such as assignment expressions `somevar:10`; and `ClassCastException` is thrown if you try to retrieve anything other than a table. Here I am handling only the `SQLException`s and masking all the others - which generally is not a good practice.

You need to first start the kdb server. You can run the client within eclipse or as a jar:


<figure>
    <img src="/img/P2_01.gif"></img>
</figure>

You can find the complete project [here](https://github.com/subhc/blogcodes/tree/master/spring-kdb-demo).


