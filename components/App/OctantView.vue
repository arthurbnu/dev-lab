<template>
    <MyTagsInput
        api = "Octant"
        :url = "'https://query.wikidata.org/sparql?query=' + encodeURIComponent(sparqlQuery)" 
        replace-search-in-url="__REPLACE__"
        :displayUserItems="false"
        placeHolder="Recherche"
        :handleResponse="handleOctant"
        :tags = _tags
        @tags-update = "tagsUpdate"
    >
        <template v-slot:items-list>
            <ul v-auto-animate = "{duration : animTime}" id = "my-items-list" :class = "rowClass">
                <li v-for = "item in _tags.slice().reverse()" :key="item.id"> <!-- reverse() peut se faire avec flex -->
                    <CardItem :item = item  ref = "listItems"/>
                </li>
            </ul>
        </template>
    </MyTagsInput>
</template>

<script setup>

import {ref, provide, watch} from 'vue'
import MyTagsInput from '@/components/App/MyTagsInput.vue';
import CardItem from '@/components/App/CardItem.vue';


// import { useFocus} from 'composables/use-focus'
// import { useFocus } from '@vueuse/core';

// import useKeyDown from '@/composables/use-keydown';

// useFocus()

// const
const   animTime = 400,
        defaultClass = 'my-row-1';

const sparqlQuery = `SELECT distinct ?item ?itemLabel ?articleLabel ?itemDescription
    (SAMPLE(?image) as ?image) # on peut avoir +eurs images (évite les doublons dans les résultats) 
    WITH {
      SELECT * WHERE {
        BIND (LCASE("__REPLACE__") AS ?searchfor1) 
        BIND (REPLACE(?searchfor1, "[àâä]", "a") AS ?searchfor2)
        BIND (REPLACE(?searchfor2, "[éèêë]", "e") AS ?searchfor)
          
      }
    } AS %p
    WITH {
      SELECT ?item
      WHERE {
        INCLUDE %p
        BIND (CONCAT("haswbstatement:P31=Q5 ", ?searchfor) AS ?searchstr)
        SERVICE wikibase:mwapi {
          bd:serviceParam wikibase:endpoint "www.wikidata.org" .
          bd:serviceParam wikibase:api "Generator" .
          bd:serviceParam mwapi:generator "search" .
          bd:serviceParam mwapi:gsrsearch ?searchstr . # Full-text search in wiki.
          bd:serviceParam mwapi:gsrlimit "max" .
          bd:serviceParam mwapi:gsrnamespace "0" .
          bd:serviceParam mwapi:gsrprop "" .
          ?item wikibase:apiOutputItem mwapi:title .
        }
      }
     LIMIT 500 # limite à 500 résultats pour accélérer la requête
      # à vérifier dans le fonctionnement sur le long terme
    } AS %i
    WHERE {
      INCLUDE %i
      INCLUDE %p
      #   Filtre sur le label. L'article concerné doit contenir la recherche initiale dans son titre
      #   Si on filtre sur le nom : 'da Vinci' uniquement pour Léonard de Vinci. 
      #   Le label est plus souple (+eurs labels associés à un elt, ie léonard, leonard, ...) et permet de filtrer par nom + prénom
      #   inconvénient recherche par label : trouve Piotr Yakoubovitchp pour Charles Baudelaire
      ?item rdfs:label ?itemLabel .
      FILTER (LANG(?itemLabel)="fr")
      BIND (REPLACE(LCASE(?itemLabel), "[àâä]", "a") AS ?itemLabel1)
      BIND (REPLACE(?itemLabel1, "[éèêë]", "e") AS ?itemLabel2)

      # filtre les résultats obtenus : 
      #   - si la recherche contient un espace, on vérifie que le label contient les 2 mots (permet d'inverser le nom et le prénom)
      #   - sinon on vérifie que le label contient la recherche glolable
      BIND(STRAFTER(?searchfor, " ") as ?afterSpace)
      BIND(STRBEFORE(?searchfor, " ") as ?beforeSpace)
      BIND(contains(?searchfor, " ") as ?containsSpace)
      FILTER(
            CONTAINS(?itemLabel2, ?searchfor) 
              || (
                ?containsSpace = true
                && CONTAINS(?itemLabel2, ?beforeSpace)
                && CONTAINS(?itemLabel2, ?afterSpace)
              )
      )
      
      # article wikipédia français associé
      ?article schema:about ?item .
      ?article schema:inLanguage "fr" .
      ?article schema:isPartOf <https://fr.wikipedia.org/>.	
      
      OPTIONAL { ?item wdt:P18 ?image }
      
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr". }
    }
    GROUP BY ?item ?itemLabel ?articleLabel ?itemDescription`;

// refs
const rowClass = ref(defaultClass)
const _tags = ref([])
const listItems = ref([]);
provide('tags Octant', _tags)

// emitted
const tagsUpdate = (newTags) => {
    // let suffix = newTags.length > 2 ? '3' : newTags.length
    // rowClass.value = defaultClass + '-' + suffix
}

// useKeyDown([
//     {'key': 'Escape', 'fn': () => handleFullScreen('exit')},
//     {'key': 'ArrowRight', 'fn': () => handleFullScreen('next') },
//     {'key': 'ArrowLeft', 'fn': () => handleFullScreen('prev')},
// ]);

const handleFullScreen = (action) => {
    let componentFullScreen = listItems.value.find(item => item.fullscreen)
    if (! componentFullScreen) return
    switch (action) {
        case 'exit':
        componentFullScreen.fullscreen = false
            break;
        case 'next':
        componentFullScreen.nextImage()
            break;
        case 'prev':
        componentFullScreen.prevImage()
            break;
    }
}

let defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Anonymous_emblem.svg'

const handleOctant = (response) => {
    handleApiError(response);
    console.log(response)
    console.log(response.results)
    console.log(response.results.bindings)
    return response.results.bindings.map(a => 
    {       
        let wikiPage = safeValue(a, 'articleLabel')
        return { 
            value : wikiPage,
            text : safeValue(a, 'itemLabel') + ' - ' + shorten(safeValue(a, 'itemDescription')),
            name : safeValue(a, 'itemLabel'),
            image : safeValue(a, 'image', defaultImage),
            wikiPage : wikiPage,
            itemDescription : safeValue(a, 'itemDescription'),
            id : wikiPage + '-' + _tags.value.length,
        }
    });
}

const shorten = (text, maxLength = 30) => text.length > maxLength ? text.substr(0, maxLength) + '...' : text;

const safeValue = (item, property, defaultValue = '') => property in item ? item[property].value : defaultValue;

const handleApiError = (data) => {
    if ((typeof data === 'string' && data !== '') || ! data.results.bindings) {
        console.log(data);
        throw new Error('Problème lors de la requête sparql');
    }
}

</script>

<style lang="scss" scoped>
// <!-- <style scoped> -->

.q-separator{
      width : 150px;
      margin: auto;
  }

</style>