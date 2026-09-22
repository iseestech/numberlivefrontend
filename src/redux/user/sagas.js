import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from '@/main'
import store from 'store'

import * as firebase from '@/services/firebase'
import * as advisor from '@/services/axios/advisor'
import * as jwt from '@/services/jwt'
import actions from './actions'

const mapAuthProviders = {
  firebase: {
    login: firebase.login,
    register: firebase.register,
    currentAccount: firebase.currentAccount,
    logout: firebase.logout,
  },
  jwt: {
    login: jwt.login,
    register: jwt.register,
    currentAccount: jwt.currentAccount,
    logout: jwt.logout,
  },
  advisor: {
    login: advisor.login,
    verifyOtp: advisor.verifyOtp,
    register: advisor.register,
    currentAccount: advisor.currentAccount,
    logout: advisor.logout,
  },
  user: {
    id: 2,
    email: 'user@isees.com',
    name: 'Demo User',
    role: 'user',
    services: ['dashboards', 'contacts', 'customer', 'sales', 'orders', 'invoices', 'salesReturn'],
    avatar: '',
    authorized: true,
  },
  admin: {
    id: 1,
    email: 'admin@isees.com',
    name: 'Demo Admin',
    role: 'admin',
    avatar: '',
    authorized: true,
  },
}

export function* LOGIN({ payload }) {
  const { email, password, screenType, mobile, country_code: countryCode, type } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider: autProviderName } = yield select(state => state.settings)
  // Step 1 of 2: only checks email/password and triggers the OTP email.
  // Actual sign-in / redirect happens in VERIFY_OTP below.
  const success = yield call(mapAuthProviders.advisor.login, email, password, screenType)
  if (success) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
        otpRequired: true,
        otpEmail: email,
        otpScreenType: screenType,
      },
    })
  } else {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* VERIFY_OTP({ payload }) {
  const { email, otp, screenType } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(mapAuthProviders.advisor.verifyOtp, email, otp)
  if (success) {
    const org = store.get('organization')
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    if (screenType === 'SUPERADMIN') {
      yield window.location.href = '/admin/organizations'
    } else if (!Object.keys(org).length) {
      yield window.location.href = '/auth/user/organization/create'
    } else {
      yield window.location.href = '/'
    }
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in!',
    })
  } else {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* REGISTER({ payload }) {
  const { email, password, firstName, lastName, country_code: countryCode, mobile, role } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select(state => state.settings)
  const success = yield call(
    mapAuthProviders.advisor.register,
    email,
    password,
    firstName,
    lastName,
    countryCode,
    mobile,
  )
  if (success) {
    // if (true) {
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    notification.success({
      message: 'Succesful Registered',
      description: 'You have successfully registered! Please check email to create password',
      duration: 5,
    })
    yield window.location.href = '/auth/login'
  }
  if (!success) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select(state => state.settings)
  const { user } = yield select(state => state.user)
  const response = yield call(mapAuthProviders.advisor.currentAccount)
  // const response = mapAuthProviders.admin
  // console.log(response, 'response current User')
  if (response && response.data && response.data.accessToken.length) {
    // if (response) {
    const { id, email, name, avatar, role, services, mobile, accessToken } = response.data

    // const { id, email, name, avatar, role, services, mobile, accessToken } = response
    yield put({
      type: 'user/SET_STATE',
      payload: {
        ...response.data,
        role: 'admin',
        authorized: true,
        loading: false,
      },
    })
    // yield history.push('/')
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  const role = store.get('role')
  const { authProvider } = yield select(state => state.settings)
  yield call(mapAuthProviders.advisor.logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
  if (role && role.type === 'SUPERADMIN') {
    yield window.location.href = '/auth/admin/login'
  } else {
    yield window.location.href = '/auth/login'
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.VERIFY_OTP, VERIFY_OTP),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
