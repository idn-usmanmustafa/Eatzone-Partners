import { fromJS, Map, List } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    orders: {
        data: [],
        error: null,
        loading: false,
    },
});

export default function orderListReducer (state = initialState, action) {
    switch (action.type) {
        case constants.FETCH_USER_ORDERS_REQUEST:
            return state.setIn(['orders', 'loading'], true);

        case constants.FETCH_USER_ORDERS_SUCCESS: {
            const payload = List(
                action.data.map(item =>
                    Map({
                        ...item,
                        key: guid(),
                    }),
                ),
            );
            return state
                .setIn(['orders', 'data'], payload)
                .setIn(['orders', 'loading'], false);
        }

        case constants.FETCH_USER_ORDERS_FAILURE:
            return state
                .setIn(['orders', 'error'], action.error)
                .setIn(['orders', 'loading'], false);

        case constants.RESET_ORDERS_STATE:
            return initialState;
        default:
            return state;
    }
}
