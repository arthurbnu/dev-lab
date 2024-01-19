<template>
  <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />

    <div class="space-y-4 text-center mb-5">
      <span v-for="(tag, id) in tags" :key="id"
        class="bg-teal-800 text-white px-1 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950">
        {{ tag }}
      </span>
    </div>

    <!-- show nbMots, nbJours and motsParjours in a beautiful nuxt ui way -->
    <div>

      <!-- <label for="">
        <span class="text-2xl font-bold">Objectif : </span>
        <span class="text-2xl font-bold">{{ nbMots }}</span>
        <span class="text-2xl font-bold">mots</span>

        <span class="text-2xl font-bold">en</span>
        <span class="text-2xl font-bold">{{ nbJours }}</span>
        <span class="text-2xl font-bold">jours</span>

        <span class="text-2xl font-bold">soit</span>
        <span class="text-2xl font-bold">{{ motsParJour }}</span>
        <span class="text-2xl font-bold">mots par jour</span>

      </label> -->
      <!-- same but with a nuxi ui table -->
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 text-lg">
                <thead class="bg-teal-300">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Nombre de mots
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Nombre de semaines
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Mots par semaine
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ nbMots }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ nbSemaines }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ motsParSemaine }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>

  </main>
</template>

<script setup>
const title = "Objectif mémoire";
const description = "Mémoire | Objectif : 20/20 | 2024 ";

// crée des objets pour faire un tableau avec : nombre de mots total pour le mémoire (15000), nombre de jours restant avant mi - avril 2024, nombre de mots à écrire par jour pour atteindre l'objectif de 15000 mots.
// const objectif = {
//   mots: 15000,
//   jours: 1120,
//   motsParJour: 13.4,
// };
const nbMots = 15000
const nbJours = daysBetween(new Date(), new Date(2024, 3, 15))
const nbSemaines = weeksBetween(new Date(), new Date(2024, 3, 15))
const motsParJour = Math.round(nbMots / nbJours)
const motsParSemaine = Math.round(nbMots / nbSemaines)


function daysBetween(date1, date2) {
  // Get 1 day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceMs = date2Ms - date1Ms;

  // Convert back to days and return
  return Math.round(differenceMs / oneDay);
}

const weeksBetween = (date1, date2) => {
  return daysBetween(date1, date2) / 7;
};

useSeoMeta({
  title: title,
  description,
  author: "A B",
  ogImage: "https://dev-lab-one.vercel.app/sparql/sparql-vuejs-personnes-wikipedia.png",
  ogUrl: "https://dev-lab-one.vercel.app/sparql",
  ogType: "website",
  ogTitle: title,
  ogDescription: description,
  robots: "index, follow",
  themeColor: "teal",
});

const tags = [
  "trop forte",
  "intelligente",
  "douée",
  "lâche rien",
  "bientôt le mariage",
];


</script>