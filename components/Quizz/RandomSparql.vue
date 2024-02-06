
<template>
  <div>
    <div v-if="error" class="text-red-500 hidden">{{ error }}</div>
    <transition-expand>
      <QuizzGhostLoader v-if="pending" :nbItems="nbPics" class="w-[60vw] mx-auto my-8"/>
    </transition-expand>
    <QuizzDrag v-if="pics.length" :picsInit="pics" :easyMode="true" :class="{ 'opacity-0': pending }" />
  </div>
</template>

<script  setup>
import { watchEffect, ref, computed } from 'vue';
const nbPics = ref(6);
const imgWidth = 200
const date = ref('')  
const dateLine = computed(() => `# Requête sparql : ${date.value}`)  // to force refresh

const props = defineProps({
  sparqlQuery: {
    type: String,
    required: true
  },
  nbPics: {
    type: Number,
    required: false,
    default: 6
  },
})

const limit = `LIMIT ${props.nbPics + 5}`
const sparqlQuery = props.sparqlQuery + limit

const fullUrl = computed(() => baseUrl + encodeURIComponent(dateLine.value + sparqlQuery))

const baseUrl = 'https://query.wikidata.org/sparql?query='

const headers = { 'Accept': 'application/json' };
const pending = ref(true)
const { data: items, error: error } = await useFetch(baseUrl + encodeURIComponent(dateLine.value + sparqlQuery), { headers: headers });

const pics = ref([])

const cleanResults = (receivedPictures) =>
  receivedPictures.filter(picture =>
    !picture.answer.includes('http')   // url pour auteur inconnu
    && !picture.answer.includes('|')   // plusieurs auteurs
    && !picture.src.includes('.tiff')  // format non supporté
  )
  // remove duplicate answers and duplicate pictures
  .filter((picture, index, self) =>
    index === self.findIndex((t) => (
      t.answer === picture.answer
    ))
  )

watchEffect(() => {
  if (!items.value) return
  const receivedPictures = items.value.results.bindings.map((item) => {
    return {
      src: item.image.value + `?width=${imgWidth}`,
      answer: item.artisteLabels.value
    }
  })
  const cleanPics = cleanResults(receivedPictures)
  pics.value = cleanPics.length > nbPics.value ? cleanPics.slice(0, nbPics.value) : cleanPics
  console.log('pics : ', pics.value)
})

const clientFetch = async () => {
  date.value = new Date().toLocaleString()
  $fetch(fullUrl.value, { headers: { 'Accept': 'application/json' } }).then(response => items.value = response)
  .catch(error => error.value = error)
  .finally(() => setTimeout(() => pending.value = false, 1000));
}

onMounted(() => {
  if (!pics.value.length) {
    clientFetch()
  }
})



</script>