
<template>
  <main class="min-h-screen opacity-0 transition-all duration-700" ref = "main">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />
    <div class=" h-80 shadow-lg m-5 max-w-full">
      <!-- <ul v-auto-animate class="flex flex-nowrap space-x-2 mb-4"> -->
        <VueDraggableNext :list="pictures" @change = "handleChange" animation="500" tag="ul" class="flex flex-nowrap space-x-2 mb-4" direction = "horizontal">
      <transition-group>
        <li v-for="picture in pictures" :key="picture.src" class="relative" :style="basisStyle">
          <!-- span de fond - empeche le click si deja ok -->
          <span v-if="picture.found"
            class="absolute w-full h-full bg-teal-700/40 z-10 transition-all my-height grid place-content-center text-4xl border-b-2 border-yellow-300">
            🥇
          </span>
          <img :src="'quizz/' + picture.src" :data-src="picture.src"
            :class="{ 'my-error': lastError.picture === picture.src }"
            class="cursor-pointer hover:opacity-90 transition-all border-4 border-solid">
        </li>
      </transition-group>
    </VueDraggableNext>
      <ul v-auto-animate class="flex flex-nowrap space-x-2">
        <li v-for="answer in answers" :key="answer"
          class="grid place-content-center cursor-pointer hover:opacity-90 transition-all bg-teal-900 h-20 border-4 border-teal-700 border-solid text-sm"
          :class="{ 'my-error': lastError.answer === answer }"
          :data-answer="answer"
          :style="basisStyle">
            {{ answer }}
        </li>
      </ul>
    </div>
  </main>
  <AppFires v-if="startFireWorks" class="opacity-60"/>
</template>

<script setup lang = "ts">

import { ref, watchEffect, computed, onMounted } from 'vue'
import {VueDraggableNext} from 'vue-draggable-next'


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

const startFireWorks = computed(() => pictures.value.every(picture => picture.found))
const main = ref() as Ref<HTMLElement>
const lastError = ref( {picture: '', answer: ''} )

onMounted(async() => {
  await nextTick()
  main.value.classList.remove('opacity-0')
  document.querySelector('nav')?.classList.add('opacity-0')
});

const handleChange = (e: any) => {
  console.log(e)
  const movedSrc = e.moved.element.src
  console.log('src', movedSrc, 'answer should be ', pictures.value.find(p=> p.src == movedSrc)?.answer,
   'current answer is ', answers.value[e.moved.newIndex])
  // set last error if not found
  if (movedSrc !== answers.value[e.moved.newIndex]) {
    lastError.value = { picture: movedSrc, answer: answers.value[e.moved.newIndex] }
  }
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

// instead get answer from picture
// const answers = ref(pictures.value.map(picture => picture.answer))

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

// shuffle
// pictures.value.sort(() => Math.random() - 0.5)
// answers.value.sort(() => Math.random() - 0.5)

const basisStyle = { 'flex-basis': `${100 / answers.value.length}%` }

const checkAnswer = async () => {
  for (let i = 0; i < pictures.value.length; i++) {
    const pic = pictures.value[i]
    pic.found =  pic.answer === answers.value[i]
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
}</style>