
<template>
    <section>
        <!-- <div class="absolute w-full h-full z-0 opacity-20 filter blur-lg  bg-contain bg-center" :class="bgImageClass"></div> -->
        <div class="flex justify-center gap-3 mb-5 ">
            <div v-for="(pic, i) in picsRef" :key="i">
                <div class="filter saturate-100 border-teal-600 border-solid" :class="{ 'border-b-2': currentIndex === i }">
                    <UAvatar :src="pic.src" :alt="pic.answer" size="lg" :imgClass="getImgClass(pic)"
                        @click="currentIndex = i" />
                </div>
            </div>
        </div>
        <div class="max-w-2xl m-auto">
            <div class="bg-slate-800/40 p-2 pt-3 h-[62vh] w-full rounded-lg relative">
                <div ref="imgContainer">
                    <transition-slide :offset="['100%', 0]" group mode="in-out">                  
                        <div v-for="(pic, i) in picsRef" :key="i">
                            <div v-if="i === currentIndex">
                                <cite class="text-center text-md mb-2 block w-full truncate">
                                    {{ pic.name }}
                                </cite>
                                <img :src="pic.src" class="rounded m-auto object-contain h-[53vh] w-full" />
                            </div>
                        </div>
                    </transition-slide>
                </div>
            </div>
            <!--  4 proposition de réponses -->
            <div class="flex justify-around gap-3 w-full mt-2 md:mt-5 mb-8">
                <button v-for="(pic, i) in getChoices()" :key="i" @click="handleChoice(pic.answer)"
                    :disabled="alreadyAnswered(currentPic)"
                    class="bg-teal-900 text-white p-1 grid items-center basis-[48%] rounded lg:hover:bg-teal-600 transition-all border-2 border-transparent"
                    :class="{
                        '!border-teal-200 !bg-teal-600 !opacity-100': alreadyAnswered(currentPic) && currentPic.answer === pic.answer,
                        '!bg-red-500': !currentPic.found && selectedAnswer === pic.answer,
                        '!cursor-default': alreadyAnswered(currentPic),
                    }">
                    {{ pic.answer }}
                </button>
            </div>
            <!-- Partie terminée -->
            <div v-if="end" ref = "wikiLinks" class="scroll-mt-2">
                <UIcon name="trophy" class="text-9xl text-teal-700" />
                <h2 class="text-lg mb-4 ">Partie terminée ...
                    <!-- bouton rejouer -->
                </h2>

                Score : {{ picsRef.filter(pic => pic.found).length }} / {{ picsRef.length }}
                <UProgress :value="picsRef.filter(pic => pic.found).length" :max="picsRef.length" class="animate-pulse" />
                <div class="max-w-full my-5 bg-white/5 rounded-lg p-4">
                    <div class="text-xl mb-5">Liens Wikipédia</div>
                    <ul>
                        <li v-for="(pic, i) in picsRef" :key="i"
                            class="flex items-center gap-3 mb-2 text-md hover:!bg-slate-400/10 rounded-md odd:bg-gray-700/10 p-2">
                            <span class="basis-40">
                                {{ pic.answer }}
                            </span>
                            <UAvatar :src="pic.src" :alt="pic.answer" size="md" class="m" />
                            <a :href="pic.article ?? pic.src.split('?width')[0]" target="_blank"
                                class="text-primary underline truncate w-72 md:w-80">{{ pic.name }}
                            </a>
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
const bgImageClass = computed(() => `bg-[url('${currentPic.value.src}')]`)

const imgContainer = ref(null)
const wikiLinks = ref(null)
const { isSwiping, direction } = useSwipe(imgContainer, {
    onSwipeEnd: () => {
        if (direction.value === 'left' && currentIndex.value < picsRef.value.length - 1) currentIndex.value++
        if (direction.value === 'right' && currentIndex.value > 0) currentIndex.value--
    }
})

watchEffect(() => {
    if (isSwiping.value) {
        // if (direction.value === 'left' && currentIndex.value < picsRef.value.length - 1) currentIndex.value++
        // if (direction.value === 'right' && currentIndex.value > 0) currentIndex.value--
    }
})

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
const getChoices = () => {
    const pic = currentPic.value
    if (pic.choices) return pic.choices
    const choices = [pic]
    while (choices.length < props.nbChoices) {
        const randomPic = picsRef.value[Math.floor(Math.random() * picsRef.value.length)]
        if (!choices.includes(randomPic)) choices.push(randomPic)
    }
    pic.choices = choices.sort(() => Math.random() - 0.5)
    return pic.choices
}

const getImgClass = (pic) => {
    const baseClass = 'border-4 border-solid hover:scale-125 transition-all cursor-pointer'
    // if (typeof pic.found === 'undefined') return baseClass
    if (!alreadyAnswered(pic)) return baseClass
    const foundClass = pic.found ? 'border-teal-700' : 'border-red-500'
    return [baseClass, foundClass].join(' ')
}

const picsRef = ref(props.pics.map(pic => ({ ...pic, found: undefined })))
const alreadyAnswered = pic => pic.found !== undefined
const end = computed(() => picsRef.value.every(pic => alreadyAnswered(pic)) || (import.meta.env.DEV && alreadyAnswered(picsRef.value.at(-1))))
const showAnswerTime = 800
const selectedAnswer = ref('')

const handleChoice = async answer => {
    selectedAnswer.value = answer
    currentPic.value.found = answer === currentPic.value.answer
    await new Promise(resolve => setTimeout(resolve, showAnswerTime))
    selectedAnswer.value = ''
    if (currentIndex.value !== picsRef.value.length - 1)
        currentIndex.value++
}

watchEffect(() => 
    end.value && 
    setTimeout(() => wikiLinks.value.scrollIntoView({ behavior: 'smooth' }), 1000)
)

</script>

<style scoped>
/* 
section{
    cursor: url('/quizz/pencil2.ico'), auto;
} */

</style>