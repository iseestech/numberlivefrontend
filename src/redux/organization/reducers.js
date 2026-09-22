import actions from './actions'

const initialState = {
}

export default function orgReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SETNEWORG:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
