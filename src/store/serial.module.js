import ApiService from "../services/common/api.service";

const serial = {
    namespaced: true,
    state: () => ({
        serial:  {
            id : null,
            configures : []
        },
    }),
    getters: {
        getSerial(state) {
            return state.serial
        },
        getConfigures(state) {
            return state.configures
        }

    },
    actions: {
        fetchSerial(context, projectId) {
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/project/${projectId}/serial`).then(
                    response => {
                        if (response.status === 200) {
                            context.commit('setSerial', response.data)
                            context.commit('setConfigures', response.data.configures)
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

        storeSingleConfig(context, data) {
            return new Promise((resolve, reject) => {
                const {projectId, configureId, alias, nextFailure} = data
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/serial/config/new`, {
                    configureId,
                    alias,
                    nextFailure
                }).then(
                    response => {
                        context.commit("addConfig", response.data)
                        resolve(response)

                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        updateSingleConfig(context, data) {
            return new Promise((resolve, reject) => {
                const {projectId, id, configureId, alias, nextFailure} = data
                ApiService.init()
                ApiService.put(`/api/v1/project/${projectId}/serial/config`, {
                    id,
                    configureId,
                    alias,
                    nextFailure
                }).then(
                    response => {
                        context.commit('updateSpecificConfig', response.data)
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        storeSingleCLogic(context, body) {
            return new Promise((resolve, reject) => {
                const {projectId, configId, rule, data, nextSuccess,response} = body
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/serial/config/${configId}/clogic/new`, {
                    rule,
                    data,
                    nextSuccess,
                    response
                }).then(
                    response => {
                        context.commit('addSingleCLogicSerial', {configId, cLogic : response.data})
                        resolve(response)
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },

        updateSingleCLogic(context, body) {
            return new Promise((resolve, reject) => {
                const {projectId, configId, id, rule, data, nextSuccess,response} = body
                ApiService.init()
                ApiService.put(`/api/v1/project/${projectId}/serial/config/${configId}/clogic`, {
                    id,
                    rule,
                    data,
                    nextSuccess,
                    response
                }).then(
                    response => {
                        context.commit('updateSingleCLogicSerial', {configId, id, cLogic : response.data});
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
        addSingleCLogicSerial(state, data){
            const { configId, cLogic} = data
            let configIndex = state.serial.configures.findIndex(e => e.id === configId) ;
            if(configIndex >= 0){
                state.serial.configures[configIndex].c_logics.push(cLogic);
            }
        },
        updateSingleCLogicSerial(state,data){
            const { configId, id, cLogic} = data
            let configIndex = state.serial.configures.findIndex(e => e.id === configId) ;
            if(configIndex >= 0){

                let cLogicIndex = state.serial.configures[configIndex].c_logics.findIndex(c => c.id === id);
                if(cLogicIndex >=0){
                    let temp  = [...state.serial.configures];
                    temp[configIndex].c_logics[cLogicIndex] = cLogic
                    state.serial.configures = temp;
                }
            }
        },
        setConfigures(state, data) {
            state.configures = data
        },
        addConfig(state, data) {
            state.serial.configures.push(data);
        },
        updateSpecificConfig(state, data) {
            let index = state.configures.findIndex(e => e.id === data.id);
            if (index >= 0) {
                let temp = [...state.configures];
                temp[index] = data;
                state.configures = temp;
            }
        },
        addSingleCLogic(state, data) {
            const {configId, value} = data
            let index = state.configures.findIndex(e => e.id === configId);
            if (index >= 0) {
                let temp = [...state.configures];
                temp[index].c_logics.push(value)
                state.configures = temp;
            }
        },
        updateSingleCLogic(state, data) {
            const {configId, value} = data
            let confIndex= state.configures.findIndex(e => e.id === configId);
            if (confIndex >= 0) {
                let cLogicIndex = state.configures[confIndex].c_logics.findIndex(e => e.id === value.id)
                if(cLogicIndex >= 0){
                    let temp = [...state.configures]
                    temp[confIndex].c_logics[cLogicIndex] = value;
                    state.configures = temp;
                }
            }
        },

    },
}

export default serial
