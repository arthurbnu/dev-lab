<template>
  <main class="bg-teal-400/5 p-4">
    <h1 class="flex items-center gap-2 text-lg">
      <img :src = "imgUrl" alt="Logo wikidata" class="h-5">
      {{ title }}
    </h1>
    <h2 class="opacity-75">{{ description }}</h2>

    <section>
      <transition-scale group tag="div" class="space-y-4" :delay="200">
      <span v-for="(tag, id) in shownTags" :key="id"
        class="bg-teal-800 text-white px-3 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950">
        {{ tag }}
      </span>
    </transition-scale>
    </section>

    <section class="my-10">
      <ContentList path="/wikidatathon" v-slot="{ list }">
        <ContentQuery v-for="(item, id) in list" :key="item._path" :path="item._path" find="one" v-slot="{ data }">
          <ContentRenderer :value="data" >
            <code ref = "spql" class="hidden" :data-title="item.title">{{data.body.children[0].props.code}}</code>
            <ContentRendererMarkdown :value="data" ref="md"
              class="max-w-full overflow-x-scroll bg-slate-800/50 px-5 pb-7" 
              :class="{'hidden' : indexRequest !== id}"
            />
          </ContentRenderer>
        </ContentQuery>
      </ContentList>
    </section>

  </main>
</template>

<script setup>

const indexRequest = ref(0)
const baseUrl = 'https://dev-lab-one.vercel.app/'

const title = "Atelier Wikidata-thon";
const description = "Retrouvez les requêtes et les données en temps réel ";;
const imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Wikidata-logo-en.svg/1024px-Wikidata-logo-en.svg.png"

const shownTags = ref([])
const timeBetweenTags = 50
const tags = [
  'Atelier',
  "Wikidata",
  "Sparql",
  "BNU - Lab",
  "Urfist",
];

onMounted(() => {
  for (let i = 0; i < tags.length; i++) {
    setTimeout(() => {
      shownTags.value.push(tags[i])
    }, timeBetweenTags * i);
  }
  setTimeout(() => {
    show.value = true
  }, timeBetweenTags * tags.length);
})

const spql = ref()

const request = `
SELECT ?theaterPlay ?theaterPlayLabel ?publicationDate WHERE { 
  ?theaterPlay wdt:P31 wd:Q7725634 ;  # Instance of theater play (Q7725634) 
               wdt:P407 wd:Q8786 ;    # Language of work or name (P407) = Alsatian (Q8786) 
               wdt:P577 ?publicationDate .  # Publication date (P577) 
   
  # Fetch the labels in the preferred language (e.g., English) 
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
} `

useSeoMeta({
  title: title,
  description,
  // author: "arthur.brody@bnu.fr",
  // ogImage: baseUrl + "quizz/quizz-renaissance2.png",
  ogImage: imgUrl,
  ogUrl: baseUrl,
  ogType: "website",
  ogTitle: title,
  ogDescription: description,
  robots: "index, follow",
  themeColor: "teal",
});


</script>

