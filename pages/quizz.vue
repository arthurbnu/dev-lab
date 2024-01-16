
<template>
  <div class=" h-80 shadow-lg m-5 max-w-full">
    <ul v-auto-animate class="flex flex-nowrap space-x-2 mb-4">
      <li v-for="picture in pictures" :key="picture.src" class = "relative" :style = "basisStyle">
        <span v-if = "picture.found" class = "absolute w-full h-full bg-teal-700/40 z-10 transition-all"></span> <!-- empeche le click si deja ok -->
        <img :src="'quizz/' + picture.src" @click="selectedPicture = picture.src"
          class="cursor-pointer hover:opacity-90 transition-all border-2 border-solid"
          :class="{ 'border-teal-500': selectedPicture === picture.src }">
      </li>
    </ul>
    <ul v-auto-animate class="flex flex-nowrap space-x-2">
      <li v-for="answer in answers" :key="answer" @click="selectedAnswer = answer"
        class="grid place-content-center cursor-pointer hover:opacity-90 transition-all bg-teal-900 h-20 basis-1 border-2 border-solid"
        :class="[{ 'border-teal-500': selectedAnswer === answer }]"
        :style = "basisStyle">
        <span class = 'text-sm'>
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
  { src: 'art1.png', answer: 'Arthur', found : false },
  {src: 'art2.png', answer: 'Christophe', found : false },
  {src: 'art3.png', answer: 'Madeleine', found : false },
  {src: 'art4.png', answer: 'Ferdi', found : false },
  {src: 'art5.png', answer: 'Elisa', found : false },
  {src: 'art6.png', answer: 'Kevin', found : false },
  {src: 'art7.png', answer: 'Maël', found : false },
  {src: 'art8.png', answer: 'François', found : false },
  {src: 'art9.png', answer: 'Jimmy', found : false },
  {src: 'art10.png', answer: 'Mathilde', found : false },
])

const answers = ref([
  'Arthur',
  'Christophe',
  'Madeleine',
  'Ferdi',
  'Elisa',
  'Kevin',
  'Maël',
  'François',
  'Jimmy',
  'Mathilde',
])

const basisStyle = { 'flex-basis': `${100 / answers.value.length}%` }

const checkAnswer = async () => {
  // for ts, check if selectedPicture.value is in pictures.value
  const pic = pictures.value.find(picture => picture.src === selectedPicture.value)
  if (!pic) return
  if (selectedAnswer.value === pictures.value.find(picture => picture.src === selectedPicture.value)?.answer) {
    // set this picture to the beginning of the array
    pictures.value = [pic, ...pictures.value.filter(picture => picture.src !== selectedPicture.value)]
    answers.value = [selectedAnswer.value, ...answers.value.filter(answer => answer !== selectedAnswer.value)]
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

<style scoped lang = "scss">
  .my-override-container{   // classe ajoutée dans le container Container.vue
    max-width: 100%;
  }
</style>