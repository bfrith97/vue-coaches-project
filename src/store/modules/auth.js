let timer;

export default {
    state() {
        return {
            userId: null,
            token: null,
            setAutoLogout: false,
        }
    },
    getters: {
        userId(state) {
            return state.userId;
        },
        token(state) {
            return state.token;
        },
        isAuthenticated(state) {
            return !!state.token;
        },
        didAutoLogout(state) {
            return state.setAutoLogout;
        }
    },
    mutations: {
        setUser(state, payload) {
            state.token = payload.token;
            state.userId = payload.userId;
        },
        setAutoLogout(state) {
            state.setAutoLogout = true;
        }
    },
    actions: {
        async login(context, payload) {
            return context.dispatch('auth', {
                ...payload,
                mode: 'login'
            })
        },
        async signup(context, payload) {
            return context.dispatch('auth', {
                ...payload,
                mode: 'signup'
            })
        },
        async auth(context, payload) {
            const mode = payload.mode;
            let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4HwD8jepAfm591wsRcp0oB916mtcbRec';

            if (mode === 'signup') {
                url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4HwD8jepAfm591wsRcp0oB916mtcbRec'
            }
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.log(responseData);
                throw new Error(responseData.message || 'Failed to authenticate')
            }

            const expiresIn = +responseData.expiresIn * 1000;
            const expirationDate = new Date().getTime() + expiresIn;

            localStorage.setItem('token', responseData.idToken);
            localStorage.setItem('userId', responseData.localId);
            localStorage.setItem('tokenExpiration', expirationDate);

            timer = setTimeout(function() {
                context.dispatch('autoLogout');
            }, expiresIn)

            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
            })
        },
        tryLogin(context) {
              const token = localStorage.getItem('token');
              const userId = localStorage.getItem('userId');
              const tokenExpiration = localStorage.getItem('tokenExpiration');

              const expiresIn = +tokenExpiration - new Date().getTime();

              if (expiresIn < 0) {
                  return;
              }

              timer = setTimeout(function() {
                  context.dispatch('autoLogout');
              }, expiresIn)

              if (token && userId) {
                  context.commit('setUser', {
                      token: token,
                      userId: userId,
                  })
              }
        },
        logout(context, payload) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('tokenExpiration');

            clearTimeout(timer);

            context.commit('setUser', {
                token: null,
                userId: null,
                tokenExpiration: null,
            });
        },
        autoLogout(context) {
            context.dispatch('logout');
            context.commit('setAutoLogout')
        }
    },
}