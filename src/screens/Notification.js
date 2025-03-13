import { View, StatusBar, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import Header from '../common/Header';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import CommonImageBackground from '../common/commonImageBackground';

import { universalPaddingHorizontal } from '../theme/dimens';
import {
  AppText,
  FIFTEEN,
  FORTEEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  TWENTY,
} from '../common/AppText';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/color';
const Notification = () => {
  function Item({ item }) {
    return (
      <View
        style={styles.listItem}>
        <View style={styles.singleDot} />
        <View style={styles.viewContainer}>
          <AppText type={FIFTEEN} weight={POPPINS_SEMI_BOLD}>
            {item.name}
          </AppText>
          <AppText weight={POPPINS_MEDIUM}>{item.header}</AppText>
          <AppText>{item.time}</AppText>
        </View>
      </View>
    );
  }
  state = {
    data: [
      {
        name: 'GT vs RCB:Lineups has been announced',
        time: '6:10PM',
        header: 'Make your team now and earn real money.',
      },
      {
        name: 'GT vs RCB:Lineups has been announced',
        time: '6:10PM',
        header: 'Make your team now and earn real money.',
      },
      {
        name: 'GT vs RCB:Lineups has been announced',
        time: '6:10PM',
        header: 'Make your team now and earn real money.',
      },
      {
        name: 'GT vs RCB:Lineups has been announced',
        time: '6:10PM',
        header: 'Make your team now and earn real money.',
      },
      {
        name: 'GT vs RCB:Lineups has been announced',
        time: '6:10PM',
        header: 'Make your team now and earn real money.',
      },
      {
        name: 'GT vs RCB:Lineups has been announced',
        time: '6:10PM',
        header: 'Make your team now and earn real money.',
      },
    ],
  };
  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <Header
          style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
          title="Notification"
          commonHeader
        />
        <View style={{
          flex: 1, alignItems: 'center',
          justifyContent: "center"
        }} >
          <AppText
            style={{ textAlign: 'center', marginTop: '-15%' }}
            weight={POPPINS_SEMI_BOLD}
            type={TWENTY}>
            No Notification
          </AppText>
        </View>
        {/* <FlatList
          style={{
            flex: 1,
            paddingHorizontal: universalPaddingHorizontal,
            marginTop:15
          }}
          data={this.state.data}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.email}
        /> */}
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};
const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    marginVertical: 5,
    borderRadius: 16,
  },
  singleDot: {
    height: 8,
    width: 8,
    borderRadius: 100,
    backgroundColor: colors.borderBackColor,
    marginTop: 5,
  },
  viewContainer: {
    flex: 1,
    marginLeft: 10,
  },
});
export default Notification;
