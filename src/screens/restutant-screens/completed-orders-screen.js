import { connect } from 'react-redux';
import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import { View, StatusBar, ActivityIndicator, BackHandler, AsyncStorage,Platform } from 'react-native';

import { Header } from '../../components/common/header';

import * as actions from '../../actions/restaurant-actions/order-listing-actions';
import * as selectors from '../../selectors/restaurant-selectors/order-list-selectors';

import OrdersContainer from '../../containers/restaurant-containers/my-orders-container';
let offsetVar = 1
class CompletedOrdersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null,offset :1 }
    //Binding handleBackButtonClick function with this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  // async componentDidMount() {
  //   this.props.fetchList();
  //   await this._retrieveData()
  // }
  async componentDidMount() {
        await this._retrieveData()
    this.props.fetchList(0);
    offsetVar = offsetVar + 1
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('HomeScreen');
    return true;
  }
  handleLoadMore = () => {
    // alert('called')
        if(this.props.completedOrders.length > 0){
          if(this.props.completedOrders.length != this.props.completedOrders[0].arraysCount) {
            let pagination = (offsetVar - 1)*10
            this.props.fetchList(pagination);
            offsetVar = offsetVar + 1
          }
          else{
          }
        }
      };
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userRes');
      if (value !== null) {
        // We have data!!
        await this.setState({ user: JSON.parse(value) })
        console.log('userRes====>>>>',JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  refresher = ()=>{
    offsetVar = 1
    this.props.restCompletedOrders()
    this.props.fetchList(0);
    offsetVar = offsetVar + 1

  }
  render() {
    const { loading, deliveries,completedOrders } = this.props;
    console.log("[complete orders screens],showing completed orders with seletectors",completedOrders)
    // if (loading) {
    //   return (
    //     <View style={{ flex: 1, backgroundColor: '#e4e4e4' }}>
    //       <StatusBar hidden={false} />
    //       <Header
    //         navigation={this.props.navigation}
    //         title={'Completed Orders'}
    //       />
    //       {/* <ActivityIndicator size={'large'} color={'#1BA2FC'} /> */}
    //     </View>
    //   )
    // }
    return (
      <View style={{ flex: 1, backgroundColor: '#e4e4e4' }}>
        <StatusBar hidden={false} />
        <Header
          navigation={this.props.navigation}
          title={'Completed Orders'}
        />
        <NavigationEvents
          onWillFocus={payload => {
            this.refresher()
          }}
        />
        <OrdersContainer
          navScreen="CompletedOrdersScreen"
          isDelivery={true}
          isCollecting={true}
          userRes= {this.state.user}
          navigation={this.props.navigation}
          // fetchList={() => this.props.fetchList(this.state.offset)}
          list={completedOrders}
          onEndReached={()=>this.handleLoadMore()}
          onEndReachedThreshold = {Platform.OS === 'ios' ? 0 :1}
          refresher = {this.refresher}
        />
        {loading ?
        <ActivityIndicator size={'large'} color={'#1BA2FC'} />
        :
        null
       }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  deliveries: selectors.makeSelectDeliveryOrderList()(state),
  loading: selectors.makeSelectOrderListLoading()(state),
  error: selectors.makeSelectOrderListError()(state),
  completedOrders:selectors.makeCompletedOrderList()(state),
  
});

const mapDispatchToProps = dispatch => {
  return {
    fetchList: (params) => dispatch(actions.fetchCompleteOrdersAction(params)),
    restCompletedOrders:()=>dispatch(actions.resetCompleteOrders())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedOrdersScreen); 