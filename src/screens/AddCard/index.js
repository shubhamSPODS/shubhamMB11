import {View, Text, StatusBar, Image} from 'react-native';
import React, {useState} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  ELEVEN,
  FORTEEN,
  POPPINS_LIGHT,
  RUSSO,
  TEN,
  THIRTEEN,
  THIRTY,
  TWELVE,
} from '../../common/AppText';
import styles from './styles';
import {useSelector} from 'react-redux';
import InputBox from '../../common/InputBox';
import SecondaryButton from '../../common/secondaryButton';
import {PrivateValueStore} from '@react-navigation/native';
import PrimaryButton from '../../common/primaryButton';
import DropdownComponent from '../../common/Dropdown';
import {icici} from '../../helper/image';
import FastImage from 'react-native-fast-image';
import {RootState} from '../../libs/rootReducer';
import {universalPaddingHorizontal} from '../../theme/dimens';

const AddCard = () => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [cvv, setCvv] = useState('');
  return (
    <AppSafeAreaView>
      <CommonImageBackground common>
        <Header
          style={{padding: universalPaddingHorizontal}}
          commonHeader
          title="Add Credit/Debit Card"
        />
        <KeyBoardAware style={styles.bottomContainer}>
          <AppText type={FORTEEN} style={styles.withdraw(colors)}>
            Enter Card Details
          </AppText>

          <View style={styles.box(colors)}>
            <InputBox
              placeholder=""
              value={name}
              placeholderTextColor={colors.grey}
              labelStyle={styles.label(colors)}
              label="Cardholder Name"
              returnKeyType="next"
              onChange={value => setName(value)}
              textInputBox={styles.textInputBox(colors)}
            />

            <InputBox
              placeholder=""
              value={number}
              placeholderTextColor={colors.grey}
              labelStyle={[styles.label(colors), {marginTop: 20}]}
              label="Card Number"
              returnKeyType="next"
              onChange={value => setNumber(value)}
              textInputBox={styles.textInputBox(colors)}
            />

            <View style={styles.dateContainer}>
              <InputBox
                placeholder=""
                value={date}
                placeholderTextColor={colors.grey}
                labelStyle={[styles.label(colors), {}]}
                label="Expiry Date"
                returnKeyType="next"
                onChange={value => setDate(value)}
                textInputBox={styles.textInputBox(colors)}
                style={{flex: 1, marginEnd: 10}}
              />
              <InputBox
                placeholder=""
                value={cvv}
                placeholderTextColor={colors.grey}
                labelStyle={[styles.label(colors), {}]}
                label="CVV Number"
                returnKeyType="done"
                onChange={value => setCvv(value)}
                textInputBox={styles.textInputBox(colors)}
                style={{flex: 1, marginStart: 10}}
              />
            </View>
          </View>

          <PrimaryButton buttonStyle={styles.button} title="SAVE" />
        </KeyBoardAware>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

export default AddCard;
