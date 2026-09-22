import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import actions from './actions'

export function* SETNEWORG({values}) {
  console.log('SETNEWORG',values)
 yield put({
    type: 'organization/SETNEWORG',
    payload: values || {},
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.SETNEWORG, SETNEWORG),
  ])
}
