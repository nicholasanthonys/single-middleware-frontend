import ApiService from "../services/common/api.service";

const parallel = {
    namespaced: true,
    state: () => ({
        parallel: {
            failure_response: {},
            configures: [],
            c_logics: [],
        }
    }),
    getters: {
        getParallel(state) {
            return state.parallel
        },

    },
    actions: {
        fetchParallel(context, projectId) {
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/project/${projectId}/parallel`).then(
                    response => {
                        if (response.status === 200) {
                            context.commit('setParallel', response.data)
                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        storeSingleConfigParallel(context, data) {
            return new Promise((resolve, reject) => {
                const {configure_id, alias, projectId, loop} = data
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/parallel/config/new`, {
                    configure_id,
                    alias,
                    loop
                }).then(
                    response => {
                        context.commit('addSingleConfigSerial', response.data)
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },


        storeSingleCLogicParallel(context, body) {
            return new Promise((resolve, reject) => {
                const {projectId, data, rule, next_success, response,} = body
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/parallel/clogic/new`, {
                    data,
                    rule,
                    next_success,
                    response
                }).then(
                    response => {
                        context.commit('addSingleCLogic', response.data)
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        deleteSpecificCLogic(context, data) {
            return new Promise((resolve, reject) => {
                const {projectId, cLogicId} = data
                ApiService.init()
                ApiService.delete(`/api/v1/project/${projectId}/parallel/clogic/${cLogicId}`,).then(
                    response => {
                        context.commit('removeSpecificCLogic', {projectId, cLogicId})
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        deleteSpecificConfigFile(context, data) {
            return new Promise((resolve, reject) => {
                const {projectId, configFileId} = data
                ApiService.init()
                ApiService.delete(`/api/v1/project/${projectId}/parallel/configure-file/${configFileId}`,).then(
                    response => {
                        context.commit('removeSpecificConfigFile', {projectId, configFileId})
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        updateSingleConfigParallel(context, data) {
            return new Promise((resolve, reject) => {
                const {id, configure_id, alias, projectId, loop} = data
                ApiService.init()
                ApiService.put(`/api/v1/project/${projectId}/parallel/config`, {
                    id,
                    configure_id,
                    alias,
                    loop
                }).then(
                    response => {
                        context.commit('updateSingleConfigParallel', {id, configure_id, alias})
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        storeFailureResponse(context, data) {
            return new Promise((resolve, reject) => {
                const {transform, status_code, adds, modifies, deletes, projectId} = data
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/parallel/next-failure`, {
                    transform, status_code, adds, modifies, deletes
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

        updateSingleCLogicParallel(context, body) {
            return new Promise((resolve, reject) => {
                const {projectId, data, rule, next_success, response, id} = body
                ApiService.init()
                ApiService.put(`/api/v1/project/${projectId}/parallel/clogic`, {
                    data, rule, next_success, response, id
                }).then(
                    response => {
                        context.commit('updateSingleCLogicParallel', {id, cLogic: response.data})
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        storeParallel(context, data) {
            return new Promise((resolve, reject) => {
                const {projectId, configures} = data
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/parallel`, {
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
        setParallel(state, data) {
            state.parallel.failure_response = data.failure_response
            state.parallel.configures = data.configures
            state.parallel.c_logics = data.c_logics;
        },
        updateSingleCLogicParallel(state, body) {
            const {id, cLogic} = body;
            let cLogicIndex = state.parallel.c_logics.findIndex(c => c.id === id);
            if (cLogicIndex >= 0) {
                let temp = [...state.parallel.c_logics];
                temp[cLogicIndex] = cLogic;
                state.parallel.c_logics = temp;

            }
        },
        addSingleCLogic(state, cLogic) {
            state.parallel.c_logics.push(cLogic)
        },
        removeSpecificCLogic(state, data) {
            const {cLogicId} = data

            state.parallel.c_logics = state.parallel.c_logics.filter(c => c.id !== cLogicId)
        },
        removeSpecificConfigFile(state, data) {
            const {configFileId} = data
            state.parallel.configures = state.parallel.configures.filter(c => c.id !== configFileId)
        },
        updateSingleConfigParallel(state, data) {
            const {id, configure_id, alias} = data;
            let confIndex = state.parallel.configures.findIndex(e => e.id === id);
            if (confIndex >= 0) {
                let temp = [...state.parallel.configures];
                temp[confIndex].configure_id = configure_id;
                temp[confIndex].alias = alias;
                state.parallel.configures = temp;
            }
        },
        addSingleConfigSerial(state, data) {
            const {configure_id, alias, id} = data;
            state.parallel.configures.push({
                id,
                configure_id, alias
            })
        }
    },
}

export default parallel
