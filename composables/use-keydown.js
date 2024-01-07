import {onBeforeUnmount, onMounted} from "vue";

let useKeyDown = (keyCombos) => {
    let onKeyDown = (event) => {
        let kc = keyCombos.find(kc => kc.key === event.key);

        if(kc) {
            kc.fn();
        }
    }
    onMounted(async () => {
        await nextTick();   // pour les composants .client.vue
        window.addEventListener('keydown', onKeyDown);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onKeyDown);
    });
};

export default useKeyDown;