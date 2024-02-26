
<template>
  <div class="transition-all duration-700 my-width" :class="{ 'opacity-0': !ready }">
    <transition-expand :delay="300" :duration="600">
      <p v-if="orientationError" class="text-center text-lg text-teal-600">
        <Icon name="heroicons:arrow-path-rounded-square" class="inline-block w-6 h-6 mr-2" />
        {{ orientationError }}
      </p>
      <div v-else class=" h-80 max-w-full">
        <VueDraggableNext :list="pictures" @end="handleEnd" :move="handleMove" animation="500" tag="ul"
          class="flex flex-nowrap space-x-2 mb-4" :class="{ 'swap': swap }">
          <transition-group name="img-group">
            <li v-for="(picture, id) in pictures" :key="picture.src" class="relative" :style="basisStyle">
              <span v-if="picture.found"
                class="absolute w-full bg-teal-700/40 z-10 h-[calc(100%+110px)] grid place-content-center text-4xl border-b-2 border-yellow-300">
                🥇
              </span>
              <UChip :color="picture.found ? 'teal' : 'gray'" :size="picture.found ? '2xl' : 'md'" class="w-full">
                <NuxtImg v-if="!picture.src.includes('http')" v-bind="imgProperties(picture.src)" />
                <img v-else v-bind="imgProperties(picture.src)" />
              </UChip>
            </li>
          </transition-group>
        </VueDraggableNext>
        <ul v-auto-animate class="flex flex-nowrap space-x-2">
          <li v-for="(answer, id) in answers" :key="answer"
            class="grid place-content-center hover:opacity-90 transition-all bg-teal-900 h-20 border-4 border-teal-700 border-solid text-sm"
            :class="{ 'my-animation-shake': lastError.answer === answer }" :data-answer="answer" :style="basisStyle">
            {{ answer }}
          </li>
        </ul>
      </div>
    </transition-expand>
    <div v-if="shuffled && youWin">
      <AppFires class="opacity-80"/>
      <UModal v-model="youWin" prevent-close
        :ui="{ background: 'bg-gray-500', base: '', padding: 'p-5', width: 'w-72 h-32', container: 'grid items-center' }">
        <div class="text-xl font-bold m-2 p-2">Bravo... défi réussi !</div>
        <div class="flex p-3 items-center justify-around">
          <UButton v-if="replay !== 'no-replay'" :disabled="replay" variant="soft" @click="replay = true">
            {{ replay ? 'Chargement...' : 'Rejouer' }}</UButton>
          <UButton v-else @click="deepShuffle" variant="soft">Rejouer</UButton>
          <NuxtLink to="/" class="text-teal-600 underline">Retour aux quizz</NuxtLink>
        </div>
      </UModal>
    </div>
  </div>
</template>

<script setup lang = "ts">

import { VueDraggableNext } from 'vue-draggable-next'

const props = defineProps<{
  picsInit: { src: string; answer: string; }[],
  swap?: boolean,
}>()

const getPics = () => props.picsInit.map(picture => ({ ...picture, found: false }))
const getAnswers = () => props.picsInit.map(picture => picture.answer)

const ready = ref(false)
const shuffled = ref(false)
const pictures = ref(getPics())
const answers = ref(getAnswers())
const youWin = computed(() => pictures.value.every(picture => picture.found))
const basisStyle = computed(() => { return { 'flex-basis': `${100 / answers.value.length}%` } })
const screenOrientation = useScreenOrientation()
const acceptedOrientation: OrientationType[] = ['landscape-primary', 'landscape-secondary']
const lastError = ref({ picture: '', answer: '' })

// store moving indexes - used if option swap
const movingIndex = ref(0)
const lastIndex = ref(0)

const handleMove = (e: any) => {
  if (!props.swap) return true  // default (no swap) : all indexes between current and future are updating
  const { index, futureIndex } = e.draggedContext
  movingIndex.value = index
  lastIndex.value = futureIndex
  return false // swap : only current and future index are updating
}

const handleEnd = (e: any) => {
  if (props.swap)
    return handleEndSwap(e)
  const chosenAnswer = answers.value[e.newIndex]
  const chosenPicture = pictures.value[e.newIndex]
  if (chosenAnswer !== chosenPicture.answer)
    lastError.value.answer = chosenAnswer
}

const handleEndSwap = (e: any) => {
  const futureItem = pictures.value[lastIndex.value]
  const movingItem = pictures.value[movingIndex.value]
  const _items = Object.assign([], pictures.value) as typeof pictures.value
  _items[lastIndex.value] = movingItem
  _items[movingIndex.value] = futureItem
  pictures.value = _items

  const chosenAnswer = answers.value[lastIndex.value]
  if (chosenAnswer !== movingItem.answer)
    lastError.value.answer = chosenAnswer
}

const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5)
const deepShuffle = () => {
  let nbFound = 2
  while (nbFound > 1) {
    shuffle(answers.value)
    checkAnswer()
    nbFound = getNbFound()
  }
  shuffled.value = true
}
const getNbFound = () => pictures.value.filter(picture => picture.found).length
const imgProperties = (src: string) => {return {
  src: src,
  alt: 'inconnu ' + src,
  class: 'cursor-move hover:opacity-90 transition-all border-4 border-solid w-full',
}}

const orientationError = computed(() => {
  if (!ready.value || !screenOrientation.isSupported.value || !screenOrientation.orientation.value)
    return ''
  if (!acceptedOrientation.includes(screenOrientation.orientation.value))
    return 'Passer en mode paysage pour commencer le jeu'
  return ''
})

onMounted(async () => {
  shuffle(pictures.value)
  ready.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  deepShuffle()
});

const checkAnswer = () => {
  for (let i = 0; i < pictures.value.length; i++) {
    const pic = pictures.value[i]
    pic.found = pic.answer === answers.value[i]
  }
}

const resetLastError = async () => {
  if (lastError.value.picture || lastError.value.answer) {
    await new Promise(resolve => setTimeout(resolve, 300))
    lastError.value = { picture: '', answer: '' }
  }
}

// Replay : trigger refetch in parent
const replay = inject('replay', 'no-replay') as Ref<boolean> | 'no-replay'
watch(() => props.picsInit, () => {
  pictures.value = getPics()
  answers.value = getAnswers()
  deepShuffle()
})

watchEffect(() => checkAnswer())
watchEffect(() => resetLastError())   // reset last error whenever it changes to trigger the animation

</script>

<style>

.my-override-container:has(.my-width) {
  max-width: 100vw !important;
}
</style>

<style scoped > 
@import url("~/assets/mystyle.css");

 .swap .img-group-move {
   transition: all .3s;
 }
</style>