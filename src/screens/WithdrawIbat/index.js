import {View, Text, StatusBar} from 'react-native';
import React, {useState} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {AppText, ELEVEN, RUSSO, THIRTEEN, THIRTY} from '../../common/AppText';
import styles from './styles';
import {useSelector} from 'react-redux';
import InputBox from '../../common/InputBox';
import SecondaryButton from '../../common/secondaryButton';
import {PrivateValueStore} from '@react-navigation/native';
import PrimaryButton from '../../common/primaryButton';
import DropdownComponent from '../../common/Dropdown';
import {RootState} from '../../libs/rootReducer';

const WithdrawIbat = () => {
  const [reason, setReason] = useState(null);
  const data = [
    {value: 1, label: 'ABC'},
    {value: 2, label: 'XYZ'},
  ];
  const onChangeValue = value => {
  };

  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  return (
    <AppSafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
      <KeyBoardAware>
        <CommonImageBackground common>
          <Header commonHeader title="Withdrawal IBAT" />
          <View style={styles.bottomContainer}>
            <AppText type={THIRTEEN} style={styles.withdraw(colors)}>
              Withdrawl
            </AppText>
            <View style={styles.box(colors)}>
              <View style={styles.boxContainer}>
                <AppText type={ELEVEN} style={styles.wallet(colors)}>
                  Wallet Address
                </AppText>
                <InputBox
                  textInputBox={styles.textInputBox}
                  placeholder="Enter wallet address"
                />
                <AppText type={ELEVEN} style={styles.wallet(colors)}>
                  Amount
                </AppText>
                <InputBox
                  textInputBox={styles.textInputBox}
                  placeholder="Enter your amount"
                />
                <AppText type={ELEVEN} style={styles.wallet(colors)}>
                  Select Network
                </AppText>
                <DropdownComponent
                  value={reason}
                  placeholder="BTC"
                  items={data}
                  // onPick={onPick}
                  extraStyle={styles.extraStyle}
                  labelsStyle={styles.labelsStyle}
                  dropContaner={styles.dropContainer}
                  outerContainer={styles.outerContainer}
                  dropdownStyles={styles.dropdownStyles}
                  onChangeValue={onChangeValue}
                  onSelectItem={items => {
                  }}
                />
              </View>
            </View>
            <PrimaryButton buttonStyle={styles.button} title="WITHDRAW" />
          </View>
        </CommonImageBackground>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default WithdrawIbat;
