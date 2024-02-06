<template>
  <div>
    <div class="flex-container">

      <div class="flex-child">
        <div class="p-4 bg-gray-100 rounded-md border flex flex-col justify-center items-center overflow-hidden">
          <div class="font-extrabold text-lg [text-wrap:balance] text-gray-700">
            En 2023, le Lab a accueilli
            <span class="inline-flex flex-col h-[calc(theme(fontSize.lg)*theme(lineHeight.tight))] overflow-hidden">
              <ul class="block text-left leading-tight [&_li]:block animate-text-slide">
                <li class="text-indigo-500">{{ labNumbers[0].n_tot_formations }} formations</li>
                <li class="text-rose-500">{{ labNumbers[0].n_tot_ateliers }} ateliers</li>
                <li class="text-yellow-500">{{ labNumbers[0].n_tot_projets }} différents projets</li>
                <li class="text-teal-500">{{ labNumbers[0].n_tot_personnes }} différentes personnes</li>
                <li class="text-pink-500">{{ labNumbers[0].n_tot_outils }} outils </li>
                <li class="text-sky-500">XXX</li>
              </ul>
            </span>
          </div>
        </div>
      </div>

      <div class="flex-child">
        <AppTargetNumber :targetNumber="labNumbers[0].n_tot_heures"></AppTargetNumber>
      </div>
    </div>
    <br>
    <div class="font-extrabold text-lg [text-wrap:balance] text-gray-700">
      <AppPolarAreaGraph></AppPolarAreaGraph>
    </div>



    <div class="p-4 bg-gray-100 rounded-md border flex flex-col justify-center items-center overflow-hidden">
      <div class="font-extrabold  margin -auto text-lg [text-wrap:balance] text-gray-700">
        En ce moment le Lab ... </div>
      <br>

      <div class="flex-container">

        <div class="flex-child">
          <div class="font-extrabold text-lg [text-wrap:balance] text-teal-700">
            ... collabore sur {{ labNumbers[0].number_current_projects }} différents projets </div>
          <q-circular-progress show-value font-size="12px" :value=percentage_capacity_projects size="100px"
            :thickness="0.22" color="teal" track-color="grey-3" class="text-gray-700 q-ma-md" style="text-align:center">
            {{ Math.round(percentage_capacity_projects) }}% de sa capacité
          </q-circular-progress>

        </div>

        <div class="flex-child">
          <div class="font-extrabold text-lg [text-wrap:balance] text-teal-700">
            ... collabore sur {{ labNumbers[0].number_current_formas }} différents projets </div>
          <q-circular-progress show-value font-size="12px" :value=percentage_capacity_forma size="100px"
            :thickness="0.22" color="teal" track-color="grey-3" class="text-gray-700 q-ma-md" style="text-align:center">
            {{ percentage_capacity_forma }}% de sa capacité
          </q-circular-progress>
        </div>

        <div class="flex-child">
          <button @click="startFireWorks = !startFireWorks">
          <div class="font-extrabold text-lg [text-wrap:balance] text-teal-700" >
            ... collabore sur {{ labNumbers[0].number_current_autre }} différents projets </div>
          <q-circular-progress show-value font-size="12px" :value=percentage_capacity_autre size="100px"
            :thickness="0.22" color="teal" track-color="grey-3" class="text-gray-700 q-ma-md" style="text-align:center">
            {{ percentage_capacity_autre }}% de sa capacité
          </q-circular-progress>
        </button>
        </div>
        
      </div>
    </div>
    <AppFires v-if="startFireWorks" class = "opacity-60"/>
  </div>
</template>


<script setup>

const { data: labNumbers } = await useAsyncData("annilab", () =>
  queryContent("/annilab").find()
);

const percentage_capacity_projects = labNumbers.value[0].number_current_projects/labNumbers.value[0].capacity_projects * 100
const percentage_capacity_forma = labNumbers.value[0].number_current_formas/labNumbers.value[0].capacity_formas * 100
const percentage_capacity_autre = labNumbers.value[0].number_current_autre/labNumbers.value[0].capacity_autre * 100
const startFireWorks = ref(false)

</script>



<style>
.animate-text-slide {
  animation: text-slide 12.5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
}

@keyframes text-slide {

  0%,
  16% {
    transform: translateY(0%);
  }

  20%,
  36% {
    transform: translateY(-16.66%);
  }

  40%,
  56% {
    transform: translateY(-33.33%);
  }

  60%,
  76% {
    transform: translateY(-50%);
  }

  80%,
  96% {
    transform: translateY(-66.66%);
  }

  100% {
    transform: translateY(-83.33%);
  }
}

.flex-container {
  display: flex;
}

.flex-child {
  flex: 1;
}

.flex-child:first-child {
  margin-right: 20px;
}
</style>