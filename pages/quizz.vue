
<template>
    <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />

  <div class=" h-80 shadow-lg m-5 max-w-full">
    <ul v-auto-animate class="flex flex-nowrap space-x-2 mb-4">
      <li v-for="picture in pictures" :key="picture.src" class="relative" :style="basisStyle">
        <!-- span de fond - empeche le click si deja ok -->
        <span v-if="picture.found" class="absolute w-full h-full bg-teal-700/40 z-10 transition-all my-height grid place-content-center text-4xl">
          🥇
        </span>
        <img :src="'quizz/' + picture.src" @click="selectedPicture = picture.src" :data-src="picture.src"
          draggable="true" @dragstart="dragStart"
          class="cursor-pointer hover:opacity-90 transition-all border-2 border-solid"
          :class="{ 'border-teal-500': selectedPicture === picture.src, 'my-error': lastError.picture === picture.src }">
      </li>
    </ul>
    <ul v-auto-animate class="flex flex-nowrap space-x-2">
      <li v-for="answer in answers" :key="answer" @click="selectedAnswer = answer"
        class="grid place-content-center cursor-pointer hover:opacity-90 transition-all bg-teal-900 h-20 basis-1 border-2 border-solid"
        :class="{ 'border-teal-500': selectedAnswer === answer, 'my-error': lastError.answer === answer }"
        :data-answer="answer"
        @dragover="dragOver" @drop="drop"
        :style="basisStyle">
        <span class='text-sm'>
          {{ answer }}
        </span>
      </li>
    </ul>
  </div>
  <!-- <div class="text-center">
    <button @click="pictures.value = pictures.value.sort(() => Math.random() - 0.5)" class="bg-teal-900 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition-all">
      Mélanger
    </button>
  </div> -->
</main>
</template>

<script setup lang = "ts">

import { ref, watchEffect } from 'vue'
// import { Fireworks} from '@fireworks-js/vue'

const title  = "L'IPNI selon l'Intelligence Artificielle";
const description = "Essaye d'associer chaque image au bon informaticien.";

const dragged = ref(null) as Ref<HTMLElement | null>

  const dragStart = (e: DragEvent) => {
    console.log('dragStart', e.target)
    dragged.value = e.target as HTMLElement
  }

  const dragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const drop = (e: DragEvent) => {
    e.preventDefault()
    console.log('drop', 'drop target is ', e.target, 'dragged is ', dragged.value)
    if (!dragged.value) return
    selectedPicture.value = dragged.value.getAttribute('data-src') as string
    selectedAnswer.value = e.target?.getAttribute('data-answer') as string
    
  }


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

const selectedPicture = ref('')
const selectedAnswer = ref('')
const lastError = ref({
  picture: '',
  answer: ''
})

interface Picture {
  src: string
  answer: string,
  found: boolean
}

const pictures = ref([
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
])

const answers = ref([
  'Elisa',
  'Christophe',
  'Maël',
  'Kevin',
  'Arthur',
  'Mathilde',
  'Ferdi',
  'Madeleine',
  'François',
  'Jimmy',
])

const basisStyle = { 'flex-basis': `${100 / answers.value.length}%` }

const checkAnswer = async () => {
  const pic = pictures.value.find(picture => picture.src === selectedPicture.value)
  if (!pic) return  // ts error
  if (selectedAnswer.value === pic.answer) {  // bonne réponse
    // replace l'element trouvé en premier
    pictures.value = [pic, ...pictures.value.filter(picture => picture.src !== selectedPicture.value)]
    answers.value = [selectedAnswer.value, ...answers.value.filter(answer => answer !== selectedAnswer.value)]
    // pause avant animation 
    await new Promise(resolve => setTimeout(resolve, 300))
    pic.found = true
  } 
  else {    // mauvaise réponse
    lastError.value = {
      picture: selectedPicture.value,
      answer: selectedAnswer.value
    }
    await new Promise(resolve => setTimeout(resolve, 500))  // on attend la classe my-error
  }
  selectedPicture.value = ''
  selectedAnswer.value = ''
  lastError.value = {
    picture: '',
    answer: ''
  }
}

// const launchFireworks = () =>{
//   const fireworks = new Fireworks({
//     target: document?.querySelector('.my-override-container'),
//     hue: 120,
//     startDelay: 1,
//     minDelay: 20,
//     maxDelay: 30,
//     speed: 2,
//     acceleration: 1.05,
//     friction: 0.98,
//     gravity: 1,
//     particles: 100,
//     trace: 3,
//     explosion: 5,
//     boundaries: {
//       top: 50,
//       bottom: 500,
//       left: 50,
//       right: 500
//     },
//     sound: {
//       enable: true,
//       // list: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/85280/rock.mp3', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/85280/firework.mp3', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/85280/firework.mp3', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/85280/firework.mp3', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/85280/firework.mp3']
//     },
//     mouse: {
//       click: true,
//       move: true,
//       max: 3
//     }
//   })
//   fireworks.start()

// }

watchEffect(() => {
  if (selectedPicture.value && selectedAnswer.value) 
    checkAnswer()
  // if (pictures.value.every(picture => picture.found)) 
    // launchFireworks()
})

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