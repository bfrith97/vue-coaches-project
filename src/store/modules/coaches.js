export default {
    state() {
        return {
            lastFetch: null,
            coaches: [],
        }
    },
    getters: {
        shouldUpdate(state) {
            const lastFetch = state.lastFetch;
            if (!lastFetch) {
                return true;
            }
            const currentTimeStamp = new Date().getTime();
            return (currentTimeStamp - lastFetch) / 1000 > 60;
        },
        coaches(state) {
            return state.coaches;
        },
        hasCoaches(state) {
            return state.coaches && state.coaches.length > 0;
        },
        isCoach(state, getters, rootState, rootGetters) {
            const coaches = getters.coaches;
            const userId = rootGetters.userId;
            return coaches.some(coach => coach.id === userId);
        },
    },
    mutations: {
        registerCoach(state, data) {
            state.coaches.push(data);
        },
        setCoaches(state, payload) {
            state.coaches = payload;
        },
        setFetchTimestamp(state) {
            state.lastFetch = new Date().getTime();
        }
    },
    actions: {
        async registerCoach(context, data) {
            const userId = context.rootGetters.userId
            const coachData = {
                firstName: data.first,
                lastName: data.last,
                areas: data.areas,
                description: data.desc,
                hourlyRate: data.rate,
            }

            const token = context.rootGetters.token;
            const response = await fetch(`https://vue-http-demo-13ee8-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`, {
                method: 'PUT',
                body: JSON.stringify((coachData)),
            });

            if (!response.ok) {
                // error...
            }

            context.commit('registerCoach', {
                ...coachData,
                id: userId
            });
        },
        async loadCoaches(context, payload) {
            if (!payload.forceRefresh && !context.getters.shouldUpdate) {
                return;
            }

            const response = await fetch(`https://vue-http-demo-13ee8-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to fetch!')
            }

            const coaches = [];

            for (const key in responseData) {
                const coach = {
                    id: key,
                    firstName: responseData[key].firstName,
                    lastName: responseData[key].lastName,
                    areas:responseData[key].areas,
                    description: responseData[key].description,
                    hourlyRate: responseData[key].hourlyRate,
                };

                coaches.push(coach);
            }

            context.commit('setCoaches', coaches)
            context.commit('setFetchTimestamp')
        }
    }
}