
<template>
  <div>
    <div v-if="error" class="text-red-500 hidden">{{ error }}</div>
    <div v-if="pending">
      <div class="animate-pulse flex space-x-4 w-[80%] m-auto py-4 px-[2vw]">
        <div class = "w-full flex justify-between">
          <div v-for="n in nbPics" :key="n"
          class="rounded-full bg-gray-200 h-14 w-14"></div>
        </div>
        <div class="w-full">
        <div class = "w-full flex justify-between mt-5">
            <div v-for = "n in nbPics" :key="n" class="h-4 bg-primary-200 rounded w-14"></div>
        </div>

        </div>
      </div>
    </div>
    <QuizzDrag v-else-if="pics.length" :picsInit="pics"/>
  </div>
</template>

<script  setup>
import { watchEffect, ref } from 'vue';
const nbPics = ref(7);

const sparqlQuery = `
#  +800 résultats
# doublons : plusieurs images, plusieurs auteurs
# - sample img -> 848 résultats
# - concat auteurs -> 819
# données manquantes : 
#  - auteurs inconnus (tête de méduse )

#defaultView:ImageGrid
#             wdt:P347 ?idJoconde.        # 80 oeuvres sur +800
#             wdt:P973 ?descriptionUrl.   # 590
SELECT ?peintureLabel ?mouvementLabel ?peinture 
(MD5(CONCAT(str(?peinture),str(RAND()))) as ?random)
(SAMPLE(?image) AS ?image) 
(GROUP_CONCAT(DISTINCT ?artisteLabel; SEPARATOR = " | ") AS ?artisteLabels) WHERE {
  ?peinture wdt:P31 wd:Q3305213;
    wdt:P135 ?mouvement;
    wdt:P18 ?image;
    wdt:P170 ?artiste.
  ?mouvement (wdt:P31|wdt:P361) wd:Q4692.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
    ?artiste rdfs:label ?artisteLabel.
  }
}
GROUP BY ?peintureLabel ?mouvementLabel ?peinture
ORDER BY ?random
LIMIT ${nbPics.value}
`;

const baseUrl = 'https://query.wikidata.org/sparql?query='


const headers = { 'Accept' : 'application/json'};
const pending = ref(true)
const { data: items, error: error } = await useFetch(baseUrl + encodeURIComponent(  sparqlQuery), { headers: headers });

const pics = ref([])

const cleanResults = (receivedPictures) => 
  receivedPictures.filter(picture => ! picture.answer.includes('http') 
  && ! picture.answer.includes('|')
  && ! picture.src.endsWith('.tiff')
  )

watchEffect(() => {
  if (! items.value) return
  const receivedPictures = items.value.results.bindings.map((item) => {
    return {
      src: item.image.value,
      answer: item.artisteLabels.value
    }
  })
  pics.value = cleanResults(receivedPictures)
  console.log('pics : ', pics.value)
})

const clientFetch = async () => {
  $fetch(baseUrl + encodeURIComponent(sparqlQuery), { headers : {'Accept'   : 'application/json'}}).then(response => {
      items.value = response
  })
  .catch(error => {
      error.value = error
      console.log('error : ', error)
    }) 
  .finally(() => {
    setTimeout(() => pending.value = false, 1000)
      // pending.value = false 
      console.log('items : ', items.value)
  });
}

onMounted(() => {
  if (! pics.value.length) {
    clientFetch()
  }
})



</script>