<template>
    <MyTagsInput
        :api = "apiName"
        :url = "'https://query.wikidata.org/sparql?query=' + encodeURIComponent(sparqlQuery)" 
        replace-search-in-url="__REPLACE__"
        :displayUserItems="false"
        placeHolder="Rechercher une personne sur wikipedia"
        :handleResponse="handleOctant"
        :tags = tags
        >
        <!-- @tags-update = "tagsUpdate" -->
        <!-- image="wikidata-query-service.png" -->
        <template v-slot:items-list> 
            <!-- soit auto animate soit vue-transition group w-full  -->
            <ul v-auto-animate = "{duration : 400}" id = "my-items-list">
            <!-- <ul  id = "my-items-list"> -->
                <!-- <transition-scale group class = "w-full"> -->
                    <li v-for = "item in tags.slice().reverse()" :key="item.id" class = "li_item"> <!-- reverse() peut se faire avec flex -->
                        <CardItem :item = item  ref = "listItems"/>
                    </li>
                <!-- </transition-scale> -->
            </ul>
        </template>
    </MyTagsInput>
</template>

<script setup>

import {ref, provide} from 'vue'
import MyTagsInput from '@/components/App/MyTagsInput.vue';
import CardItem from '@/components/App/CardItem.vue';

import { useFocus} from '~/composables/focus';      // ces 2 composables appellent nextTick car composant client - cf doc nuxt
import useKeyDown from '~/composables/use-keydown';
useFocus()
useKeyDown([
    {'key': 'Escape', 'fn': () => handleFullScreen('exit')},
    {'key': 'ArrowRight', 'fn': () => handleFullScreen('next') },
    {'key': 'ArrowLeft', 'fn': () => handleFullScreen('prev')},
]);

const props = defineProps({
    sparqlQuery : {
        type : String,
    }
})

// refs
const tags = ref([])
const listItems = ref([]);
const apiName = 'Recherche-Sparql-Wikidata'
provide('tags '+ apiName, tags)

// emitted - gestion flex row - 1, 2 ou 3 colonnes
// const tagsUpdate = (newTags) => {
//     // let suffix = newTags.length > 2 ? '3' : newTags.length
//     // rowClass.value = defaultClass + '-' + suffix
// }

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
            id : wikiPage + '-' + tags.value.length,
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
