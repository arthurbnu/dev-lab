<template>
  <div class="transition-all duration-700 my-width drag-move-answers" :class="{ 'opacity-0': !ready }">
    <!-- <transition-expand :delay="300" :duration="600"> 
      <p v-if="orientationError" class="text-center text-lg text-teal-600">
        <Icon name="heroicons:arrow-path-rounded-square" class="inline-block w-6 h-6 mr-2" />
        {{ orientationError }}
      </p> -->
      <div class="w-full max-w-7xl mx-auto">
        <!-- plus de liste de mouvements en haut -->
        <div class="flex justify-center items-center gap-4 mb-8">
          <button class="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition disabled:opacity-50 shadow-none" @click="validate" :disabled="!canValidate">Valider</button>
          <button class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition shadow-none" @click="reset()">Réinitialiser</button>
          <button class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition shadow-none" 
            :disabled="replay === true"
            @click="replay = true">
              {{replay ? 'Chargement...' : 'Autres oeuvres'}}
          </button>
          <button v-if="showResult" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition shadow-none" @click="showAnswers()">Afficher les réponses</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div v-for="(pic, idx) in pictures" :key="pic.src" class="flex flex-col items-center">
            <img
              :src="pic.src"
              :alt="pic.answer"
              class="rounded shadow object-contain w-full max-h-64 min-h-[180px] border-4 border-solid mb-1 cursor-zoom-in transition-all duration-200"
              :class="showResult ? (userAnswers[idx] === pic.answer ? 'border-green-500' : 'border-red-500') : ''"
              @click="openFullscreen(pic.src)"
            />
            <!-- Modal plein écran pour l'image -->
            <div v-if="fullscreenImg" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeFullscreen">
              <img :src="fullscreenImg" class="rounded-lg shadow-2xl fullscreen-img" @click.stop />
              <button @click="closeFullscreen" class="absolute top-4 right-4 text-white text-3xl font-bold bg-black/50 rounded-full px-3 py-1 hover:bg-black/80">×</button>
            </div>
            <div
              class="h-14 w-full flex items-center justify-center bg-teal-700 rounded border-2 border-dashed border-teal-400 mt-1 relative group dropzone transition-colors"
              :class="{ 'dragover': dragOverIdx === idx }"
              :data-idx="idx"
              @dragover.prevent="onDragOver(idx)"
              @dragleave="onDragLeave"
              @drop="onDropZone(idx)"
              @click="onDropZoneClick(idx)"
            >
              <div>
                <div v-if="userAnswers[idx]"
                  class="answer-chip bg-teal-700 text-white px-3 py-1 rounded shadow flex items-center justify-center cursor-move"
                  draggable="true"
                  @dragstart="onDragStartAnswer(idx)"
                  @dragend="onDragEnd"
                >
                  <span class="font-semibold tracking-wide">{{ userAnswers[idx] }}</span>
                </div>
                <div v-else-if="selectedDropIdx === idx" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10 bg-white rounded shadow-lg border border-teal-300 p-2 flex flex-wrap gap-2 min-w-[180px]">
                  <button v-for="answer in availableAnswers" :key="answer" class="answer-chip bg-teal-600 text-white px-3 py-1 rounded shadow hover:bg-teal-800 transition" @click.stop="selectAnswerForDrop(idx, answer)">{{ answer }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QuizzAnswersTable v-if="showResult" ref="answersBlock" :pictures="pictures" :score="score" :maxScore="answers.length" class="my-12 rounded-lg"/>
        <div class="min-h-24 w-full"></div> <!-- espace en bas pour gérer l'anim scroll de QuizzAnswersTable -->
      </div>
      <div v-if="youWin" class="mt-6">
        <AppFires class="opacity-80" />
        <UModal v-model="youWin" :ui="{ background: 'bg-gray-500', base: '', padding: 'p-5', width: 'w-72 h-32', container: 'grid items-center' }">
          <div class="text-xl font-bold m-2 p-2">Bravo... défi réussi !</div>
          <div class="flex p-3 items-center justify-around">
            <button v-if="replay !== 'no-replay'" :disabled="replay" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition shadow-none" @click="replay = true">
              {{ replay ? 'Chargement...' : 'Rejouer' }}</button>
            <NuxtLink to="/" class="text-teal-600 underline">Retour aux quizz</NuxtLink>
          </div>
        </UModal>
      </div>
    <!-- </transition-expand> -->
  </div>
</template>

<script setup lang="ts">
const answersBlock = ref<{$el: HTMLElement}>()
const end = ref(false)
function showAnswers() {
  answersBlock.value?.$el?.scrollIntoView({ behavior: 'smooth' })
}
const dragOverIdx = ref<number|null>(null)
function onDragOver(idx: number) {
  dragOverIdx.value = idx
}
function onDragLeave() {
  dragOverIdx.value = null
}
const selectedDropIdx = ref<number|null>(null)
function onDropZoneClick(idx: number) {
  if (!userAnswers.value[idx]) {
    selectedDropIdx.value = idx
  } else {
    selectedDropIdx.value = null
  }
}
function selectAnswerForDrop(idx: number, answer: string) {
  userAnswers.value[idx] = answer
  selectedDropIdx.value = null
}
const fullscreenImg = ref<string|null>(null)
function openFullscreen(src: string) {
  fullscreenImg.value = src
  document.body.style.overflow = 'hidden'
}
function closeFullscreen() {
  fullscreenImg.value = null
  document.body.style.overflow = ''
}
import { ref, computed, watch, inject } from 'vue'
import type { Ref } from 'vue'
const replay = inject('replay', ref(false)) as Ref<boolean | 'no-replay'>

const props = defineProps<{
  picsInit: { src: string; answer: string; article?: string; name?: string }[],
  swap?: boolean
}>()

const getPics = () => props.picsInit.map(pic => ({ ...pic, found: false }))
const getAnswers = () => props.picsInit.map(pic => pic.answer)

const pictures = ref(getPics())
const answers = ref(getAnswers())
// Mélange initial des réponses
function shuffle(array: any[]) {
  let arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
const userAnswers = ref(shuffle(answers.value))
const draggingAnswer = ref<string|null>(null)
const draggingIdx = ref<number|null>(null)
const showResult = ref(false)
const score = ref(0)
const youWin = ref(false)
const ready = ref(true)

const canValidate = computed(() => userAnswers.value.every(ans => ans !== ''))
const availableAnswers = computed(() => answers.value.filter(a => !userAnswers.value.includes(a)))

function onDragStart(answer: string) {
  draggingAnswer.value = answer
  draggingIdx.value = null
}
function onDragStartAnswer(idx: number) {
  draggingAnswer.value = userAnswers.value[idx]
  draggingIdx.value = idx
}
function onDragEnd() {
  draggingAnswer.value = null
  draggingIdx.value = null
}
function onDropZone(idx: number) {
  dragOverIdx.value = null
  if (!draggingAnswer.value) return
  // Si on dépose sur une case déjà remplie, on swap
  if (userAnswers.value[idx]) {
    // Si on drag depuis une autre case réponse
    if (draggingIdx.value !== null && draggingIdx.value !== idx) {
      const temp = userAnswers.value[idx]
      userAnswers.value[idx] = draggingAnswer.value
      userAnswers.value[draggingIdx.value] = temp
    }
    // Si on drag depuis la liste, on remplace
    else if (draggingIdx.value === null) {
      userAnswers.value[idx] = draggingAnswer.value
    }
  } else {
    // Case vide : on pose la réponse
    if (draggingIdx.value !== null) {
      userAnswers.value[idx] = draggingAnswer.value
      userAnswers.value[draggingIdx.value] = ''
    } else {
      userAnswers.value[idx] = draggingAnswer.value
    }
  }
  draggingAnswer.value = null
  draggingIdx.value = null
}

function validate() {
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

function reset() {
  userAnswers.value = shuffle(answers.value)
  showResult.value = false
  score.value = 0
  youWin.value = false
}

// Orientation error (optionnel)
// const orientationError = ref('')

// Reset on replay
watch(() => props.picsInit, () => {
  pictures.value = getPics()
  answers.value = getAnswers()
  userAnswers.value = shuffle(answers.value)
  showResult.value = false
  score.value = 0
  youWin.value = false

  setTimeout(() => window.scrollTo({top : 30, behavior: 'smooth'}), 500)
})
</script>

<style scoped>
/* Agrandissement de l'image plein écran */
.fullscreen-img {
  width: 100%;
  height: auto;
  max-width: 700px;
  max-height: 700px;
  object-fit: contain;
  object-position: center;
  transition: width 0.2s, height 0.2s;
}
.drag-move-answers {
  max-width: 1800px;
  margin: 0 auto;
  background: transparent;
  border-radius: 1.5rem;
  box-shadow: none;
  padding-bottom: 2rem;
}
.answer-chip {
  user-select: none;
  transition: box-shadow 0.2s, background 0.2s, transform 0.15s;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.09);
  font-size: 1.1rem;
  letter-spacing: 0.01em;
  min-width: 90px;
  min-height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dropzone {
  min-height: 3.5rem;
  border-radius: 0.75rem;
  border-width: 2px;
  border-style: dashed;
  border-color: #14b8a6;
  background: transparent;
  transition: background 0.2s, border-color 0.2s;
}
.dropzone.dragover {
  background: #14b8a6;
  border-color: #2dd4bf;
}
.dropzone:hover, .dropzone:focus {
  border-color: #0d9488;
  background: #0d9488;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
