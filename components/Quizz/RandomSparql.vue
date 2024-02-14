
<template>
  <div>
    <div v-if="error" class="text-red-500 hidden">{{ error }}</div>
    <transition-expand>
      <QuizzGhostLoader v-if="pending" :nbItems="nbPics" class="w-[60vw] mx-auto my-8"/>
    </transition-expand>
    <div v-if = "quizzTemplate === 'drag'">
      <QuizzDrag v-if="pics.length" :picsInit="pics" :easyMode="true" :class="{ 'opacity-0': pending }" />
    </div>
    <div v-else-if = "quizzTemplate === 'choice'">
      <QuizzChoice v-if="pics.length" :pics="pics" :nbChoices="4" :class="{ 'opacity-0': pending }" />
    </div>
  </div>
</template>

<script  setup>
import { watchEffect, ref, computed } from 'vue';
const imgWidth = 200
const date = ref('')  
const dateLine = computed(() => `# Requête sparql : ${date.value}`)  // to force refresh

const defaultImageLabel = 'image'
const defaultAnswerLabel = 'artisteLabels'

const props = defineProps({
  quizzTemplate: {
    type: String,
    required: false,
    default: 'drag'   // drag | choice
  },
  sparqlQuery: {
    type: String,
    required: true
  },
  nbPics: {
    type: Number,
    required: false,
    default: 6
  },
  imageLabel: {
    type: String,
    required: false,
    default: defaultImageLabel
  },
  answerLabel: {
    type: String,
    required: false,
    default: defaultAnswerLabel
  }
})

const limit = `LIMIT ${props.nbPics + 8}`
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
      t.answer === picture.answer || t.src === picture.src
    ))
  )

watchEffect(() => {
  if (!items.value) return
  const receivedPictures = items.value.results.bindings.map((item) => {
    return {
      src: item[props.imageLabel ?? defaultImageLabel].value + `?width=${imgWidth}`,
      answer: item[props.answerLabel ?? defaultAnswerLabel].value,
      article : item.article?.value
    }
  })
  const cleanPics = cleanResults(receivedPictures)
  pics.value = cleanPics.length > props.nbPics ? cleanPics.slice(0, props.nbPics) : cleanPics
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