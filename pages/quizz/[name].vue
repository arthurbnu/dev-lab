<template>
  <main class="min-h-screen">
    <AppHeader class="mb-6 text-center" :title="pageInfos.title" :description="pageInfos.description" />
    <QuizzRandomSparql :nbPics="pageInfos.nbPics" :sparqlQuery="pageInfos.sparqlQuery" 
      :data-name = "name"
      :imageLabel = "pageInfos.imageLabel" 
      :answerLabel="pageInfos.answerLabel"/>
  </main>
</template>

<script setup>

const route = useRoute()
const { name } = route.params

const pageInfos = reactive({
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
  themeColor: '',
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
}

</script>

<style lang="scss" >

[data-name="swift"]  {

li:has(img) div {
  background: aliceblue;
}

}
</style>