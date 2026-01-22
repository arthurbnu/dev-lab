<template>
    <div>
        <UIcon name="trophy" class="text-9xl text-teal-700" />
        <div class="text-lg mb-4 flex gap-6 items-center">Partie terminée ...
            <UButton v-if="replay !== 'no-replay'" :disabled="replay" variant="soft" @click="replay = true">
                {{ replay ? 'Chargement...' : 'Rejouer' }}
            </UButton>
            <NuxtLink to="/" class="text-teal-700 underline">Retour aux quizz</NuxtLink>
        </div>
        <div class="mb-2 w-full text-left">Score : {{ score }} / {{ maxScore }}</div>
        <UProgress :value="score" :max="maxScore" class="animate-pulse mb-6" />
        <div class="max-w-full my-5 bg-white/5 rounded-lg p-4 mb-40">
            <div class="text-xl mb-5 text-left">Liens Wikipédia</div>
            <ul class="my-animate-children-appear">
                <li v-for="(pic, idx) in pictures" :key="pic.src"
                    class="flex items-center gap-3 mb-2 text-md hover:!bg-slate-400/10 rounded-md odd:bg-gray-700/10 p-2">
                    <span class="basis-40 text-left">{{ pic.answer }}</span>
                    <UAvatar :src="pic.src" :alt="pic.answer" size="md" />
                    <a :href="pic.article ?? pic.src.split('?width')[0]" target="_blank"
                        class="text-primary underline truncate md:w-80 w-72 text-left">{{ pic.name ?? pic.answer }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    pictures: Array<{ src: string; answer: string; article?: string; name?: string }>,
    score: number,
    maxScore: number
}>()
const replay = inject<Ref<boolean | 'no-replay'>>('replay', ref<'no-replay'>('no-replay'))
</script>
