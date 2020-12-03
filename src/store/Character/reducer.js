import * as action_types from '../actions'

const initialState = {
    characters: []
}

const GetSortOrder = (prop) => {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

const reducer = (state = initialState, action) => {
    console.log('Characters reducer called');
    switch (action.type) {
        case action_types.SORT_CHARACTERS:
            let chrs = state.characters
            chrs.sort(GetSortOrder(action.payload.attr))
            console.log(chrs);
            console.log(state.characters);
            return {
                characters: chrs
            }
        case action_types.SET_CHARACTERS:
            console.log(action.payload.characters);
            return {
                characters: action.payload.characters
            }
        default:
            return state
    }
}

export default reducer;