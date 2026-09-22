import apiClient from '@/services/axios'
import store from 'store'

const UserProfileService = {
  createPassword: (values) => {
    const url = '/isees/api/users/confirm-password'

    return apiClient.post(url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
}

  export default UserProfileService