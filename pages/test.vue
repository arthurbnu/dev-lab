<template>
  <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />
  </main>
</template>

<script setup>

const title = "Test ";
const description = "Page test"

useSeoMeta({
  title: title,
  description,
  author: "A B",
});

</script>