<template>
  <main class="min-h-screen">
    <!-- <AppHeader class="mb-6 text-center" :title="title" :description="description" /> -->
    <h1 class="text-2xl text-center mb-3">{{ title }}</h1>
    <!-- <QuizzRandomSparql :nbPics="nbPics" :sparqlQuery="sparqlQuery" /> -->
    <!-- <img src="http://coverartarchive.org/release-group/eabb68b3-d57c-359a-8215-91f38d365da5/front	" alt=""> -->
    <QuizzChoice :pics = "pics"/>
  </main>
</template>

<script setup>

import { onMounted } from 'vue';

onMounted(() => {
  return
  console.log("mounted")

  fetch('http://coverartarchive.org/release-group/9162580e-5df4-32de-80cc-f45a8d8a9b1d/front', {
    headers: {
      'Accept': 'application/json',
    },
  })
  // get json
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.warn('Error:', error);
  });


  fetch('https://ws-synchronic.ad.bnu.fr/api-affluences.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "X-Token" : "1234"
    },
    body: JSON.stringify({ "mail": "arthur.brody@bnu.fr" })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.warn('Error:', error);
  });

})

const title = "Test ";
const description = "page de test pour les requêtes";

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


const pics = [
    {
        src: "https://placehold.it/250x700",
        answer : "700"
    },
    {
        src: "https://placehold.it/700x250",
        answer : "250"
    },
    // {
    //     src: "https://placehold.it/250x400",
    //     answer : "400"
    // },
    // {
    //     src: "https://placehold.it/250x300",
    //     answer : "300"
    // },
    {
        src: "https://placehold.it/250x200",
        answer : "200"
    },
    {
        src: "https://placehold.it/250x100",
        answer : "100"
    }
]

</script>