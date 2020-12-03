import * as action_types from './actions'

const initialState = {

}

const reducer = (state = initialState, action) => {
    console.log('Reducer called');
    switch (action.type) {
        case action_types.SET_BLOG:
            console.log('Setting');
            return {
                character: action.payload.char
            }
        default:
            return state
    }
}

export default reducer;