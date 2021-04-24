import ApiService from "../services/common/api.service";

const serial = {
    namespaced: true,
    state: () => ({
        serial :null
    }),
    getters: {
        getSerial(state) {
            return state.serial
        },

    },
    actions: {
        fetchSerial(context, projectId) {
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/project/${projectId}/serial`).then(
                    response => {
                        if (response.status === 200) {
                            context.commit('setSerial',response.data)
                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        storeSerial(context, data) {
            return new Promise((resolve, reject) => {
                const {projectId, configures} = data
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/serial`, {
                   configures
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
        setSerial(state, data) {
            state.serial = data
        },
    },
}

export default serial
