import ApiService from "../services/common/api.service";

const containers = {
    namespaced: true,
    state: () => ({
        containers : [],
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
                            context.commit('setContainers',response.data)
                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        getContainerById(context, dbContainerId){
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/container/${dbContainerId}`).then(
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
                const {name, description, project_ids, routers} = data
                ApiService.init()
                ApiService.post('/api/v1/container', {
                    name,
                    description,
                    project_ids,
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
                const {id, name, description, project_ids, routers} = data
                ApiService.init()
                ApiService.put('/api/v1/container', {
                    id,
                    name,
                    description,
                    project_ids,
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
        deleteContainer(context, id){
            return new Promise((resolve, reject) => {
                ApiService.delete(`/api/v1/container/${id}` ).then(
                    response => {
                        context.commit('deleteContainer', id)
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },
        toggleStartStopContainer(context, data){
            return new Promise((resolve, reject) => {
                const {dbContainerId} = data
                ApiService.init()
                ApiService.put('/api/v1/container/docker-container', {
                    id : dbContainerId
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

        createDockerContainer(context, data){
            return new Promise((resolve, reject) => {
                const {dbContainerId} = data
                ApiService.init()
                ApiService.post('/api/v1/container/docker-container', {
                    id : dbContainerId
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

    },

    mutations: {
        setContainers(state, data) {
            state.containers = data
        },
        deleteContainer(state, id){
            state.containers = state.containers.filter(e => e.id !== id)
        }
    },
}

export default containers
