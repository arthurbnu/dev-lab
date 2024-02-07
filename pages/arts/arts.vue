<template>
    <main class="min-h-screen">
        <AppHeader class="mb-6 text-center" :title="title" :description="description" />
        <QuizzArts/>
    </main>
</template>

<script setup>

const title = "Quizz - Peintures de la renaissance";
const description =  "Trouvez l'auteur de chaque oeuvre";

useSeoMeta({
    title: title,
    description,
});


</script>