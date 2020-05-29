export function get(endpoint) {
  return window
    .fetch(endpoint, { method: 'GET' })
    .then(async response => {
        const data = await response.json()
        if (response.ok) {  
          return data  
        } else {  
          return Promise.reject(data)  
        }  
      })
}