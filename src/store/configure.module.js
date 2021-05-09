import ApiService from "../services/common/api.service";

const configures = {
    namespaced: true,
    state: () => ({
        configs: [],
        selectedConfig: null,
        description: ''
    }),
    getters: {
        getConfigures(state) {
            return state.configs
        },

    },
    actions: {
        fetchConfigures(context, project_id) {
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/configure/project/${project_id}`).then(
                    response => {
                        if (response.status === 200) {
                            context.commit('setDescription', response.data.description)
                            context.commit('setConfigs', response.data.configs)
                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },
        fetchSpecificConfigure(context, data) {
            const {configure_id, project_id} = data
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/configure/${configure_id}/project/${project_id}`).then(
                    response => {
                        if (response.status === 200) {
                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        storeConfigure(context, data) {
            return new Promise((resolve, reject) => {
                const {project_id, config} = data
                const { request, response, description} = config
                ApiService.init()
                ApiService.post('/api/v1/configure', {
                    project_id,
                    config: {
                        description,
                        request,
                        response
                    },
                }).then(
                    response => {
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        updateConfigure(context, data) {
            return new Promise((resolve, reject) => {
                const {project_id, config} = data
                const {id, request, response, description} = config
                ApiService.init()
                ApiService.put('/api/v1/configure', {
                    project_id,
                    config: {
                        id,
                        description,
                        request,
                        response
                    },
                }).then(
                    response => {
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        deleteConfigure(context, params) {
            const {project_id, configure_id} = params
            return new Promise((resolve, reject) => {
                ApiService.delete(`/api/v1/configure/`, {
                    project_id,
                    configure_id
                }).then(
                    response => {
                        context.commit('deleteConfigure', configure_id)
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        }
    },

    mutations: {
        setConfigs(state, data) {
            state.configs = data
        },
        setSelectedConfig(state, data) {
            state.selectedConfig = data
        },
        setDescription(state, data) {
            state.description = data
        },
        deleteConfigure(state, id) {
            if(state.configs){
                state.configs = state.configs.filter(e => e.id !== id)
            }
        }
    },
}

export default configures
