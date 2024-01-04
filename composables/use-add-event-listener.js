import {onBeforeUnmount} from "vue";

export function useAddEventListener(target, eventName, fn ){
    document.addEventListener(eventName, fn);
    onBeforeUnmount(() => {
        document.removeEventListener(eventName, fn);
    });

    document.on(eventName, fn);
}
// export function useAddEventListener(eventName, fn){
//     window.addEventListener(eventName, fn);
//     onBeforeUnmount(() => {
//         window.removeEventListener(eventName, fn);
//     });
// }