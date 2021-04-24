import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login";
import store from '../store';
import Container from "../views/Containers/Containers";
import Projects from "../views/Projects/Projects";
import ProjectDetail from "../views/Projects/ProjectDetail";
import ConfigureDetail from "../views/Configures/ConfigureDetail";
import ConfigureSerialDetail from "../views/SerialParallelConfig/ConfigSerialDetail";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            requireAuth: true
        },
        children: [
            {
                path: '',
                name: 'Home.Containers',
                component: Container,

            },
            {
                path: 'projects',
                name: 'Home.Projects',
                component: Projects,

            }
        ]

    },
    {
        path: '/projects/new',
        name: 'Projects.New',
        component: ProjectDetail,
        meta: {
            requireAuth: true
        },
    },
    {
        path: '/projects/:projectId/serial/:configId',
        name: 'Serial.Detail',
        component: ConfigureSerialDetail,
    },
    {
        path: '/projects/:projectId/configures/new',
        name: 'Configures.New',
        component: ConfigureDetail,
    },
    {
        path: '/projects/:projectId/configures/:id',
        name: 'Configures.Detail',
        component: ConfigureDetail,
    },

    {
        path: '/projects/:id',
        name: 'Projects.Detail',
        component: ProjectDetail,
        meta: {
            requireAuth: true
        },
        children: []
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
    if (to.name !== 'Login' && !isAuthenticated) next({name: 'Login'})
    else next()

    if (to.name === "Login" && isAuthenticated) {
        next({name: "Home"})
    }
})

export default router
