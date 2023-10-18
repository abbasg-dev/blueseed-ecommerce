import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Cache-control': 'no-cache',
    },
    timeout: 20000,
});

let refreshCounter = 0

api.interceptors.request.use(function (config: AxiosRequestConfig) {
    if (config.headers === undefined) {
        config.headers = {};
    }
    if (localStorage.getItem('ecommerceTokens')) {
        const { accessToken, idToken, refreshToken, creationDate } = JSON.parse(localStorage.getItem('ecommerceTokens') as string)
        let minutesDifference = (new Date().getTime() - new Date(creationDate).getTime()) / 60000
        if (minutesDifference > 50) {
            refreshCounter++;
            if (refreshCounter <= 1)
                api.get(`refresh-token?token=${refreshToken}`)
                    .then(function (response) {
                        let tokens = { accessToken: response.data.accessToken, idToken: response.data.idToken, refreshToken, creationDate: new Date() }
                        localStorage.setItem('ecommerceTokens', JSON.stringify(tokens))
                        if (config.headers === undefined) {
                            config.headers = {};
                        }
                        config.headers.Authorization = response.data.accessToken;
                        config.headers["x-id-token"] = response.data.idToken;
                    })
                    .catch(function () {
                        return Promise.reject("tokenError");
                    })
                    .then(function () {
                        refreshCounter = 0
                    })
        } else {
            config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
            config.headers["x-id-token"] = idToken ? idToken : '';
        }
    }
    return config;
});


export default api;