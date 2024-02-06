<template>
  <main class="min-h-screen">
    <AppHeader class="mb-6 text-center" :title="title" :description="description" />
    <QuizzRandomSparql :nbPics="nbPics" :sparqlQuery="sparqlQuery" />
  </main>
</template>

<script setup>

const title = "Quizz - actrices ayant reçu un oscar ";
const description = "Remettez les photos au dessus du bon nom ! ";

const nbPics = 7

const sparqlQuery = `
#defaultView:ImageGrid
#             wdt:P347 ?idJoconde.        # 80 oeuvres sur +800
#             wdt:P973 ?descriptionUrl.   # 590
SELECT  ?date 
(MD5(CONCAT(str(?artiste),str(RAND()))) as ?random)
(SAMPLE(?image) AS ?image) 
(GROUP_CONCAT(DISTINCT ?artisteLabel; SEPARATOR = " | ") AS ?artisteLabels) 
(GROUP_CONCAT(DISTINCT ?recompenseLabel; SEPARATOR = " | ") AS ?recompenseLabels) 
WHERE {
  ?artiste wdt:P31 wd:Q5;
#          wdt:P106 wd:Q33999;    # Américain
          wdt:P166 ?recompense;
          wdt:P27 wd:Q30;
          
    wdt:P18 ?image;
    wdt:P569 ?date.
  
  filter(?recompense in (wd:Q103618)).
#   filter(?recompense in (wd:Q103916, wd:Q103618)).
  
#   filter(year(?date) > 1970).  
#   filter(year(?date) > 1950).

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
    ?artiste rdfs:label ?artisteLabel.
    ?recompense rdfs:label ?recompenseLabel.
  }
}
GROUP BY ?random ?date ?artiste 
ORDER BY ?random
`;

</script>