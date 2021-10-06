+++
title = "Unsupervised Part Discovery with Contrastive Reconstruction"
nopaging = true
nodate = true
nocomment = true
noheader = true
type = "projects"
layout = "template"
conference = "NeurIPS 2021"
authors = [ ["Subhabrata Choudhury","https://subhabratachoudhury.com/", " "],
            ["Iro Laina","http://campar.in.tum.de/Main/IroLaina", " "] ,
            ["Christian Rupprecht","https://chrirupp.github.io/", " "] ,
            ["Andrea Vedaldi","https://www.robots.ox.ac.uk/~vedaldi/", " " ] ]
affiliations = [ [" ", "VGG, University of Oxford","http://www.robots.ox.ac.uk/~vgg/", "/img/ox.svg" ] ]
links = [ ["paper","#paper"], ["video","#video"], ["code","#code"], ["supplementary","#suppmat"] ]
teaser = "/img/p/neurips21a-teaser5.jpg"
results = "/img/p/neurips_220_results.jpg"
description = "We propose an unsupervised method to decompose a images of objects into semantically meaningful parts by building a self-supervised task that encourages the model to learning a semantic decomposition. <b><i>Top:</i></b> In our case, we combine three simple learning principles as “part proxy”: internally-consistent and distinctive appearance, and consistency to transformation (equivariance). <b><i>Bottom:</i></b> Our method works on various fine-grained but visually distinct categories e.g. birds (CUB-2011), human (DeepFashion), sheep (Pascal-Parts) etc."
video = "https://www.youtube-nocookie.com/embed/QH2-TGUlwu4"
pdf_link = ""
pdf_thumb= "/img/file-alt-regular.svg"
simple_sections = [ ["Code", "[ github link ]", "#code", "/img/Octocat.png", 'code'] ,
                  ["Supplementary", "[ supplementary ]", "#sm", "/img/file-alt-regular.svg", 'suppmat'] ]
abstract = "The goal of self-supervised visual representation learning is to learn strong, transferable image representations, with the majority of research focusing on object or scene level. On the other hand, representation learning at part level has received significantly less attention. In this paper, we propose an unsupervised approach to object part discovery and segmentation and make three contributions. First, we construct a proxy task through a set of objectives that encourages the model to learn a meaningful decomposition of the image into its parts. Secondly, prior work argues for reconstructing or clustering pre-computed features as a proxy to parts; we show empirically that this alone is unlikely to find meaningful parts; mainly because of their low resolution and the tendency of classification networks to spatially smear out information. We suggest that image reconstruction at the level of pixels can alleviate this problem, acting as a complementary cue. Lastly, we show that the standard evaluation based on keypoint regression does not correlate well with segmentation quality and thus introduce different metrics, NMI and ARI, that better characterize the decomposition of objects into parts. Our method yields semantic parts which are consistent across fine-grained but visually distinct categories, outperforming the state of the art on three benchmark datasets."
bibtex = ["@inproceedings{choudhury2021unsupervised,",
"author = {Choudhury, Subhabrata and Laina, Iro and Rupprecht, Christian and Vedaldi, Andrea},",
"booktitle = {Advances in Neural Information Processing Systems}",
"title = {Unsupervised Part Discovery with Contrastive Reconstruction}",
"volume = {34},",
"year = {2021}",
"}"]
+++
