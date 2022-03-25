import { connect } from 'react-redux';
import React, { Component,PureComponent } from 'react';
import { NavigationEvents } from 'react-navigation';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
  View, StatusBar, ActivityIndicator, Dimensions, BackHandler, AsyncStorage,Platform
} from 'react-native';

import { Header } from '../../components/common/header';

import * as actions from '../../actions/restaurant-actions/order-listing-actions';
import * as selectors from '../../selectors/restaurant-selectors/order-list-selectors';

import OrdersContainer from '../../containers/restaurant-containers/my-orders-container';

let offsetCollectionsVar = 1
let offsetVar = 1
class RecentOrdersScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      index: 0,
      offset:1,
      offsetCollections:1,
      routes: [
        { key: 'first', title: 'My Orders' },
        { key: 'second', title: 'Dine In Orders' },
      ],
    };

    //Binding handleBackButtonClick function with this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  async componentDidMount() {

    setInterval(async ()=>{
      await this.myOrderRefresher()
      await this.dineInRefresher()

    },120000)
    await this._retrieveData()
    const {offset,offsetCollections} = this.state
    this.props.fetchList(0);
    this.props.fetchListCollections(0)
    this.setState({offset:offset+1})
    offsetVar = offsetVar + 1
    offsetCollectionsVar = offsetCollectionsVar + 1

    console.log('OrdersDelivered===========>>>>',this.props.deliveries,'Dine-in=====>>>>',this.props.collections);
  }
  handleLoadMoreDeliveries =() =>{
    // alert('called Delivert ')
          if(this.props.deliveries.length > 0){
            if( this.props.deliveries.length != this.props.deliveries[0].arraysCount) {
            let pagination = (offsetVar - 1)*10
            this.props.fetchList(pagination);
            offsetVar = offsetVar + 1
          }
          else{
          }
        }
      };
      handleLoadMoreCollections = () => {
        // alert('called')
            if(this.props.collections.length > 0){
              console.log("showing arrays count ",this.props.collections[0].arraysCount)
              if( this.props.collections.length != this.props.collections[0].arraysCount) {
                const {offsetCollections} = this.state
                let pagination = (offsetCollectionsVar - 1)*10
                this.props.fetchListCollections(pagination);
                // this.setState({offsetCollections:offsetCollections+1})
                offsetCollectionsVar = offsetCollectionsVar + 1
              }
              else{
              }
            }
          };
 
  async componentWillMount() {
    let { params } = this.props.navigation.state;
    // console.warn('nextProps',params);
    try {
      if (params.nextProps.canceled) {
        await this.setState({ index: 1 })
      } 
    } catch (error) {
      // console.log(error);
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('HomeScreen');
    return true;
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userRes');
      if (value !== null) {
        // We have data!!
        await this.setState({ user: JSON.parse(value) })
        // console.log('userRes====>>>>',JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  myOrderRefresher = ()=>{
    offsetVar = 1
    this.props.resetMyorders()
    this.props.fetchList(0);
    offsetVar = offsetVar + 1
  }
  dineInRefresher = ()=>{
    offsetCollectionsVar = 1
    this.props.resetDineinorders()
    this.props.fetchListCollections(0)
    offsetCollectionsVar = offsetCollectionsVar + 1
  }

  render() {
    const {params} = this.props.navigation.state
    console.log('shwowing recent order props',params)

    const { loading, collections, deliveries } = this.props;
    console.log("[recent-orders.js] showing collections array ",collections, 'delivery==:',deliveries)
    // if (loading) {
    //   return (
    //     <View style={{ flex: 1, backgroundColor: '#e4e4e4' }}>
    //       <StatusBar hidden={false} />
    //       <Header
    //         navigation={this.props.navigation}
    //         title={'Recent Orders'}
    //       />
    //       <NavigationEvents
    //         onWillFocus={payload => {
    //           this.props.fetchList();
    //         }}
    //       />
    //       <ActivityIndicator size={'large'} color={'#1BA2FC'} />
    //     </View>
    //   )
    // }

    return (
      <View style={{ flex: 1, backgroundColor: '#e4e4e4', }}>
        <StatusBar hidden={false} />
        <Header
          navigation={this.props.navigation}
          title={params ? params.dineIn ?'Dine In Orders' : 'My Orders':'Recent Orders' }
        />
        <NavigationEvents
          onWillFocus={payload => {
            // this.props.fetchList();
          }}
        />
        {/* <TabView
          renderTabBar={props =>
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: '#1BA2FC' }}
              style={{ backgroundColor: '#fff' }}
              labelStyle={{ color: '#000' }}
              pressColor={{ color: '#000' }}
            />
          }
          navigationState={this.state}
          renderScene={SceneMap({
            first: () => (
              <OrdersContainer
                navScreen="RecentOrdersScreen"
                isDelivery={true}
                userRes= {this.state.user}
                navigation={this.props.navigation}
                // fetchList={() => this.props.fetchList(this.state.offset)}
                // list={deliveries && deliveries.filter(row => (
                //   (row.orderStatus === 'CONFIRMED' || row.orderStatus === 'PENDING') && row.currentOrderStep !== '0')
                // )}
                list={deliveries}
                // onEndReached={this.handleLoadMoreDeliveries}
                // onEndReachedThreshold = {Platform.OS === 'ios' ? 0 :1}
                refresher = {this.myOrderRefresher}

              />
            ),
            second: () => (
              <OrdersContainer
                navScreen="RecentOrdersScreen"
                list={collections}
                isDelivery={false}
                isCollecting={true}
                userRes= {this.state.user}
                navigation={this.props.navigation}
                // fetchList={() => this.props.fetchListCollections(this.state.offsetCollections)}
                onEndReached={this.handleLoadMoreCollections}
                // onEndReachedThreshold = {Platform.OS === 'ios' ? 0 :0.1}
                refresher = {this.dineInRefresher}
               
              />
            ),
          })}
          onIndexChange={index => {
            this.setState({ index });
          }}
          initialLayout={{ width: Dimensions.get('window').width }}
        /> */}
        {params && params.dineIn  ?
         <OrdersContainer
         navScreen="RecentOrdersScreen"
         list={collections}
         isDelivery={false}
         isCollecting={true}
         userRes= {this.state.user}
         navigation={this.props.navigation}
         // fetchList={() => this.props.fetchListCollections(this.state.offsetCollections)}
         onEndReached={this.handleLoadMoreCollections}
         onEndReachedThreshold = {Platform.OS === 'ios' ? 0 :1}
         refresher = {this.dineInRefresher}
       />
       :
       <OrdersContainer
       navScreen="RecentOrdersScreen"
       isDelivery={true}
       userRes= {this.state.user}
       navigation={this.props.navigation}
       // fetchList={() => this.props.fetchList(this.state.offset)}
       // list={deliveries && deliveries.filter(row => (
       //   (row.orderStatus === 'CONFIRMED' || row.orderStatus === 'PENDING') && row.currentOrderStep !== '0')
       // )}
       list={deliveries}
       onEndReached={this.handleLoadMoreDeliveries}
       onEndReachedThreshold = {Platform.OS === 'ios' ? 0 :1}
       refresher = {this.myOrderRefresher}

     />
      
        }
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
  collections: selectors.makeSelectCollectionOrderList()(state),
  deliveries: selectors.makeSelectDeliveryOrderList()(state),
  loading: selectors.makeSelectOrderListLoading()(state),
  error: selectors.makeSelectOrderListError()(state),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchList: (param) => dispatch(actions.fetchOrdersAction(param)),
    fetchListCollections: (param) => dispatch(actions.fetchOrdersActionCollections(param)),
    resetMyorders : () =>dispatch(actions.resetMyOrders()),
    resetDineinorders : () =>dispatch(actions.resetDineInOrders())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentOrdersScreen); 