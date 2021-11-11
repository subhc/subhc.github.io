+++
title = "The Curious Layperson: Fine-Grained Image Recognition without Expert Labels"
title_list = ["The Curious Layperson:", "Fine-Grained Image Recognition without Expert Labels"]
nopaging = true
nodate = true
nocomment = true
noheader = true
noindex = true
type = "projects"
layout = "template"
conference = "BMVC 2021 (Oral)"
authors = [ ["Subhabrata Choudhury","https://subhabratachoudhury.com/", " "],
            ["Iro Laina","http://campar.in.tum.de/Main/IroLaina", " "] ,
            ["Christian Rupprecht","https://chrirupp.github.io/", " "] ,
            ["Andrea Vedaldi","https://www.robots.ox.ac.uk/~vedaldi/", " " ] ]
affiliations = [ [" ", "VGG, University of Oxford","http://www.robots.ox.ac.uk/~vgg/", "/img/ox.svg" ] ]
links = [ ["paper","#paper"], ["video","#video"], ["code","#code"], ["supplementary","#supp"] ]
teaser = "/img/p/bmvc21_t.png"
results = "/img/p/bmvc21_r.jpg"
description = "We propose a novel task that enables fine-grained classification without using expert class information (e.g. bird species) during training. We frame the problem as document retrieval from general image descriptions by leveraging existing textual knowledge bases, such as Wikipedia."
video = "6OUxxh46jaA"
pdf_link = "/pdfs/choudhury21curious.pdf"
pdf_thumb= "/img/p/bmvc21_thumb.png"
simple_sections = [ ["Code", "[ coming soon ]", "https://github.com/subhc/clever", "/img/Octocat.png", 'code', 'no-border'] ,
                  ["Supplementary", "[ supplementary ]", "/pdfs/choudhury21curious_supp.pdf", "/img/p/bmvc21_supp_thumb.png", 'supp', 'border'] ]
abstract = "Most of us are not experts in specific fields, such as ornithology. Nonetheless, we do have general image and language understanding capabilities that we use to match what we see to expert resources. This allows us to expand our knowledge and perform novel tasks without ad-hoc external supervision. On the contrary, machines have a much harder time consulting expert-curated knowledge bases unless trained specifically with that knowledge in mind. Thus, in this paper we consider a new problem: fine-grained image recognition without expert annotations, which we address by leveraging the vast knowledge available in web encyclopedias. First, we learn a model to describe the visual appearance of objects using non-expert image descriptions. We then train a fine- grained textual similarity model that matches image descriptions with documents on a sentence-level basis. We evaluate the method on two datasets and compare with several strong baselines and the state of the art in cross-modal retrieval."
bibtex = ["@inproceedings{choudhury21curious,",
"author = {Choudhury, Subhabrata and Laina, Iro and Rupprecht, Christian and Vedaldi, Andrea},",
"booktitle = {British Machine Vision Conference}",
"title = {The Curious Layperson: Fine-Grained Image Recognition without Expert Labels}",
"volume = {32},",
"year = {2021}",
"}"]
+++
