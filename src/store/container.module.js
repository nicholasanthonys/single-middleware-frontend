import ApiService from "../services/common/api.service";

const containers = {
    namespaced: true,
    state: () => ({
        containers: [],
    }),
    getters: {
        getContainers(state) {
            return state.containers
        },

    },
    actions: {
        fetchContainers(context) {
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get('/api/v1/container').then(
                    response => {
                        if (response.status === 200) {
                            context.commit('setContainers', response.data)
                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },
        fetchSpecificContainer(context, containerId) {
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/container/${containerId}`).then(
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

        storeContainer(context, data) {
            return new Promise((resolve, reject) => {
                const {name, description, projectIds, routers} = data
                ApiService.init()
                ApiService.post('/api/v1/container', {
                    name,
                    projectIds,
                    routers
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

        updateContainer(context, data) {
            return new Promise((resolve, reject) => {
                const {id, name, description, projectIds, routers} = data
                ApiService.init()
                ApiService.put('/api/v1/container', {
                    id,
                    name,
                    description,
                    projectIds,
                    routers
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

        deleteContainer(context, id) {
            return new Promise((resolve, reject) => {
                ApiService.delete(`/api/v1/container/${id}`).then(
                    response => {
                        context.commit('deleteContainer', id)
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
        setContainers(state, data) {
            state.containers = data
        },
        deleteContainer(state, id) {
            if(state.containers){
                state.containers = state.containers.filter(e => e.id !== id)
            }
        },
        setSelectedContainer(state, data) {
            state.selectedContainer = data
        }
    },
}

export default containers
