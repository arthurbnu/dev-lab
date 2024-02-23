
<template>
  <div>
    <div v-if="error" class="text-red-500 hidden">{{ error }}</div>
    <transition-expand>
      <QuizzGhostLoader v-if="pending" :nbItems="quizz.nbPics" class="w-[60vw] mx-auto my-8" />
    </transition-expand>
    <div v-if="pics.length">
      <QuizzChoice v-if="quizz.quizzTemplate === 'choice'" 
        :pics="pics" :nbChoices="4" :class="{ 'opacity-0': pending }" :quizz = "quizz" />
      <QuizzDrag v-else 
        :picsInit="pics" :class="{ 'opacity-0': pending }" :swap = "!quizz.no_swap"/>   <!-- // drag -->
    </div>
  </div>
</template>

<script  setup>
const imgWidth = 300
const date = ref('')
const dateLine = computed(() => `# Requête sparql : ${date.value}`)  // to force refresh

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
    !picture.answer.includes('http')   // url pour auteur inconnu
    && !picture.answer.includes('|')   // plusieurs auteurs
    && !picture.src.includes('.tiff')  // format non supporté
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

onMounted(() => !pics.value.length && clientFetch())                                      // erreur fetch initial (coté serveur)

watchEffect(() => pics.value.length && setTimeout(() => pending.value = false, 700))      // délai pour charger les images

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