import ApiService from "../services/common/api.service";

const parallel = {
    namespaced: true,
    state: () => ({
        parallel: {
            next_failure: {},
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
                const {configureId, alias, projectId} = data
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/parallel/config/new`, {
                    configureId,
                    alias
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
                const {projectId, data, rule, nextSuccess, response,} = body
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/parallel/clogic/new`, {
                    data,
                    rule,
                    nextSuccess,
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

        updateSingleConfigParallel(context, data) {
            return new Promise((resolve, reject) => {
                const {id, configureId, alias, projectId} = data
                ApiService.init()
                ApiService.put(`/api/v1/project/${projectId}/parallel/config`, {
                    id,
                    configureId,
                    alias
                }).then(
                    response => {
                        context.commit('updateSingleConfigParallel', {id, configureId, alias})
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        storeNextFailure(context, data) {
            return new Promise((resolve, reject) => {
                const {transform, statusCode, adds, modifies, deletes, projectId} = data
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/parallel/next-failure`, {
                    transform, statusCode, adds, modifies, deletes
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
                const {projectId, data, rule, nextSuccess, response, id} = body
                ApiService.init()
                ApiService.put(`/api/v1/project/${projectId}/parallel/clogic`, {
                    data, rule, nextSuccess, response, id
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
            state.parallel.next_failure = data.next_failure
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
        updateSingleConfigParallel(state, data) {
            const {id, configureId, alias} = data;
            let confIndex = state.parallel.configures.findIndex(e => e.id === id);
            if (confIndex >= 0) {
                let temp = [...state.parallel.configures];
                temp[confIndex].configure_id = configureId;
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
