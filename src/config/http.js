import axios from "axios"
import Gen from "@/libs/Gen.js"

const baseUrl = process.env.VUE_APP_BASE_URL,
  baseUrlAPI = `${process.env.VUE_APP_API_URL}/api/fo`

const http = axios.create({
  baseURL: baseUrlAPI,
})

function setBaseToken() {
  Gen.apiHeader()
}

export { baseUrl, baseUrlAPI, http, setBaseToken }
