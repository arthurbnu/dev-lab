import {ref, unref, watch, onMounted, onUnmounted,} from 'vue'

const defaultSelector = 'input'

export function useFocus(selector = defaultSelector) {
    const focusEl = (selector) => {
        try{
            const el = document.querySelector(selector)
            el.focus()
            return true
        }
        catch(e){
            console.warn('useFocus() failed for ', selector, ' caught error: ', e)
            return false
        }
    }
    
    let mountedFocus = ref(false)

    onMounted(async () => {
await nextTick()
        mountedFocus = focusEl(selector)
    })

    return {mountedFocus}

}