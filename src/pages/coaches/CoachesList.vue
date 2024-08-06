<script setup>
import CoachItem from "@/components/coaches/CoachItem.vue";
import CoachFilter from "@/components/coaches/CoachFilter.vue";
import {reactive, ref, computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const isLoading = ref(false);
const error = ref(null);
const activeFilters = reactive({
    frontend: true,
    backend: true,
    career: true,
});

const isLoggedIn = computed(function () {
    return store.getters.isAuthenticated;
});
const filteredCoaches = computed(function () {
    const coaches = store.getters['coaches'];
    return coaches.filter(coach => {
        if (activeFilters.frontend && coach.areas.includes('frontend')) {
            return true;
        }
        if (activeFilters.backend && coach.areas.includes('backend')) {
            return true;
        }
        if (activeFilters.career && coach.areas.includes('career')) {
            return true;
        }
        return false;
    })
});
const hasCoaches = computed(function () {
    return !isLoading.value && store.getters['hasCoaches'];
});
const isCoach = computed(function () {
    return store.getters['isCoach'];
});

function setFilters(updatedFilters) {
    activeFilters.value = updatedFilters;
}

async function loadCoaches(refresh) {
    try {
        isLoading.value = true;
        await store.dispatch('loadCoaches', {
            forceRefresh: refresh
        });

        isLoading.value = false;
    } catch (error) {
        error.value = error.message || 'Something went wrong!'
    }
}

function handleError()
{
    error.value = null;
}

loadCoaches(false);

</script>

<template>
    <div>
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <coach-filter @change-filter="setFilters"></coach-filter>
        </section>
        <section>
            <base-card>
                <div class="controls">
                    <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
                    <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">Log in to Register as Coach</base-button>
                    <base-button link to="/register" v-if="isLoggedIn && !isCoach && !isLoading">Register as Coach</base-button>
                </div>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="hasCoaches">
                    <coach-item v-for="coach in filteredCoaches"
                                :key="coach.id"
                                :id="coach.id"
                                :first-name="coach.firstName"
                                :last-name="coach.lastName"
                                :rate="coach.hourlyRate"
                                :areas="coach.areas"
                    > {{ coach.firstName }}
                    </coach-item>
                </ul>
                <h3 v-else>There are no coaches</h3>
            </base-card>
        </section>
    </div>
</template>

<style scoped>
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.controls {
    display: flex;
    justify-content: space-between;
}
</style>