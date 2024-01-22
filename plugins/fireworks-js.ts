import Vue from 'vue';
import { Fireworks } from '@fireworks-js/vue';

defineNuxtPlugin((nuxtApp) => {
    // Vue.use(Fireworks);
    nuxtApp.vueApp.use(Fireworks);
});

// Vue.use(Fireworks);

