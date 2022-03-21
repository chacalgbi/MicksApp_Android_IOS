import axios from 'axios';
import {server} from './variables';

export default (endPoint, obj) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${server}${endPoint}`, obj, {timeout: 20000})
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
};
