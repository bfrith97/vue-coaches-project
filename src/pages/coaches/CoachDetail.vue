<script setup>
import {ref, computed, toRefs} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";

const store = useStore();
const route = useRoute();

const props = defineProps(['id']);

const {id} = toRefs(props);

const selectedCoach = ref(null);
selectedCoach.value = store.getters.coaches.find(coach => coach.id === id.value)

const fullName = computed(function () {
    return selectedCoach.value.firstName + ' ' + selectedCoach.value.lastName;
});
const contactLink = computed(function () {
    return route.path + '/' + id + '/contact';
});
const areas = computed(function () {
    return selectedCoach.value.areas;
});
const rate = computed(function () {
    return selectedCoach.value.hourlyRate;
});
const description = computed(function () {
    return selectedCoach.value.description;
});
</script>

<template>
    <div>
        <section>
            <base-card>
                <h2>{{ fullName }}</h2>
                <h3>£{{ rate }}/hour</h3>
            </base-card>
        </section>
        <section>
            <base-card>
                <header>
                    <h2>Interested? Reach out now!</h2>
                    <base-button link :to="contactLink">Contact</base-button>
                </header>
                <router-view></router-view>
            </base-card>
        </section>
        <section>
            <base-card>
                <base-badge v-for="area in areas" :key="area" :type="area" :text="area"></base-badge>
                <p>{{ description }}</p>
            </base-card>
        </section>
    </div>
</template>

<style scoped>

</style>