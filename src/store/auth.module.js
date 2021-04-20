import ApiService from '@/services/common/api.service'
import JwtService from '@/services/common/jwt.service'
import router from '@/router'

const auth = {
    namespaced: true,
    state: () => ({
        errors: null,
        message: null,
        user: {},
        loggedIn: !!JwtService.getToken(),
    }),
    getters: {
        currentUser(state) {
            return state.user
        },
        isLoggedIn(state) {
            return state.loggedIn
        },
    },
    actions: {
        login(context, credentials) {
            const {email, password, redirect} = credentials
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.post('/api/v1/auth/login', {
                    email,
                    password,
                }).then(
                    response => {
                        if (response.status === 200) {
                            context.commit('setAccessToken', response.data.accessToken)
                            context.commit('setAuth', {
                                user: response.data.user,
                            })
                            router.push({ path: redirect })

                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },
        logout(context, redirect) {
            context.commit('purgeAuth')
            router.push({name : redirect})
        },
        register(context, credentials) {
            const{name, email, password, redirect} = credentials
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.post('/api/v1/auth/register', {
                    email: email,
                    name,
                    password
                }).then(
                    response => {
                        router.push({ path: redirect })
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },
    },

    mutations: {
        setError(state, error) {
            state.errors = error
        },
        setAuth(state, user) {
            state.loggedIn = true
            state.user = user
            state.errors = {}
        },
        setAccessToken(state, data) {
            JwtService.saveToken(data)
        },
        purgeAuth(state) {
            state.loggedIn = false
            state.user = {}
            state.errors = {}
            JwtService.destroyToken()
        },
    },
}

export default auth
