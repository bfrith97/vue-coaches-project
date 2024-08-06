<script setup>
import {computed, ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useStore} from "vuex";

const router = useRouter();
const route = useRoute();

const store = useStore();

const email = ref('');
const password = ref('');
const formIsValid = ref(true);
const mode = ref('login');
const isLoading = ref(false);
const error = ref(null);

const submitButtonCaption = computed(function () {
    if (mode.value === 'login') {
        return 'Login'
    } else {
        return 'Signup'
    }
});
const switchModeButtonCaption = computed(function () {
    if (mode.value === 'login') {
        return 'Signup instead'
    } else {
        return 'Login instead'
    }
});

async function submitForm() {
    formIsValid.value = true;
    if (email.value === '' || !email.value.includes('@') || password.value.length < 6) {
        return formIsValid.value = false;
    }

    isLoading.value = true;

    try {
        if (mode.value === 'login') {
            await store.dispatch('login', {
                email: email.value,
                password: password.value,
            });
        } else {
            await store.dispatch('signup', {
                email: email.value,
                password: password.value,
            });
        }
        const redirectUrl = '/' + (route.query.redirect || 'coaches');
        router.replace(redirectUrl);
    } catch (err) {
        error.value = err.message || 'Failed to authenticate';
    }

    isLoading.value = false;
}

function switchAuthMode() {
    if (mode.value === 'login') {
        mode.value = 'signup'
    } else {
        mode.value = 'login'
    }
}

function clearError() {
    error.value = null;
}
</script>

<template>
    <div>
        <base-dialog :show="!!error" title="An error occurred!" @close="clearError">
            <p>{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading" fixed title="Autneitcating...">
            <base-spinner></base-spinner>
        </base-dialog>
        <base-card>
            <form @submit.prevent="submitForm">
                <div class="form-control">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model.trim="email"/>
                </div>
                <div class="form-control">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model.trim="password"/>
                </div>
                <p v-if="!formIsValid">Please enter a valid email and password (must be at least 6 characters long)</p>
                <base-button>{{ submitButtonCaption }}</base-button>
                <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchModeButtonCaption }}</base-button>
            </form>
        </base-card>
    </div>
</template>

<style scoped>
form {
    margin: 0.5rem;
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
</style>