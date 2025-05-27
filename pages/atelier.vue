<template>
  <main class="bg-teal-400/5 p-4 space-y-8">
    <h1 class="flex items-center gap-2 text-2xl">
      <UAvatar v-for="logo in logos" :src="'https://logo.clearbit.com/' + logo" class="w-12 h-12 mr-2 bg-white"
        size="md" />
      {{ title }}
    </h1>
    <h2 class="opacity-75 h-5 text-lg">{{ description }}</h2>

    <transition-scale group tag="div" class="space-y-4" :delay="200">
      <span v-for="(tag, id) in shownTags" :key="id"
        class="bg-teal-800 text-white px-3 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950">
        {{ tag }}
      </span>
    </transition-scale>

    <!-- <section class="border-teal-300 border-solid border-l-4 pl-3">
      <p>Jeux de données</p>
      <div class="text-teal-400 flex gap-10">
        <a v-for="(link, i) in dataLinks" :href="link.url" target="_blank">{{ link.name }}</a>
      </div>
    </section> -->
    <section class="border-teal-300 border-solid border-l-4 pl-3">
      <p>Liens utiles</p>
      <div class="text-teal-400 flex gap-10">
        <a v-for="(link, i) in links" :href="link.url" target="_blank">{{ link.name }}</a>
      </div>
    </section>


    <section v-if="alsacianItems" class="">
      <h3 class="text-lg mb-2">Créatrices alsaciennes</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-animate-children-appear">
        <div v-for="item in alsacianItems" :key="item.creatrice.value" class="bg-white p-4 rounded-lg shadow hover:scale-105 transition-transform">

          <a :href="item.article.value" target="_blank" class="text-blue-500 hover:underline">
            {{ item.creatriceLabel?.value }} 
          </a>
          <!-- <p class = "text-blue-900">
            {{ item.apiUrlForLength }}
          </p> -->
          <!-- <p>
            <span v-if="item.articleLength" class="text-sm text-gray-500">
              Longueur de l'article: {{ item.articleLength }} caractères
            </span>
          </p> -->
          <p class="mt-2">
            <img :src="item.image?.value ?? 'https://logo.clearbit.com/wikipedia.org'" 
              :alt="item.creatriceLabel?.value"
              loading="lazy"
              class="w-full h-auto rounded-md" :class = "{'opacity-10': !item.image?.value}" />
          </p>
          <p v-if="item.lieuNaissanceLabel?.value" class="text-sm text-gray-600 mt-1">
            Lieu de naissance: {{ item.lieuNaissanceLabel.value }}
          </p>
        </div>
      </div>

      <pre class="hidden">
        {{ alsacianItems }}
      </pre>
    </section>

    <!-- <section v-if="items" class="border-blue-300 border-solid border-l-4 pl-3 ">
      <h3 class="text-lg mb-2">Dernières créatrices ajoutées / modifiées sur Wikidata</h3>
      <ul v-auto-animate>
        <li v-for="creatrice in items" :key="creatrice.creatrice.value" class="flex gap-10 justify-between">
          <a :href="creatrice.creatrice.value" target="_blank">
            {{ creatrice?.creatriceLabel?.value }}
            <span class="hidden">
              {{ creatrice?.date?.value }}
            </span>
          </a>
          <span class="text-gray-500">
            {{ new Date(creatrice?.modified?.value).toLocaleDateString() }}
          </span>
        </li>
      </ul>
    </section> -->

    <section class="hidden">
      {{ items }}
    </section>

    <!-- <section class="my-10">
      <ContentList path="/wikidatathon" v-slot="{ list }">
        <ContentQuery v-for="(item, id) in list" :key="item._path" :path="item._path" find="one" v-slot="{ data }">
          <ContentRenderer :value="data">
            <a :href="'https://query.wikidata.org/#' + encodeURIComponent(data.body.children[0].props.code)"
              target="_blank" class=" flex items-center">
              <UAvatar :src="'https://logo.clearbit.com/wikidata.org'" class="mr-2 bg-white" size="xs" />
              Voir la Requête :
              <span class="text-blue-400 "> {{ data.title }}</span>
            </a>
            <ContentRendererMarkdown :value="data" ref="md"
              class="max-w-full overflow-x-scroll bg-slate-800/50 px-5 pb-7 mt-2" />
          </ContentRenderer>
          <div class="w-1 h-10"></div>
        </ContentQuery>
      </ContentList>
    </section> -->

  </main>
</template>

<script setup>
const baseUrl = 'https://dev-lab-one.vercel.app/'

const title = "Atelier Wikipédia"
const description = "Femmes illustres et de science "
const imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Wikidata-logo-en.svg/1024px-Wikidata-logo-en.svg.png"

const shownTags = ref([])
const timeBetweenTags = 50
const tags = [
  'Atelier',
  "Wikipédia",
  "Wikidata",
  "BNU - Lab",
  "Urfist",
];

const logos = [
  "wikipedia.org",
  "wikidata.org",
  // "bnu.fr",
]

const dataLinks = [
  // {
  //   name: "Alsacien",
  //   url: "https://docs.google.com/spreadsheets/d/1tx2hku5XqqYFqcJceB5DXlUZ0K9bnqf38dlz14W2yBw"
  // },
  // {
  //   name: "Allemand",
  //   url: "https://dx.doi.org/10.34847/nkl.ccb28f8t"
  // },
  // {
  //   name: "Français",
  //   url: "https://docs.google.com/spreadsheets/d/1AQpMDE-zPuIeBfRXHadiDKK8B8OpYBMnlKpu3DOOXXU"
  // }
]

const links = [

  // {
  //   name: "Pad",
  //   url: "https://notes.wikimedia.fr/p/wikidatathon12decembre"
  // },
  // {
  //   name: "OpenRefine",
  //   url: "https://hub-paws.wmcloud.org/hub"
  // },
  // {
  //   name: "Constructeur de Requête ",
  //   url: "https://query.wikidata.org/"
  // },
  // wikimedia et wikipedia
  {
    name: "Pad de l'éditathon",
    url: "https://urls.fr/F79H3I"
  },
  {
    name: "Page projet",
    url: "https://fr.wikipedia.org/wiki/Projet:Wikifier_la_science/Strasbourg/%C3%89ditathon_Bnu"
  },
  {
    name: "Wikimedia",
    url: "https://wikimedia.org/"
  },
  {
    name: "Wikipédia",
    url: "https://wikipedia.org/"
  },
  {
    name: "Wikidata",
    url: "https://wikidata.org/"
  },

]

onMounted(() => {
  for (let i = 0; i < tags.length; i++) {
    setTimeout(() => {
      shownTags.value.push(tags[i])
    }, timeBetweenTags * i);
  }
  setTimeout(() => {
  }, timeBetweenTags * tags.length);

  setInterval(() => requestDate.value = new Date(Date.now()).toString(), 5000)

})

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

const requestDate = ref('')
const lastcreatrices = computed(() => `
# Requête SPARQL pour les créatrices ajoutées/modifiées récemment
SELECT ?creatrice ?creatriceLabel ?modified ?date
WHERE {
bind('${requestDate.value}}' as ?date)
  ?creatrice wdt:P7578 ?id;  
        schema:dateModified ?modified .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,fr". }
}
ORDER BY DESC(?modified) 
LIMIT 10`)


const maxChars = ref(20)

const endPoint = 'https://query.wikidata.org/sparql?query='
const fullUrl = computed(() => endPoint + encodeURIComponent(lastcreatrices.value))

const headers = { 'Accept': 'application/json' };
const { data: items, execute: refresh } = await useFetch(fullUrl, { headers: headers, server: false, transform: res => res.results.bindings });

const wikiApiUrl = 'https://fr.wikipedia.org/w/api.php?action=query&origin=*&prop=info&titles='
const wikiApiParams = '&format=json'


const alsacianCreatrices = computed(() => `
# Requête SPARQL pour les créatrices alsaciennes
#title: Créatrices d'Alsace
# #defaultView:ImageGrid
SELECT DISTINCT ?creatrice ?creatriceLabel ?professionLabel ?image ?id ?lieuNaissanceLabel ?article ?statements ?siteLinks ?articleName
# (GROUP_CONCAT(DISTINCT ?professionLabel; separator=", ") as ?p)
WHERE {
  ?creatrice wdt:P31 wd:Q5;
#   wdt:P106 ?profession;
    wdt:P19 ?lieuNaissance;
    wdt:P7578 ?id;
    wdt:P21 wd:Q6581072;
    wdt:P27 wd:Q142.
  
  ?creatrice wikibase:sitelinks ?siteLinks;
             wikibase:statements ?statements.
             
  OPTIONAL { ?creatrice wdt:P18 ?image. }
  OPTIONAL {
    ?article schema:about ?creatrice;
    schema:name ?articleName;
    schema:isPartOf <https://fr.wikipedia.org/>;
    schema:inLanguage "fr".
  }
  ?lieuNaissance wdt:P131 ?loc.
  FILTER(?loc IN(wd:Q12717, wd:Q12722))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}
ORDER BY (?statements)
LIMIT 100
`)

const getLengthFromWikiApi = async (url) =>{
  if (!url) {
    return 0; // Pas d'article, pas de longueur
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const pageId = Object.keys(data.query.pages)[0];
  return data.query.pages[pageId].length || 0; 
}

const fullUrlAlsacian = computed(() => endPoint + encodeURIComponent(alsacianCreatrices.value))
const { data: alsacianItems, execute: refreshAlsacian } = await useFetch(fullUrlAlsacian, {
  headers: headers,
  server: false,
  transform: async res => {
    // On initialise articleLength à null
    const items = res.results.bindings.map(item => ({
      ...item,
      apiUrlForLength: wikiApiUrl + item.article.value.split('/').pop().split(':').pop() + wikiApiParams,
      articleLength: null
    }));

     // On attend que toutes les longueurs soient récupérées
    await Promise.all(
      items.map(async (item) => {
        item.articleLength = await getLengthFromWikiApi(item.apiUrlForLength);
      })
    );

    items.sort((a, b) => (a.articleLength || 0) - (b.articleLength || 0))
    console.log('Alsacian items fetched:', items)
    return items
  }
});


// watch(alsacianItems, (newValue) => {
//   console.log('Alsacian items updated:', newValue);
// }, { immediate: true });



</script>


<style scoped>
a:hover {
  text-shadow:
    0 0 7px rgba(0, 255, 170, 0.288),
    0 0 10px rgba(0, 255, 170, 0.288),
    0 0 21px rgba(0, 255, 170, 0.288),
    0 0 42px rgba(0, 255, 170, 0.288),
    0 0 82px rgba(0, 255, 170, 0.288),
    0 0 92px rgba(0, 255, 170, 0.288),
    0 0 102px rgba(0, 255, 170, 0.288),
    0 0 151px rgba(0, 255, 170, 0.288);
}

@keyframes appear {
    from {
        opacity: 0;
        scale: .9
    }

    to {
        opacity: 1;
        scale: 1
    }
}

.my-animate-children-appear{
    padding-bottom: 200px;
}

.my-animate-children-appear>div {
    animation: appear linear both;
    animation-timeline: view();
    animation-range: entry 30% cover 25%;
}
</style>