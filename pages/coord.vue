<template>
    <main>

        <h1>Utilisation de nominatim pour les coordonnées</h1>

        <input type="text" v-model="val" class='w-[20vw] mr-4 border-2 border-teal-300' placeholder="adresse">

        <textarea name="" v-model="val2" class='w-[20vw] mr-4 border-2 border-teal-300' placeholder="adresses"></textarea>
        <button @click="val = ''">Effacer</button>

        {{ myRes }}

        <div class="bg-teal-400/25 p-4 mt-3">
            <h2>Résultat</h2>
            <div v-if="response">
                <ul>
                    <li v-for="item in response" :key="item.place_id">
                        <h3>{{ item.display_name }}</h3>
                        <p><label class="mr-3" for="">Lattitude</label>{{ item.lat }}</p>
                        <p><label class="mr-3" for="">Longitude</label>{{ item.lon }}</p>
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

    </main>
</template>

<script setup>

const url = "https://nominatim.openstreetmap.org/search"
const val = ref('')
const val2 = ref('')

const res2 = ref('')
const myRes = ref([])
watch(val2, async v => {
    if (!v) return

    res2.value = ''
    const addresses = v.split('\n')
    console.log(addresses)

    for (let ad of addresses) {
        const { data: res, error: err, pending: p } = await useFetch(url, { params: { q: ad, format: "json" } })
        console.log(res)
        // res2.value += res
        myRes.push(res)


    }
})


const queryParams = computed(() => { return { q: val.value, format: "json" } })

const { data: response, error: error, pending: pending } =
    await useFetch(url, { immediate: false, params: queryParams })
// await useFetch(url, { immediate: false, headers: headers, params: queryParams })

</script>