
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

const values = 
{
  "sparql": {
    "results": {
      "result": [
        {
          "binding": [
            {
              "uri": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Piero%2C_arezzo%2C_Discovery_and_Proof_of_the_True_Cross_01.jpg"
            },
            {
              "literal": "Piero della Francesca"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Angelico%2C_niccolina_04.jpg"
            },
            {
              "literal": "Fra Angelico"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "http://commons.wikimedia.org/wiki/Special:FilePath/Giorgione%20-%20Il%20Tramonto%20%281506-1510%29.jpg"
            },
            {
              "literal": "Giorgione"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "http://commons.wikimedia.org/wiki/Special:FilePath/Antonello%20da%20Messina%20-%20Portrait%20of%20a%20Man%20-%20National%20Gallery%20London.jpg"
            },
            {
              "literal": "Antonello da Messina"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "http://commons.wikimedia.org/wiki/Special:FilePath/Titian%20-%20The%20Appeal%20-%2026.107%20-%20Detroit%20Institute%20of%20Arts.jpg"
            },
            {
              "literal": "Giorgione | Titian | Sebastiano del Piombo"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "http://commons.wikimedia.org/wiki/Special:FilePath/Giorgione%20063.jpg"
            },
            {
              "literal": "Giorgione"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "http://commons.wikimedia.org/wiki/Special:FilePath/Sandro%20Botticelli%2C%20The%20Last%20Communion%20of%20Saint%20Jerome.png"
            },
            {
              "literal": "Sandro Botticelli"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "http://commons.wikimedia.org/wiki/Special:FilePath/Tiziano%2C%20stimmate%20di%20san%20francesco%2C%20trapani.jpg"
            },
            {
              "literal": "Titian"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "http://commons.wikimedia.org/wiki/Special:FilePath/La-belle-jardiniere.jpg"
            },
            {
              "literal": "Raphael"
            }
          ]
        },
        {
          "binding": [
            {
              "uri": "http://commons.wikimedia.org/wiki/Special:FilePath/Pietro%20Perugino%20cat55.jpg"
            },
            {
              "literal": "Pietro Perugino"
            }
          ]
        }
      ]
    }
  }
}

const picsInit = values.sparql.results.result.map((item: any) => {
  return {
    src: item.binding[0].uri,
    answer: item.binding[1].literal,
  }
})

</script>
