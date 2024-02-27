---
name : "beatles"
title : "Beatles"
description : "Remettez les images de chaque Album au dessus du bon titre de chanson"
nbPics : 7
answerLabel : "trackListLabel"
badges : "musique"
no_swap : true
image : "beatles.jpg"
icon: "i-lucide-music"
---


```sparql
# Albums et titres associés
SELECT ?trackListLabel ?trackList 
(SAMPLE(?albumLabel) AS ?albumLabels) 
(SAMPLE(?img) AS ?image) (SAMPLE(?musicBrainz) AS ?musicBrainzFirst) 
(MD5(CONCAT(STR(?trackList), STR(RAND()))) AS ?random) 
WHERE {
  ?album wdt:P31 wd:Q482994;
    wdt:P1476 ?titre;
    wdt:P175 ?musicien;
    wdt:P658 ?trackList.
  wd:P436 wdt:P1630 ?formatterurl.
  ?album wdt:P436 ?musicBrainz.
  BIND(IRI(REPLACE(?musicBrainz, "^(.+)$", ?formatterurl)) AS ?musicBrainzUrl)
  BIND(CONCAT("http://coverartarchive.org/release-group/", ?musicBrainz, "") AS ?p)
  BIND(CONCAT(?p, "/front", "") AS ?img)
  FILTER(?musicien IN(wd:Q1299))
  FILTER(?album IN(wd:Q199585, wd:Q173643, wd:Q60676411, wd:Q185121, wd:Q169226))
  ?article schema:about ?album;
    schema:inLanguage "fr";
    schema:isPartOf <https://fr.wikipedia.org/>.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
    ?trackList rdfs:label ?trackListLabel.
    ?album rdfs:label ?albumLabel.
  }
}
GROUP BY ?trackListLabel ?random ?trackList
ORDER BY (?random)
```