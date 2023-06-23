import { getToken } from './users-service'

export default async function sendRequest(url, method = 'GET', payload = null) {
  const options = { method };
  if(payload instanceof FormData){
    options.body = payload
  }else if(payload){
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }
  const token = getToken();
  if (token) {
    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, options);
  if (res.ok){
    return res.json();
  }else if(res.status === 401){
    throw new Error('Unauthorized');
  }else if(res.status === 403){
    throw new Error('Forbidden');
  }else if(res.status === 409){
    throw new Error('Conflict');
  }else{
    throw new Error('Bad Request');
  }
}