import React, {useEffect, useState} from 'react';
import {FlatList, View, RefreshControl} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import {Screen} from '../../theme/dimens';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import MatchCard from '../../components/matchCard/MatchCard';
import {personIcon, combine, notification} from '../../helper/image';
import {getMyMatches} from '../../slices/matchSlice';
import styles from './styles';
import {
  AppText,
  BROWNYELLOW,
  EIGHTEEN,
  FIRST,
  FORTEEN,
  LIGHTPINK,
  LIGHTWHITE,
  POPPINS_MEDIUM,
  RED,
  THIRTEEN,
  TWELVE,
  WHITE,
  BLACKOPACITY,
} from '../../common/AppText';
import {flexOne, universalPaddingHorizontal} from '../../theme/dimens';
import {StatusBar} from 'native-base';
import CommonImageBackground from '../../common/commonImageBackground';
import {NLCColor, colors} from '../../theme/color';
import NavigationService from '../../navigation/NavigationService';
import {
  BOTTOM_TAB_HOMESCREEN,
  BOTTOM_TAB_PROFILE_SCREEN,
  Notification__SCREEN,
} from '../../navigation/routes';
import PrimaryButton from '../../common/primaryButton';
import {HomeTopHeader} from '../../common/HomeTopHeader';
import MatchCardContest from '../../components/matchCard/MatchCardContest';

export const RenderTabBar = props => {
  return (
    <TabBar
      {...props}
      contentContainerStyle={{
        backgroundColor: '#111019',
      }}
      renderLabel={({route, focused}) => (
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            // height: 38,
            justifyContent: 'space-between',
            padding: 5,
            alignItems: 'center',
          }}>
          <AppText
            type={FORTEEN}
            color={focused ? BROWNYELLOW : WHITE}
            weight={POPPINS_MEDIUM}>
            {route?.title}
          </AppText>
          {focused ? (
            <LinearGradient
              style={{height: 2, width: 95}}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={[
                colors.playerDetailsLinerOne,
                colors.playerDetailsLinerTwo,
              ]}></LinearGradient>
          ) : (
            <View style={{width: 95, height: 2}}></View>
          )}
        </View>
      )}
      indicatorStyle={{backgroundColor: 'transparent'}}
      scrollEnabled={!props.scrollEnabled ? props.scrollEnabled : true}
      tabStyle={[ props.tabStyle]}
      pressColor={'transparent'}
      style={[styles.tabbar, props.style]}
    />
  );
};

export const ListEmptyComponent = ({title, activeTab}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {activeTab == 'Live' ? (
        <AppText
          style={{textAlign: 'center'}}
          type={FORTEEN}
          weight={POPPINS_MEDIUM}>
          {title
            ? title
            : `You haven't joined any that are live.\n Join contests for any of the upcoming matches`}
        </AppText>
      ) : (
        <></>
      )}
      {activeTab == 'Upcoming' ? (
        <AppText
          style={{textAlign: 'center'}}
          type={FORTEEN}
          weight={POPPINS_MEDIUM}>
          {title
            ? title
            : `You haven't joined any upcoming contests \n Join contests for any of the upcoming matches`}
        </AppText>
      ) : (
        <></>
      )}

      <PrimaryButton
        onPress={() => NavigationService.navigate(BOTTOM_TAB_HOMESCREEN)}
        smallBtn={styles.joinButtonMyContest}
        title="VIEW UPCOMING MATCHES"
        type={TWELVE}
      />
    </View>
  );
};

const MyMatches = () => {
  const dispatch = useDispatch();
  // const tabData = ['Upcoming', 'Live', 'Completed'];
  const [activeTab, setActiveTab] = useState('Upcoming');
  const data = useSelector(state => state?.match?.myMatchesData);
  const isLoading = useSelector(state => state?.match?.isLoading);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Upcoming'},
    {key: 'second', title: 'Live'},
    {key: 'third', title: 'Completed'},
  ]);

  useEffect(() => {
    setActiveTab(
      index === 0
        ? (title = 'Upcoming')
        : index === 1
        ? (title = 'Live')
        : index === 2
        ? (title = 'Completed')
        : '',
    );
    dispatch(getMyMatches(title == 'Upcoming' ? 'Scheduled' : title));
  }, [index]);
  // useEffect(() => {
  //   dispatch(getMyMatches(activeTab == 'Upcoming' ? 'Scheduled' : activeTab));
  // }, [activeTab]);
  const onRefresh = () => {
    if (activeTab == 'Upcoming') {
      dispatch(getMyMatches('Scheduled'));
    } else if (activeTab == 'Live') {
      dispatch(getMyMatches('Live'));
    } else {
      dispatch(getMyMatches('Completed'));
    }
  };
  const renderItem = ({item}) => {
    return (
      <MatchCardContest
        details={item}
        isFromMyMatch={true}
        tab={activeTab}
        myMatches={true}
      />
    );
  };

  // const changeTab = title => {
  //   setActiveTab(title);
  //   dispatch(getMyMatches(title == 'Upcoming' ? 'Scheduled' : title));
  // };
  const reversedData = [...data]


  const FirstRoute = () => (
    <FlatList
      data={reversedData}
      style={{flex: flexOne, marginTop: 10}}
      contentContainerStyle={{flexGrow: flexOne}}
      keyExtractor={(item, index) => index?.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        isLoading ? <></> : <ListEmptyComponent activeTab={activeTab} />
      }
      renderItem={renderItem}
    />
  );

  const SecondRoute = () => (
    <FlatList
      data={reversedData}
      style={{flex: flexOne, marginTop: 10}}
      contentContainerStyle={{flexGrow: flexOne}}
      keyExtractor={(item, index) => index?.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        isLoading ? <></> : <ListEmptyComponent activeTab={activeTab} />
      }
      renderItem={renderItem}
    />
  );

  const ThirdRoute = () => (
    <FlatList
      data={reversedData}
      style={{flex: flexOne, marginTop: 10}}
      contentContainerStyle={{flexGrow: flexOne}}
      keyExtractor={(item, index) => index?.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        isLoading ? <></> : <ListEmptyComponent activeTab={activeTab} />
      }
      renderItem={renderItem}
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  return (
    <AppSafeAreaView statusColor={true} hidden={false}>
      <CommonImageBackground common>
        <HomeTopHeader
          walletIcon={true}
          personClick={() => NavigationService.openDrawer()}
        />

        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: Screen.Width}}
          renderTabBar={props => <RenderTabBar {...props} style={{}} />}
        />
      </CommonImageBackground>
      <SpinnerSecond loading={isLoading} />
    </AppSafeAreaView>
  );
};

export default MyMatches;
