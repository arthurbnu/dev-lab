
<template>
  <main class="min-h-screen transition-all duration-700" :class="{ 'opacity-0': !ready }">
    <AppHeader class="mb-5 text-center" :title="title" :description="description" />
    <transition-expand>
      <p v-if = "orientationError" class = "text-center text-lg text-teal-600 transition-all">    
        <Icon name = "heroicons:arrow-path-rounded-square" 
        class = "inline-block w-6 h-6 mr-2" />
        {{ orientationError }}
      </p>
    <div v-else class=" h-80 shadow-lg  max-w-full transition-all">
      <!-- <ul v-auto-animate class="flex flex-nowrap space-x-2 mb-4"> -->
      <VueDraggableNext :list="pictures" @end="handleEnd" animation="500" tag="ul" class="flex flex-nowrap space-x-2 mb-4">
        <transition-group>
          <li v-for="picture in pictures" :key="picture.src" class="relative" :style="basisStyle">
            <span v-if="picture.found"
              class="absolute w-full h-full bg-teal-700/40 z-10 transition-all my-height grid place-content-center text-4xl border-b-2 border-yellow-300">
              🥇
            </span>
            <img :src="baseSrc + picture.src" :alt ="'inconnu ' + picture.src"
              :class="{ 'my-error': lastError.picture === picture.src }"
              class="cursor-move hover:opacity-90 transition-all border-4 border-solid">
          </li>
        </transition-group>
      </VueDraggableNext>
      <ul v-auto-animate class="flex flex-nowrap space-x-2">
        <li v-for="answer in answers" :key="answer"
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
  </main>
</template>

<script setup lang = "ts">

import { ref, watchEffect, computed, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
// import { useScreenOrientation } from '#imports';

const screenOrientation = useScreenOrientation()
const acceptedOrientation:OrientationType[] = ['landscape-primary', 'landscape-secondary']

const title = "L'IPNI selon l'Intelligence Artificielle";
const description = "Tout est dans le désordre.. Essaye de remettre chaque image au dessus du bon prénom !";

useSeoMeta({
  title: title,
  description,
  author: "A B",
  ogImage: "https://dev-lab-one.vercel.app/quizz/quizz-ipni.png",
  ogUrl: "https://dev-lab-one.vercel.app/quizz",
  ogType: "website",
  ogTitle: title,
  ogDescription: description,
  themeColor: "teal",
});

const ready = ref(false)
const youWin = computed(() => pictures.value.every(picture => picture.found))
const lastError = ref({ picture: '', answer: '' })

const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5)

const baseSrc = process.env.NODE_ENV === 'development' ? '' : 'quizz/'

const orientationError = computed(() => {
  if (!ready.value ) 
    return ''
  if (!screenOrientation.isSupported.value || !screenOrientation.orientation.value) 
    return ''
  if (!acceptedOrientation.includes(screenOrientation.orientation.value))
    return 'Passer en mode paysage pour commencer le jeu'
  return ''  
})

onMounted(() => { 
  shuffle(pictures.value)
  ready.value = true
  setTimeout(() => shuffle(answers.value), 500);
});

// reset last error each time its value is not empty to trigger the animation
watchEffect(async () => {
  if (lastError.value.picture || lastError.value.answer) {
    await new Promise(resolve => setTimeout(resolve, 300))
    lastError.value = { picture: '', answer: '' }
  }
})

const handleEnd = (e: any) => {
  const chosenAnswer = answers.value[e.newIndex]
  const chosenPicture = pictures.value[e.newIndex]
  if (chosenAnswer !== chosenPicture.answer) { 
    lastError.value.answer = chosenAnswer
  }
}

const picsInit = [
  { src: 'art1.png', answer: 'Arthur', found: false },
  { src: 'art2.png', answer: 'Christophe', found: false },
  { src: 'art3.png', answer: 'Madeleine', found: false },
  { src: 'art4.png', answer: 'Ferdi', found: false },
  { src: 'art5.png', answer: 'Elisa', found: false },
  { src: 'art6.png', answer: 'Kevin', found: false },
  { src: 'art7.png', answer: 'Maël', found: false },
  { src: 'art8.png', answer: 'François', found: false },
  { src: 'art9.png', answer: 'Jimmy', found: false },
  { src: 'art10.png', answer: 'Mathilde', found: false },
]

const pictures = ref(picsInit)
const answersInit = picsInit.map(picture => picture.answer)
const answers = ref(answersInit)

const basisStyle = { 'flex-basis': `${100 / answers.value.length}%` }

const checkAnswer = async () => {
  for (let i = 0; i < pictures.value.length; i++) {
    const pic = pictures.value[i]
    pic.found = pic.answer === answers.value[i]
  }
}

watchEffect(() => checkAnswer())

</script>

<style>
.my-override-container {
  max-width: 100vw;
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