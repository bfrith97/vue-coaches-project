<script>
import CoachForm from "@/components/coaches/CoachForm.vue";

export default {
    name: "CoachRegistration",
    components: {CoachForm},
    methods: {
        saveData(data) {
            this.$store.dispatch('registerCoach', data);
            this.$router.replace('/coaches');
        }
    }
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