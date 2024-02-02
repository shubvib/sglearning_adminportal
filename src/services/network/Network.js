import axios, { AxiosPromise } from 'axios';
import { AppConfig } from '../../config';

 const server_url_dev = 'https://sglearning-development.azurewebsites.net/api/v1/';
 const server_url_staging = 'https://sglearning-staging.azurewebsites.net/api/v1/';
 const server_url_prod = 'https://sglearning.azurewebsites.net/api/v1/';

let BASE_URL = server_url_dev;
if (AppConfig) {
    BASE_URL = AppConfig.isDevelopment ? AppConfig.server_url_dev : AppConfig.isStaging ? AppConfig.server_url_staging : AppConfig.server_url_prod;
}

// let RequestMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

class Network {
    static instance = new Network()
    token = ''
    // appVersion = '3.0.0.15'

    constructor() {
        if (Network.instance) {
            throw new Error('Error: Instantiation failed: Use Network.getInstance() instead of new.')
        }

        // this.appVersion = Device.getAppVersion()
        Network.instance = this
    }
    static getInstance() {
        return Network.instance
    }

    setAppVersion(appVersion) {
        this.appVersion = appVersion
    }

    getBaseUrl() {
        return BASE_URL
    }

    setToken(token) {
        this.token = token
    }

    getToken() {
        return this.token
    }

    apiRequest(
        url,
        method = 'GET',
        data,
        params,
        header
    ) {
        const response = axios({
            method: method,
            url: url,
            baseURL: BASE_URL,
            data: data,
            timeout: 420000,
            params: params,
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                crossDomain: true,
                // 'cache-control': 'no-cache',
                Authorization: `Bearer ${this.token}`,
                ...header,
            }
        })
        return response
    }

    // authorizedRequest(
    //     url,
    //     method = 'GET',
    //     data,
    //     params,
    //     header
    // ) {
    //     const response = axios({
    //         method: method,
    //         url: url,
    //         baseURL: BASE_URL,
    //         data: data,
    //         timeout: 60000,
    //         params: params,
    //         headers: {
    //             ...header,
    //             'Content-Type': 'application/json',
    //             accept: 'application/json',
    //             crossDomain: true,
    //             token: this.token,
    //         }
    //     })
    //     return response
    // }
}

export const NetWorkError = {
    200: 'Success',
    404: 'Page not found',
    422: 'Invalid request',
    500: 'Internal errror'
}

export function getError(errorCode, fallback = 'Unknown Error') {
    let _fallback = 'Unknown Error'
    if (fallback && fallback !== '') {
        _fallback = fallback
    }
    const errorMessage = (NetWorkError)[errorCode] || _fallback
    return {
        errorCode,
        errorMessage
    }
}

axios.interceptors.request.use(
    config => {
        if (AppConfig.isDevelopment) {
            const { url, method, data, params, baseURL, headers } = config
            const message = `👉👉👉
Request Info: ${baseURL || ''}${url}
  - Method : ${method}
  - Body   : ${JSON.stringify(data)}
  - Params : ${JSON.stringify(params)}
  - Headers: ${JSON.stringify(headers)}
  `
            console.log(message)
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
        if (AppConfig.isDevelopment) {
            const { data: responseData, config } = response
            const { url, method, data, params } = config
            const message = `👉👉👉
Response info: ${url}
  - Method : ${method}
  - Body   : ${JSON.stringify(responseData)}
  - Params : ${JSON.stringify(params)}
  - Response Data: ${data}
  `
            console.log(message)
        }
        return response.data
    },
    error => {
        if (AppConfig.isDevelopment) {
            const message = `👉👉👉
Response error: ${error}
  `
            console.log(message)
        }

        return Promise.reject(error)
    }
)

export default Network.getInstance()
