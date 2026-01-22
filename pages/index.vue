<template>
  <main>
    <section class="text-center">
      <h1 class="text-2xl m-3">
        <span class="text-teal-400 mr-4">WiQuizz</span>
        {{ title }}
      </h1>
      <p class="text-left [&>a]:text-teal-400 [&>a]:underline">
        Le langage <NuxtLink to="https://fr.wikipedia.org/wiki/SPARQL" target="_blank">sparql</NuxtLink> 
        permet de faire des requêtes sur des bases de données rdf telles que 
        <NuxtLink to="https://www.wikidata.org/wiki/Wikidata:Main_Page" target="_blank">wikidata</NuxtLink>.
        Chaque quizz est généré à partir d'une requête sparql.
      </p>
    </section>
    <div class="my-4 text-center mb-4">
      <UBadge v-for="(tag, id) in tags" :key="id" class="m-1" color="primary" variant="outline">
        {{ tag }}
      </UBadge>
    </div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 m-auto">
      <QCard v-for="(quizz, id) in allQuizz" :key="id" dark
        class="m-1 hover:scale-105 transition-all will-change-transform border-teal-400/20" 
        :title="quizz.title" :description="quizz.description" bordered >
        <NuxtLink :to="'/quizz/' + quizz.name" class="border-teal-500">
          <div class="h-48 lg:h-40 overflow-hidden relative">
            <UAvatar v-if = "quizz.icon" class="absolute z-20 top-2 left-2 bg-gray-700" size="md">
               <UIcon dynamic :name="quizz.icon"/>
            </UAvatar>
            <NuxtImg :src="quizzImg(quizz)" :alt="quizz.title" height="300" width="400" class="opacity-30"/>
          </div>
          <div class="p-4">
            <h2 class="text-xl font-bold">{{ quizz.title }}</h2>
            <p>{{ quizz.description }}</p>
            <p class="mt-2">
              <span v-for="(badge, i) in quizz.badges?.split(',')" class="mr-2">
                <UBadge :key="i" color="indigo" variant="outline" >
                  {{ badge }}
                </UBadge>
              </span>
            </p>
          </div>
        </NuxtLink>
      </QCard>
    </div>

  </main>
</template>

<script setup>

const { data: allQuizz } = await useAsyncData("allQuizz", () =>
  queryContent("/quizz").find()
);

const baseUrl = 'https://dev-lab-one.vercel.app/'
const quizzImg = quizz => {
  const img = quizz.image ?? "quizz-sparql.png"
  return  "quizz/" + img
}
const title  = "Quizz dynamiques générés avec wikidata et sparql";
const description = "Quizz wikidata créés avec sparql sur des thèmes variés : " + allQuizz.value.map(q => q.title).join(', ') ;

useSeoMeta({
  title: "WiQuizz - " + title,
  description,
  author: "arthur.brody@bnu.fr",
  ogImage: baseUrl + "quizz/quizz-renaissance2.png",
  ogUrl: baseUrl,
  ogType: "website",
  ogTitle:  "WiQuizz - " + title,
  ogDescription: description,
  robots: "index, follow",
  themeColor: "teal",
});

const tags = [
  'quizz',
  "sparql",
  "wikipedia",
  "wikidata", 
];


</script>