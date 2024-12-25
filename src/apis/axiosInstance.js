import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'https://kurokami-manhwa-api.vercel.app/api',
    timeout: 10000
})

export default axiosInstance