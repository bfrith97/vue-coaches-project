import {createStore} from 'vuex';

import requestsModule from '@/store/modules/requests.js'
import coachesModule from '@/store/modules/coaches.js'
import authModule from '@/store/modules/auth.js'

export default createStore({
    modules: {
        requests: requestsModule,
        coaches: coachesModule,
        auth: authModule
    },
})