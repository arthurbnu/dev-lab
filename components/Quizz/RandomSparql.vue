
<template>
  <div>
    <div v-if="error" class="text-red-500 hidden">{{ error }}</div>
    <transition-expand>
      <QuizzGhostLoader v-if="pending" :nbItems="quizz.nbPics" class="w-full max-w-3xl mx-auto my-8" />
    </transition-expand>
    <div v-if="pics.length">
      <QuizzChoice v-if="quizz.quizzTemplate === 'choice'" 
        :pics="pics" :nbChoices="4" :class="{ 'opacity-0': pending }" :quizz = "quizz" />
      <QuizzDrag v-else 
        :picsInit="pics" :class="{ 'opacity-0': pending }" :swap = "!quizz.no_swap"/>
    </div>
  </div>
</template>

<script setup>
const imgWidth = 300
const date = ref('')
const dateLine = computed(() => `# Requête sparql : ${date.value}`)  // force refresh (cache)

const defaultImageLabel = 'image'
const defaultAnswerLabel = 'artisteLabels'

const props = defineProps({
  quizz : {
    type: Object,
    required: true
  },
  sparqlQuery: {
    type: String,
    required: true
  },
})

const limit = `LIMIT ${props.quizz.nbPics + 8}`
const sparqlQuery = props.sparqlQuery + limit

const baseUrl = 'https://query.wikidata.org/sparql?query='
const fullUrl = computed(() => baseUrl + encodeURIComponent(dateLine.value + sparqlQuery))

const headers = { 'Accept': 'application/json' };
const pending = ref(true)
const { data: items, error: error } = await useFetch(baseUrl + encodeURIComponent(dateLine.value + sparqlQuery), { headers: headers });

const pics = ref([])

const cleanResults = (receivedPictures) =>
  receivedPictures.filter(picture =>
    !picture.answer.includes('http')   // unknown wikidata answer
    && !picture.answer.includes('|')   // several authors for one picture
    && !picture.src.includes('.tiff') 
  )
    // remove duplicate answers and duplicate pictures
    .filter((picture, index, self) =>
      index === self.findIndex((t) => (
        t.answer === picture.answer || t.src === picture.src
      ))
    ) // replace http:// by https:// in src
    .map(picture => {
      picture.src = picture.src.replace('http://', 'https://')
      return picture
    })

watchEffect(() => {
  if (!items.value) return
  const receivedPictures = items.value.results.bindings.map((item) => {
    return {
      src: item[props.quizz.imageLabel ?? defaultImageLabel].value + `?width=${imgWidth}`,
      answer: item[props.quizz.answerLabel ?? defaultAnswerLabel].value,
      article: item.article?.value,
      name: item.itemLabel?.value ?? item.peintureLabel?.value
    }
  })
  const cleanPics = cleanResults(receivedPictures)
  pics.value = cleanPics.length > props.quizz.nbPics ? cleanPics.slice(0, props.quizz.nbPics) : cleanPics
})

const clientFetch = async () => {
  date.value = new Date().toLocaleString()
  await $fetch(fullUrl.value, { headers: { 'Accept': 'application/json' } })
    .then(response => items.value = response)
    .catch(error => error.value = error)
}

onMounted(() => !pics.value.length && clientFetch())                                      // fetch if no pics (server side error)

watchEffect(() => pics.value.length && setTimeout(() => pending.value = false, 700))      // let pics appear 

// allow children to refetch
const replay = ref(false)
provide('replay', replay)
watchEffect(async () => {
  if (replay.value) {
    await clientFetch()
    replay.value = false
  }
})

</script>