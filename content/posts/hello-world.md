+++
date = "2016-03-12T12:53:29+05:30"
title = "Hello World!"
tags = ["meta", "hugo", "d3"]
description = "First post of my blog!"
+++

For more than half a decade - since my freshman year at college, I have spent thinking how cool it would be to have a website of my own. At long last, I now have one! The plan is to post something interesting on a regular basis. 

Now that it's up, I wish I had done it sooner. We are never happy with ourselves, aren’t we?

### Making-of

It took two weeks to create the design and code the website. Idea was to create something that is light and minimal. I created few mockups of what I wanted the site to look like:

<figure>
    <img class="largeimg" src="/img/P1_01.jpg"></img>
</figure>

It was fun coding. I deviated from the wireframes a bit in my pursuit to make the website as responsive as possible. 

The site is built upon a customized bootstrap template. Most of it is pretty standard stuff. The front page portrait is created in [d3.js](https://d3js.org). d3 is an impressive library written in JavaScript to create and manipulate visualizations from data. There I have two transitions being applied to multiple polygons simultenously. I found `d3.transition` kept the CPU usage of the browser pegged above 50%. So I did the animations  frame-by-frame manually at a 12 fps speed. This approach dropped the CPU usage below 10%. Also in the about page, the contact form is actually a google from that submits the data to a hidden iframe. 

The prototype was then used to create the theme (views) for Hugo to use. [Hugo](https://gohugo.io) a static site generator written in [Go](https://golang.org). It's an absolute delight to use. Hugo creates html pages from the markdown content using theme and templates. The workflow is something like the following. You will write your all your posts in markdown. Hugo then generates all the pages, does styling of the pages according to the page template, if configured adds pages to the lists, links the tags (if present) and, outputs the whole site in a folder. You would then replace the web server content with it. If you have enabled deploying your web site via git, uploading to server becomes really easy.
