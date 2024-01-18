
<template>  
    <div class = "template col-6 q-pa-md text-center" 
    @contextmenu = "handleRightClick"

    :class = "{'template_loading' : loading, 'invalidInput' : invalidInput}" 
    ref = "currentTemplate" 
    @click = "handleTemplateClick">
    <span class = "row inline items-center">
        <img v-if = "image" class = "my-api-img" :alt="api">
        <!-- <img v-if = "image" class = "my-api-img" :src='getImageUrl(image)' :alt="api"> -->
        <!-- <h5 class="title q-ma-xs q-pa-xs q-pb-sm">
            {{ api }}         
        </h5> -->

        <q-radio v-for = "option in filterOptions" 
            size="xs" 
            v-model="modelSelect" 
            :val="option.value" 
            :label="option.label ?? option.value" 
        />
        <!-- <q-checkbox v-if = "!envProd && autoComplete !== null" v-model = "modelAutoComplete"  -->
        <q-checkbox v-if = "autoComplete !== null" v-model = "modelAutoComplete" 
        label = "Auto Complétion" class = "q-ml-lg" :disable="disableAutoComplete">
        <q-tooltip anchor="bottom middle" self="top middle">
            <div class="text-center">
                <span> Recherche exacte si décoché</span>
           </div>
        </q-tooltip>
        </q-checkbox>
    </span>
    <div ref = "tagsInputContainer">
        <div class="spinner q-pa-md">
            <q-circular-progress
                indeterminate
                rounded
                color="primary"
                class = "q-pb-xs" 
                size = "1.3em"
            />
            Chargement
        </div>
        <!-- <ClientOnly > -->

            <!-- to have this working we need to add the following to nuxt.config.js
            plugins: [
                { src: '~/plugins/vue-tags-input', mode: 'client' }
            ] -->
            <!--  or we must add placeholder manually -->


        <vue-tags-input
            v-model="tag" 
            :tags="tags" 
            :autocomplete-items="autocompleteItems"
            :add-only-from-autocomplete="true" 
            :placeholder=actualPlaceHolder 
            :avoid-adding-duplicates="false"
            :autocomplete-filter-duplicates="false"
            @tags-changed="update" 
            @keyup.up = "scrollSelect"
            @keyup.down = "scrollSelect"
            @keyup.ctrl.down = "changeHistory(1)"
            @keyup.ctrl.up = "changeHistory(-1)"
            @keyup.escape = "resetSearch"
            :class = "{'sticky' : stickySearch && !autocompleteItems.length && !tag.length }"      
        >
            <!--  slot  au dessus des résultats de recherche - Export csv-->
            <template v-slot:autocomplete-header v-if = " ! loading && autocompleteItems.length">
                    <q-btn
                    @click = "exportCSV"
                    class = "q-ml-md"
                    color = "primary"
                    icon = "file_download"
                    size = "sm"
                    flat
                    >
                    <span class="q-ma-xs">
                        Export csv des résultats
                    </span>
                </q-btn>
            </template>
        </vue-tags-input>
        <!-- </ClientOnly> -->
        <!-- position sticky possible uniquement si pas de recherche en cours pour éviter dépassement de résultats  -->
        <div    
            v-if = "fetchError.message && ! loading" 
            :class="'axios-error level_' + [fetchError.level]"
            class = "row inline q-pl-md q-pr-md"
        >
            {{ fetchError.message }}
        </div>
        <div  class="config q-pt-md">
           <p class = "hidden">{{ url }} | {{ actualPlaceHolder }}</p>
        </div>
        <slot name = "items-list"></slot>
        <!-- config par défaut du composant : displayUserItems (possibilité d'utiliser le slot items-list dans le parent sinon) -->
        <!-- <div v-if = "displayUserItems" class = "max-width"> 
            <ul v-auto-animate = "{duration : 400}" class = "q-pa-none q-mt-xl" >
                <li v-for="item, i in tags.slice().reverse()" :key="item" >
                        <CardUserVue :user = "item">
                            <template v-slot:card-user-controls>
                                <button :class = "classBtnDeleteCardUser" class = "text-grey" @click = "deleteUser(item)">
                                    ✖ 
                                </button>
                            </template>
                            <template v-slot:search-matched-api-user>
                                <div class="text-subtitle2 qa-ma-md text-grey">
                                    Nom d'utilisateur : 
                                    <button class = "my-button-user"
                                        @click = "actionSender = 
                                        {name : 'checkMatchedApi', searchOption : 'Nom d\'utilisateur', userId : item.value}"   
                                    >
                                    {{ item.value }}
                                    <q-tooltip v-if = "item.value"  anchor="center right" self="center left">
                                        <div class="text-center">
                                            <span class="text-weight-light">Rechercher ce nom d'utilisateur sur</span>
                                            <br>
                                            <span class="text-weight-bold"> {{ props.matchedApi}}</span>
                                        </div>
                                    </q-tooltip>
                                    </button>
                                </div>
                            </template>
                        </CardUserVue>
                </li>
            </ul>
        </div> -->
    </div>
</div>
</template>
  
<script setup>
import { ref, watch, onMounted, inject, computed} from 'vue';

// La version de base de vue tags input n'est plus maintenue.. V2 only
// problem to solve : vue3-tags-input is client side only, so we can't use it on server side
// to fix this, we can tell nuxt to ignore this component on server side rendering
import VueTagsInput from "@sipec/vue3-tags-input";

// vue3-tags-input has been added to nuxt.config.js in plugins, so we can use it on server side like this
// import VueTagsInput from 'vue3-tags-input';


// import { useRoute } from 'vue-router';
// import router from '@/router';

// const route = useRoute();

// props
const props = defineProps({
    api: String,
    image: String,
    placeHolder: String,
    url: String,
    tIndex: Number,
    replaceSearchInUrl: {
        type : String,    // requete comlexe (ex sparql) __REPLACE__
        default : ''
    },
    tags : {
        type : Array,
    },
    matchedApi: { // api où chercher des correspondances
        type: String,
        default : ''
    },
    endUrl : {
        type: String,
        default: ''
    },
    handleResponse: Function,
    filterOptions : {
        type : Array,
    },
    timeBetweenRequests : {
        type : Number,
        default : 700,
    },
    // si true, on affiche les CardUser car le composant a été développé pour ça. 
    // Sinon on peut définir une liste custom grâce au slot items-list
    displayUserItems : {
        type : Boolean,
        default : true
    },
    autoComplete : {
        type : Boolean,
        default : null 
    },
    stickySearch : {        // barre de recherche de vue-tags-input sticky
        type : Boolean,
        default : false
    },
    validateInput : {
        type : Function,
        default : () => true
    }
});

// emit -> parent
const emit = defineEmits(['tagsUpdate']);

const deleteUser = user => tags.value = tags.value.filter(tag => tag.value !== user.value)

// variables non réactives
const defaultError = {message : '', level : 0};
let mainInput = null,
    fetchController = new AbortController(),
    lastChoiceAutocomplete = null,
    classBtnDeleteCardUser = 'my-btn-close',
    debounce = null;

    // true si env de production
    // const envProd = inject('envProd');
    const myLog = console.log

    // token d'authentification
    // const result = inject('result'); 
    // const expiredTokenError = inject('expiredTokenError')

    // const getImageUrl = (image) => require('@/assets/' + image)
    const disableAutoComplete = ref (false);

const tag = ref(''),

    tags = inject('tags ' + props.api),
    autocompleteItems = ref([]),
    actualUrl = ref(props.filterOptions ? props.url + props.filterOptions.find(it => it.default).url : props.url),
    actualPlaceHolder = ref(props.placeHolder),
    modelAutoComplete = ref(props.autoComplete),
    modelSelect = ref(props.filterOptions ? props.filterOptions.find(it => it.default).value : props.placeHolder),
    fetchError = ref(defaultError),
    loading = ref(false),
    currentTemplate = ref(null),        // défini dans le template
    tagsInputContainer = ref(null),     // défini dans le template

    // gestion de l'historique de recherche
    searchHistory = ref([]),
    searchHistoryIndex = ref(0)

    // Fonctions ---------------------------------------------------------------------------------------------
    
    onMounted(async() => {
        mainInput = tagsInputContainer.value.querySelector('.ti-input input');
        if (mainInput)
            mainInput.setAttribute('tabIndex', props.tIndex);
        lastChoiceAutocomplete = props.autoComplete;
    });

    // export des résultats de recherche en CSV (autocompleteItems) - TODO : composable
    const addQuotes = str => `"${str}"`;

    const exportCSV = () => {
        // get csv columns from the first item
        const exportColumns = Object.keys(autocompleteItems.value[0])
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent +=       exportColumns.join(";") + "\n" +
                            autocompleteItems.value.map(item => exportColumns.map(col => addQuotes(item[col])).join(";")).join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.querySelector('a.export_csv') 
        if (! link){
            link = document.createElement("a");
            link.className = 'export_csv';
            link.style.display = 'none';
            document.body.appendChild(link);
        } 
        link.setAttribute("href", encodedUri);
        let fileName = "export_" + props.api + "_" + new Date().toLocaleDateString() + ".csv";
        link.setAttribute("download", fileName);
        link.click();
    }

    const cleanStr = s => s.replace(/\s/g, '').toUpperCase()

    // clic droit sur résultat de la liste de résultats (autoCompleteItems) pour ajouter plusieurs tags
    const handleRightClick = e => {
        const clickedResult = e.target.closest('.ti-item')
        if (! clickedResult) return
        e.preventDefault()
        const tagText = cleanStr(clickedResult.innerText)
        const item = autocompleteItems.value.find(it => cleanStr(it.text) === tagText)
        if (! item || tags.value.find(it => it.value === item.value)) return
        tags.value.push(item)
        item.classes += ' ti-result-duplicate '
    }

    const lastRequestUrl = computed(() => {
        let searchVal = tag.value
        let exactSearch = modelAutoComplete.value ? '&auto_complete=1' : '';    // use js native query string lib INSTEAD
        let startUrl =  props.replaceSearchInUrl ?
                        actualUrl.value.replace(props.replaceSearchInUrl, encodeURIComponent(searchVal)) : 
                        actualUrl.value + encodeURIComponent(searchVal);

        if (! props.filterOptions) 
            return startUrl + props.endUrl + exactSearch;
        // let formatFunction = props.filterOptions.find(it => it.value === modelSelect.value).function;
        // if ( ! searchVal.includes('@')) // Recherche par nom d'utilisateur
        //     switch (formatFunction){
        //         case 'syncDec' :
        //             searchVal = syncDec(searchVal);
        //             break;
        //         case 'syncHex' :
        //             searchVal = syncHex(searchVal);
        //             break;
        //     }

        return startUrl + props.endUrl + exactSearch;
    });
    
    // validation de l'input si validateInput définie, à chaque modif de tag.value ou modelSelect.value
    const invalidInput = computed(() => ! props.validateInput(tag.value, modelSelect.value))

    const selectedSearchOption = computed(() => {
        if (! props.filterOptions) return '';
        let selected = props.filterOptions.find(it => it.value === modelSelect.value);
        return selected.label ?? selected.value;
    });

    // Scroll si l'item sélecté n'est plus visible
    // Améliore la gestion du scroll de vue-tags-input
    const scrollSelect = (e) => {
        // window not defined on server side
        if (typeof window === 'undefined') return
        if (e.ctrlKey) return   // pas de scroll désiré si ctrl + up/down - gestion de l'historique de recherche
        let selected = tagsInputContainer.value.querySelector('.ti-selected-item')
        if (! selected) return
        let coords = selected.getBoundingClientRect();
        if (coords.y  + 100 > window.innerHeight) 
            window.scrollBy({top : coords.y - window.innerHeight + 100, behavior : 'smooth'})
        else if (coords.y < 100) 
            window.scrollBy({top : coords.y - 100, behavior : 'smooth'})
    }

    const changeHistory = (iteration) => {
        if (! searchHistory.value.length) return
        searchHistoryIndex.value = (searchHistoryIndex.value + iteration + searchHistory.value.length) % searchHistory.value.length
        tag.value = searchHistory.value[searchHistoryIndex.value]
    }

    const resetSearch = () => {
        autocompleteItems.value = [];
        tag.value = '';
    }
    
    const separatorUsersUrl = '___'     // pour +eurs users dans l'url .. inutilisé pour le moment
    const update = (newTags) => {
        resetSearch()
        let oldTagsValues = tags.value.map(tag => tag.value);
        let newTagsValues = newTags.map(tag => tag.value);
        
        let newTagAdded = newTags.find(tag => ! oldTagsValues.includes(tag.value));
        if (newTagAdded)  {
            tags.value.push(newTagAdded);
            currentTemplate.value.scrollIntoView({behavior: "smooth", block: "start"});
            // let newUrl = router.resolve({name: 'user', params: {user: newTagsValues.join(separatorUsersUrl)}}).href;
            // let newUrl = router.resolve({name: 'user', params: {user: newTagAdded.value.toLowerCase()}}).href;
            // window.history.pushState({path:newUrl},'',newUrl);
        }
        else {
            let tagToRemove = tags.value.find(tag => ! newTagsValues.includes(tag.value));
            if (tagToRemove) {
                tags.value = tags.value.filter(tag => tag.value !== tagToRemove.value);
                // url set to home whenever a tag is removed
                // window.history.pushState({name:'home'},'',router.resolve({name:'home'}).href);
            }
        }

        emit('tagsUpdate', tags.value); // permet au parent d'effectuer une action après màj des tags
    }
    
    const mustResetSearch = computed(() => tag.value === '' || invalidInput.value)

    const resetValues = () => {
        fetchError.value = defaultError;
        autocompleteItems.value = [];
        loading.value = false;
        fetchController.abort()
        fetchController = new AbortController()
    }

    const initItems = () => {
        if (mustResetSearch.value) return resetValues()
        fetchError.value = defaultError;
        scrollTop()
        loading.value = true;
        handleApi(lastRequestUrl.value);
    }

    // Remonte jusqu'à la barre de recherche si trop éloigné
    let destinationScrollPosition = 0;
    const scrollTop = () => {
        if (typeof window === 'undefined') return

        let distance = Math.abs(window.scrollY - destinationScrollPosition);
        if (distance > 150) {
            currentTemplate.value.scrollIntoView();             // nécessaire pour le scroll smooth qui suit
            window.scrollBy({top : - 80, behavior : 'smooth'})
            destinationScrollPosition = window.scrollY;
        }    
    }

    const noResultMessage = computed(() => {
        const criteriaIsUnknown = tag.value.includes('@') || ! selectedSearchOption.value       // @ => peut être une recherche par nom d'utilisateur
        const criteria = criteriaIsUnknown ? 'cette recherche' : 'ce ' + selectedSearchOption.value.toLowerCase()
        return {message : 'Aucun résultat pour ' + criteria, level : 0}
    })

    const handleApi = (currentRequestUrl) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            // Annulation de la requête précédente
            fetchController.abort()
            fetchController = new AbortController()


// {signal : axiosController.signal, headers : header

            $fetch(currentRequestUrl, { signal : fetchController.signal, headers : {'Accept' : 'application/json'}}).then(response => {
                myLog(response);
                autocompleteItems.value = props.handleResponse(response)
                if (! autocompleteItems.value || autocompleteItems.value.length === 0)
                    fetchError.value = noResultMessage.value
                else {
                    autocompleteItems.value.sort((it, it2) => it.text > it2.text ? 1 : -1)
                    fetchError.value = defaultError
                }
            })
            .catch( e => catchErrorRequests(e)) 
            .finally(() => {
                loading.value = currentRequestUrl !== lastRequestUrl.value
                if (mustResetSearch.value) resetValues()
                else {
                    if (document.activeElement.classList.value !== mainInput.classList.value){
                        mainInput.focus();
                        mainInput.setSelectionRange(mainInput.value.length, mainInput.value.length)
                    }
                    if (! searchHistory.value.includes(tag.value)) {
                        searchHistory.value.push(tag.value)
                        searchHistoryIndex.value = 0
                    }
                }
            });
        }, props.timeBetweenRequests);
    }

    const catchErrorRequests = (e) => {
        if (e.name === 'CanceledError') return // requête annulée volontairement (fetchController) par nouvelle saisie de l'utilisateur
        let errorMessage = e.message
        switch(e.code){
            case 'ERR_NETWORK' : 
            errorMessage = 'Erreur lors de la connexion avec le serveur. Vérifiez votre connexion internet.'
                break;
            case 'ERR_BAD_RESPONSE' : 
            errorMessage = 'Erreur lors du traitement de la requête.'
                if (tag.value.includes('*') ) 
                errorMessage += ' La recherche avec le caractère * est limitée pour des raisons de performance.'
                break;
        }
        fetchError.value = {message : errorMessage, level : 1} 
        autocompleteItems.value = [];   // si erreur, on réinitialise la liste de résultats

        console.warn('Erreur handleApi : '); 
        myLog(e); 
    }

    const handleSelectOptions = (selectValue) => {
        let selected = props.filterOptions.find(it => it.value === selectValue),
        autoCompletePossible = 'autoCompletePossible' in selected;
        actualUrl.value = props.url + selected.url
        actualPlaceHolder.value = selected.description ?? selected.label ?? selected.value
        if (! autoCompletePossible) modelAutoComplete.value = false
        else modelAutoComplete.value = lastChoiceAutocomplete
        disableAutoComplete.value = ! autoCompletePossible
        search();
    }
    
    const search = () => {
        handleTemplateClick();  
        initItems(tag.value);
    }

    // focus sur le champ de recherche sauf suppression ou survol de la carte User 
    const handleTemplateClick = e => {
        if (! document.querySelector('.q-card:hover') && ! e?.target.classList.contains(classBtnDeleteCardUser)) 
            mainInput.focus(); 
    }  

    // Vérifie l'existence de l'user pour l'api de recherche correspondante matchedApi
    const checkMatchedApi = (uid, option) => { 
        tag.value = '@' + uid 
        currentTemplate.value.scrollIntoView({block: "start"});
    }

    const handleReceivedAction = action => {
        myLog('handleReceivedAction : ', action);
        switch (action.name) {
            case 'checkMatchedApi' : checkMatchedApi(action.userId, action.searchOption); break;
        }
    }

    // checkbox autocomplete
    const handleAutoComplete = val => {
        if (disableAutoComplete.value) return;
        lastChoiceAutocomplete = val;
        search();
    }
    
    
    let userSearchedFromParam = false;      // Utile juste une fois au chargement de la page quand le token MSAL est reçu.
    const loadUsersFromUrl = () => {
        if (userSearchedFromParam || ! route.params.user || ! result.value ) return
        tag.value= '@' + route.params.user.split(separatorUsersUrl).pop()   // pour le moment, on ne prend que le dernier user de la liste
        userSearchedFromParam = true;
    }


    // watchers

    watch(tag, initItems);
    watch(modelAutoComplete, handleAutoComplete);
    watch(modelSelect, handleSelectOptions);
    // watch(actionTracker, handleReceivedAction);
    // watch(result, loadUsersFromUrl);

</script>


<style lang = "scss">

div {
    margin: 0 auto;
}

.spinner{
    opacity: 0 !important;
    font-size: small;
    font-weight: bold;
    // color: rgb(0, 0, 0);
}

.ti-autocomplete{
    color: black;
}

.template_loading{
    .ti-autocomplete{
        opacity: .3;
    }
    .spinner{
        opacity: .5 !important;
    }
    .title i, .my-api-img{
        animation: rotating 2s linear infinite;
    }
}

.config {
    font-size: small;
    padding: 20px;
    color: rgb(207, 206, 206);
}
.light {
    font-family: monospace;
    font-size: larger;
    font-size: small;
    color: #d1c7c7;
}

.axios-error {
    margin: 20px;
    background: rgba(0, 0, 0, .05);
    font-size: small;
    font-weight: bold;
    padding: 5px;
    opacity: .8;

    &.level_1 {
        color: rgb(255, 0, 0);
    }

    &.level_0 {
        color: black;
    }
}

.max-width {
    max-width: 300px;
}

.template{
    transition: all .8s ease;

    &:hover{
        // background-color: rgb(248, 248, 248);
    }
}

// Bouton de recherche user sur l'autre api (matchedApi)
.my-button-user{
  background-color: transparent;
  border: none;
  color: #8ac3d1;
  text-decoration: underline;
  &:hover{
    cursor: pointer;
    color: #f5f5f5;
  }
}

@keyframes rotating {
    from{   transform: rotate(0deg);}
    to{     transform: rotate(360deg);}
}

// classes vue tags input

// TODO : utiliser les variables de quasar
$primary : #62a9e5;
$negative : #ff0000;

.vue-tags-input{
    border: 1px solid transparent;
    
    &.ti-focus {
        border: 1px solid #686868;
    }
    &.sticky{
        position: sticky !important;
        top: 0;
        z-index: 10;
    }
    .ti-tag, .ti-selected-item, .ti-item:hover{
        background-color: $primary !important;
        // background-color: blue !important;
    }
    .ti-tag.ti-deletion-mark {
        background-color: red !important;
    }
    input{
        background: white;
        color: black;
    }

}

[aria-checked=true]{
    .q-radio__label{
        color: $primary ;
    }
}

.invalidInput{
    .ti-new-tag-input-wrapper::after{
        content : "Saisie invalide";
        color : $negative;
    }
    [aria-checked=true] .q-radio__label {
        color : $negative;
    }
}

.ti-invalid.ti-duplicate, .ti-result-duplicate{
    background-color: #b3b3b3!important;
}

.ti-result-duplicate{
    transition: all .8s ease;
    animation: pulse .3s ease;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.my-api-img{
    height: 40px;
    border-radius: 50%;
    padding: 2px;
    align-self: baseline;
    filter: hue-rotate(104deg) saturate(0.9);
}

// user valide
.my-ti-valid > div:first-child::after{
    content: "✔";
    color: #2ddd56;
    font-size: 1.2em;
    margin: 0 5px 0 7px;
}

// agent 
// .my-ti--agent > div:first-child::before{
//     content: "👮";
//     font-size: 1.2em;
//     margin: 0 5px 0 7px;
// }

// Autres groupes
// 2   
// 3   Agents 
// 4    LAB
// 5  | TECHNIQUE 24-24
// 6  |  ACCES EXT

// LAB
// .my-ti-group- {
//     &4 {
//         & > div:first-child::before{
//             content : "🍔";
//             font-size: 1.2em;
//             margin: 0 5px 0 7px;
//         }

//         &.my-ti-group-3 > div:first-child::before{
//             content : "🍔 👮";
//         }
//     }

// }




</style>