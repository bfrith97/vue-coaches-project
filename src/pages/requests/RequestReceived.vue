<script setup>
import RequestItem from "@/components/requests/RequestItem.vue";
import {computed, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

const isLoading = ref(false);
const error = ref(null);
const receivedRequests = computed(function () {
    return store.getters['requests']
});
const hasRequests = computed(function () {
    return store.getters['hasRequests']
});

async function loadRequests() {
    isLoading.value = true;
    try {
        await store.dispatch('fetchRequests');
    } catch (error) {
        error.value = error.message || 'Something failed!';
    }
    isLoading.value = false;
}

function handleError() {
    error.value = null;
}

loadRequests();
</script>

<template>
    <div>
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <header>
                    <h2>Requests Received</h2>
                </header>
                <base-spinner v-if="isLoading"></base-spinner>
                <ul v-else-if="hasRequests">
                    <request-item v-for="request in receivedRequests" :email="request.email" :message="request.message" :key="request.id"></request-item>
                </ul>
                <h3 v-else>You haven't received any requests yet :(</h3>
            </base-card>
        </section>
    </div>
</template>

<style scoped>
header {
    text-align: center;
}

ul {
    list-style: none;
    margin: 2rem auto;
    padding: 0;
    max-width: 30rem;
}

h3 {
    text-align: center;
}
</style>