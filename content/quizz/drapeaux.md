---
name : "drapeaux"
title : "Quizz - Drapeaux"
quizzTemplate : "choice"
description :  ""
nbPics : 12
answerLabel : "countryLabel"
imageLabel : "flag"
---


```sparql

select ?flag ?countryLabel ?image
(MD5(CONCAT(str(?flag),str(RAND()))) as ?random)
where{

  ?country wdt:P31 wd:Q3624078;
        wdt:P41 ?flag
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr" . }

  }
order by ?random
      

```
