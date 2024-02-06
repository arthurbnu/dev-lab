<template>
    <VueApexCharts height=300, type="area" :options="options" :series="series"></VueApexCharts>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";
const { data: labNumbers } = await useAsyncData("annilab", () =>
    queryContent("/annilab").find()
  );
const generateDateTimeSerie = (timeSerie) => {
  var series = [];
  timeSerie.forEach(function (e) {
    series.push([new Date(e[0]).getTime(), e[1]]);
  });
  return series
}

    const options = {
        chart: {
          id: 'vuechart-example',
          stacked: true,
        },
        colors: ['#008FFB', '#00E396', '#CED4DC'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
      }

     const series = [{
            name: 'First',
            data: generateDateTimeSerie(labNumbers.value[0].timeline.first)
          },
          {
            name: 'Second',
            data: generateDateTimeSerie(labNumbers.value[0].timeline.second)
          },
          {
            name: 'Third',
            data: generateDateTimeSerie(labNumbers.value[0].timeline.third)
          }]
</script>