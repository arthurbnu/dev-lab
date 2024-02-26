
<template>
  <main class="min-h-screen">
    <AppHeader class="mb-5 text-center" :title="title" :description="description" />
    <QuizzDrag :picsInit="picsInit" :swap="true" />
  </main>
</template>

<script setup lang = "ts">

const title = "L'IPNI selon l'Intelligence Artificielle";
const description = "Tout est dans le désordre.. Essaye de remettre chaque image au dessus du bon prénom !";

useSeoMeta({
  title: title,
  description,
  author: "A B",
  ogImage: "https://dev-lab-one.vercel.app/quizz/quizz-ipni.png",
  ogUrl: "https://dev-lab-one.vercel.app/quizz",
  ogType: "website",
  ogTitle: title,
  ogDescription: description,
  themeColor: "teal",
});

const picsInit = [
  { src: 'quizz/art1.png', answer: 'Arthur'},
  { src: 'quizz/art2.png', answer: 'Christophe'},
  { src: 'quizz/art3.png', answer: 'Madeleine'},
  { src: 'quizz/art4.png', answer: 'Ferdi'},
  { src: 'quizz/art5.png', answer: 'Elisa'},
  { src: 'quizz/art6.png', answer: 'Kevin'},
  { src: 'quizz/art7.png', answer: 'Maël'},
  { src: 'quizz/art8.png', answer: 'François'},
  { src: 'quizz/art9.png', answer: 'Jimmy'},
  { src: 'quizz/art10.png', answer: 'Mathilde'},
]

</script>
