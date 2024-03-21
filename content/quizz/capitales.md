---
name : "capitales"
title : "Capitales"
quizzTemplate : "choice"
description :  "...mais à partir des drapeaux, sinon c'est trop simple"
nbPics : 12
answerLabel : "capitalLabel"
imageLabel : "flag"
hideTitle : true
small : true
badges : "culture, géographie"
icon: "i-lucide-globe"
timer: true
---


```sparql

select ?flag ?itemLabel 
(MD5(CONCAT(str(?flag),str(RAND()))) as ?random)
(GROUP_CONCAT(DISTINCT ?capLabel; SEPARATOR = " | ") AS ?capitalLabel) 
where{
  ?country wdt:P31 wd:Q3624078;
        wdt:P41 ?flag;
        wdt:P36 ?capital.
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "fr,en".
    ?country rdfs:label ?itemLabel.
    ?capital rdfs:label ?capLabel.
  }
}
GROUP BY ?flag ?itemLabel 
order by ?random      

```
