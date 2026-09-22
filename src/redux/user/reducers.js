import actions from './actions'

const initialState = {
  avatar: '',
  services: [],
  authorized: import.meta.env.REACT_APP_AUTHENTICATED || false, // false is default value
  loading: false,
  accessToken: '',
  address: [],
  organization: [],
  email: '',
  id: 1,
  mobile: '8983896646',
  name: 'Demo',
  role: [],
  newOrgData: {}
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
