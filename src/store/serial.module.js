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

        // updateSerial(context, data) {
        //     return new Promise((resolve, reject) => {
        //         const {projectId, configures} = data
        //         ApiService.init()
        //         ApiService.put(`/api/v1/project/${projectId}`, {
        //             configures
        //         }).then(
        //             response => {
        //                 resolve(response)
        //             },
        //             error => {
        //                 reject(error)
        //             }
        //         )
        //     })
        // },

        // deleteSerial(context, id){
        //     return new Promise((resolve, reject) => {
        //         ApiService.delete(`/api/v1/project/${id}` ).then(
        //             response => {
        //                 context.commit('deleteSerial', id)
        //                 resolve(response)
        //             },
        //             error => {
        //                 reject(error)
        //             }
        //         )
        //     })
        // }
    },

    mutations: {
        setSerial(state, data) {
            state.serial = data
        },
        // deleteSerial(state ){
        //     state.serial = null
        // },

    },
}

export default serial
