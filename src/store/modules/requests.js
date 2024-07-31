export default {
    state() {
        return {
            requests: [],
        }
    },
    getters: {
        requests(state, getters, rootState, rootGetters) {
            const coachId = rootGetters.userId;
            return state.requests.filter(req => req.coachId === coachId);
        },
        hasRequests(state, getters) {
            return getters.requests && getters.requests.length > 0;
        }
    },
    mutations: {
        addRequest(state, payload) {
            state.requests.push(payload)
        },
        setRequests(state, payload) {
            state.requests = payload;
        }
    },
    actions: {
        async addRequest(context, payload) {
            const response = await fetch(`https://vue-http-demo-13ee8-default-rtdb.europe-west1.firebasedatabase.app/requests/${payload.id}.json`, {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to send request!')
            }

            payload.id = responseData.name;

            context.commit('addRequest', payload);
        },
        async fetchRequests(context) {
            const coachId = context.rootGetters.userId

            const token = context.rootGetters.token;
            const response = await fetch(`https://vue-http-demo-13ee8-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json?auth=${token}`);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to fetch requests.')
            }

            const requests = [];

            for (const key in responseData) {
                const request = {
                    id: key,
                    coachId: coachId,
                    email: responseData[key].email,
                    message: responseData[key].message
                };

                requests.push(request);
            }

            context.commit('setRequests', requests)
        }
    }
}