import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login";
import store from '../store';
import Container from "../views/Containers";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            requireAuth: true
        },
        children : [
            {
                path: '',
                name: 'Home.Containers',
                component: Container,
                meta: {
                    requireAuth: true
                },
            }
        ]

    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            requireAuth: false,
        }

    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    let isAuthenticated = store.getters['auth/isLoggedIn']
    if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
    else next()

    if(to.name === "Login" && isAuthenticated){
        next({name : "Home"})
    }
})

export default router
