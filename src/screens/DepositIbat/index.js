import {View, Text, StatusBar, Image} from 'react-native';
import React, {useState} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  ELEVEN,
  POPPINS_LIGHT,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  TWELVE,
} from '../../common/AppText';
import styles from './styles';
import {useSelector} from 'react-redux';
import InputBox from '../../common/InputBox';
import {RootState} from '../../libs/rootReducer';
import {scan, copy} from '../../helper/image';
import FastImage from 'react-native-fast-image';

const DepositIbat = () => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  return (
    <AppSafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
      <KeyBoardAware>
        <CommonImageBackground common>
          <Header commonHeader title="Deposit IBAT" />
          <FastImage style={styles.scan} source={scan} />
          <View style={styles.bottomContainer}>
            <View style={styles.box(colors)}>
              <View style={[styles.boxContainer, styles.topContainer]}>
                <AppText
                  type={TWELVE}
                  weight={POPPINS_LIGHT}
                  style={styles.topText(colors)}>
                  fnwejfowvdkjfijsdnjdncsd9762hdhdfsd
                </AppText>

                <View>
                  <FastImage style={styles.copy} source={copy} />
                </View>
              </View>
            </View>
            <AppText
              type={TWELVE}
              style={[styles.topText(colors), styles.code]}>
              Click above to copy the code
            </AppText>

            <View style={styles.box(colors)}>
              <View style={styles.bottomBox}>
                <AppText
                  type={SIXTEEN}
                  weight={POPPINS_SEMI_BOLD}
                  style={styles.disclaimer(colors)}>
                  Disclaimer:
                </AppText>

                <AppText type={ELEVEN} style={styles.discription(colors)}>
                  • Minimum deposit of 0.250 IBAT, deposit below that cannot be
                  recovered.
                </AppText>
                <AppText type={ELEVEN} style={styles.discription(colors)}>
                  • Please deposit only IBAT on this address. If you deposit any
                  other coin, it will be lost forever.
                </AppText>
                <AppText type={ELEVEN} style={styles.discription(colors)}>
                  • This is IBAT deposit address type. Transferring to an
                  unsupported network could result in loss of deposit.
                </AppText>
              </View>
            </View>
          </View>
        </CommonImageBackground>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default DepositIbat;
