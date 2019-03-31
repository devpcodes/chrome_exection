import axios from 'axios';

const service = axios.create({
    baseURL: 'http://www.mynotemd.com',//http://www.mynotemd.com
    timeout: 5000
})

export default service;