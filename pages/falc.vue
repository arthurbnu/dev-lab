<template>
    <main>
        <section class="text-center space-y-4">
            <h1 class="text-2xl m-3 mb-5">
                <span class="text-teal-400 mr-">Aide pour le vote</span>
                 en Facile à Lire et à Comprendre
            </h1>

            <p >
                <a href="https://drive.google.com/drive/folders/1iQtxGY6jgnXzPK39ncAV-_OfPKGB6wQH?usp=sharing" target = "_blank" class = "text-teal-400 underline">
                    Retrouvez les podcasts ici</a>
            </p>

            <p>
                Faites défiler vers le bas pour voir comment voter
                <UIcon dynamic name="i-lucide-arrow-down" class="text-teal-400 mx-auto mb-1 animate-ping"/>
            </p>
        </section>

        <section>
            <div class = "space-y-10">
                <NuxtImg src = "falc/1.jpg" alt="Vote en FALC" class="m-auto my-4 max-w-full"/>
                <NuxtImg src = "falc/2.jpg" alt="Vote en FALC" class="m-auto my-4 max-w-full"/>
                <NuxtImg src = "falc/3.jpg" alt="Vote en FALC" class="m-auto my-4 max-w-full"/>
                <NuxtImg src = "falc/4.jpg" alt="Vote en FALC" class="m-auto my-4 max-w-full"/>
                <NuxtImg src = "falc/5.jpg" alt="Vote en FALC" class="m-auto my-4 max-w-full"/>
            </div>

        </section>
    </main>

</template>



<script setup>

const title = "Vote - FALC"
const description = "Aide au vote en FALC."
const baseUrl = 'https://dev-lab-one.vercel.app/'
const imgUrl = baseUrl + "falc/vote-falc.jpg"


useSeoMeta({
    title: title,
    description,
    ogImage: imgUrl,
    ogUrl: baseUrl,
    ogType: "website",
    ogTitle: title,
    ogDescription: description,
    robots: "index, follow",
    themeColor: "teal",
});

</script>


<style scoped></style>