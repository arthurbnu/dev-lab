<template>
    <main class="space-y-7">
        <h1 v-if="entity" class="text-xl bg-slate-400/10 rounded-lg p-3 pl-5 border-primary border-l-2 ">
            <div class="text-primary capitalize mr-2">
                Détail - {{ table }}
            </div>
            {{ getTitle(entity) }}
        </h1>

        <pre v-if="error" class="text-red-500">
            {{ error }}
        </pre>

        <div class="flex gap-5">
            <NuxtImg src="gravures/Von dem grossen lutherischen Narren wie in Doctor Murner.png" :alt="`Détail ${table} - ${getTitle(entity)}`" width="400" class="opacity-90 text-center transition-all duration-700  p-3 bg-slate-900 rounded-md" :class="{ 'w-0': !mounted }" />
            <div class="flex-1 bg-slate-500/40 grid place-items-center text-xl">
                <span class="text-center capitalize mr-2">
                    <span class = "text-primary ">
                        Détail - {{ table }} <br>
                    </span>
                    {{ getTitle(entity) }}
                </span>
            </div>
        </div>


        <ul class="p-5 rounded-lg bg-gradient-to-r from-slate-800/25 to-slate-900/50 space-y-2">
            <li v-for="(value, field) in entity" :key="id" class="flex hover:bg-slate-100/10">
                <label class="inline-block w-24 text-primary-500">
                    {{ field }}
                </label>
                <label class="flex-1 break-all">
                    {{ value }}
                    <NuxtLink v-if="field === 'BOIS'" :to="`/gravures/bois-${getBOIS(entity)}`" class="text-primary-400 underline ml-3">
                        Accéder au bois correspondant
                    </NuxtLink>
                </label>
            </li>
        </ul>

        <!-- <pre>
            {{ data }}
        </pre> -->
    </main>
</template>


<script setup>

const route = useRoute()
const { tableAndId } = route.params
const [table, id] = tableAndId.split('-')


// surement du à une erreur lors de la création de la base à paartir des csv
// add '0' until length is 8
const getBOIS = entity => {
    const BOIS = entity.BOIS
    return BOIS.length < 8 ? '0'.repeat(8 - BOIS.length) + BOIS : BOIS
}

const { data, error, pending } = await useFetch(`/api/gravures/detail`, { params: { id: id, table: table } })
const entity = computed(() => data.value.result[0] ?? null)
const getTitle = entity => entity.TIT ?? entity.TITL ?? entity.DE ?? entity.BOIS

const mounted = ref(false)
// onMounted(() => mounted.value = true)
onMounted(() => setTimeout(() => mounted.value = true, 200))

</script>