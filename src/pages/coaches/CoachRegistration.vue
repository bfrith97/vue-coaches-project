<script setup>
import CoachForm from "@/components/coaches/CoachForm.vue";

import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

function saveData(data) {
    store.dispatch('registerCoach', data);
    router.replace('/coaches');
}
</script>

<template>
    <div>
        <section>
            <base-card>
                <h2>Register as a coach now!</h2>
                <coach-form @submit-form="saveData"></coach-form>
            </base-card>
        </section>
    </div>
</template>

<style scoped>

</style>