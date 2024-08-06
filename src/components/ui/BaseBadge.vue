<script setup>
import {computed} from "vue";

const props = defineProps(['text', 'type']);

const title = computed(function () {
    return props.text.toUpperCase();
})
</script>

<template>
    <span class="badge" :class="type">
        {{ title }}
    </span>
</template>

<style scoped>
.badge {
    background-color: #ccc;
    color: #252525;
    border-radius: 30px;
    padding: 0.5rem 1.5rem;
    display: inline-block;
    margin-right: 0.5rem;
}

.frontend {
    background-color: #3d008d;
    color: white;
}

.backend {
    background-color: #71008d;
    color: white;
}

.career {
    background-color: #8d006e;
    color: white;
}
</style>