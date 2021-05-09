import ApiService from "../services/common/api.service";

const serial = {
    namespaced: true,
    state: () => ({
        serial:  {
            id : null,
        },
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
                            context.commit('setSerial', response.data)
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
                const { project_id, configure_id, alias, next_failure} = data
                ApiService.init()
                ApiService.post(`/api/v1/project/${project_id}/serial/config/new`, {
                    configure_id,
                    alias,
                    next_failure
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
                const {project_id: project_id, id, configure_id, alias, next_failure} = data
                ApiService.init()
                ApiService.put(`/api/v1/project/${project_id}/serial/config`, {
                    id,
                    configure_id,
                    alias,
                    next_failure
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
                const {projectId, configId, rule, data, next_success,response} = body
                ApiService.init()
                ApiService.post(`/api/v1/project/${projectId}/serial/config/${configId}/clogic/new`, {
                    rule,
                    data,
                    next_success,
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

        deleteCLogic(context,data){
            return new Promise((resolve, reject) => {
                const {projectId, configId, cLogicId} = data
                ApiService.init()
                ApiService.delete(`/api/v1/project/${projectId}/serial/config/${configId}/clogic/${cLogicId}`,).then(
                    response => {
                        context.commit('removeSpecificCLogic', {projectId, configId, cLogicId})
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
                ApiService.delete(`/api/v1/project/${projectId}/serial/configure-file/${configFileId}`,).then(
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


        updateSingleCLogic(context, body) {
            return new Promise((resolve, reject) => {
                const {projectId, configId, id, rule, data, next_success,response} = body
                ApiService.init()
                ApiService.put(`/api/v1/project/${projectId}/serial/config/${configId}/clogic`, {
                    id,
                    rule,
                    data,
                    next_success,
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
        removeSpecificCLogic(state, data) {
            const {configId, cLogicId} = data
            let configIndex = state.serial.configures.findIndex(e => e.id === configId) ;
            console.log("config index is")
            console.log(configIndex)
            if(configIndex >= 0){
                state.serial.configures[configIndex].c_logics = state.serial.configures[configIndex].c_logics.filter(c => c.id !== cLogicId)
            }
        },
        removeSpecificConfigFile(state, data) {
            const {configFileId} = data
            state.serial.configures = state.serial.configures.filter(c => c.id !== configFileId)
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
            state.serial.configures = data
        },
        addConfig(state, data) {
            state.serial.configures.push(data);
        },
        updateSpecificConfig(state, data) {
            let index = state.serial.configures.findIndex(e => e.id === data.id);
            console.log("index is")
            console.log(index)
            console.log("data is")
            console.log(data)
            if (index >= 0) {
                let temp = [...state.serial.configures];
                temp[index] = data;
                state.serial.configures = [...temp];
            }
        },
        addSingleCLogic(state, data) {
            const {configId, value} = data
            let index = state.serial.configures.findIndex(e => e.id === configId);
            if (index >= 0) {
                let temp = [...state.serial.configures];
                temp[index].c_logics.push(value)
                state.serial.configures = temp;
            }
        },
        updateSingleCLogic(state, data) {
            const {configId, value} = data
            let confIndex= state.serial.configures.findIndex(e => e.id === configId);
            if (confIndex >= 0) {
                let cLogicIndex = state.serial.configures[confIndex].c_logics.findIndex(e => e.id === value.id)
                if(cLogicIndex >= 0){
                    let temp = [...state.serial.configures]
                    temp[confIndex].c_logics[cLogicIndex] = value;
                    state.serial.configures = temp;
                }
            }
        },

    },
}

export default serial
