<template>
    <div class="h-2 opacity-60 flex rounded bg-teal-200/25">
        <div class="w-full shadow-none rounded flex flex-col justify-center bg-teal-200 transition-all ease-linear"
            :style="{'transition-duration' : time}"
            :class="{'!w-0' : mounted}"
            >
        </div>
    </div>
</template>

<script setup>
const mounted = ref(false)
const delay = 500

const emit = defineEmits(['end'])

const props = defineProps({
    time : {  
        type: String,
        required: false,
        default: '3s'
    }
})

onMounted( () => {
    setTimeout(() => {
        mounted.value = true
    }, delay)

    setTimeout(() => {
        emit('end')
    }, parseInt(props.time) * 1000 + delay)
})

</script>