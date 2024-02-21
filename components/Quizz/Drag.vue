
<template>
  <div class="transition-all duration-700" :class="{ 'opacity-0': !ready }">
    <transition-expand :delay="300" :duration="600" >
      <p v-if="orientationError" class="text-center text-lg text-teal-600">
        <Icon name="heroicons:arrow-path-rounded-square" class="inline-block w-6 h-6 mr-2" />
        {{ orientationError }}
      </p>
      <div v-else class=" h-80 max-w-full">
        <VueDraggableNext :list="pictures" @end="handleEnd" animation="500" tag="ul"
          class="flex flex-nowrap space-x-2 mb-4">
          <transition-group>
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
    <div v-if="youWin">
      <AppFires class="opacity-60" />
      <div class="absolute inset-0 flex justify-center items-center text-black z-50 text-center">
        <div class="bg-white/80 rounded-lg shadow-lg p-5 w-80 ">
          <span class="text-2xl font-bold m-1">Bravo !</span>
          <p>Défi réussi !</p> <br>
          <UButton color="primary" variant="soft" @click="shuffle(answers)">Rejouer</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang = "ts">

import { ref, watchEffect, computed, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

const props = defineProps<{
  picsInit: { src: string; answer: string; }[],
  easyMode?: boolean
}>()

const ready = ref(false)
const screenOrientation = useScreenOrientation()
const acceptedOrientation: OrientationType[] = ['landscape-primary', 'landscape-secondary']

const youWin = computed(() => pictures.value.every(picture => picture.found))
const lastError = ref({ picture: '', answer: '' })
const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5)
const getNbFound = () => pictures.value.filter(picture => picture.found).length
const imgProperties = (src: string) => { return {
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
  let nbFound = 2
  while (nbFound > 1) {
    shuffle(answers.value)
    checkAnswer()
    nbFound = getNbFound()
  } 
});

const handleEnd = (e: any) => {
  const chosenAnswer = answers.value[e.newIndex]
  const chosenPicture = pictures.value[e.newIndex]
  if (chosenAnswer !== chosenPicture.answer)
    lastError.value.answer = chosenAnswer
}

const pictures = ref(props.picsInit.map(picture => ({ ...picture, found: false })))
const answers = ref(props.picsInit.map(picture => picture.answer))
const basisStyle = { 'flex-basis': `${100 / answers.value.length}%` }

const checkAnswer = () => {
  for (let i = 0; i < pictures.value.length; i++) {
    const pic = pictures.value[i]
    pic.found = pic.answer === answers.value[i]
  }
}


const resetLastError =  async () => {
  if (lastError.value.picture || lastError.value.answer) {
    await new Promise(resolve => setTimeout(resolve, 300))
    lastError.value = { picture: '', answer: '' }
  }
}

watchEffect(() => checkAnswer())
watchEffect(() => resetLastError())   // reset last error each time its value is not empty to trigger the animation

</script>

<style>
.my-override-container {
  max-width: 100vw;
}
</style>

<style scoped >

  @import url("~/assets/mystyle.css");

</style>