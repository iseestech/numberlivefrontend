import { combineReducers } from 'redux'
// import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import organization from './organization/reducers'

export default history =>
  combineReducers({
    router: history && history,
    user,
    menu,
    settings,
    organization
  })
