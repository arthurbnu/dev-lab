<template >
  <q-card ref = "cardItem" dark bordered class="bg-grey-9 my-card my-card_max max-width q-mb-lg card-item" >
    <slot name="item-top"></slot>
    <q-card-section class = "my-highlight-fast">
      <div class="my-main text-h6" >
        <a :href="item.wikiPage" class = "text-white" target = "_blank" :alt = "item.name">
          {{ item.name }}
          <q-tooltip anchor="center right" self="center left" >
              <em> Lien wikipedia</em>
              <q-icon name="link" size = "1.5em" class = "q-ml-sm"/>
          </q-tooltip>
        </a>
        <div class="text-caption text-grey-13 text-capitalize text-italic" v-if="item.itemDescription">
          <q-icon name="account_circle" size="1.3em" class = "q-mr-xs"></q-icon>
          {{ item.itemDescription }}
        </div>
      </div>
    </q-card-section>
    <slot name="item-bottom"></slot>
    <q-separator dark inset class = "separator" />
    <q-card-section>
        <q-carousel ref = "carousel"
          @mouseover="showFullScreenButton = true"
          @mouseleave="showFullScreenButton = false"
          v-model="slides" 
          v-model:fullscreen="fullscreen"
          :class = "{'my-hide-navigation' : images.length < 2}"
          animated 
          arrows 
          navigation
          infinite 
          swipeable
          dark
        >
        <q-carousel-slide v-for = "image, i in images" :name="i" :img-src="image.src" />
        <!-- // bouton fullscreen -->
        <template v-slot:control >
          <q-carousel-control position="bottom-right" :offset="[18, 18]" v-show = "showFullScreenButton && images.length > 1" >
            <q-btn ref = "buttonFullscreen"
              push round dense color="white" text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="fullscreen = !fullscreen" />
          </q-carousel-control>
        </template>
      </q-carousel>
    </q-card-section>

    <q-expansion-item class="my-expansion-item" icon="info" label="Infobox">
      <q-card-section class="q-pa-xs">
        <div v-if="infobox">
          <div v-html="infobox" class="my-infobox"></div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>


<script setup lang="ts">

import { ref, onMounted } from 'vue'
// import q card quasar typescipt 
import { QCard } from 'quasar'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
})

// wiki
const infoboxSelector = '.infobox_v2, .infobox_v3'
const wikiFrontUrl = 'https://fr.wikipedia.org/'
const wikiApiUrl = wikiFrontUrl + 'api/rest_v1/page/html/'
const wikiApiUrlImages = wikiFrontUrl + 'w/api.php?action=query&prop=images&origin=*&format=json&formatversion=2&titles='
const wikiBaseUrl = wikiFrontUrl + 'wiki/'
const wikiFilePath = wikiFrontUrl + 'wiki/Special:FilePath/'

// refs
const infobox = ref('<div>InfoBox non trouvée...</div>')
// const images:Ref<Image[]> = ref([])
// simpler
const images = ref<Image[]>([])
const slides = ref(0)
const fullscreen = ref(false)
const showFullScreenButton = ref(false)

// const cardItem = ref<{ $el: HTMLElement }>()
const cardItem = ref<QCard>()

type Image = {
  name: string,
  src: string
}

// wikiImage type, got from fetch, it has at least a property title
type WikiImage = {
  title: string,
}

onMounted(() => {
  images.value.push({
    name: 'default',
    src: props.item.image
  })
  fetchInfoBox(props.item.wikiPage)
  fetchImages(props.item.wikiPage)
  // highlight fast newly added card
  setTimeout(() => cardItem.value?.$el.querySelector('.my-highlight-fast')?.classList.remove('my-highlight-fast')
  , 500);

})

// appelés depuis le parent
const nextImage = () => slides.value = (slides.value + 1) % images.value.length
const prevImage = () => slides.value = slides.value > 0 ? slides.value - 1 : images.value.length - 1

defineExpose({
  fullscreen,
  nextImage,
  prevImage,
})


const fetchImages = async (wikiUrl: string) => {
  if (!wikiUrl) return
  let apiUrl = wikiApiUrlImages + wikiUrl.split('/').pop()
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log('data images', data)
      let imagesArray = images.value
      for (let page in data.query.pages) {
        let imagesWiki = data.query.pages[page].images
        imagesWiki = imagesWiki.filter((image: WikiImage) => !image.title.endsWith('.svg'))
        imagesArray = imagesArray.concat(imagesWiki.map((image: WikiImage) => ({ name: image.title, src: wikiFilePath + image.title })))
      }
      imagesArray = imagesArray.filter((image, index, self) => index === self.findIndex((t) => (sameImage(t, image))))
      images.value = imagesArray
    })
}

// const formatImageName = (imageUrl: string) => decodeURIComponent(imageUrl.split('/').pop() as string).toLowerCase().replace(/\s/g, '') 
// simpler (avoid as string) 
const formatImageName = (imageUrl: string) => decodeURIComponent(imageUrl.split('/').pop()!).toLowerCase().replace(/\s/g, '').replaceAll('fichier:', '')
const sameImage = (image1: Image, image2: Image) => formatImageName(image1.src) === formatImageName(image2.src)

const fetchInfoBox = async (wikiUrl: string) => {
  if (!wikiUrl) return
  let apiUrl: string = wikiApiUrl + wikiUrl.split('/').pop()
  // let data = fetch(  "https://en.wikipedia.org/w/api.php?action=query&titles=San_Francisco&prop=images&imlimit=20&origin=*&format=json&formatversion=2", 
  fetch(apiUrl)
    .then(response => response.text())
    .then(text => {
      let html = new DOMParser().parseFromString(text, 'text/html');
      let results = html.querySelector(infoboxSelector) as HTMLElement;
      if (!results) return infobox.value = 'Aucune infobox trouvée...'
      formatHtml(results)
      infobox.value = results.outerHTML
    });
}

const maxWidth = '290px';
// formate le html fetché de wikipedia pour l'affichage dans la card 
const formatHtml = (html: HTMLElement) => {
  // dépassements de largeur
  html.style.maxWidth = maxWidth
  html.querySelectorAll<HTMLElement>('[width], [style]').forEach(el => el.style.maxWidth = maxWidth)

  // pour éviter doublons d'id
  html.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'))

  // suppr les éléments de navigation + les éléments non destinés au print (liens modifier, légende, annotation, ....)
  html.querySelectorAll('.navigation-only, .noprint').forEach(el => el.remove())  // (infobox_v3)

  // change les href pour qu'ils pointent vers wikipedia
  html.querySelectorAll('a').forEach(a => {
    a.setAttribute('target', '_blank')
    let href = a.getAttribute('href')
    if (href?.startsWith('./'))
      a.setAttribute('href', wikiBaseUrl + href.replace('./', ''))
  })
}

</script>

<!-- l'attribut scoped ne permet pas la mise en forme du contenu chargé avec fetch -->
<style lang ="scss">
$borderColor : #686868;

// TODO quasar theme

$primary : #62a9e5;

.card-item {

  // highlight fast
  .my-highlight-fast{
    .my-main a{
    /*
      color : $primary !important;*/
      color : blue !important;
    }
  }

  .my-main a{
      transition: all 1s ease;
    }

  // anciennement dans octantView
  .q-separator{
    width : 150px;
    margin: auto;
  }

  .my-main{
    img{
      opacity: .9;
      width: 150px;
        max-width: 40vw;
        max-height: 30vh;
        border-radius: 5%;
        transition: opacity .3s;
        
        &:hover{
          opacity: 1;
        }
      } 
    }
    
  .my-infobox table {
    color: white;
    width: 100%;

    tr {
      opacity: .8;
      transition: opacity .3s ease;

      &:hover {
        opacity: 1;
      }

      &:nth-child(odd) {
        background-color: $borderColor;
      }
    }
  }

  a{
    text-decoration:none;
  }

  .my-infobox {
    a {
      color: #62a9e5;
    }

    // signature
    img {
      background-color: #ffffffc4;
      margin: 5px;
      border-radius: 0%;
    }
  }

  .my-expansion-item .q-item--clickable {
    background-color: #686868;
    i {
      color: white;
    }
  }

  
  // carousel  
  .q-carousel{
    // background-color: $grey-9;  /* couleur de q-card dark */
    background-color: 'black';  /* couleur de q-card dark */
    max-height: 250px;
  }

  .q-carousel__slide {
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  // masque la navigation du carousel si pas plein écran (ne rend pas bien avec le scroll)
  .q-carousel__navigation-inner{
    display: none;
  }

  // masque fleches de nav si une seule image
  .my-hide-navigation .q-carousel__arrow{
    display: none;
  }
  
  // réajuste les flèches de navigation du carousel
  .q-carousel__prev-arrow--horizontal {
    left: 0px;
  }
  .q-carousel__next-arrow--horizontal {
    right: 0px;
  }

}

// carousel fullscreen n'est pas dans le Card item
body:has(.card-item) .fullscreen .q-carousel__slide {
    background-size: contain;
    background-repeat: no-repeat;
}

// disposition flex q card sur 3 colonnes
// à appliquer sur le parent pour disposition en 3 colonnes
#my-items-list{
  flex-wrap: wrap;
  display: flex;
  max-width: 80%;
  margin: auto;
  
  li{
    flex-basis: 33%;
  }
    // 1 colonne
    &.my-row-1{
      li{
        flex-basis: 100%;
      }
    }
    // // 2 colonnes
    &.my-row-2{
      li{
        flex-basis: 50%;
      }
    }
    // // 3 colonnes
    &.my-row-3{
      li{
        flex-basis: 33%;
      }
    }

}


</style>