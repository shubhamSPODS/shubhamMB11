import React, {useEffect, useState} from 'react';
import {AppSafeAreaView} from '../common/AppSafeAreaView';
import {FlatList, StyleSheet, View, useWindowDimensions} from 'react-native';
import CommonImageBackground from '../common/commonImageBackground';
import Header from '../common/Header';
import {Screen, universalPaddingHorizontal} from '../theme/dimens';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  BROWNYELLOW,
  FIRST,
  FORTEEN,
  GREEN,
  LIGHTBLUE,
  LIGHTGOLDEN,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  RED,
  TWELVE,
  WHITE,
} from '../common/AppText';
import {useDispatch, useSelector} from 'react-redux';
import {getTransactionsDeposit} from '../actions/profileAction';
import {SpinnerSecond} from '../common/SpinnerSecond';
import {TEN} from '../common/AppText';
import moment from 'moment';
import {StatusBar} from 'native-base';
import {colors} from '../theme/color';
import {fixedToTwo} from '../helper/utility';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

const renderItem = ({item}) => {
  const {createdAt, message, transaction_status, amount, requestedamount} =
    item ?? '';
  console.log(item);
  return (
    <View style={styles.renderItemContainer}>
      <View style={styles.renderItemContainerSecond}>
        <AppText weight={POPPINS_MEDIUM} type={TWELVE} style={{flex: 1}}>
          {moment(createdAt).format('DD MMM')?.toUpperCase()}
          {'\n'}
          <AppText weight={POPPINS_LIGHT} color={FIRST} style={{flex: 1}}>
            {moment(createdAt).format('hh:mm A')?.toUpperCase()}
          </AppText>
        </AppText>
        <View style={{flex: 1.2}}>
          {item?.transaction_type === 'withdrawl_request' ? (
            <AppText
              color={item?.transaction_status === 'success' ? GREEN : item?.transaction_status === "in-process" ? LIGHTGOLDEN :RED}
              style={{textAlign: 'center'}}>{`${transaction_status}`}</AppText>
          ) : (
            <>
              <AppText
                color={
                  item?.transaction_type == 'winning_reverted'
                    ? RED
                    : item?.transaction_type == 'contest_charge_deducted'
                    ? RED
                    : GREEN
                }
                style={{textAlign: 'center'}}>
                {`${message}`}
              </AppText>
              <AppText
                weight={POPPINS_LIGHT}
                color={FIRST}
                style={{textAlign: 'center'}}>
                {item?.match_title}
              </AppText>
            </>
          )}
          {/* <AppText
            weight={POPPINS_LIGHT}
            color={FIRST}
            style={{textAlign: 'center', marginVertical: 5}}>
            Match ID-{item?.match_id}
          </AppText> */}
        </View>
        <View style={{flex: 1}}>
          {requestedamount && (
            <AppText color={RED} style={{textAlign: 'right'}}>
              TDS {fixedToTwo(requestedamount - amount)}
            </AppText>
          )}
          {item?.transaction_type === 'withdrawl_request' ? (
            <AppText
            color={item?.transaction_status === 'success' ? GREEN : item?.transaction_status === "in-process" ? LIGHTGOLDEN :RED}
              style={{textAlign: 'right'}}>
              INR {fixedToTwo(amount)}
            </AppText>
          ) : (
            <AppText color={GREEN} style={{textAlign: 'right'}}>
              INR {fixedToTwo(amount)}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
};

const FirstRoute = ({data, isLoading}) => (
  <>
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      contentContainerStyle={{flexGrow: 1}}
      ListEmptyComponent={
        isLoading ? <></> : <ListEmptyComponent title="Nothing to show." />
      }
    />
  </>
);

const MyTransaction = () => {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();

  const depositTransactions = useSelector(
    state => state.profile.depositTransactions,
  );
  const reverseData = [...depositTransactions];
  const contestTransactions = useSelector(
    state => state.profile.contestTransactions,
  );
  const withdrawalsTransactions = useSelector(
    state => state.profile.withdrawalsTransactions,
  );
  const isLoading = useSelector(state => state.auth.isLoading);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Deposits', data: reverseData, isLoading},
    {key: 'third', title: 'Withdrawals', data: reverseData, isLoading},
  ]);

  useEffect(() => {
    const transactionType = index === 0 ? 'ADDCASH' : 'withdrawl';
    dispatch(getTransactionsDeposit(transactionType));
  }, [index]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute data={reverseData} isLoading={isLoading} />;
      case 'third':
        return <FirstRoute data={reverseData} isLoading={isLoading} />;
      default:
        return null;
    }
  };
  const [active, setActive] = useState('Deposits');
  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar backgroundColor="transparent" translucent />
      <CommonImageBackground common>
        <Header
          commonHeader
          title="Transaction"
          style={{padding: universalPaddingHorizontal, marginTop: '10%'}}
        />
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <RenderTabBar
              {...props}
              onTabChange={tabIndex => {
                // setIndex(tabIndex);
                setActive(tabIndex);
              }}
            />
          )}
        />
        <SpinnerSecond loading={isLoading} />
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

export default MyTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: universalPaddingHorizontal,
  },
  containerHeader: {
    height: 45,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    width: '33%',
    height: 38,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 5,
    alignItems: 'center',
  },
  renderItemContainer: {
    // flex: 1,
    width: Screen.Width - 40,
    alignSelf: 'center',
    padding: 5,
  },
  renderItemContainerSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: universalPaddingHorizontal,
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginTop: 5,
    borderBottomColor: '#BEBEBE',
  },
});

const RenderTabBar = props => {
  const {onTabChange} = props;
  return (
    <>
      <TabBar
        {...props}
        onTabPress={e => {
          onTabChange(e.route.key);
        }}
        scrollEnabled={false}
        tabStyle={[{flex: 1}, props.tabStyle]}
        renderLabel={({route, focused}) => (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AppText
              type={FORTEEN}
              color={focused ? BROWNYELLOW : WHITE}
              weight={POPPINS_MEDIUM}>
              {route.title}
            </AppText>
            {focused ? (
              <LinearGradient
                style={{height: 2, width: 105}}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={[
                  colors.playerDetailsLinerOne,
                  colors.playerDetailsLinerTwo,
                ]}
              />
            ) : (
              <View style={{height: 2, width: 105}} />
            )}
          </View>
        )}
        indicatorStyle={{backgroundColor: 'transparent'}}
        pressColor="transparent"
        style={[{width: '100%', backgroundColor: 'transparent', elevation: 0}]}
      />
      <View
        style={{
          width: Screen.Width - 60,
          padding: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
        }}>
        <AppText color={LIGHTBLUE} type={TEN}>
          DATE & TIME
        </AppText>
        <AppText color={LIGHTBLUE} type={TEN} style={{textAlign: 'center'}}>
          TRANSACTION DETAILS
        </AppText>
        <AppText color={LIGHTBLUE} type={TEN} style={{textAlign: 'right'}}>
          AMOUNT
        </AppText>
      </View>
    </>
  );
};

const ListEmptyComponent = ({title}) => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <AppText
      style={{textAlign: 'center'}}
      type={FORTEEN}
      weight={POPPINS_MEDIUM}>
      {title ||
        "You haven't joined any upcoming contests \n Join contests for any of the upcoming matches"}
    </AppText>
  </View>
);
