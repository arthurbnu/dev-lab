---
title: "Créatrices d'Alsace"
description: "Dictionnaire des créatrices"  
---


```sparql
# Requête SPARQL pour les créatrices alsaciennes
#title: Créatrices d'Alsace
# #defaultView:ImageGrid
SELECT DISTINCT ?creatrice ?creatriceLabel ?professionLabel ?image ?id ?lieuNaissanceLabel ?article ?statements ?siteLinks ?articleName
# (GROUP_CONCAT(DISTINCT ?professionLabel; separator=", ") as ?p)
WHERE {
  ?creatrice wdt:P31 wd:Q5;
#   wdt:P106 ?profession;
    wdt:P19 ?lieuNaissance;
    wdt:P7578 ?id;
    wdt:P21 wd:Q6581072;
    wdt:P27 wd:Q142.
  
  ?creatrice wikibase:sitelinks ?siteLinks;
             wikibase:statements ?statements.
             
  OPTIONAL { ?creatrice wdt:P18 ?image. }
  OPTIONAL {
    ?article schema:about ?creatrice;
    schema:name ?articleName;
    schema:isPartOf <https://fr.wikipedia.org/>;
    schema:inLanguage "fr".
  }
  ?lieuNaissance wdt:P131 ?loc.
  FILTER(?loc IN(wd:Q12717, wd:Q12722))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}
ORDER BY (?statements)
LIMIT 100

```
