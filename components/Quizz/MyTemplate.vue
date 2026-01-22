
<template>
  <div class="my-template-game p-6 bg-white rounded-lg shadow-md flex flex-col items-center transition-all duration-700 my-width" :class="{ 'opacity-0': !ready }">
    <h2 class="text-2xl font-bold mb-4">Associe chaque image à la bonne réponse</h2>
    <div v-if="orientationError" class="text-center text-lg text-teal-600 mb-4">
      <Icon name="heroicons:arrow-path-rounded-square" class="inline-block w-6 h-6 mr-2" />
      {{ orientationError }}
    </div>
    <div v-else class="w-full max-w-2xl">
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div v-for="(pic, idx) in pictures" :key="pic.src" class="flex flex-col items-center">
          <img :src="pic.src" :alt="pic.answer" class="rounded shadow object-contain w-full max-h-48 border-4 border-solid mb-2" />
          <select v-model="userAnswers[idx]" class="rounded border p-1 w-full">
            <option value="" disabled>Choisir...</option>
            <option v-for="answer in answers" :key="answer" :value="answer">{{ answer }}</option>
          </select>
        </div>
      </div>
      <button class="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600" @click="checkPairs" :disabled="!canValidate">Valider</button>
      <div v-if="showResult" class="mt-4 text-lg font-semibold">
        <span v-if="score === answers.length" class="text-green-600">Bravo ! Toutes les paires sont correctes !</span>
        <span v-else class="text-red-600">{{ score }} / {{ answers.length }} bonnes réponses</span>
      </div>
    </div>
    <div v-if="youWin" class="mt-6">
      <AppFires class="opacity-80" />
      <UModal v-model="youWin" prevent-close :ui="{ background: 'bg-gray-500', base: '', padding: 'p-5', width: 'w-72 h-32', container: 'grid items-center' }">
        <div class="text-xl font-bold m-2 p-2">Bravo... défi réussi !</div>
        <div class="flex p-3 items-center justify-around">
          <UButton v-if="replay !== 'no-replay'" :disabled="replay" variant="soft" @click="replay = true">
            {{ replay ? 'Chargement...' : 'Rejouer' }}</UButton>
          <NuxtLink to="/" class="text-teal-600 underline">Retour aux quizz</NuxtLink>
        </div>
      </UModal>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'

const props = defineProps<{
  picsInit: { src: string; answer: string; article?: string; name?: string }[],
  swap?: boolean
}>()

const getPics = () => props.picsInit.map(pic => ({ ...pic, found: false }))
const getAnswers = () => props.picsInit.map(pic => pic.answer)

const pictures = ref(getPics())
const answers = ref(getAnswers().sort(() => Math.random() - 0.5))
const userAnswers = ref(Array(pictures.value.length).fill(''))
const showResult = ref(false)
const score = ref(0)
const youWin = ref(false)
const ready = ref(true)
const replay = inject('replay', 'no-replay') as any

const canValidate = computed(() => userAnswers.value.every(ans => ans !== ''))

function checkPairs() {
  let correct = 0
  for (let i = 0; i < pictures.value.length; i++) {
    if (userAnswers.value[i] === pictures.value[i].answer) {
      pictures.value[i].found = true
      correct++
    } else {
      pictures.value[i].found = false
    }
  }
  score.value = correct
  showResult.value = true
  if (correct === answers.value.length) {
    setTimeout(() => { youWin.value = true }, 800)
  }
}

// Orientation error (optionnel)
const orientationError = ref('')

// Reset on replay
watch(() => props.picsInit, () => {
  pictures.value = getPics()
  answers.value = getAnswers().sort(() => Math.random() - 0.5)
  userAnswers.value = Array(pictures.value.length).fill('')
  showResult.value = false
  score.value = 0
  youWin.value = false
})
</script>

<style scoped>
.my-template-game {
  max-width: 700px;
  margin: 0 auto;
}
</style>
