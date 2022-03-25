import { fromJS, Map, List } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    orders: {
        deliveries: [],
        collections: [],
        completedOrders:[],
        completed: false,
        canceled: false,
        accepted: false,
        updating: false,
        loading: false,
        error: null,
    },
});

export default function orderListReducer (state = initialState, action) {
    switch (action.type) {
        case constants.FETCH_RESTAURANT_ORDERS_REQUEST:
            return state.setIn(['orders', 'loading'], true);

        case constants.FETCH_RESTAURANT_DELIVERIES_ORDERS_SUCCESS: {
            // const collections = List(
            //     action.data && action.data.collections.rows.map(item =>
            //         Map({
            //             ...item,
            //             key: guid(),
            //         }),
            //     ),
            // );
            // const deliveries = List(
            //     action.data && action.data.deliveries.rows.map(item =>
            //         Map({
            //             ...item,
            //             key: guid(),
            //         }),
            //     ),
            // );
            // return state
            //     .setIn(['orders', 'deliveries'], deliveries)
            //     .setIn(['orders', 'collections'], collections)
            //     .setIn(['orders', 'loading'], false);
            let orderArray = state.getIn(['orders', 'deliveries']).toJS()
            let payload = null
            console.log('showing array ',orderArray)
            if(orderArray.length == action.data.count){
                payload = orderArray
            }
            else{
                payload = orderArray.concat(action.data.rows)

            }
            console.log('showing array passed in data by action ',action.data.rows)
            // payload = orderArray.concat(action.data)
            console.log('showing paylaod of updated array',payload)
            return state
                .setIn(['orders', 'deliveries'], fromJS(payload))
                .setIn(['orders', 'loading'], false);
        }
        case constants.FETCH_RESTAURANT_COLLECTION_ORDERS_SUCCESS: {
            // const collections = List(
            //     action.data && action.data.collections.rows.map(item =>
            //         Map({
            //             ...item,
            //             key: guid(),
            //         }),
            //     ),
            // );
            // const deliveries = List(
            //     action.data && action.data.deliveries.rows.map(item =>
            //         Map({
            //             ...item,
            //             key: guid(),
            //         }),
            //     ),
            // );
            // return state
            //     .setIn(['orders', 'deliveries'], deliveries)
            //     .setIn(['orders', 'collections'], collections)
            //     .setIn(['orders', 'loading'], false);
            let orderArray = state.getIn(['orders', 'collections']).toJS()
            let payload = null
            console.log('showing array ',orderArray)
            if(orderArray.length == action.data.count){
                payload = orderArray
            }
            else{
                payload = orderArray.concat(action.data.rows)

            }
            console.log('showing array passed in data by action ',action.data.rows)
            // payload = orderArray.concat(action.data)
            console.log('showing paylaod of updated array',payload)
            return state
                .setIn(['orders', 'collections'], fromJS(payload))
                .setIn(['orders', 'loading'], false);
        }

        case constants.FETCH_COMPLETED_ORDERS: {
            let orderArray = state.getIn(['orders', 'completedOrders']).toJS()
            let payload = null
            console.log('showing array ',orderArray)
            if(orderArray.length == action.data.count){
                payload = orderArray

            }
            else{
                payload = orderArray.concat(action.data.rows)

            }
            console.log('showing array passed in data by action ',action.data.rows)
            // payload = orderArray.concat(action.data)
            console.log('showing paylaod of updated array',payload)
            return state
                .setIn(['orders', 'completedOrders'], fromJS(payload))
                .setIn(['orders', 'loading'], false);
        }

        case constants.FETCH_RESTAURANT_ORDERS_FAILURE:
            return state
                .setIn(['orders', 'error'], action.error)
                .setIn(['orders', 'loading'], false);

        case constants.UPDATE_RESTAURANT_ORDERS_REQUEST:
            return state.setIn(['orders', 'updating'], true);

        case constants.UPDATE_STATUS_LOCALLY:
            return state
                .setIn(['orders', action.orderStatus], true)
                .setIn(['orders', 'updating'], false);

        case constants.UPDATE_RESTAURANT_ORDERS_REQUEST:
            return state
                .setIn(['orders', 'updating'], true)
                .setIn(['orders', action.orderStatus], true);

        case constants.RESET_RESTAURANT_ORDERS_STATE:
            return initialState;
        case constants.RESET_COMPLETED_ORDERS:
            return state
            .setIn(['orders', 'completedOrders'], fromJS([]))
        case constants.RESET_MY_ORDERS:
            return state
            .setIn(['orders', 'deliveries'], fromJS([]))
        case constants.RESET_DINEIN_ORDERS:
                return state
                .setIn(['orders', 'collections'], fromJS([]))
        default:
            return state;
    }
}
