
import type { UProgress } from '#build/components';

import type { UProgress } from '#build/components';

<template>
    <section>
        <div class="flex justify-center gap-3 mb-5">
            <div v-for="(pic, i) in picsRef" :key="i">
                <div class="filter saturate-100 border-teal-600 border-solid"
                    :class="{ 'border-b-2': currentPicture === i }">
                    <UAvatar :src="pic.src" :alt="pic.answer" size="lg" :imgClass="getImgClass(pic)" />
                </div>
            </div>
        </div>
        <div class="bg-slate-800/40 p-8 h-[75vh] w-full rounded-lg m-auto max-w-[700px] relative">
            <div v-if="!end">
                <transition-expand group>
                    <div v-for="(pic, i) in pics" :key="i">
                        <img v-if="isVisible(pic)" :src="pic.src" class="rounded m-auto object-contain h-[50vh] w-[58vw]" />
                    </div>
                </transition-expand>

                <div class="flex justify-around  gap-3 absolute z-10 bottom-4 left-0 w-full max-x-[58vw]">
                    <!-- class="bg-teal-700 text-white text-center justify-center inline-block cursor-pointer hover:bg-teal-600 transition-all border-teal-950 basis-[33%]" -->
                    <div v-for="(pic, i) in getChoices(pics[currentPicture])" :key="i"
                        @click="handleChoice(pic.answer, $el)"
                        class="bg-teal-700 text-white px-5 py-2 text-center inline-block cursor-pointer hover:bg-teal-600 transition-all border-solid border-2 basis-[33%]"
                        :class="{ '!border-teal-200': pic.found, '!border-red-400' : pic.found===false }">
                        <span>{{ pic.answer }}</span>
                    </div>
                </div>
            </div>
            <div v-else>
                <h2>Partie terminée ...</h2>

                Score : {{ picsRef.filter(pic => pic.found).length }} / {{ picsRef.length }}
                <UProgress :value="picsRef.filter(pic => pic.found).length" :max="picsRef.length" />
            </div>
        </div>
    </section>
</template>

<script setup>

const currentPicture = ref(0)

const props = defineProps({
    pics: {
        type: Array,
        required: true
    },
    nbChoices: {
        type: Number,
        default: 4
    }
})

// function that takes an answer (the good one) and adds 3 random wrong answers
const getChoices = (answer) => {
    console.log('right : ', answer)
    const choices = [answer]
    while (choices.length < props.nbChoices) {
        const randomPic = props.pics[Math.floor(Math.random() * props.pics.length)]
        console.log(randomPic)
        if (!choices.includes(randomPic)) choices.push(randomPic)
    }
    return choices.sort(() => Math.random() - 0.5)
}

const getImgClass = (pic) => {
    const baseClass = 'border-4 border-solid hover:scale-125 transition-all'
    if (typeof pic.found === 'undefined') return baseClass
    const foundClass = pic.found ? 'border-teal-700' : 'border-red-500'
    return [baseClass, foundClass].join(' ')
}

const picsRef = ref(props.pics.map(pic => ({ ...pic, found: undefined })))

const isVisible = (pic) => currentPicture.value === props.pics.indexOf(pic)

// const end = computed(() => picsRef.value.every(pic => typeof pic.found !== 'undefined'))

const end = ref(false)

const handleChoice = (answer, el) => {
    console.log(el)
    const correctAnswer = props.pics[currentPicture.value].answer
    picsRef.value[currentPicture.value].found = answer === correctAnswer
    if (currentPicture.value !== picsRef.value.length - 1)
        setTimeout(() => {
            currentPicture.value++
        }, 400)
        // currentPicture.value++
    else
        end.value = true
}



</script>