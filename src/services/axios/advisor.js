// import firebase from 'firebase/app'
import { notification } from 'antd'
import apiClient from '@/services/axios'
import store from 'store'
// import 'firebase/auth'
// import 'firebase/database'

// const firebaseConfig = {
//   apiKey: 'AIzaSyBJVhr2WZshEGR7egcxoygQIphKOkKVIYQ',
//   authDomain: 'sellpixels-7d5d4.firebaseapp.com',
//   databaseURL: 'https://sellpixels-7d5d4.firebaseio.com',
//   projectId: 'sellpixels-7d5d4',
//   storageBucket: 'cleanui-72a42.appspot.com',
//   messagingSenderId: '338219933237',
// }

// const firebaseConfig = {
//   apiKey: 'AIzaSyDsmr0RwcWuMDSvpupFm7Jq-HcqeFjKGvE',
//   authDomain: 'isessaccountancy.firebaseapp.com',
//   databaseURL: 'https://isessaccountancy.firebaseio.com',
//   projectId: 'isessaccountancy',
//   storageBucket: 'isessaccountancy.appspot.com',
//   messagingSenderId: '141081686380',
// }
// firebase.initializeApp(firebaseConfig);
// export const firebaseAuth = firebase.auth()
// export const firebaseDatabase = firebase.database()

// export const firebaseAuth = ''
// export const firebaseDatabase = ''

export async function login(email, password, screenType) {
  console.log('email, password, screenType', email, password, screenType)
  // Step 1 of 2: validate email/password and trigger the OTP email.
  // Whatever the sign-in response carries gets cached the same way it always did,
  // but the caller (the OTP saga/UI) decides when the login is actually "complete".
  return apiClient
    .post('/isees/api/users/sign-in', {
      email,
      password,
      screenType,
    })
    .then(response => {
      // console.log(response, 'response login')
      if (response && response.data && response.data.statusCode === 200) {
        const userData = response.data.data
        console.log("User data:", userData)
        store.set('accessToken', userData.accessToken)
        store.set('mobile', userData.mobile)
        store.set('email', userData.email)
        store.set('role', userData.role ? userData.role[0] : '')
        store.set('organization', (userData.organization && userData.organization[0]) || [])
        store.set('showOrgnization', 'yes')

        // Sync with localStorage for consistency
        localStorage.setItem('accessToken', userData.accessToken || '')
        localStorage.setItem('email', userData.email || '')
        localStorage.setItem('mobile', userData.mobile || '')

        notification.success({
          message: 'OTP Sent',
          description: response.data.message || 'Please check your email for the OTP',
        })
        return true
      }
      notification.error({
        message: 'Error',
        description: (response && response.data && response.data.message) || 'Invalid email or password',
      })
      return false
    })
    .catch(err => {
      console.log('from advisor login error:', err)
      notification.error({
        message: 'Error',
        description: (err.response && err.response.data && err.response.data.message) || 'Invalid email or password',
      })
      return false
    })
}

export async function verifyOtp(email, otp) {
  // Step 2 of 2: only after this resolves true does the login screen redirect into the app.
  return apiClient
    .post('/isees/api/users/verify-otp', { email, otp })
    .then(response => {
      if (response && response.data && response.data.email) {
        notification.success({
          message: 'Success',
          description: 'Logged in successfully',
        })
        return true
      }
      notification.error({
        message: 'Invalid OTP',
        description: 'The OTP you entered is incorrect or has expired',
      })
      return false
    })
    .catch(err => {
      console.log('from advisor verifyOtp error:', err)
      notification.error({
        message: 'Invalid OTP',
        description:
          (err.response && err.response.data && err.response.data.message) ||
          'The OTP you entered is incorrect or has expired',
      })
      return false
    })
}

export async function register(email, password, firstName, lastName, countryCode, mobile, role) {
  // console.log('email, password, name', email, password)
  const address = {
    area: '',
    local1: '',
    local2: '',
    pincode: 0,
  }
  return apiClient
    .post('/isees/api/users/sign-up', {
      createDate: '',
      updateDate: '',
      address,
      email,
      password,
      firstName,
      lastName,
      countryCode,
      mobile,
      role,
    })
    .then(response => {
      // console.log(response, 'response')
      if (response && response.data && response.data.statusCode === 200) {
        notification.success({
          message: 'Success',
          description: response.data && response.data.message,
        })
        return true
      }
      notification.warning({
        message: 'Error',
        description: response && response.data && response.data.message,
      })
      return false
    })
    .catch(err =>
      notification.error({
        message: 'Error',
        description: 'Something went wrong!!!',
      }),
    )
}

export async function currentAccount() {
  let userLoaded = false
  function getCurrentUser() {
    userLoaded = true
    const email = store.get('email') || localStorage.getItem('email')
    console.log("User data / store email:", email)
    console.log("Email ID before API call:", email)

    if (!email || email === 'undefined' || email === 'null' || typeof email !== 'string' || email.trim() === '') {
      console.error('Valid email ID is required')
      return null
    }

    return apiClient
      .get(`/isees/api/users/emailId?emailId=${encodeURIComponent(email.trim())}`)
      .then(response => {
        console.log("User data response:", response)
        if (response && response.data) {
          const user = response.data
          return user
        }
        return null
      })
      .catch(err => {
        console.log('Error fetching current account:', err)
        return null
      })
  }

  const accessToken = store.get('accessToken') || localStorage.getItem('accessToken')
  if (accessToken && accessToken.length) {
    return getCurrentUser()
  }
  return null
}

export async function logout() {
  store.remove('accessToken')
  store.remove('mobile')
  store.remove('email')
  store.remove('organization')
  store.remove('role')
  store.remove('showOrgnization')
  store.remove('selectedOrg')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('mobile')
  localStorage.removeItem('email')
  localStorage.removeItem('organization')
  localStorage.removeItem('role')
}
