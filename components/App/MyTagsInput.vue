
<template>  
    <div class = "template col-6 text-center" 
        @contextmenu = "handleRightClick"
        :class = "{'template_loading' : loading, 'invalidInput' : invalidInput}" 
        ref = "currentTemplate" >
    <span class = "row inline items-center">
        <img v-if = "image" class = "my-api-img" :src="image" :alt="api">
        <q-radio v-for = "option in filterOptions" 
            size="xs" 
            v-model="modelSelect" 
            :val="option.value" 
            :label="option.label ?? option.value" 
        />
    </span>
    <div ref = "tagsInputContainer">
        <div class="spinner q-pb-md">
            <q-circular-progress
                indeterminate
                rounded
                color="primary"
                class = "q-pb-xs" 
                size = "1.3em"
            />
            Chargement
        </div>
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
        <div    
            v-if = "fetchError.message && ! loading" 
            :class="'axios-error level_' + [fetchError.level]"
            class = "row inline q-pl-md q-pr-md"
        >
            {{ fetchError.message }}
        </div>
        <div v-else-if = "autocompleteItems.length" 
            @click="mainInput?.focus()"
            class = "text-primary q-ma-md no_select cursor-pointer p-3 hover:bg-slate-500/40 transition-all">
            {{autocompleteItems.length}} résultat(s) trouvé(s)
        </div>
        <div  class="config q-pt-md">
           <p class = "hidden">{{ url }} | {{ actualPlaceHolder }}</p>
        </div>
        <slot name = "items-list"></slot>
    </div>
</div>
</template>
  
<script setup>
import { ref, watch, onMounted, inject, computed} from 'vue';

import VueTagsInput from "@sipec/vue3-tags-input";

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

// variables non réactives
const defaultError = {message : '', level : 0};
let mainInput = null,
    fetchController = new AbortController(),
    debounce = null;

const tag = ref(''),

    tags = inject('tags ' + props.api),
    exampleSearch = inject('exampleSearch'),    // exemple de recherche transmis par le parent

    autocompleteItems = ref([]),
    actualUrl = ref(props.url),
    actualPlaceHolder = ref(props.placeHolder),
    modelSelect = ref(props.filterOptions ? props.filterOptions.find(it => it.default).value : props.placeHolder),
    fetchError = ref(defaultError),
    loading = ref(false),
    currentTemplate = ref(null),        // défini dans le template
    tagsInputContainer = ref(null),     // défini dans le template

    // gestion de l'historique de recherche
    searchHistory = ref([]),
    searchHistoryIndex = ref(0)

    // Fonctions --------------------------------------------------------------------------------------------- 

    // modif depuis le parent
    watch(() => props.url, () => {
        actualUrl.value = props.url;
        search()
    });

    onMounted(async() => {
        mainInput = tagsInputContainer.value.querySelector('.ti-input input');
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
        let searchVal = tag.value.trim()
        let startUrl =  props.replaceSearchInUrl ?
                        actualUrl.value.replace(props.replaceSearchInUrl, encodeURIComponent(searchVal)) : 
                        actualUrl.value + encodeURIComponent(searchVal);

        if (! props.filterOptions) 
            return startUrl + props.endUrl;
        return startUrl + props.endUrl;
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
        }
        else {
            let tagToRemove = tags.value.find(tag => ! newTagsValues.includes(tag.value));
            if (tagToRemove) {
                tags.value = tags.value.filter(tag => tag.value !== tagToRemove.value);
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
        loading.value = true;
        handleApi(lastRequestUrl.value);
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
            $fetch(currentRequestUrl, { signal : fetchController.signal, headers : {'Accept' : 'application/json'}}).then(response => {
                console.log(response);
                autocompleteItems.value = props.handleResponse(response)
                if (! autocompleteItems.value?.length) 
                    fetchError.value = noResultMessage.value
                else {
                    autocompleteItems.value.sort((it, it2) => it.text.localeCompare(it2.text))
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
            break;
        }
        fetchError.value = {message : errorMessage, level : 1} 
        autocompleteItems.value = [];   // si erreur, on réinitialise la liste de résultats

        console.warn('Erreur handleApi : '); 
        console.log(e); 
    }
    
    const search = () => {
        initItems(tag.value);
    }

    // watchers

    watch(tag, initItems);

    // gestion exemple de recherche transmis par le parent
    watch(exampleSearch, () =>{
        if (! exampleSearch.value) return
        tag.value = exampleSearch.value
    });
    watch(tag, () => exampleSearch.value = '');

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
}

.max-width {
    max-width: 300px;
}

.template{
    transition: all .8s ease;
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

</style>