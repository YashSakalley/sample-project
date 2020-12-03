import * as action_types from '../actions'

const initialState = {
    episodes: []
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
    console.log('Episodes reducer called');
    switch (action.type) {
        case action_types.SORT_EPISODES:
            let eps = state.episodes
            eps.sort(GetSortOrder(action.payload.attr))
            console.log(eps);
            console.log(state.episodes);
            return {
                episodes: eps
            }
        case action_types.SET_EPISODES:
            console.log('setting');
            return {
                episodes: action.payload.episodes
            }
        default:
            return state
    }
}

export default reducer;