import ApiService from "../services/common/api.service";

const projects = {
    namespaced: true,
    state: () => ({
        projects : [],
    }),
    getters: {
        getProjects(state) {
            return state.projects
        },

    },
    actions: {
        fetchProjects(context) {
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get('/api/v1/project').then(
                    response => {
                        if (response.status === 200) {
                            context.commit('setProjects',response.data)
                            resolve(response)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        },
        fetchSpecificProject(context, projectId){
            return new Promise((resolve, reject) => {
                ApiService.init()
                ApiService.get(`/api/v1/project/${projectId}`).then(
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

        storeProject(context, data) {
            return new Promise((resolve, reject) => {
                const {name, description, base} = data
                ApiService.init()
                ApiService.post('/api/v1/project', {
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

        updateProject(context, data) {
            return new Promise((resolve, reject) => {
                const {id,name, description, base} = data
                ApiService.init()
                ApiService.put('/api/v1/project', {
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

        deleteProject(context, id){
            return new Promise((resolve, reject) => {
                ApiService.delete(`/api/v1/project/${id}` ).then(
                    response => {
                        context.commit('deleteProject', id)
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
        setProjects(state, data) {
            state.projects = data
        },
        deleteProject(state, id){
            state.projects = state.projects.filter(e => e.id !== id)
        }
    },
}

export default projects
