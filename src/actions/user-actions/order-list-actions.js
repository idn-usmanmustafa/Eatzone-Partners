import axios from 'axios';
import * as constants from '../constants';

function fetchOrderRrquest () {
    return {
        type: constants.FETCH_USER_ORDERS_REQUEST,
    }
}

function fetchOrderSuccess (data) {
    return {
        type: constants.FETCH_USER_ORDERS_SUCCESS,
        data,
    }
}

function fetchOrderFailure (error) {
    return {
        type: constants.FETCH_USER_ORDERS_FAILURE,
        error,
    }
}

export function fetchOrdersAction () {
    return dispatch => {
        dispatch(fetchOrderRrquest());
        return axios.get(`/user/get-orders`)
            .then(response => {
                dispatch(fetchOrderSuccess(response.data));
            })
            .catch(error => {
                dispatch(fetchOrderFailure(error))
            })
    }
}