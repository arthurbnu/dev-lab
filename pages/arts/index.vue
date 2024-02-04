<template>
    <main class="min-h-screen">
        <AppHeader class="mb-6" title="Arts visuels" :description="description" />
        <div class="space-y-4">
            <QuizzArts/>
        </div>
    </main>
</template>

<script setup>

const description =  " ... Jeu sparql avec des peintures disponiles sur wikidata";

useSeoMeta({
    title: "Arts ",
    description,
});


</script>