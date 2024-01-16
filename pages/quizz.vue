
<template>
  <div class=" h-80 shadow-lg m-5 max-w-full">
    <ul v-auto-animate class="flex flex-nowrap space-x-2">
      <li v-for="(picture, id) in pictures" :key="id">
        <img :src="picture.src" @click="selectedPicture = id" 
        class="cursor-pointer hover:opacity-90 transition-all border-3 border-solid" :class="{'border-teal-500': selectedPicture === id}">
        <div class="text-center cursor-pointer hover:opacity-90 transition-all bg-teal-800 mt-3" 
        @click="selectedAnswer = id" :class="{'bg-teal-500 text-white': selectedAnswer === id}">
          {{ answers[id] }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang = "ts">

import {ref, watchEffect} from 'vue'

const selectedPicture = ref(-1)
const selectedAnswer = ref(-1)



const pictures = ref([
  { src : 'https://via.placeholder.com/180x150', answer : '180' },
  { src : 'https://via.placeholder.com/160x150', answer : '160' },
  { src : 'https://via.placeholder.com/170x150', answer : '170' },
  { src : 'https://via.placeholder.com/150x150', answer : '150' },
])

const answers = ref([
  '170',
  '150',
  '180',
  '160',
])

const checkAnswer = () => {
  if (answers.value[selectedAnswer.value] === pictures.value[selectedPicture.value].answer) {
   // alert('Good answer')
    // sort pictures by src
    pictures.value.sort((a, b) => a.src.localeCompare(b.src))
  } else {
    alert('Bad answer')
  }
selectedPicture.value=-1
selectedAnswer.value=-1
}


watchEffect(() => {
  if (selectedPicture.value !== -1 && selectedAnswer.value !== -1) {
    checkAnswer()
  }
})

</script>