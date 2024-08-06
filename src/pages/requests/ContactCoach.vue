<script setup>
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {ref} from "vue";

const route = useRoute();
const router = useRouter();
const store = useStore();

const email = ref('');
const message = ref('');
const formIsValid = ref(true);

function validateForm() {
    if (email.value === '' || !email.value.includes('@') || message.value === '') {
        return formIsValid.value = false;
    }
    return formIsValid.value = true;
}

function submitForm() {
    this.validateForm();

    const formData = {
        id: route.params.id,
        email: email.value,
        message: message.value,
    }

    if (formIsValid.value) {
        store.dispatch('addRequest', formData);

        router.replace('/coaches');
    }
}
</script>

<template>
    <form @submit.prevent="submitForm">
        <div class="form-control">
            <label for="email">Your Email</label>
            <input type="email" id="email" v-model.trim="email"/>
        </div>
        <div class="form-control">
            <label for="message">Your Message</label>
            <textarea id="message" rows="5" v-model.trim="message"></textarea>
        </div>
        <p v-if="!formIsValid" class="errors">Please enter a valid email and non-empty message.</p>
        <div class="actions">
            <base-button>Send Message</base-button>
        </div>
    </form>
</template>

<style scoped>
form {
    margin: 1rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 1rem;
}

.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
}

input,
textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
}

input:focus,
textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
}

.errors {
    font-weight: bold;
    color: red;
}

.actions {
    text-align: center;
}
</style>