import Config from "@/libs/Config"
import { http } from "@/config/http"

let CryptoJS = require("crypto-js")

const Gen = {
  apiHeader() {
    return {
      "X-API-KEY":
        " Basic V0ItUkRHLXNlcnZlci1kYTI4MDllY2NlYxRheB7jQzYzYzNThhYWM3YTI3MmM3MDM6",
      "X-Frame-Options": "sameorigin",
      "X-XSS-Protection": "1; mode=block",
      "X-Content-Type-Option": "nosniff",
      "Content-Security-Policy": "script-src 'self'",
      "Strict-Transport-Security": "max-age=31536000;includeSubDomains",
    }
  },

  apiRest(path, config = {}, method = "get", responType = "json") {
    let options = {
      headers: {
        ...Gen.apiHeader(),
      },
      method: method,
      url: path,
      responseType: responType,
    }

    let data = {}
    let params = {}
    let headers = {}

    if (config.data) {
      // options.method = method
      data = Object.assign(data, config.data)
      data = {
        data: JSON.stringify({
          payload: Gen.CryptoJSAesEncrypt(
            Config.encrypt_key,
            JSON.stringify(data)
          ),
        }),
      }
    }

    if (config.params) params = Object.assign(params, config.params)
    if (config.headers) headers = Object.assign(headers, config.headers)

    // params = Object.assign({ token: Gen.getCookie("userAuth") || ""}, params || {})

    if (Object.prototype.hasOwnProperty.call(config, "data"))
      options.data = data
    if (Object.prototype.hasOwnProperty.call(config, "headers"))
      options.headers = headers
    if (Object.prototype.hasOwnProperty.call(config, "params"))
      options.params = params

    return http(options)
  },
  CryptoJSAesEncrypt(pass, value) {
    var salt = CryptoJS.lib.WordArray.random(256)
    var iv = CryptoJS.lib.WordArray.random(16)
    var key = CryptoJS.PBKDF2(pass, salt, {
      hasher: CryptoJS.algo.SHA512,
      keySize: 64 / 8,
      iterations: 999,
    })
    var encrypted = CryptoJS.AES.encrypt(value, key, { iv: iv })
    var data = {
      ciphertext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
      salt: CryptoJS.enc.Hex.stringify(salt),
      iv: CryptoJS.enc.Hex.stringify(iv),
    }
    return JSON.stringify(data)
  },
}

export default Gen
