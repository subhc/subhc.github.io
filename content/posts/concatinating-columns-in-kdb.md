+++
date = "2016-05-14T10:58:42+05:30"
title = "Concatenating kdb Columns"
tags = ["kdb"]
description = "First post of my blog!"
+++


Suppose in a query you need to concatenate two kdb columns into one; for example, to join date and time into one field - kdb has nifty features to do it easily.

1. You can join(`,`) two or more column into one using `'`(each-both). The columns do not need to be of the same type. The type of the returned column is list.
{{<highlight q "linenos=True">}}
q)tab:([]firstname:`John`Jia`Jai`Jac;lastname:`James`Jain`Jadeja`Jones;age:1+4?30)
q)tab
firstname lastname age
----------------------
John      James    19
Jia       Jain     24
Jai       Jadeja   25
Jac       Jones    19
q)
q)select name:(firstname,'lastname) from tab
name
----------
John James
Jia  Jain
Jai  Jadeja
Jac  Jones
{{</highlight>}}

2. A mixed list is formed if the columns are of different type. If you cast the columns to string before each-both join, a concatenated string is formed. You can also insert a character using `,'`.
{{<highlight q "linenos=True">}}
q)select col:((string firstname),'(string lastname),'"/",'(string age)) from tab
col
--------------
"JohnJames/19"
"JiaJain/24"
"JaiJadeja/25"
"JacJones/19"
{{</highlight>}}

3. If you need multi character delimiters, use `sv`. A nice advantage of this method is you don't have to individually convert each column to string.
{{<highlight q "linenos=True">}}
q)select col:({"--" sv x} each string (firstname,'lastname,'age)) from tab
col
-----------------
"John--James--19"
"Jia--Jain--24"
"Jai--Jadeja--25"
"Jac--Jones--19"
{{</highlight>}}

4. To add a string as prefix and postfix to a column, you can use `/:`(each right) and `\:`(each left) respectively.
{{<highlight q "linenos=True">}}
q)select ("Dear ",/:(string firstname)) from tab
firstname
-----------
"Dear John"
"Dear Jia"
"Dear Jai"
"Dear Jac"
q)select ((string age),\:" years") from tab
x
----------
"19 years"
"24 years"
"25 years"
"19 years"
q)select col:((string firstname),'(string lastname),'"/Age",/:(string age)) from tab
col
--------------
"JohnJames/Age19"
"JiaJain/Age24"
"JaiJadeja/Age25"
"JacJones/Age19"
{{</highlight>}}


5. Lets conclude by creating a JavaScript style array by joining all three columns.
{{<highlight q "linenos=True">}}
q)select ("['",/:(({"','" sv x} each string (firstname,'lastname,'age)),\:"']")) from tab
x
-----------------------
"['John','James','19']"
"['Jia','Jain','24']"
"['Jai','Jadeja','25']"
"['Jac','Jones','19']"
{{</highlight>}}
