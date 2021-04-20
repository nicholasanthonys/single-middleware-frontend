import axios from 'axios'
import JwtService from './jwt.service'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'
import * as qs from 'qs'

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
            params:
                params !== undefined ? snakecaseKeys(params, { deep: true }) : params,
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: 'brackets' })
            },
            transformResponse: [
                data => {
                    return camelcaseKeys(JSON.parse(data), { deep: true })
                },
            ],
        })
    },

post(resource, body, noSnakeCase) {
        return axios.post(
            `${resource}`,
            !noSnakeCase ? snakecaseKeys(body, { deep: true }) : body,
            {
                transformResponse: [
                    data => {
                        if (data) {
                            return camelcaseKeys(JSON.parse(data), { deep: true })
                        }
                    },
                ],
            }
        )
    },

    update(resource, slug, params) {
        return axios.put(`${resource}/${slug}`, params)
    },

    put(resource, body, noSnakeCase) {
        return axios.put(
            `${resource}`,
            !noSnakeCase ? snakecaseKeys(body, { deep: true }) : body,
            {
                transformResponse: [
                    data => {
                        if (data) {
                            return camelcaseKeys(JSON.parse(data), { deep: true })
                        }
                    },
                ],
            }
        )
    },

    delete(resource, body) {
        return axios.delete(resource, {
            params: body ? snakecaseKeys(body, { deep: true }) : null,
            transformResponse: [
                data => {
                    if (data) {
                        return camelcaseKeys(JSON.parse(data), { deep: true })
                    }
                },
            ],
        })
    },
}

export default ApiService