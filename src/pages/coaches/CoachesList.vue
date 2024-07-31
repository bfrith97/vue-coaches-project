<script>
import CoachItem from "@/components/coaches/CoachItem.vue";
import CoachFilter from "@/components/coaches/CoachFilter.vue";

export default {
    name: "CoachesList",
    data() {
        return {
            isLoading: false,
            error: null,
            activeFilters: {
                frontend: true,
                backend: true,
                career: true,
            }
        }
    },
    components: {CoachFilter, CoachItem},
    computed: {
        isLoggedIn() {
            return this.$store.getters.isAuthenticated;
        },
        filteredCoaches() {
            const coaches = this.$store.getters['coaches'];
            return coaches.filter(coach => {
                if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
                    return true;
                }
                if (this.activeFilters.backend && coach.areas.includes('backend')) {
                    return true;
                }
                if (this.activeFilters.career && coach.areas.includes('career')) {
                    return true;
                }
                return false;
            })
        },
        hasCoaches() {
            return !this.isLoading && this.$store.getters['hasCoaches'];
        },
        isCoach() {
            return this.$store.getters['isCoach'];
        }
    },
    methods: {
        setFilters(updatedFilters) {
            this.activeFilters = updatedFilters;
        },
        async loadCoaches(refresh) {
            try {

                this.isLoading = true;
                await this.$store.dispatch('loadCoaches', {
                    forceRefresh: refresh
                });

                this.isLoading = false;
            } catch (error) {
                this.error = error.message || 'Something went wrong!'
            }
        },
        handleError() {
            this.error = null;
        }
    },
    created() {
        this.loadCoaches(false);
    }
}
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