<template>
  <q-btn v-if = "small"
     :icon = "icon" :color="buttonColor" @click="open=true" dense flat size = ".8em" title = "info" class = "q-mb-xs" />
  <q-btn v-else
    :color="buttonColor" :icon = "icon" @click="open=true" :label="label" />

    <q-dialog v-model="open">
      <q-card dark class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{title}}
            </div>
          </div>
        </q-card-section>

        <q-card-section  class="q-pt-none">
          <div class="text-subtitle1 row inline items-end">
            <img src="@/assets/sebina.png" class = "my-api-img q-mr-sm" alt="Sebina">
            Sebina
          </div>
          <div class="text-caption text-grey" >
            Un utilisateur Sebina est valide s'il possède : 
            <ul>
              <li :class = "{'important' : important.includes('important-code')}">
                <q-icon class = "q-mr-sm " name="circle" color = "green"/>
                <b>
                  Une carte avec un code <span class = "text-weight-bolder text-italic">unique</span> à 10 ou 18 chiffres 
                </b> 
              </li>
              <li>
                <q-icon class = "q-mr-sm " name="circle" color = "green"/>
                <b>
                  Une habilitation BNU non dépassée.
                </b>
              </li>
            </ul>
            Les utilisateurs Sebina valides sont ajoutés dans Synchronic lors de synchronisations régulières.
          </div>
        </q-card-section>
        <q-card-section  class="q-pt-none">
          <div class="text-subtitle1 row inline items-end">
            <img src="@/assets/synchronic.png" class = "my-api-img q-mr-sm" alt="Synchronic">
            Synchronic
          </div>
          <div class="text-caption text-grey row inline">
            Synchronic est le logiciel de gestion du contrôle d'accès public de la BNU. <br>
            Tous les utilisateurs Synchronic sont valides et peuvent accéder aux espaces publics de la BNU. <br>
            Si un utilisateur Sebina est valide mais n'est pas présent dans Synchronic, il sera ajouté automatiquement lors d'une synchronisation prochaine.
          </div>
        </q-card-section>
        <q-separator />
        <!-- <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Reserve" />
          <q-btn v-close-popup flat color="primary" round icon="event" />
        </q-card-actions> -->
      </q-card>
    </q-dialog>
</template>


<style lang = "scss" scoped>
.my-card{
  min-width: 400px;
}

  .my-api-img{
    width: 25px;
    height: 25px;
    filter: none;
  }

  .important{
    background-color: #00800038;
  }

</style>

<script setup>
import { ref  } from 'vue';
const props = defineProps({
  title : {
    type : String,
    default : 'Recherche d\'utilisateurs'
  },
  label : {
    type : String,
    default : 'Infos'
  },
  buttonColor : {
    type : String,
    default : 'primary'
  },
  dialogColor : {
    type : String,
    default : 'primary'
  },
  icon : {
    type : String,
    default : 'info'
  },
  small : {
    type : Boolean,
    default : false
  },
  important : {
    type : Array, 
    default : []    // ex : ['important-code']
  }
})

const open = ref(false)
</script>