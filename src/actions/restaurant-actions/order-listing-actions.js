import axios from 'axios';
import * as constants from '../constants';

function fetchOrderRrquest() {
    return {
        type: constants.FETCH_RESTAURANT_ORDERS_REQUEST,
    }
}

function fetchOrderSuccessDeliveries(data) {
    return {
        type: constants.FETCH_RESTAURANT_DELIVERIES_ORDERS_SUCCESS,
        data,
    }
}
function fetchOrderSuccessCollections(data) {
    return {
        type: constants.FETCH_RESTAURANT_COLLECTION_ORDERS_SUCCESS,
        data,
    }
}
function fetchCompleteOrderSuccess (data){
    return {
        type: constants.FETCH_COMPLETED_ORDERS,
        data,
    }   
}
function fetchOrderFailure(error) {
    return {
        type: constants.FETCH_RESTAURANT_ORDERS_FAILURE,
        error,
    }
}

export function resetOrderState() {
    return {
        type: constants.RESET_RESTAURANT_ORDERS_STATE,
    }
}

export function fetchOrdersAction(offset) {
    console.log("showing offset is it displaying",offset)
    return dispatch => {
        dispatch(fetchOrderRrquest());
        return axios.get(`/restaurant/get-orders-deliveries?offset=${offset}&limit=10`)
            .then(response => {
                console.log('Recent Orders=====>>',response.data);
                response.data.rows.forEach(item => {
                    item.dropOff = false
                    item.arraysCount = response.data.count
                    if (item.deliveringRestaurant.id === item.transportResponsibility) {
                        item.dropOff = true
                    }
                })
                // response.data.collections.rows.forEach(item => {
                //     item.pickUp = false
                //     if (item.collectingRestaurant.id === item.transportResponsibility) {
                //         item.pickUp = true
                //     }
                // })

                dispatch(fetchOrderSuccessDeliveries(response.data));
            })
            .catch(error => {
                dispatch(fetchOrderFailure(error))
            })
    }
}
export function fetchOrdersActionCollections(offset) {
    return dispatch => {
        dispatch(fetchOrderRrquest());
        return axios.get(`/restaurant/get-orders-collections?offset=${offset}&limit=10`)
            .then(response => {
                console.log('Recent Orders=====>>',response.data);
                
                response.data.rows.forEach(item => {
                    item.arraysCount = response.data.count
                    item.pickUp = false
                    if (item.collectingRestaurant.id === item.transportResponsibility) {
                        item.pickUp = true
                    }
                })

                dispatch(fetchOrderSuccessCollections(response.data));
            })
            .catch(error => {
                dispatch(fetchOrderFailure(error))
            })
    }
}
export function fetchCompleteOrdersAction(offset) {
    console.log('showing offset completed orders',offset)
    return dispatch => {
        dispatch(fetchOrderRrquest());
        return axios.get(`/restaurant/get-completed-orders?offset=${offset}&limit=10`)
            .then(response => {
                console.log('[order listings actions.js] showing completed orders',response.data);
                // response.data.deliveries.rows.forEach(item => {
                //     item.dropOff = false
                //     if (item.deliveringRestaurant.id === item.transportResponsibility) {
                //         item.dropOff = true
                //     }
                // })
                // response.data.collections.rows.forEach(item => {
                //     item.pickUp = false
                //     if (item.collectingRestaurant.id === item.transportResponsibility) {
                //         item.pickUp = true
                //     }
                // })
                response.data.rows.forEach(item => {
                    item.arraysCount = response.data.count
                })
                if(response.data.rows.length > 0) {
                    dispatch(fetchCompleteOrderSuccess(response.data));
                }

            })
            .catch(error => {
                dispatch(fetchOrderFailure(error))
            })
    }
}

function updateOrderRequest() {
    return {
        type: constants.UPDATE_RESTAURANT_ORDERS_REQUEST,
    }
}
export function resetCompleteOrders(){
    return{
        type:constants.RESET_COMPLETED_ORDERS
    }
}
export function resetMyOrders(){
    return{
        type:constants.RESET_MY_ORDERS
    }
}
export function resetDineInOrders(){
    return{
        type:constants.RESET_DINEIN_ORDERS
    }
}

function updateOrderSuccess(data) {
    return {
        type: constants.UPDATE_RESTAURANT_ORDERS_SUCCESS,
        data,
    }
}

function updateOrderFailure(error) {
    return {
        type: constants.UPDATE_RESTAURANT_ORDERS_FAILURE,
        error,
    }
}

export function updateLocally(orderStatus) {
    return {
        type: constants.UPDATE_STATUS_LOCALLY,
        orderStatus,
    }
}

export function updateOrderStatusAction(url, orderStatus) {
    return dispatch => {
        dispatch(updateOrderRequest());
        axios.put(url)
            .then(response => {
                console.log('response====>>>',response);
                // dispatch(updateOrderSuccess(response.data));
                dispatch(updateLocally(orderStatus))
            })
            .catch(error => {
                dispatch(updateOrderFailure(error));
            })
    }
}