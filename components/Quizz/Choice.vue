
<template>
    <section>
        <div class="flex justify-center gap-3 mb-5">
            <div v-for="(pic, i) in picsRef" :key="i">
                <div class="filter saturate-100 border-teal-600 border-solid"
                    :class="{ 'border-b-2': currentIndex === i }">
                    <UAvatar :src="pic.src" :alt="pic.answer" size="lg" :imgClass="getImgClass(pic)" />
                </div>
            </div>
        </div>
        <div class=" p-8 pt-6 h-[75vh] w-full rounded-lg m-auto max-w-[700px] relative" :class="{'bg-slate-800/40' : !end}">
            <div v-if="!end">
                <transition-expand group>
                    <div v-for="(pic, i) in pics" :key="i">
                        <img v-if="isVisible(pic)" :src="pic.src" class="rounded m-auto object-contain h-[52vh] w-[97%]" />
                    </div>
                </transition-expand>

                <div class="flex justify-around  gap-3 absolute z-10 bottom-4 left-0 w-full">
                    <button v-for="(pic, i) in getChoices(pics[currentIndex])" :key="i"
                        @click="handleChoice(pic.answer, $el)"
                        class="bg-teal-900 text-white p-1 grid items-center basis-[45%] rounded lg:hover:bg-teal-600 transition-all border-solid border-2 border-transparent"
                        :class="{ '!border-teal-200 !bg-teal-700': typeof currentPic.found != 'undefined' &&  currentPic.answer === pic.answer, '!bg-red-500' : !currentPic.found && selectedAnswer === pic.answer}">
                        {{ pic.answer }}
                    </button>
                </div>
            </div>
            <!-- Partie terminée -->
            <div v-else>    
                 <UIcon name="trophy" class="text-9xl text-teal-700" />
                <h2 class="text-lg mb-4 ">Partie terminée ...</h2>

                Score : {{ picsRef.filter(pic => pic.found).length }} / {{ picsRef.length }}
                <UProgress :value="picsRef.filter(pic => pic.found).length" :max="picsRef.length" class = "animate-pulse"  />
                    <div class="max-w-full my-5 bg-white/5 rounded-lg p-4">
                        <div class="text-xl mb-5">Réponses</div>
                        <ul>
                            <li v-for="(pic, i) in picsRef" :key="i" class="flex items-center gap-3 mb-2 hover:bg-slate-400/10 p-1 rounded-md">
                                <UAvatar :src="pic.src" :alt="pic.answer" size="lg" :imgClass="''" />
                                {{ pic.answer}}
                                <a :href="pic.article ?? pic.src.split('?width')[0]" target="_blank" class="text-primary underline">Voir</a>
                            </li>
                        </ul>
                    </div>
            </div>
        </div>
    </section>
</template>

<script setup>

const currentIndex = ref(0)
const currentPic = computed(() => picsRef.value[currentIndex.value])

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
    const pic = currentPic.value
    if (pic.choices) return pic.choices
    const choices = [answer]
    while (choices.length < props.nbChoices) {
        const randomPic = props.pics[Math.floor(Math.random() * props.pics.length)]
        console.log(randomPic)
        if (!choices.includes(randomPic)) choices.push(randomPic)
    }
    pic.choices = choices.sort(() => Math.random() - 0.5)
    return pic.choices
}

const getImgClass = (pic) => {
    const baseClass = 'border-4 border-solid hover:scale-125 transition-all'
    if (typeof pic.found === 'undefined') return baseClass
    const foundClass = pic.found ? 'border-teal-700' : 'border-red-500'
    return [baseClass, foundClass].join(' ')
}

const picsRef = ref(props.pics.map(pic => ({ ...pic, found: undefined })))

const isVisible = (pic) => currentIndex.value === props.pics.indexOf(pic)

const end = ref(false)

const showAnswerTime = 800

const selectedAnswer = ref('')

const handleChoice = async (answer, el) => {
selectedAnswer.value = answer 
    const correctAnswer = currentPic.value.answer
    currentPic.value.found = answer === correctAnswer
    console.log(el)
    await new Promise(resolve => setTimeout(resolve, showAnswerTime))
selectedAnswer.value = ''
    if (currentIndex.value !== picsRef.value.length - 1)
        currentIndex.value++
    else
        end.value = true
}



</script>