<template>
    <h1>Utilisation de nominatim pour les coordonnées</h1>

    <input type="text" v-model="val" class='w-[20vw] mr-4 border-2 border-teal-300' placeholder="adresse">
    <button @click="val = ''">Effacer</button>


    <div class="bg-teal-400/25 p-4 mt-3">
        <h2>Résultat</h2>
        <div v-if="response">
            <ul>
                <li v-for="item in response" :key="item.place_id">
                    <h3>{{ item.display_name }}</h3>
                    <p><label class = "mr-3" for="">Lattitude</label>{{ item.lat }}</p>
                    <p><label class = "mr-3" for="">Longitude</label>{{ item.lon }}</p>
                </li>
            </ul>
        </div>
    </div>


    <section class="bg-teal-400/25 p-4 mt-3">
        <h2>Résultat brut</h2>
        <pre>
            {{ response }}
        </pre>
    </section>


    <section>
        <pre>
            {{ error }}
        </pre>
    </section>

</template>

<script setup>

const url = "https://nominatim.openstreetmap.org/search"
const val = ref('')


const queryParams = computed(() => { return { q: val.value, format: "json" } })

const { data: response, error: error, pending: pending } =
    await useFetch(url, { immediate: false, params: queryParams })
// await useFetch(url, { immediate: false, headers: headers, params: queryParams })

</script>