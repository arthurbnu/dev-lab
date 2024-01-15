
<template>
  <div class=" h-80 shadow-lg m-5 max-w-full">
    <ul class="flex flex-nowrap space-x-2">
      <li v-for="(picture, id) in pictures" :key="id">
        <img :src="picture" @click="selectedPicture = id" 
        class="cursor-pointer hover:opacity-90 transition-all border-2 border-solid" :class="{'border-teal-500': selectedPicture === id}">
        <div class="text-center cursor-pointer hover:opacity-90 transition-all bg-teal-100 mt-3" 
        @click="selectedAnswer = id" :class="{'bg-teal-500 text-white': selectedAnswer === id}">
          {{ answers[id] }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>

import {ref, watchEffect} from 'vue'

const selectedPicture = ref(-1)
const selectedAnswer = ref(-1)



const pictures = [
'https://via.placeholder.com/150x150',
'https://via.placeholder.com/160x150',
'https://via.placeholder.com/170x150',
'https://via.placeholder.com/180x150',
]

const answers = [
  '170',
  '150',
  '180',
  '160',
]

const combinations = [
  [0, 1],
  [1, 3],
  [2, 0],
  [3, 2],
]

watchEffect(() => {
  console.log(selectedPicture.value, selectedAnswer.value)
  if (combinations.includes([selectedPicture.value, selectedAnswer.value])) {
    console.log('correct')
  } else {
    console.log('wrong')
  }
})

</script>