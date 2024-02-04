<template>
    <main class="min-h-screen">
        <AppHeader class="mb-6" :title="title" :description="description" />
        <div class="space-y-4">
            <QuizzArts/>
        </div>
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