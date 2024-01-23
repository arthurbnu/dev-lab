<template>
  <div>
    <h1
      class="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 px-3"
    >
      {{ title }}
    </h1>
 <slot></slot> 
    <p class="mt-6 text-base text-gray-600 dark:text-gray-400" v-if = "description" v-html="description"></p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});
</script>
