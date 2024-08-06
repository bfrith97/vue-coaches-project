<script setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute();

const props = defineProps(['id', 'firstName', 'lastName', 'rate', 'areas']);

const fullName = computed(function () {
    return props.firstName + ' ' + props.lastName;
});
const coachContactLink = computed(function () {
    return route.path + '/' + props.id + '/contact';
});
const coachDetailsLink = computed(function () {
    return route.path + '/' + props.id
});
</script>

<template>
    <li>
        <h3>{{ fullName }}</h3>
        <h4>£{{ rate }}/hour</h4>
        <div>
            <base-badge v-for="area in areas"
                        :key="area"
                        :text="area"
                        :type="area"
            >
                {{ area }}
            </base-badge>
        </div>
        <div class="actions">
            <base-button mode="outline" link :to="coachContactLink">Contact</base-button>
            <base-button link :to="coachDetailsLink">View Details</base-button>
        </div>
    </li>
</template>

<style scoped>
li {
    margin: 1rem 0;
    border: 1px solid #424242;
    border-radius: 12px;
    padding: 1rem;
}

h3 {
    font-size: 1.5rem;
}

h3,
h4 {
    margin: 0.5rem 0;
}

div {
    margin: 0.5rem 0;
}

.actions {
    display: flex;
    justify-content: flex-end;
}
</style>