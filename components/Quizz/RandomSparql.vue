<template>
  <div>
    <div v-if="error" class="text-red-500 ">{{ error }}</div>
    <transition-expand>
      <QuizzGhostLoader v-if="!ready" :nbItems="quizz.nbPics" class="w-full max-w-3xl mx-auto my-8" />
    </transition-expand>
    <div v-if="pics.length">
      <QuizzChoice v-if="quizz.quizzTemplate === 'choice'" :pics="pics" :nbChoices="4" :class="{ 'opacity-0': !ready }"
        :quizz="quizz" />
      <QuizzDragMoveAnswers v-else-if="quizz.quizzTemplate === 'drag-move-answers'" :picsInit="pics" :class="{ 'opacity-0': !ready }" :swap="!quizz.no_swap" />
      <QuizzDrag v-else :picsInit="pics" :class="{ 'opacity-0': !ready }" :swap="!quizz.no_swap" />
      <!-- <QuizzMyTemplate v-else :picsInit="pics" :class="{ 'opacity-0': !ready }" :swap="!quizz.no_swap" /> -->
    </div>
  </div>
</template>

<script setup>
const imgWidth = 300
const date = ref('')
const dateLine = computed(() => `# Requête sparql : ${date.value}`)  // force refresh (cache)

const defaultImageLabel = 'image'
const defaultAnswerLabel = 'answerLabel'

const props = defineProps({
  quizz: {
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
const { data: items, error: error } = await useFetch(fullUrl, { headers: headers, server: false });

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
  if (items.value) {
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
  }
})

// allow children to refetch
const replay = ref(false)
provide('replay', replay)
watchEffect(async () => {
  if (replay.value) {
    date.value = new Date().toLocaleString()    // re-triggers fetch + avoid getting same results (cache)
  }
})

// let pics appear 
const ready = ref(false)
watchEffect(() => {
  if (pics.value.length) {
    setTimeout(() => {
      ready.value = true
      replay.value = false
    }, 700)
  }
})

</script>