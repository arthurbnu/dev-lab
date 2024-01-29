<template>
  <div class="q-px-lg q-py-md">
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
        subtitle="15,16,17,19 mai"
        icon="rocket_launch"
        :body="body"
      />

   

      <q-timeline-entry
        title="Wikidata, printemps de la donnée"
        subtitle="découvrez comment alimenter et obtenir des données Wikidata avec le langage spatql, .. et bien plus encore"
        color="orange"
        icon="done_all"
        :body="body"
      />

      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
        :body="body"
      />

      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
        :body="body"
      />
    </q-timeline>
  </div>
</template>