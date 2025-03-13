import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import CommonImageBackground from '../common/commonImageBackground';
import { StatusBar } from 'native-base';
import Header from '../common/Header';
import { universalPaddingHorizontal } from '../theme/dimens';
import { KeyBoardAware } from '../common/KeyboardAware';
import { AppText, FORTEEN, POPPINS_MEDIUM } from '../common/AppText';
import InputBox from '../common/InputBox';
import { colors } from '../theme/color';
import { fontFamilyPoppins } from '../theme/typography';
import PrimaryButton from '../common/primaryButton';
import { checkUPIDlNumber, toastAlert } from '../helper/utility';
import { useDispatch } from 'react-redux'
import { getUpiVerifiy } from '../slices/matchSlice';
import FastImage from 'react-native-fast-image';
import { scanIcon } from '../helper/image';

const VerifyUPI = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [nameHolder, setNameHolder] = useState('');

  const onSubmit = () => {
    if (!checkUPIDlNumber(name))
      return toastAlert.showToastError('Please enter valid UPI ID');
    const data = {
      upi_number: name,
    };
    dispatch(getUpiVerifiy(data))
  };
  return (
    <AppSafeAreaView>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle="dark-content"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <Header
          commonHeader
          title="Verify UPI ID"
          style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
        />
        <KeyBoardAware style={styles.bottomContainer}>
          <FastImage source={scanIcon} resizeMode='contain' style={styles.topLogo}/>
          <AppText
            type={FORTEEN}
            weight={POPPINS_MEDIUM}
            style={styles.withdraw}>
    Enter your UPI ID
          </AppText>
          <View style={styles.box}>
            
            <InputBox
              placeholder="Enter your UPI ID"
              value={name}
              placeholderTextColor={colors.grey}
              labelStyle={[styles.label, { marginTop: 10 }]}
              label="UPI ID*"
              returnKeyType="next"
              onChange={value => setName(value)}
              textInputBox={styles.textInputBox}
            />
          </View>
        </KeyBoardAware>
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            marginBottom: 10,
          }}>
          <PrimaryButton
            buttonStyle={styles.button}
            title="SUBMIT"
            onPress={onSubmit}
          />
        </View>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};
const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  withdraw: {
    color: colors.white,
    marginTop: 10,
  },
  box: {
    borderWidth: 1,
    // borderColor: 'rgba(63, 139, 238, 0.3)',
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: colors.bottomBackgroundColor,
  },
  label: {
    fontSize: 12,
    color: colors.white,
    marginTop: 0,
    marginBottom: 5,
  },
  textInputBox: {
    fontFamily: fontFamilyPoppins,
    fontSize: 12,
    color:colors.white
  },
  topLogo:{
    width:120,
    height:199,
    alignSelf:"center",
    marginTop:20
  }
});
export default VerifyUPI;
