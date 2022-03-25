import { connect } from 'react-redux';
import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal';
import { View, ActivityIndicator, AsyncStorage } from 'react-native';
import Switcher from './Switcher'
import * as constants from './actions/constants';
import * as actions from './actions/restaurant-actions/order-listing-actions';

class MainApp extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      user: null
     };
    this.verifyUser();
    OneSignal.setLogLevel(7, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    // OneSignal.init("f63350e4-f498-494f-9a3d-6d691518b83c");
        // OneSignal.init("cd34aa1f-542a-453c-a076-654f70d0b670");
    OneSignal.init("6322a551-5f85-4a3c-a05d-02ccfab21bba");


  }

  async componentDidMount() {
    await OneSignal.userProvidedPrivacyConsent();
    OneSignal.provideUserConsent(true);
    OneSignal.addEventListener("opened", this.onOpened.bind(this));
    OneSignal.inFocusDisplaying(2);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
    OneSignal.clearOneSignalNotifications()
  }

  async onOpened(openResult) {
    const userData = await AsyncStorage.getItem('userRes') || null;
    const user = JSON.parse(userData);
    console.log('userRes====>>>>',user);
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);

    const details = openResult.notification.payload.additionalData;
    if (details) {
      AsyncStorage.getItem("user_type")
        .then((value) => {
          const { navigation } = this.props;
          if (value === 'user') {
            console.log('notttttttt User: ', details);
            navigation.navigate('OrderScreen');
          } else if (value === 'admin') {
            console.log('notttttttt Admin: ', details);
            this.props.dispatch({
              type: constants.RESET_RESTAURANT_ORDERS_STATE,
            })
            navigation.navigate('ResturantOrderDetailsScreen', {
              isNotif: true,
              userRes: user,
              details: details && (details.newOrder ? details.newOrder : (details.updatedNewMenuOrder ? details.updatedNewMenuOrder : {})),
              orderConfirmed: details.orderConfirmed
            });
          }
        })
    }
  }
  verifyUser = async() => {
    // const user = await AsyncStorage.getItem('user');
    // this.props.navigation.navigate(user ? 'App' : 'Auth');

    this.props.navigation.navigate('Switcher');
  }
  
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchList: () => dispatch(actions.fetchOrdersAction(0)),
  }
}

export default connect(null, null)(MainApp);
