<template>
  <div>
  <div class="flex-container">

    <div class="flex-child">
      <div class="p-4 bg-gray-100 rounded-md border flex flex-col justify-center items-center overflow-hidden">
        <div class="font-extrabold text-lg [text-wrap:balance] text-gray-700">
          En 2023, le Lab a accueilli
          <span class="inline-flex flex-col h-[calc(theme(fontSize.lg)*theme(lineHeight.tight))] overflow-hidden">
            <ul class="block text-left leading-tight [&_li]:block animate-text-slide">
              <li class="text-indigo-500">{{labNumbers[0].n_tot_formations}} formations</li>
              <li class="text-rose-500">{{labNumbers[0].n_tot_ateliers}} ateliers</li>
              <li class="text-yellow-500">{{labNumbers[0].n_tot_projets}} différents projets</li>
              <li class="text-teal-500">{{labNumbers[0].n_tot_personnes}} différentes personnes</li>
              <li class="text-pink-500">{{labNumbers[0].n_tot_outils}} outils </li>
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
          ... collabore sur {{labNumbers[0].percentage_current_projects}} différents projets </div>
        <q-circular-progress :value="labNumbers[0].percentage_current_projects" show-value class="text-gray-700  q-ma-md" size="100px" color="teal" />
      </div>

      <div class="flex-child">
        <div class="font-bold text-lg [text-wrap:balance] text-teal-700">
          ...élabore {{labNumbers[0].percentage_current_formas}} différentes formations </div>
        <q-circular-progress :value="labNumbers[0].percentage_current_formas" show-value class="text-gray-700  q-ma-md" size="100px" color="teal" />
      </div>

      <div class="flex-child">
        <div class="font-extrabold text-lg [text-wrap:balance] text-teal-700">
          ...élabore {{labNumbers[0].percentage_current_autre}} différentes formations </div>
        <q-circular-progress :value="labNumbers[0].percentage_current_autre" show-value class="text-gray-700 q-ma-md"  size="100px" color="teal" />
      </div>
    </div>
  </div>
</div>
</template>


<script setup>
  const { data: labNumbers } = await useAsyncData("annilab", () =>
    queryContent("/annilab").find()
  );
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