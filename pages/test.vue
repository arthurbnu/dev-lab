<template>
    <div class="w-full h-[66vh]">
        <div class="my-2">
            <div class="text-center">
                Essaye de trouver ..
                <transition-slide group class="inline-flex ml-2">
                    <div v-for="(city, index) in cities" :key="index" v-show="index === currentIndex" 
                        class="bg-primary/50 rounded px-2 text-center">
                        {{ city.name }}
                    </div>
                </transition-slide>
                <transition-slide>
                    <span class="px-4" v-if="gameOver">Partie terminée ...</span>
                </transition-slide>
            </div>
            <div class="my-2 flex items-center justify-between space-between">
                <!-- Ton marqueur est à ... {{ currentPoint ? currentDist : "..." }} km -->
                Score <UProgress :value="currentPoint ? score : 0" :max="minDistOk" class="basis-[90%]" />
            </div>
        </div>
        <transition-scale>
            <div v-if = "score" class="absolute w-[40%] m-auto top-[25vh] left-[30%] text-center text-primary/60 opacity-40 text-lg z-[1000]">
                <AppTargetNumber :targetNumber="currentDist" text = "km" class="rounded-lg"></AppTargetNumber>
            </div>
        </transition-scale>
        <LMap ref="map" :zoom="zoom" :center="mapCenter" :maxZoom="zoom" @click="handleClick">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                layer-type="base" name="OpenStreetMap" />

                <template v-if="currentPoint" >
                    <!-- User point clicked -->
                    <l-circle :lat-lng="currentPoint" color="blue" :radius = "10000"></l-circle>

                    <!-- Answer -->
                    <l-marker :lat-lng="answerCity.coords" :opacity="0.4">
                        <l-tooltip class="m-3 w-60 max-w-full h-12 pb-2" >
                            <h2 class="text-lg italic">{{ cities[currentIndex].name }} </h2>
                            <h3 class="text-md text-teal-700 my-1">Point n° {{ currentIndex }}</h3>
                        </l-tooltip>
                    </l-marker>
                    
                    <l-polyline v-if = "polyline" :lat-lngs="polyline" :color="score > 0 ? 'green' : 'red'"></l-polyline>
                    <l-circle :lat-lng="answerCity.coords" :color="score > 0 ? 'green' : 'red'" 
                        :radius = "1000 * minDistOk" :stroke="false"></l-circle>
            </template>
        </LMap>
    </div>
</template>

<script setup>

const zoom = ref(5)
const mapCenter = ref([48, 2])

const currentIndex = ref(0)
const currentDist = ref(minDistOk)
const currentPoint = ref()
const currentAnswer = ref(-1)
const waiting = ref(false)
const minDistOk = 200
const map = ref()
const answerCity = computed(() => cities[currentIndex.value])
const polyline = computed(()=> currentPoint.value && [answerCity.value.coords, [currentPoint.value.lat, currentPoint.value.lng]])

const gameOver = computed(() => currentIndex.value === cities.length - 1 && currentPoint.value)
const score = computed(() => currentDist.value > minDistOk ? 0 : minDistOk - currentDist.value)

import cities from "@/assets/cities.json"

function handleClick(e) {
    if (waiting.value) return
    waiting.value = true
    currentPoint.value = e.latlng
    currentAnswer.value = currentIndex.value

    currentDist.value = getDistanceFromLatLonInKm(
        ...cities[currentIndex.value].coords,
        e.latlng.lat,
        e.latlng.lng
    )

    if (!gameOver.value)
        setTimeout(() => {
            currentIndex.value++
            currentDist.value = minDistOk
            currentAnswer.value = 0
            currentPoint.value = null
            waiting.value = false
        }, 2000);
}

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

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
</script>