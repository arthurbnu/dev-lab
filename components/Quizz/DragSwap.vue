
<template>
  <div class="transition-all duration-700" :class="{ 'opacity-0': !ready }">
    <transition-expand :delay="300" :duration="600" :easing="'cubic-bezier(0.6, 0, 0.4, 2)'">
      <p v-if="orientationError" class="text-center text-lg text-teal-600 transition-all">
        <Icon name="heroicons:arrow-path-rounded-square" class="inline-block w-6 h-6 mr-2" />
        {{ orientationError }}
      </p>
      <div v-else class=" h-80 shadow-lg  max-w-full transition-all">
        <VueDraggableNext :list="pictures" @end="handleEnd" tag="ul" :move="handleMove" 
          class="flex flex-nowrap space-x-2 mb-4">
          <transition-group class="img-group" name="img-group">
            <li v-for="(picture, id) in pictures" :key="picture.src" class="relative" :style="basisStyle">
              <!-- <li v-for="(picture, id) in pictures" :key="picture.src" class="relative flex items-end" :style="basisStyle"> -->
              <span v-if="picture.found"
                class="absolute w-full h-full bg-teal-700/40 z-10 transition-all my-height grid place-content-center text-4xl border-b-2 border-yellow-300">
                🥇
              </span>
              <UChip :color="picture.found ? 'teal' : 'gray'" :size="picture.found ? '2xl' : 'md'" class="w-full">
                <NuxtImg v-if="!picture.src.includes('http')" :src="picture.src" :alt="'inconnu ' + picture.src"
                  :class="{ 'my-error': lastError.picture === picture.src }"
                  class="cursor-move hover:opacity-90 transition-all border-4 border-solid w-full" />

                <img v-else :src="picture.src" :alt="'inconnu ' + picture.src"
                  :class="{ 'my-error': lastError.picture === picture.src }"
                  class="cursor-move hover:opacity-90 transition-all border-4 border-solid w-full" />
                <!-- component is nuxtimg if relative path, img otherwise -->
                <!-- <component :is="picture.src.includes('http') ? 'img' : NuxtImg" 
              :src="picture.src" :alt ="'inconnu ' + picture.src"
              :class="{ 'my-error': lastError.picture === picture.src }"
              class="cursor-move hover:opacity-90 transition-all border-4 border-solid" /> -->
              </UChip>
            </li>
          </transition-group>
        </VueDraggableNext>
        <ul v-auto-animate class="flex flex-nowrap space-x-2">
          <li v-for="(answer, id) in answers" :key="answer"
            class="grid place-content-center hover:opacity-90 transition-all bg-teal-900 h-20 border-4 border-teal-700 border-solid text-sm"
            :class="{ 'my-error': lastError.answer === answer }" :data-answer="answer" :style="basisStyle">
            {{ answer }}
          </li>
        </ul>
      </div>
    </transition-expand>
    <div v-if="!ready" class="absolute inset-0 flex justify-center items-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-900"></div>
    </div>
    <div v-if="youWin">
      <AppFires class="opacity-60" />
      <div class="absolute inset-0 flex justify-center items-center text-black z-50">
        <div class="bg-white/80 rounded-lg shadow-lg p-5 w-80 ">
          <h3 class="text-2xl font-bold text-center">Bravo !</h3>
          <p class="text-center">Tu as reconnu tout le monde !</p>
          <div class="flex justify-center mt-5">
            <button @click="shuffle(answers)"
              class="bg-teal-900 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-teal-700 transition-all">
              Rejouer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang = "ts">

import { ref, watchEffect, computed, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

const screenOrientation = useScreenOrientation()
const acceptedOrientation: OrientationType[] = ['landscape-primary', 'landscape-secondary']

const ready = ref(false)
const youWin = computed(() => pictures.value.every(picture => picture.found))
const lastError = ref({ picture: '', answer: '' })

const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5)

const orientationError = computed(() => {
  if (!ready.value)
    return ''
  if (!screenOrientation.isSupported.value || !screenOrientation.orientation.value)
    return ''
  if (!acceptedOrientation.includes(screenOrientation.orientation.value))
    return 'Passer en mode paysage pour commencer le jeu'
  return ''
})

const getNbFound = () => pictures.value.filter(picture => picture.found).length

onMounted(() => {
  shuffle(pictures.value)
  ready.value = true
  setTimeout(() => {
    let nbFound = 2
    while (nbFound > 1) {
      shuffle(answers.value)
      checkAnswer()
      nbFound = getNbFound()
    }
  }
    , 500);
});

// reset last error each time its value is not empty to trigger the animation
watchEffect(async () => {
  if (lastError.value.picture || lastError.value.answer) {
    await new Promise(resolve => setTimeout(resolve, 300))
    lastError.value = { picture: '', answer: '' }
  }
})

const movingIndex = ref(0)
const lastIndex = ref(0)

const handleMove = (e: any) => {
  const { index, futureIndex } = e.draggedContext
  movingIndex.value = index
  lastIndex.value = futureIndex
  return false // disable sort
}


const handleEnd = (e: any) => {  
  const futureItem = pictures.value[lastIndex.value]
  const movingItem = pictures.value[movingIndex.value]
  const _items = Object.assign([], pictures.value)
  _items[lastIndex.value] = movingItem
  _items[movingIndex.value] = futureItem
  pictures.value = _items

  const chosenAnswer = answers.value[lastIndex.value]
  if (chosenAnswer !== movingItem.answer)
    lastError.value.answer = chosenAnswer
}

// watchEffect(() => {
//   pictures.value = [pic, ...pictures.value.filter(picture => picture.src !== selectedPicture.value)]
//     answers.value = [selectedAnswer.value, ...answers.value.filter(answer => answer !== selectedAnswer.value)]
// })

const props = defineProps<{
  picsInit: { src: string; answer: string; }[],
  easyMode?: boolean
}>()

const pictures = ref(props.picsInit.map(picture => ({ ...picture, found: false })))
const answers = ref(props.picsInit.map(picture => picture.answer))

const basisStyle = { 'flex-basis': `${100 / answers.value.length}%` }

const checkAnswer = () => {
  for (let i = 0; i < pictures.value.length; i++) {
    const pic = pictures.value[i]
    pic.found = pic.answer === answers.value[i]
  }
}

// trie à gauche toutes les images trouvées
const sortFound = () => {
  // const found = pictures.value.filter(picture => picture.found)
  // const notFound = pictures.value.filter(picture => !picture.found)
  // pictures.value = [...found, ...notFound]
  // pictures.value = pictures.value.sort((a, b) => a.found ? -1 : 1)
}

watchEffect(() => checkAnswer())
watchEffect(() => props.easyMode && sortFound())

</script>

<style>
.my-override-container {
  max-width: 100vw;
}

/* .img-group * {
  transition: all 0.5s ease;
} */

.img-group-move {
  transition: all 0.7s;
}

</style>

<style scoped lang="scss">
.my-height {
  height: calc(100% + 110px);
}

.my-error {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }

  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }

  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }

  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }

  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }

  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }

  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }

  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }

  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }

  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }

  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>