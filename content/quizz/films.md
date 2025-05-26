---
name : "films"
title : "Films primés "
quizzTemplate : "choice"
description : "Trouvez le bon réalisateur"
nbPics : 12
answerLabel : "realLabel"
badges : "cinéma"
image : "oscar.jpg"
icon: "i-lucide-film"

---

```sparql
#title: Films et réals - récompensés aux Oscars

SELECT DISTINCT ?film   ?filmLabel ?realLabel
(MD5(CONCAT(str(?film),str(RAND()))) as ?random)
# (sample(?date) as ?firstDate)
(SAMPLE(?img) AS ?image) 
# (SAMPLE(?realLabel) AS ?realLabels) 
# (GROUP_CONCAT(DISTINCT ?realLabel; SEPARATOR = " | ") AS ?reals) 

WHERE {
  ?film wdt:P31 wd:Q11424;
    wdt:P57 ?real;
        wdt:P18 ?img;
        wdt:P577 ?date.
  
#   filter (year(?date) > 1980)
  

  ?film wdt:P166 ?recompense.
#  Une des récompenses : meilleur films, meilleur.e acteur.rice
  filter(?recompense in(wd:Q102427, wd:Q103618, wd:Q103916))
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
  
#     SERVICE wikibase:label {
#     bd:serviceParam wikibase:language "fr,en".
#     ?real rdfs:label ?realLabel.
#   }
}
GROUP BY ?film  ?filmLabel  ?realLabel  

```