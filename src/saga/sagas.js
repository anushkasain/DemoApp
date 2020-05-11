import { all, takeLatest, put } from 'redux-saga/effects';
import * as types from "../actions/types";


const callApis = async (action) => {
    try {
        let response = await fetch(action.type);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log(error)
    }
}


export function* fetchAction(action) {
    try {
        const data = yield callApis(action);
        yield put({ type: types.API_CALL_SUCCESS, payload: data })
    } catch (error) {
        alert("Server Error")
        yield put({ type: types.API_CALL_FAILURE })
    }
}


