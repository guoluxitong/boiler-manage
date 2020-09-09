import axios from 'axios'
import { Message } from 'element-ui'
import {config} from "../config";

const baseURL = 'http://output.sdcsoft.com.cn/device'



const service = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true
});
service.interceptors.response.use(
  response => response,
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
);
export default service
