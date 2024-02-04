
<template>
  <section>
    <div class="flex flex-col items-center space-y-4">
      <p class="text-lg">Chaque oeuvre est associée à un auteur</p>
      <p class="text-lg">Faites glisser chaque oeuvre vers son auteur</p>
    </div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <QuizzDrag :picsInit="pics"/>
  </section>
</template>

<script lang="ts" setup>
import { watchEffect, ref } from 'vue';

const sparqlQuery = `
#  +800 résultats
# doublons : plusieurs images, plusieurs auteurs
# - sample img -> 848 résultats
# - concat auteurs -> 819
# données manquantes : 
#  - auteurs inconnus (tête de méduse)

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
LIMIT 10
`;

const baseUrl = 'https://query.wikidata.org/sparql?query='

const headers = { 'Accept': 'application/sparql-results+json' };
const { data: items, error: error, pending: pending } = await useFetch(baseUrl + encodeURIComponent(sparqlQuery), { headers: headers });

const pics = ref([]) as any

watchEffect(() => {
  if (!items.value) return
  console.log('items : ', items.value)
  console.log('items : ', items.value.results)
  console.log('items : ', items.value.results.bindings[0])
  pics.value = items.value.results.bindings.map((item: any) => {
    console.log('item : ', item)
    return {
      src: item.image.value,
      answer: item.artisteLabels.value
    }
  })
  console.log('pics : ', pics.value)
})

</script>