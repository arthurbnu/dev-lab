<template>
  <q-card dark bordered @mouseenter = "hover = true" @mouseleave = "hover = false"
    class="my-card-user relative-position
    bg-grey-9 my-card my-card_max
    q-mb-lg q-pl-md"
    :class = "{'my-user-invalid' : ! user.valid}">
  <slot name = "card-user-controls"></slot>
  <q-card-section >
      <div class="text-h7 q-ma-xs my-title text-weight-medium">
          <q-icon name = "account_circle" class = "q-mr-md q-pb-xs" size = "1em"></q-icon>
          {{ user.fullName }}
      </div>
    <slot name = "search-matched-api-user"></slot>
  </q-card-section>
  <q-separator dark inset />
  <!--  show mail and contact links if user is BNU worker  -->
  <q-card-section v-if = "user.bnuAgent" class = "my-section-mail row items-start q-pa-xs light q-mt-sm">
    <span>
      <b>👮 Agent BNU </b>  {{ user.mail }}
    </span>
    <span v-if = "user.mail">
        <q-icon name = "message" size = "1.1em"></q-icon>
        Contact
        <a :href = "'https://teams.microsoft.com/l/chat/0/0?users=' + user.mail" class = "text-white" target = "_blank">Teams</a> 
        - 
        <a :href = "'https://outlook.office.com/mail/deeplink/compose?to=' + user.mail" class = "text-white" target = "_blank">Outlook</a>
        <!-- -<a :href = "urlRechercheIntranet" target = "_blank" class = "text-white">Intranet</a> -->
    </span>
    <span v-if  = "user.searchSource === 'synchronic'" class = "text-caption text-grey">
      Accès aux espaces du personnel
    </span>
  </q-card-section>
  <!-- section pour les users ayant accès au lab -->
  <q-card-section v-if = "user.synchronicGroups && user.synchronicGroups.includes(4)" class = "row items-start q-pa-xs light q-mt-sm">
    <span><b>🍔 Accès au lab</b></span>
  </q-card-section>
  <q-card-section v-if = "user.code || user.codeHexa" class = "my-section-code row items-start  q-pa-sm light">
      <span >
          <b>Code : </b>
      <span class = "user-code" :class = "{'twin-code-hovered' : twinCodeHovered}">
          {{ code }}
      </span>
      </span>
      <br>
      <span v-if = "user.validCode">
          <b>Code Hexa : </b>{{ codeHexa }}
      </span>
      <span v-if = "user.infos" v-show = "false">
          {{ user.infos }}
      </span>
  </q-card-section>

  <q-card-section v-if = "user" class = "row items-start q-pa-xs">
  <span v-if = "user.validCode" >
    <q-icon class = "q-mr-sm" name="circle" color = "green"/>
    Code valide
  </span>
  <span v-else>
    <q-icon class = "q-mr-sm" name="circle" color = "pink"/>
    Code invalide <CardDialog :small = "true" :important = "['important-code']"/>
  </span>
  </q-card-section>

  <q-card-section v-if = "user" class = "row items-start q-pa-xs">
    <span v-if = "user.authorized && user.authorized !== 'undetermined'" >
      <q-icon class = "q-mr-sm " name="circle" color = "green"/>
      Usager habilité 
    </span>
    <!-- <span v-if = "user.dateEndAuth" > - {{ user.dateEndAuth }}</span> -->
    <span v-else-if = "user.authorized !== 'undetermined'">
      <q-icon class = "q-mr-sm " name="circle" color = "pink"/>
      Usager non habilité
    </span>
    <LogoBnuVue v-if = "user.authorized !== 'undetermined'"
    class = "q-ml-md"
    :authorized="user.authorized ?? false" 
    :dateEndAuth = "user.dateEndAuth ?? ''"/>

    <span v-if = "user.otherFields">
      <ul class = "text-left q-pa-none">
        <li v-for = "field in user.otherFields">
          {{field.name}} : {{field.value.toUpperCase()}}
        </li>
      </ul>
    </span>

    <span v-if = "user.createdAt" class = "text-caption text-grey">
      <span class="inline row items-center">
        <q-icon class = "q-mr-xs" name = "event"/>
        <label >Date de création : </label>
        {{ convDate(user.createdAt) }}
      </span>
    </span>
  </q-card-section>
  <q-card-section v-if = "mustLoadEvent" class = "row items-start q-pa-xs text-left text-caption text-grey">
  <div class="q-ma-none">
    <span v-if = "!eventLoaded">
      Dernier badgeage Synchronic...
      <q-spinner-gears size="20px" color="white" />
    </span>
    <span v-else-if = "!lastUserEvent" >
      Aucun badgeage trouvé pour ce code hexa
    </span>
    <span v-else >
      <span class="inline row items-center">
        <q-icon class = "q-mr-xs" :name = "badgeageOk ? 'check_circle' : 'warning'" :color = "badgeageOk ? 'green' : 'red'"/>
        <label >
          Dernier badgeage : 
        </label>
        {{ convDate(lastUserEvent.source_date) }} 
      </span>
      <br>
      {{ lastUserEvent.stringified_evt }} 
    </span>
  </div>
  </q-card-section>

  <q-card-section class = "q-pa-xs">
    <slot name = "search-matched-api"></slot>
  </q-card-section>
</q-card>
</template>

<script setup lang="ts">

type user = {
  name: string,
  firstName: string,
  code: string,
  codeHexa: string,
  fullName: string,
  mail: string,
  infos: string,
  authorized: boolean | 'undetermined',
  dateEndAuth: string,
  validCode: boolean,
  valid: boolean,
  bnuAgent: boolean,
  lastUserEvent: any,
  synchronicGroups?: number[],  // familles d'usagers Synchronic auxquelles appartient l'usager (2 : espaces publics, 3 : espaces du personnel, 4 : espace lab)
  searchSource?: 'sebina' | 'synchronic' | 'unistra',
  createdAt?: string,

  otherFields : field[]
}

type field = {
  'name' : string,
  'value' : any
}

type synchronicEvent = {
  source_date: string,
  stringified_evt: string
}

// type UserState is a reactive containing the user state (user or null)
interface userState {
  userHovered: user|false,
}

import { ref, inject, watch, computed, onMounted, onUnmounted, Ref, ComputedRef} from 'vue'
import LogoBnuVue from '@/views/LogoBnu.vue'; 
import CardDialog from './CardDialog.vue'
import useConvert from '@/composables/convertHexa.js';
import axios from 'axios'
import { AuthenticationResult } from '@azure/msal-common/dist/response/AuthenticationResult';

const requestSearchEventUrl = 'https://ws-synchronic.ad.bnu.fr/recherche2.php?action=search_event&value='

const reactiveUserState = inject('userState') as userState;
const {syncHex, syncDec} = useConvert(); 
const envProd = inject('envProd') as ComputedRef<boolean>;

const hover = ref(false);
const twinCodeHovered = ref(false); // true si le code d'un user survolé est le même que le code de l'user courant
// use msal type MsalAuthenticationResult instead
const result = inject('result') as Ref<AuthenticationResult>
const lastUserEvent = ref<synchronicEvent>()   // dernier evt Synchronic (badge accepté ou refusé par exemple)
const eventLoaded = ref(false); 
const mustLoadEvent = computed(() => props.loadUserEvent && props.user.validCode)
const badgeageOk = computed(() => lastUserEvent.value?.stringified_evt.includes('accepté'))

const convDate = (date :string) => {
  let d = new Date(date)
  return d.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
}

const getLastEvent = () => {
  let authHeader = {'Authorization' : 'Bearer ' + result.value.accessToken}
  axios.get(requestSearchEventUrl + codeHexa.value, {headers : authHeader}).then(response => {
    console.log('résultat de la recherche de badgeage', response)
    lastUserEvent.value = response.data?.data ?? null;
  }).catch(error => {
    console.log('Erreur lors de la recherche de badgeage', error)
  }).finally(() => {
    eventLoaded.value = true;
  })
}

onMounted(() => {
  if (mustLoadEvent.value)
    getLastEvent()
})

onUnmounted(() => 
  reactiveUserState.userHovered = false
)

const props = defineProps({ 
  user : {
    type: Object as () => user,
    required: true,
  },
  loadUserEvent : {
    type: Boolean,
    default: true
  }
})

defineExpose({
  props
})

// const urlRechercheIntranet = 'https://intranet.bnu.fr/fr/personnel?search_api_fulltext=' + props.user.name + '+' + props.user.firstName

const getCode = (user:user) => user.code || syncDec(user.codeHexa)
const code = computed(() => getCode(props.user))
const codeHexa = computed(() => props.user.codeHexa || syncHex(props.user.code))

const hoverChanged = (hover:boolean) => reactiveUserState.userHovered = hover && props.user // au survol on affecte l'user courant à userHovered

// si le code survolé est le même que le code de l'user courant non survolé on les met en valeur
const userHoveredChanged = (user:user|false) => twinCodeHovered.value = (user && ! hover.value && +code.value > 0 && getCode(user) === code.value)

watch(hover, hoverChanged)
watch(() => reactiveUserState.userHovered, userHoveredChanged)  // watch only userHovered property of reactiveUserState


</script>

<style lang = "scss" scoped>
.my-user-invalid{
  outline: 3px solid pink;
}

</style>

<style lang = "scss" >

$highlightTwinCode : #09606b;

.my-section-code{
  font-size: 1em;
  letter-spacing: 1px
}

// marche pas sur Firefox
// highlight the twin codes when one is hovered
:has(.twin-code-hovered){
 .my-card-user:hover .user-code, .user-code.twin-code-hovered{
    background-color: $highlightTwinCode;
  }
}

button.my-btn-close{ 
  position: absolute;
  top: 0;
  right: 10px;
  padding: 0;
  z-index: 1;
  opacity: .5;
  cursor: pointer;
  background: none;
  border: none;
}

</style>