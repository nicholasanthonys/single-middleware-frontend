import ApiService from "../services/common/api.service";

const configures = {
    namespaced: true,
    state: () => ({
        configs: [],
        selectedConfig : null,
        description : ''
    }),
    getters: {
        getConfigures(state) {
            return state.configs
        },

    },
    actions: {
        fetchConfigures(context, projectId) {
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/configure/project/${projectId}`).then(
                    response => {
                        if (response.status === 200) {
                            context.commit('setDescription',response.data.description)
                            console.log("configs")
                            console.log(response.data.configs)
                            context.commit('setConfigs',response.data.configs)
                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },
        fetchSpecificConfigure(context, data){
            const {configureId, projectId} = data
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/configure/${configureId}/project/${projectId}`).then(
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
                const {name, description, base} = data
                ApiService.init()
                ApiService.post('/api/v1/configure', {
                    name,
                    description,
                    base
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
                const {id,name, description, base} = data
                ApiService.init()
                ApiService.put('/api/v1/configure', {
                    id ,
                    name,
                    description,
                    base
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

        deleteConfigure(context, id){
            return new Promise((resolve, reject) => {
                ApiService.delete(`/api/v1/configure/${id}` ).then(
                    response => {
                        context.commit('deleteConfigure', id)
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
            state.configs= data
        },
        setSelectedConfig(state,data){
            state.selectedConfig= data
        },
        setDescription(state,data){
         state.description = data
        },
        deleteConfigure(state, id){
            state.configures = state.configures.filter(e => e.id !== id)
        }
    },
}

export default configures
