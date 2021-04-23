import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth.module'
import containers from "./containers.module";
import projects from "./projects.module";
import configures from "./configure.module";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        containers,
        projects,
        configures

    }
});
