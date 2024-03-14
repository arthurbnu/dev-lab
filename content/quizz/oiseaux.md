---
name : "oiseaux"
title : "Oiseaux du monde"
quizzTemplate : "choice"
description :  ""
nbPics : 12
answerLabel : "itemLabel"
small : true
hideTitle : true
badges : "biologie"
image : "oiseaux2.png"
icon: "i-lucide-bird"
---


```sparql

#defaultView:ImageGrid
select ?item ?itemLabel ?article
(MD5(CONCAT(str(?item),str(RAND()))) as ?random)
(SAMPLE(?image) as ?image) 
where {
  
  ?item wdt:P31 wd:Q16521;
        wdt:P18 ?image;
        wdt:P5257 ?id;
        wdt:P4798 ?_id;
        wdt:P10007 ?id2.
        
      # article wikipédia français associé
      ?article schema:about ?item .
      ?article schema:inLanguage "fr" .
      ?article schema:isPartOf <https://fr.wikipedia.org/>.   
  
       SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
  }
group by ?item ?itemLabel ?article
ORDER BY ?random


```
