const { fetchCsv , fetchPatients } = require('./csv')

export const fetchOpenDataPatients = (url, resourceNamePattern, encoding, fetch) => { 
  return fetch(url)
    .then(response => response.json())
    .then(response => {
      let resources = response.result.resources
      if (!resources) {
        return
      }
      for (let resource of resources) {
        if (resource.name.match(resourceNamePattern)) {
          return fetchPatients(resource.download_url, encoding, fetch)
        }
      }
    })
}