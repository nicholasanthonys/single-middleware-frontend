import axios from 'axios'
import JwtService from './jwt.service'

const ApiService = {
    init() {
        axios.defaults.baseURL = process.env.VUE_APP_API_URL
        axios.defaults.headers.common[
            'Authorization'
            ] = `Bearer ${JwtService.getToken()}`
        axios.defaults.headers.post['Content-Type'] =
            'application/json'
    },

    setHeaderMultipartFormData() {
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    },

    query(resource) {
        return axios.get(resource)
    },

    get(resource, params ) {
        return axios.get(`${resource}`, {
            params,

        })
    },

post(resource, body, ) {
        return axios.post(
            `${resource}`,
            body,
        )
    },

    update(resource, slug, params) {
        return axios.put(`${resource}/${slug}`, params)
    },

    put(resource, body, ) {
        return axios.put(
            `${resource}`,
            body,

        )
    },

    delete(resource, params, data) {
        return axios.delete(resource, {
             params,
            data
        })
    },
}

export default ApiService