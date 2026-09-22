import apiClient from '@/services/axios'
import queryString from 'query-string'
import store from 'store'

const OrganizationService = {
  organizationList: () => {
    return apiClient
      .get(`/isees/api/organization/all`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  organizationListAdmin: () => {
    return apiClient
      .get(`/isees/api/orgAdmin/all`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  organizationListById: id => {
    return apiClient
      .get(`/isees/api/organizations/${id}`)
      .then(response => {
        return response.data
      })
      .catch(err => console.log(err))
  },
  organizationDelete: id => {
    return apiClient
      .delete(`/isees/api/delete?id=${id}`)
      .then(response => {
        return response.data
      })
      .catch(err => console.log(err))
  },
  createOrganization: (values, method) => {
    // const qs = queryString.stringify(values)
    // console.log(values, 'from services')
    if (method === 'put') {
      return apiClient.put('/isees/api/update', values)
        .then(response => {
          console.log(response, 'response')
          return response
        })
        .catch(err => console.log(err))
    }

    // The backend's /saveOrg endpoint expects a multipart/form-data request
    // with a mandatory "image" part (@ModelAttribute + @RequestParam("image")).
    // Build a FormData payload instead of sending plain JSON, so it satisfies
    // that contract. When no logo file is supplied, fall back to an empty
    // placeholder blob so the required "image" part is still present.
    const { imageFile, ...fields } = values
    const formData = new FormData()
    Object.keys(fields).forEach(key => {
      const value = fields[key]
      if (value === undefined || value === null) return
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value)
    })
    formData.append('image', imageFile || new Blob([], { type: 'application/octet-stream' }), imageFile ? imageFile.name : 'placeholder')

    return apiClient.post('/isees/api/saveOrg', formData)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
}

export default OrganizationService
