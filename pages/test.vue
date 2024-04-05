<template>
    <div class="w-full h-[66vh]" @mousemove="handleMove" ref="container" @mouseleave="hoveringContainer = false">
        <client-only> <!--  Lottie Animation moving on hover -->
            <div ref="lottieContainer" class="hidden md:!block w-16 rounded-xl transition-all ease-in-out duration-500"
                :class="{ 'opacity-0 scale-0': !hoveringContainer, 'scale-x-[-1]': movingLeft }">
                <Vue3Lottie autoPlay animationLink="/quizz/zeppelin.json" class="scale-[200%]" />
            </div>
        </client-only>
        <div class="my-2">
            <div class="text-center font-light text-md tracking-wider min-h-[40px]">
                <span>Essaye de trouver ..</span>
                <transition-slide group class="inline-flex ml-2">
                    <div v-for="(city, index) in cities" :key="index" v-show="index === currentIndex"
                        class="bg-primary/50 rounded px-2 text-center">
                        {{ city.name }}
                    </div>
                </transition-slide>
                <transition-slide>
                    <span v-show="gameOver" class="px-4 animate-pulse">
                        <span class="hidden md:!inline">Partie terminée ...</span>
                        <UButton @click="reset" variant="soft">Continuer</UButton>
                    </span>
                </transition-slide>
            </div>
            <div class="my-2 flex items-baseline gap-2">
                Score <span class="px-1 text-teal-500">{{ totalScore }} / {{ minDistOk * cities.length }}</span>
                <UProgress :value="totalScore" :max="minDistOk * cities.length" class="flex-1" />
            </div>
        </div>
        <UModal v-model="waiting" class="z-[1000] opacity-60" :overlay="false" :transition="false"
            :ui="{ width: 'w-72', container: 'grid items-center' }">
            <AppTargetNumber :targetNumber="currentDist" text="km" class="rounded-lg"></AppTargetNumber>
        </UModal>
        <div class="flex w-full h-full gap-x-2">
            <!-- Icon markers filled when an answer is given -->
            <div class="h-full w-[50px] md:w-[60px] flex gap-1">
                <div v-for="i of nbCities" :key="i"
                    class="grid basis-full place-items-center bg-slate-300/20 rounded opacity-30 transition-all duration-500 scale-50"
                    :class="{ '!scale-100 !opacity-80': currentIndex % nbCities >= i - 1 }">
                    <UIcon name="i-lucide-map-pin" size="xl" class="text-gray-500 text-2xl" />
                </div>
            </div>
            <div class="flex-1 p-2 md:p-4 bg-slate-300/20">
                <LMap :zoom :center @click="handleClick">
                    <!-- <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                        layer-type="base" name="OpenStreetMap"/> -->

                    <l-control-layers />
                    <l-wms-tile-layer v-for="layer in layers" :key="layer.name"
                        url="http://ows.mundialis.de/services/service?" :layers="layer.layers" :visible="layer.visible"
                        :name="layer.name" layer-type="base" />

                    <template v-if="currentPoint">
                        <!-- User point clicked -->
                        <l-circle :lat-lng="currentPoint" color="blue" :radius="10000"></l-circle>
                        <!-- Line between answer and user point -->
                        <l-polyline v-if="polyline" :lat-lngs="polyline" :color></l-polyline>
                        <!-- Circle around answer -->
                        <l-circle :lat-lng="answerCoords" :color :radius="1000 * minDistOk" :stroke="false"></l-circle>
                    </template>

                    <!-- Answer (current or all if game over)-->
                    <l-marker v-if="currentPoint" v-for="(city, i) in gameOver ? cities : [answerCity]" :key="i"
                        :lat-lng="[city.lat, city.lng]">
                        <l-tooltip class="m-3 w-60 max-w-full h-12 pb-2">
                            <h2 class="text-lg italic">{{ city.name }} </h2>
                            <p v-if="answerCity.region" class="text-teal-600">{{ city.region }}</p>
                        </l-tooltip>
                    </l-marker>
                </LMap>
            </div>
        </div>
    </div>
</template>

<script setup>

// Leaflet map settings
const zoom = ref(5)
const center = ref([48, 2])

const layers = [
    {
        name: 'Hillshade',
        visible: true,
        layers: 'SRTM30-Colored-Hillshade',
        //   format: 'image/png',
        //   transparent: true,
        //   attribution: "Weather data © 2012 IEM Nexrad"
    },
]

// Current city and answer
import citiesJson from "@/assets/cities.json"
const nbCities = 6
const selectCities = (nb = nbCities) => citiesJson.sort(() => Math.random() - 0.5).slice(0, nb)
const cities = ref([])
const currentIndex = ref(0)
const currentPoint = ref()
const answerCity = computed(() => cities.value[currentIndex.value])
const answerCoords = computed(() => [answerCity.value.lat, answerCity.value.lng])
const polyline = computed(() => currentPoint.value && [answerCoords.value, [currentPoint.value.lat, currentPoint.value.lng]])

// Score, distance
const minDistOk = 200
const currentDist = ref(minDistOk)
const score = computed(() => currentDist.value > minDistOk ? 0 : minDistOk - currentDist.value)
const totalScore = ref(0)
watchEffect(() => totalScore.value += score.value)
const color = computed(() => score.value > 0 ? 'green' : 'red')

// Game state
const waiting = ref(false)
const gameOver = computed(() => currentIndex.value === cities.value.length - 1 && currentPoint.value)

// Lottie animation
import { Vue3Lottie } from 'vue3-lottie'
const lottieContainer = ref(null)
const container = ref(null)
const hoveringContainer = ref(false)
const movingLeft = ref(false)
const lastXMove = ref(0)

function handleMove(e) {
    hoveringContainer.value = true
    lottieContainer.value.style.marginLeft = `${e.screenX - container.value.offsetLeft - 50}px`
    movingLeft.value = e.screenX < lastXMove.value
    lastXMove.value = e.screenX
}

onMounted(() => cities.value = selectCities())

function reset() {
    waiting.value = false
    // currentIndex.value = 0
    currentPoint.value = null
    currentDist.value = minDistOk
    cities.value = [...cities.value, ...selectCities()]
    currentIndex.value++
}

function handleClick(e) {
    if (waiting.value) return
    waiting.value = true
    currentPoint.value = e.latlng

    currentDist.value = getDistanceFromLatLonInKm(
        ...answerCoords.value,
        e.latlng.lat,
        e.latlng.lng
    )

    if (!gameOver.value)
        setTimeout(() => {
            currentIndex.value++
            currentDist.value = minDistOk
            currentPoint.value = null
            waiting.value = false
        }, 2000);
}

const deg2rad = deg => deg * (Math.PI / 180)

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2, round = true) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return round ? Math.round(d) : d;
}

</script>