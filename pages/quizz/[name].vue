<template>
  <main class="min-h-screen">
    <AppHeader class="mb-6 text-center" :title="pageInfos.title" :description="pageInfos.description" />
    <!-- use v-bind instead -->
    <QuizzRandomSparql 
      :quizzTemplate="pageInfos.quizzTemplate"
      :data-name = "name"
      :nbPics="pageInfos.nbPics" 
      :sparqlQuery="pageInfos.sparqlQuery" 
      :imageLabel = "pageInfos.imageLabel" 
      :answerLabel="pageInfos.answerLabel"/>

  </main>
</template>

<script setup>

const route = useRoute()
const { name } = route.params

const pageInfos = reactive({
  quizzTemplate: 'drag',
  sparqlQuery: '',
  nbPics: 0,
  answerLabel: null,
  imageLabel: null,
  title: '',
  description: '',
  ogImage: '',
  ogUrl: '',
  ogType: '',
  ogTitle: '',
  ogDescription: '',
  robots: '',
})

switch(name){
  case 'oscar':
    pageInfos.title = "Quizz - actrices ayant reçu un oscar "
    pageInfos.description = "Remettez les images au dessus du bon nom ! "
    pageInfos.nbPics = 10
    pageInfos.sparqlQuery = `
      #defaultView:ImageGrid
      SELECT  ?date 
      (MD5(CONCAT(str(?artiste),str(RAND()))) as ?random)
      (SAMPLE(?image) AS ?image) 
      (GROUP_CONCAT(DISTINCT ?artisteLabel; SEPARATOR = " | ") AS ?artisteLabels) 
      (GROUP_CONCAT(DISTINCT ?recompenseLabel; SEPARATOR = " | ") AS ?recompenseLabels) 
      WHERE {
        ?artiste wdt:P31 wd:Q5;
                wdt:P166 ?recompense;
                wdt:P27 wd:Q30;
                
          wdt:P18 ?image;
          wdt:P569 ?date.
        
        filter(?recompense in (wd:Q103618)).

        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
          ?artiste rdfs:label ?artisteLabel.
          ?recompense rdfs:label ?recompenseLabel.
        }
      }
      GROUP BY ?random ?date ?artiste 
      ORDER BY ?random
      `;
    break;

    case 'arts-choice' : 
    pageInfos.quizzTemplate = 'choice'
    pageInfos.title = "Quizz - Peintures de la renaissance";
    pageInfos.description =  "";
    pageInfos.nbPics = 15
    pageInfos.sparqlQuery = `
      #  +800 résultats
      # doublons : plusieurs images, plusieurs auteurs
      # - sample img -> 848 résultats
      # - concat auteurs -> 819
      # données manquantes : 
      #  - auteurs inconnus (tête de méduse )

      #defaultView:ImageGrid
      #             wdt:P347 ?idJoconde.        # 80 oeuvres sur +800
      #             wdt:P973 ?descriptionUrl.   # 590
      SELECT ?peintureLabel ?mouvementLabel ?peinture ?article
      (MD5(CONCAT(str(?peinture),str(RAND()))) as ?random)
      (SAMPLE(?image) AS ?image) 
      (GROUP_CONCAT(DISTINCT ?artisteLabel; SEPARATOR = " | ") AS ?artisteLabels) WHERE {
        ?peinture wdt:P31 wd:Q3305213;
          wdt:P135 ?mouvement;
          wdt:P18 ?image;
          wdt:P170 ?artiste.
        ?mouvement (wdt:P31|wdt:P361) wd:Q4692.

?article schema:about ?peinture;
        schema:inLanguage "fr";
        schema:isPartOf <https://fr.wikipedia.org/>.

        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
          ?artiste rdfs:label ?artisteLabel.
        }
      }
      GROUP BY ?peintureLabel ?mouvementLabel ?peinture ?article
      ORDER BY ?random
      `;
      break;

    case 'arts' : 
    pageInfos.title = "Quizz - Peintures de la renaissance";
    pageInfos.description =  "Trouvez l'auteur de chaque oeuvre en remettant les images au dessus du bon peintre";
    pageInfos.nbPics = 6
    pageInfos.sparqlQuery = `
      #  +800 résultats
      # doublons : plusieurs images, plusieurs auteurs
      # - sample img -> 848 résultats
      # - concat auteurs -> 819
      # données manquantes : 
      #  - auteurs inconnus (tête de méduse )

      #defaultView:ImageGrid
      #             wdt:P347 ?idJoconde.        # 80 oeuvres sur +800
      #             wdt:P973 ?descriptionUrl.   # 590
      SELECT ?peintureLabel ?mouvementLabel ?peinture 
      (MD5(CONCAT(str(?peinture),str(RAND()))) as ?random)
      (SAMPLE(?image) AS ?image) 
      (GROUP_CONCAT(DISTINCT ?artisteLabel; SEPARATOR = " | ") AS ?artisteLabels) WHERE {
        ?peinture wdt:P31 wd:Q3305213;
          wdt:P135 ?mouvement;
          wdt:P18 ?image;
          wdt:P170 ?artiste.
        ?mouvement (wdt:P31|wdt:P361) wd:Q4692.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
          ?artiste rdfs:label ?artisteLabel.
        }
      }
      GROUP BY ?peintureLabel ?mouvementLabel ?peinture
      ORDER BY ?random
      `;
      break;

    case 'swift' :  // Taylor Swift - 8 pics - images des albums à associer aux bonnes chansons
    pageInfos.title = "Quizz - Taylor Swift";
    pageInfos.description =  "Remettez les images de chaque Album au dessus du bon titre de chanson ! ";
    pageInfos.nbPics = 7
    pageInfos.answerLabel = 'trackListLabel'
    pageInfos.sparqlQuery = `
    #  Albums et titres associés
      SELECT ?albumLabel ?album ?image ?trackListLabel 
      (MD5(CONCAT(str(?trackList),str(RAND()))) as ?random)
      WHERE {
        ?album wdt:P31 wd:Q482994;
              wdt:P1476 ?titre ;
              wdt:P175 ?musicien ;
              wdt:P658 ?trackList.
        
        OPTIONAL{
              ?album wdt:P18 ?albumImage.     
          }
      
          OPTIONAL{
              ?album wdt:P154 ?logoImage.
          }
        
        filter ((?image != '' || ?logoImage != ''))
        filter(?musicien in (wd:Q26876))
        
      #   // sépcifique
            filter (!( ?album in ( wd:Q858750, wd:Q37814092, wd:Q845783))) 
        
        BIND (
        COALESCE(
          ?albumImage,
          ?logoImage
        ) AS ?image
      )
                
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
          SERVICE wikibase:label {
          bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
          ?trackList rdfs:label ?trackListLabel.
      #       ?album rdfs:label ?albumLabel.
        }
      }
      # GROUP BY  ?albumLabel ?album ?image ?trackListLabel 
      ORDER BY ?random
    `;
    break;

    case 'beatles' :  // Beatles - utilisation de musicbrainz et coverartarchive pour les images 
    pageInfos.title = "Quizz - The Beatles";
    pageInfos.description =  "Remettez les images de chaque Album au dessus du bon titre de chanson ! ";
    pageInfos.nbPics = 7
    pageInfos.answerLabel = 'trackListLabel'
    pageInfos.sparqlQuery = `
    # Albums et titres associés
    SELECT ?trackListLabel ?trackList 
    (SAMPLE(?albumLabel) AS ?albumLabels) 
    (SAMPLE(?img) AS ?image) (SAMPLE(?musicBrainz) AS ?musicBrainzFirst) 
    (MD5(CONCAT(STR(?trackList), STR(RAND()))) AS ?random) 
    WHERE {
      ?album wdt:P31 wd:Q482994;
        wdt:P1476 ?titre;
        wdt:P175 ?musicien;
        wdt:P658 ?trackList.
      wd:P436 wdt:P1630 ?formatterurl.
      ?album wdt:P436 ?musicBrainz.
      BIND(IRI(REPLACE(?musicBrainz, "^(.+)$", ?formatterurl)) AS ?musicBrainzUrl)
      BIND(CONCAT("http://coverartarchive.org/release-group/", ?musicBrainz, "") AS ?p)
      BIND(CONCAT(?p, "/front", "") AS ?img)
      FILTER(?musicien IN(wd:Q1299))
      FILTER(?album IN(wd:Q199585, wd:Q173643, wd:Q60676411, wd:Q185121, wd:Q169226))
      ?article schema:about ?album;
        schema:inLanguage "fr";
        schema:isPartOf <https://fr.wikipedia.org/>.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
        ?trackList rdfs:label ?trackListLabel.
        ?album rdfs:label ?albumLabel.
      }
    }
    GROUP BY ?trackListLabel ?random ?trackList
    ORDER BY (?random)
    `;
    break;
}


useSeoMeta({
  title: pageInfos.title,
  description: pageInfos.description,

  ogImage: "https://dev-lab-one.vercel.app/quizz/quizz-sparql.png",
  ogUrl: "https://dev-lab-one.vercel.app/quizz/" + name,
  ogTitle: pageInfos.title,
  ogDescription: pageInfos.description,
});


</script>

<style lang="scss" >

[data-name="swift"]  {

  li:has(img) div {
    background: aliceblue;
  }

}

</style>