import jsCookie from 'js-cookie'


const setCookieData = (key, value) => {
  return new Promise(function (resolve, reject) {
    try {
      jsCookie.set(key, value, { expires: 365 })

      resolve(value)
    } catch (ex) {
      reject(ex)
    }
  })
}

const getCookieData = (key) => {
  return Promise.resolve().then(function () {
    const res = jsCookie.get(key) || null
    try {
      return res
    } catch (ex) {
      return null
    }
  })
}

const readCookie = (key) => {
  return jsCookie.get(key) || null
}

const deleteCookieData = (key) => {
  return Promise.resolve().then(function () {
    try {
      jsCookie.remove(key, { path: '' })
    } catch (ex) {
      return null
    }
  })
}

export {
  setCookieData,
  getCookieData,
  deleteCookieData,
  readCookie,
}
