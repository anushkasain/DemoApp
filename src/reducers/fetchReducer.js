import * as types from '../actions/types';


export default function fetchReducer(state={}, action) {
    switch (action.type) {
        case types.API_CALL_REQUEST:
            return {...state, fetching:true, error:null};
            case types.API_CALL_SUCCESS:
                return {...state, fetching:false, error:null, data:action.payload};
            case types.API_CALL_FAILURE:
                return {...state, fetching:false, error:action.error, data:null};
        default:
            return state;
    }
}