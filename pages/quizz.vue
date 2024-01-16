
<template>
  <div class=" h-80 shadow-lg m-5 max-w-full">
    <ul v-auto-animate class="flex space-x-2 mb-4">
      <li v-for="picture in pictures" :key="picture.src" class = "relative" :class = "basisClass">
        <span v-if = "picture.found" class = "absolute w-full h-full bg-teal-700/40 z-10 transition-all"></span> <!-- empeche le click si deja ok -->
        <img :src="picture.src" @click="selectedPicture = picture.src"
          class="cursor-pointer hover:opacity-90 transition-all border-2 border-solid"
          :class="{ 'border-teal-500': selectedPicture === picture.src }">
      </li>
    </ul>
    <ul v-auto-animate class="flex space-x-2">
      <li v-for="answer in answers" :key="answer" @click="selectedAnswer = answer"
        class="grid place-content-center cursor-pointer hover:opacity-90 transition-all bg-teal-800 "
        :class="{ 'bg-teal-500': selectedAnswer === answer, basisClass }"> <!-- empeche le click si deja ok -->
        <span>
          {{ answer }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang = "ts">

import { ref, watchEffect, computed } from 'vue'

const selectedPicture = ref('')
const selectedAnswer = ref('')

interface Picture {
  src: string
  answer: string,
  found: boolean
}

const pictures = ref([
  { src: 'https://via.placeholder.com/180x150', answer: '180', found : false },
  { src: 'https://via.placeholder.com/160x150', answer: '160', found : false },
  { src: 'https://via.placeholder.com/170x150', answer: '170', found : false },
  { src: 'https://via.placeholder.com/150x150', answer: '150', found : false },
])

const answers = ref([
  '170',
  '150',
  '180',
  '160',
])

const basisClass = computed(() => 'basis-1/' + pictures.value.length)

const checkAnswer = async () => {
  // for ts, check if selectedPicture.value is in pictures.value
  const pic = pictures.value.find(picture => picture.src === selectedPicture.value)
  if (!pic) return
  if (selectedAnswer.value === pictures.value.find(picture => picture.src === selectedPicture.value)?.answer) {
    // set this picture to the beginning of the array
    pictures.value = [pic, ...pictures.value.filter(picture => picture.src !== selectedPicture.value)]
    // wait for 300ms - to see the green overlay
    await new Promise(resolve => setTimeout(resolve, 300))
    pic.found = true
  } else {
    alert('Bad answer')
  }
  selectedPicture.value = ''
  selectedAnswer.value = ''
}


watchEffect(() => {
  if (selectedPicture.value && selectedAnswer.value) {
    checkAnswer()
  }
})

</script>