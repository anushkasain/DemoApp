import {all, takeLatest} from 'redux-saga/effects';
import {
fetchAction
} from './sagas';
 import * as types from '../actions/types'


function* watchFetchAction(){
    yield takeLatest(types.API_CALL_REQUEST, fetchAction)
}

function* rootSaga() {
    yield all(
        [
            watchFetchAction()
        ]
    )
}

export default rootSaga;