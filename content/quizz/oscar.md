---
name : "oscar"
title : "Actrices ayant reçu un oscar "
description : "Remettez les images au dessus du bon nom"
nbPics : 10
badges : "cinéma"
image : "oscar.jpg"
icon: "i-lucide-film"

---

```sparql
#defaultView:ImageGrid
SELECT  ?date 
(MD5(CONCAT(str(?artiste),str(RAND()))) as ?random)
(SAMPLE(?image) AS ?image) 
(GROUP_CONCAT(DISTINCT ?artisteLabel; SEPARATOR = " | ") AS ?answerLabel) 
(GROUP_CONCAT(DISTINCT ?recompenseLabel; SEPARATOR = " | ") AS ?recompenseLabels) 
WHERE {
?artiste wdt:P31 wd:Q5;
        wdt:P166 ?recompense;
        wdt:P27 wd:Q30;
        
    wdt:P18 ?image;
    wdt:P569 ?date.

filter(?recompense in (wd:Q103618)).

SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
SERVICE wikibase:label {
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
    ?artiste rdfs:label ?artisteLabel.
    ?recompense rdfs:label ?recompenseLabel.
}
}
GROUP BY ?random ?date ?artiste 
ORDER BY ?random

```