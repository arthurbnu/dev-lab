<template>
    <div class="w-full h-[66vh]">
        <transition-scale group class="contents" no-opacity>
            <div v-for="(city, index) in cities" :key="index" v-show="currentIndex == index">
                <div>Essaye de trouver ..</div>
                {{ city.name }} - {{ city.coords }}
                <div>
                    Ta réponse : {{ currentDist }}
                </div>
            </div>
        </transition-scale>
        <transition-slide>
            <div v-if="gameOver">
                Partie terminée ...
            </div>
        </transition-slide>
        <LMap ref="map" :zoom="zoom" :center="mapCenter" :maxZoom="7" @click="handleClick">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                layer-type="base" name="OpenStreetMap" />
            
        <transition-scale group no-opacity>
            <l-marker v-for="(point, i) in points" :lat-lng="point" :key="i">
                <l-popup class="m-3 w-60 max-w-full h-16">
                    <h2 class="text-lg italic">{{ point }} </h2>
                    <h3 class="text-md text-teal-700 m-1">Point n° {{ i }}</h3>
                </l-popup>
            </l-marker>
        </transition-scale>


            <l-marker v-for="(city, i) in cities" :lat-lng="city.coords" :key="i" >
                <l-popup class="m-3 w-60 max-w-full h-16">
                    <h2 class="text-lg italic">{{ city.name }} </h2>
                    <h3 class="text-md text-teal-700 m-1">Point n° {{ i }}</h3>
                </l-popup>
            </l-marker>

        </LMap>
    </div>
</template>

<script setup>

const zoom = ref(5)
const mapCenter = ref([48, 2])
const points = ref([])

const currentIndex = ref(0)
const currentDist = ref(0)
const currentPoint = ref()
const currentAnswer = ref(-1)
const waiting = ref(false)

const gameOver = computed(() => currentIndex.value === cities.length - 1)

import cities from "@/assets/cities.json"
console.log(cities)

function handleClick(e) {
    if (waiting.value) return
    waiting.value = true

    points.value.push(e.latlng)
    currentAnswer.value = currentIndex.value

    currentDist.value = pythagoreanDistanceBetweenPoints(
        ...cities[currentIndex.value].coords,
        e.latlng.lat,
        e.latlng.lng
    )

    if (! gameOver.value) 
        setTimeout(() => {
            currentIndex.value++
            currentDist.value = 0
            currentAnswer.value = 0
            waiting.value = false
        }, 2000);

}

function pythagoreanDistanceBetweenPoints(lat1, lon1, lat2, lon2, round = true) {
    const R = 6371e3;
    const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    const y = (lat2 - lat1);
    const d = Math.sqrt(x * x + y * y) * R;
    return round ? Math.round(d) : d;
}
</script>