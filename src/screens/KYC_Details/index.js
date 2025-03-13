import {View, Text, StatusBar, Image, FlatList} from 'react-native';
import React, {useState} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  EIGHT,
  ELEVEN,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  TEN,
  THIRTEEN,
  TWELVE,
} from '../../common/AppText';
import styles from './styles';
import {useSelector} from 'react-redux';
import InputBox from '../../common/InputBox';
import {RootState} from '../../libs/rootReducer';
import {scan, copy} from '../../helper/image';
import FastImage from 'react-native-fast-image';
import {phone, email, bank, panCard} from '../../helper/image';

const DATA = [
  {
    id: '1',
    source: phone,
    heading: 'Mobile Number',
    subHeading: '+91 8628****282',
    type: 'Verified',
  },
  {
    id: '2',
    source: email,
    heading: 'Email Address',
    subHeading: '+91 8628****282',
    type: 'Verified',
  },
  {
    id: '3',
    source: phone,
    heading: 'PAN Card',
    subHeading: '+91 8628****282',
    type: 'Verified',
  },
  {
    id: '4',
    source: phone,
    heading: 'Bank Account',
    subHeading: '+91 8628****282',
    type: 'Verified',
  },
];

const KYC_Details = () => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });

  const renderItem = ({item}) => {
    return (
      <View style={styles.box(colors)}>
        <View style={[styles.boxContainer, styles.topContainers]}>
          <View style={styles.phoneContainer(colors)}>
            <FastImage source={item.source} style={styles.phone} />
          </View>
          <View style={styles.mobileContainer}>
            <AppText type={TWELVE} style={styles.mobile(colors)}>
              {item.heading}
            </AppText>
            <AppText type={TEN} style={styles.mobile(colors)}>
              {item.subHeading}
            </AppText>
          </View>

          <AppText
            type={EIGHT}
            weight={POPPINS_MEDIUM}
            style={styles.verified(colors)}>
            {item.type}
          </AppText>
        </View>
      </View>
    );
  };
  return (
    <AppSafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
      <KeyBoardAware>
        <CommonImageBackground common>
          <Header commonHeader title="KYC Details" />
          <View style={styles.bottomContainer}>
            <AppText type={THIRTEEN} style={styles.getVerified(colors)}>
              Verified
            </AppText>

            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal={false}
            />
          </View>
        </CommonImageBackground>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default KYC_Details;