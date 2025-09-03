import axios from 'axios';

export default async (url: string, options: {[key:string]: any}) => axios(url, options)
  .then((resp) => resp)
  .catch((error) => {
    throw error;
  });
