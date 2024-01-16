
<template>
  <div class=" h-80 shadow-lg m-5 max-w-full">
    <ul v-auto-animate="{ duration: 700 }" class="flex flex-nowrap space-x-2">
      <li v-for="picture in pictures" :key="picture.src">
        <img :src="picture.src" @click="selectedPicture = picture.src"
          class="cursor-pointer hover:opacity-90 transition-all border-2 border-solid"
          :class="{ 'border-teal-500': selectedPicture === picture.src }">
      </li>
    </ul>
    <ul v-auto-animate="{ duration: 700 }" class="flex flex-nowrap space-x-2">
      <li v-for="answer in answers" :key="answer" @click="selectedAnswer = answer"
        :class="{ 'bg-teal-500': selectedAnswer === answer }">
        <div class="text-center cursor-pointer hover:opacity-90 transition-all bg-teal-800 mt-3">
          {{ answer }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang = "ts">

import { ref, watchEffect } from 'vue'

const selectedPicture = ref('')
const selectedAnswer = ref('')

interface Picture {
  src: string
  answer: string
}

const pictures = ref([
  { src: 'https://via.placeholder.com/180x150', answer: '180' },
  { src: 'https://via.placeholder.com/160x150', answer: '160' },
  { src: 'https://via.placeholder.com/170x150', answer: '170' },
  { src: 'https://via.placeholder.com/150x150', answer: '150' },
])

const answers = ref([
  '170',
  '150',
  '180',
  '160',
])

const checkAnswer = () => {
  if (selectedAnswer.value === pictures.value.find(picture => picture.src === selectedPicture.value)?.answer) {
    // alert('Good answer')
    // sort pictures by src
    pictures.value.sort((a, b) => a.src.localeCompare(b.src))
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