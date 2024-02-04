
<template>
  <main class="min-h-screen">
    <AppHeader class="mb-5 text-center" :title="title" :description="description" />
    <QuizzDrag :picsInit="picsInit" />
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
  { src: 'art1.png', answer: 'Arthur'},
  { src: 'art2.png', answer: 'Christophe'},
  { src: 'art3.png', answer: 'Madeleine'},
  { src: 'art4.png', answer: 'Ferdi'},
  { src: 'art5.png', answer: 'Elisa'},
  { src: 'art6.png', answer: 'Kevin'},
  { src: 'art7.png', answer: 'Maël'},
  { src: 'art8.png', answer: 'François'},
  { src: 'art9.png', answer: 'Jimmy'},
  { src: 'art10.png', answer: 'Mathilde'},
]

</script>
