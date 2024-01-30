<template>
  <div class="q-px-lg q-py-md text-xl margin-auto">
    <q-timeline color="secondary">
      <q-timeline-entry heading body="En mai, fait ce qu'il te plAIt..." />

      <q-timeline-entry
        title="ADELE"
        subtitle="2 mai"
color="secondary"
        avatar="https://s3.fr-par.scw.cloud/rdg-portal/logos-macarons/Macarons%20Recherche%20Data%20Gouv_Ateliers%20de%20la%20donn%C3%A9e.jpg"
        :body="body"
      />

      <q-timeline-entry
        title="Ateliers IA"
        subtitle="3, 5, 9 et 10 mai"
        icon="rocket_launch"
        :body="body"
      />

   

      <q-timeline-entry
        title="Sigi-AL"
        subtitle="12 mai"
        :body="body"
icon="settings_accessibility"
color="orange"
      />

<q-timeline-entry
        title="Ateliers IA"
        subtitle="15, 16, 17 et 19 mai"
        icon="rocket_launch"
        :body="body"
      />

   

      <q-timeline-entry
        title="Wikidata, printemps de la donnée"
        subtitle="26 mai"
        color="orange"
        icon="done_all"
        :body="body"
      >
<div>
Découvrez comment alimenter et obtenir des données Wikidata avec le langage sparql, et bien plus encore...
</div>
 </q-timeline-entry>

<q-timeline-entry heading body="Été rime avec ateliers" />

      <q-timeline-entry
        title="Atelier Univoak"
        subtitle="8 juin"
        :body="body"
color="purple"
      />

      <q-timeline-entry
        title="GT Libre accès"
        subtitle="13 juin"
        :body="body"
      />    

<q-timeline-entry
        title="Ateliers ESTRADES"
        subtitle="14 - 15 juin"
        :body="body"
color="purple"
avatar="https://eveille.hypotheses.org/files/2022/12/18383-768x768.jpg"
      />

   <q-timeline-entry
        title="Atelier Mirabel"
        subtitle="20 juin"
        :body="body"
color="pink"
icon="nutrition"
      />  


    </q-timeline>
  </div>
</template>