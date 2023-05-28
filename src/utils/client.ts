import axios from 'axios'
import host from '../constants/host'
import apiKey from '../constants/key'
import {
  getCookieData,
  readCookie,
  setCookieData,
  deleteCookieData,
} from './cookieHelper'
import { reactLocalStorage } from 'reactjs-localstorage'

/**
 * Create a new Axm

 */
const getClient = (baseUrl:any = null, accessToken:any = null) => {
  let options = {
    headers:{},
    baseURL: baseUrl ? baseUrl : host.api,
  }

  const getToken = (accessToken) => {
    let token = null
    if (!accessToken) {
      token = readCookie('accessToken') || apiKey.publicKeyAPI
    } else {
      token = accessToken
    }

    return token
  }

  let token = getToken(accessToken)

  options.headers = {
    Authorization: `Bearer ${token}`,
    'secret-key': apiKey.secretKey,
    channel: 'web',
  }

  const client = axios.create(options)

  let isRefreshing = false
  let failedQueue = []

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })

    failedQueue = []
  }

  const handleAccessTokenError = () => {
    try {
      deleteCookieData('accessToken')
      deleteCookieData('refreshToken')
      deleteCookieData('token')
      reactLocalStorage.remove('accessToken')
      reactLocalStorage.remove('signature')

      try {
        if (window.location.pathname == '/affiliateProgarm') {
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        }
      } catch (ex) {}
    } catch (ex) {
      console.log(ex)
    }
  }

  const handleRefeshToken = (error) => {
    //TODO handle refresh token
    //console.log(error)
    const originalRequest = error.config
    if (
      error.response.status === 401 &&
      error.response.data.message == 'ACCESS_TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token

            //TODO set to token
            return client(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }
      originalRequest._retry = true
      isRefreshing = true

      //TODO: set cookie
    //   return new Promise(async function (resolve, reject) {
    //     try {
    //       const refreshToken = await getCookieData('refreshToken')
    //       const headers = {
    //         'Content-Type': 'application/json',
    //         channel: 'web',
    //       }

    //       const tokenRes = await axios.post(
    //         host.api + 'auth/refresh-token',
    //         { refreshToken: refreshToken },
    //         { headers }
    //       )

    //       //TODO : set new token
    //       await setCookieData('token', tokenRes.data)
    //       await setCookieData('accessToken', tokenRes.data.accessToken)
    //       await setCookieData('refreshToken', tokenRes.data.refreshToken)
    //       reactLocalStorage.set('accessToken', tokenRes.data.accessToken)
    //       //client.headers['Authorization'] = 'Bearer ' + tokenRes.data.accessToken;
    //       try {
    //         client.headers.Authorization = 'Bearer ' + tokenRes.data.accessToken
    //       } catch (ex) {}
    //       client.defaults.headers.common['Authorization'] =
    //         'Bearer ' + tokenRes.data.accessToken
    //       originalRequest.headers.Authorization =
    //         'Bearer ' + tokenRes.data.accessToken

    //       processQueue(null, tokenRes.data.accessToken)
    //       resolve(client(originalRequest))
    //     } catch (ex) {
    //       processQueue(ex, null)
    //       reject(ex)

    //       const { code, message } = ex.response.data
    //       if (code == 401 && message == 'INVALID_REFRESH_TOKEN') {
    //         //TODO: reload
    //         handleAccessTokenError()
    //       }
    //     } finally {
    //       isRefreshing = false
    //     }
    //   })

    } //  end if

    // if(error.response.status == 401  &&   error.response.data.message == "INVALID_REFRESH_TOKEN"){
    if (
      error.response.status == 401 &&
      error.response.data.message != 'ACCESS_TOKEN_EXPIRED'
    ) {
      handleAccessTokenError()
    }

    return Promise.reject(error)
  }

  // Add a request interceptor
  client.interceptors.request.use(
    (requestConfig) => {
      const token = getToken(accessToken)
      requestConfig.headers.Authorization = `Bearer ${token}`
      return requestConfig
    },
    (requestError) => {
      return Promise.reject(requestError)
    }
  )

  // Add a response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => handleRefeshToken(error)
  )

  return client
}

export { getClient }
