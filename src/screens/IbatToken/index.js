import {View, Text, StatusBar, Image, FlatList} from 'react-native';
import React, {useState} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  EIGHT,
  EIGHTEEN,
  ELEVEN,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  SIXTEEN,
  TEN,
  THIRTEEN,
  TWELVE,
} from '../../common/AppText';
import styles from './styles';
import {useSelector} from 'react-redux';
import InputBox from '../../common/InputBox';
import {RootState} from '../../libs/rootReducer';

import FastImage from 'react-native-fast-image';
import {
  metaMask,
  walletConnect,
  email,
  bank,
  panCard,
  eighth,
} from '../../helper/image';
import {RadioButton} from 'react-native-paper';
import PrimaryButton from '../../common/primaryButton';

const DATA = [
  {
    id: '1',
    source: metaMask,
    heading: 'MetaMask',
    subHeading: 'To get latest information',
    type: 'Verified',
  },
  {
    id: '2',
    source: walletConnect,
    heading: 'WalletConnect',
    subHeading: 'For safety ans security of all transactions.',
    type: 'Verified',
  },
];

const IbatToken = () => {
  const [checked, setChecked] = React.useState('first');

  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });

  const renderItem = ({item}) => {
    return (
      <View style={styles.box(colors)}>
        <View style={[styles.boxContainer, styles.topContainer]}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.phoneContainer(colors)}>
              <FastImage source={item.source} style={styles.imageContainer} />
            </View>
            <View style={styles.mobileContainer}>
              <AppText type={TWELVE} style={styles.mobile(colors)}>
                {item.heading}
              </AppText>
            </View>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('first')}
              color={colors.code}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
      <KeyBoardAware>
        <CommonImageBackground common>
          <View style={styles.bottomContainer}>
            <Header commonHeader title="IBAT" />
            <AppText type={THIRTEEN} style={styles.getVerified(colors)}>
              Pay with IBAT
            </AppText>

            <View style={styles.box(colors)}>
              <View style={[styles.boxContainer, styles.topContainer]}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.phoneContainer(colors)}>
                    <FastImage source={eighth} style={styles.eighth} />
                  </View>
                  <View style={styles.mobileContainer}>
                    <AppText type={TWELVE} style={styles.mobile(colors)}>
                      1.205
                    </AppText>
                    <AppText type={TWELVE} style={styles.mobile(colors)}>
                      Pay with IBAT
                    </AppText>
                  </View>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton
                    value="first"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('first')}
                    color={colors.code}
                  />
                </View>
              </View>
            </View>
            <View style={styles.orContainer}>
              <View style={styles.leftContainer(colors)} />
              <View>
                <AppText
                  type={EIGHTEEN}
                  weight={POPPINS_SEMI_BOLD}
                  style={styles.or(colors)}>
                  or
                </AppText>
              </View>
              <View style={styles.rightContainer(colors)} />
            </View>
            <AppText
              type={SIXTEEN}
              weight={POPPINS_SEMI_BOLD}
              style={styles.connect(colors)}>
              Connect your wallet
            </AppText>
            <AppText type={THIRTEEN} style={styles.connect(colors)}>
              Connect your wallet to play game
            </AppText>

            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal={false}
            />
            <PrimaryButton buttonStyle={styles.button} title="CONNECT WALLET" />
          </View>
        </CommonImageBackground>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default IbatToken;
