import {View, StatusBar, TextInput} from 'react-native';
import React, {useState, useRef} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  ELEVEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  THIRTEEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import styles from './styles';
import InputBox from '../../common/InputBox';
import FastImage from "@d11/react-native-fast-image";
import {
  horizontalLine,
  cross,
  BannerLoop,
  rightArrow,
  closeIcon,
} from '../../helper/image';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import {useDispatch, useSelector} from 'react-redux';
import PrimaryButton from '../../common/primaryButton';
import {universalPaddingHorizontal} from '../../theme/dimens';
import {fixedToTwo, toastAlert} from '../../helper/utility';
import {NewColor, colors} from '../../theme/color';
import NavigationService from '../../navigation/NavigationService';
import {
  ADDCASH_VERIFICATION,
  PAYMENT_SCREEN,
  UPLOAD_AADHAR,
} from '../../navigation/routes';
import RBSheet from 'react-native-raw-bottom-sheet';
import PhonePePaymentSDK from 'react-native-phonepe-pg';

const AddMoney = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(Number);
  const [hash, setHash] = useState('');
  const [message, setMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [upiApps, setUpiApps] = useState('');
  const rbsheet = useRef();
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const kycDetails = useSelector(state => {
    return state.profile.kycDetails;
  });
  const {totaldeposit} = userData ?? '';
  const data = [
    {id: '1', rupay: '100'},
    {id: '2', rupay: '250'},
    {id: '3', rupay: '500'},
    {id: '4', rupay: '1000'},
  ];

  const bannerData = [
    {
      id: '1',
      image: BannerLoop,
    },
    {
      id: '2',
      image: BannerLoop,
    },
    {
      id: '3',
      image: BannerLoop,
    },
  ];
  const isUserVerified =
    kycDetails?.dl_verified == 1 ||
    kycDetails?.voter_verified == 1 ||
    kycDetails?.adhar_verified == 1;
  const isUserVerifiedPanding = kycDetails?.adhar_verified == 2;

  PhonePePaymentSDK.getUpiAppsForAndroid()
    .then(upiApps => {
      if (upiApps != null) setUpiApps(JSON.stringify(JSON.parse(upiApps)));
    })
    .catch(error => {
      setUpiApps('error:' + error.message);
    });
  const AddMoney = () => {
    if (!isUserVerified) {
      if (isUserVerifiedPanding) {
        toastAlert.showToastError('Your aadhaar verification is panding');
      } else {
        // NavigationService.navigate(UPLOAD_AADHAR);
        NavigationService.navigate(ADDCASH_VERIFICATION);
      }
    } else if (amount == '') {
      toastAlert.showToastError('Please enter amount');
    } else if (amount.charAt(0) === '0') {
      toastAlert.showToastError('Please enter vaild amount');
    }
    else if (amount <= 99) {
      toastAlert.showToastError('Please enter amount minimum 100')
    }
    else if (upiApps?.length == 0) {
      toastAlert.showToastError("You don't have any kind of UPI App");
    } else {
      let data = {
        amount: amount,
        type: '',
        targetapp: '',
      };
      NavigationService.navigate(PAYMENT_SCREEN, {data: data});
    }
  };

  let tdsamount = parseFloat((amount / 128) * 28).toFixed(2);
  let amounttoadd = amount - tdsamount;
  let dividTwo = tdsamount / 2;
  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <KeyBoardAware>
        <CommonImageBackground common>
          <Header
            style={{
              marginTop: '12%',
            }}
            commonHeader
            title="Add Money"
          />
          <View style={styles.bottomContainer}>
            <View style={styles.box}>
              <View style={styles.mobileContainer}>
                <View>
                  <AppText type={TWELVE} color={WHITE}>
                    Available Balance
                  </AppText>
                </View>

                <View>
                  <AppText type={TWELVE} color={WHITE}>
                    INR {fixedToTwo(totaldeposit)}
                  </AppText>
                </View>
              </View>
              <FastImage
                style={styles.horizontalLine}
                source={horizontalLine}
                tintColor={'#BEBEBE'}
              />
            </View>
            {/* <BannerSlider bannerData={bannerData} /> */}
            <View style={[styles.box]}>
              <AppText color={WHITE} type={TWELVE}>
                Add cash to your account
              </AppText>
              <View style={{flexDirection: 'row'}}>
                <InputBox
                  placeholder="Enter amount"
                  style={{flex: 1, marginTop: 10}}
                  textInputBox={styles.textInputBox}
                  onChange={value => setAmount(value)}
                  closeImage={true}
                  value={amount}
                  onPressClose={() => setAmount('')}
                  keyboardType={'number-pad'}
                  // textInputStyle={styles.text}
                  placeholderTextColor={colors.white}
                />
                <FastImage
                  style={{
                    height: 8,
                    width: 8,
                    alignSelf: 'center',
                    right: 20,
                    top: 4,
                  }}
                  resizeMode="contain"
                  source={cross}
                  tintColor={colors.white}
                />
              </View>
              <View style={styles.buttonContainer}>
                {data?.map(item => {
                  return (
                    <TouchableOpacityView
                      onPress={() => setAmount(item.rupay)}
                      style={styles.rsContainer}>
                      <AppText
                        color={WHITE}
                        weight={POPPINS_MEDIUM}
                        type={TWELVE}
                        style={styles.rs}>
                        + INR {item.rupay}
                      </AppText>
                    </TouchableOpacityView>
                  );
                })}
              </View>
              {amount ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <AppText type={TWELVE} color={WHITE}>
                      Amount to be added in wallet
                    </AppText>
                    <AppText>
                      +INR {parseFloat(amounttoadd)?.toFixed(2)}
                    </AppText>
                  </View>
                  {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, justifyContent: "space-between" }} >
                    <AppText type={TWELVE} color={WHITE}>
                      SGST[14%]
                    </AppText>
                    <AppText>
                      INR {parseFloat(dividTwo)?.toFixed(2)}
                    </AppText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, justifyContent: "space-between" }} >
                    <AppText type={TWELVE} color={WHITE}>
                      CGST[14%]
                    </AppText>
                    <AppText>
                      INR {parseFloat(dividTwo)?.toFixed(2)}
                    </AppText>
                  </View> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <AppText type={TWELVE} color={WHITE}>
                      Total GST[28%]
                    </AppText>
                    <AppText>-INR {parseFloat(tdsamount)?.toFixed(2)}</AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <AppText type={TWELVE} color={WHITE}>
                      Deposit Bonus
                    </AppText>
                    <AppText>+INR {parseFloat(tdsamount)?.toFixed(2)}</AppText>
                  </View>
                  <View
                    style={{
                      height: 1,
                      borderWidth: 1,
                      borderColor: '#BEBEBE',
                      marginTop: 5,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <AppText type={TWELVE} color={WHITE}>
                      Total Amount
                    </AppText>
                    <AppText>+INR {parseFloat(amount)?.toFixed(2)}</AppText>
                  </View>
                </>
              ) : (
                <></>
              )}
              <TouchableOpacityView
                onPress={() => rbsheet?.current?.open()}
                style={styles.voucherConatiner}>
                <AppText>Apply Voucher</AppText>
                <FastImage
                  source={rightArrow}
                  resizeMode="contain"
                  style={{
                    height: 15,
                    width: 15,
                  }}
                />
              </TouchableOpacityView>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: universalPaddingHorizontal,
              marginBottom: 15,
            }}>
            <PrimaryButton
              buttonStyle={styles.buttonStyle}
              onPress={AddMoney}
              title="Add Money"
            />
          </View>
        </CommonImageBackground>
      </KeyBoardAware>
      <RBSheet
        ref={rbsheet}
        closeOnDragDown={false}
        openDuration={100}
        height={150}
        customStyles={{
          container: {
            backgroundColor: colors.bottomBackgroundColor,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
            display: 'none',
          },
        }}>
        <View style={styles.bottomRbContainer}>
          <TouchableOpacityView
            onPress={() => rbsheet?.current?.close()}
            style={styles.innerContainer}>
            <AppText type={SIXTEEN} weight={POPPINS_SEMI_BOLD}>
              Apply Voucher
            </AppText>
            <FastImage
              source={closeIcon}
              tintColor={colors.white}
              resizeMode="contain"
              style={{height: 15, width: 15}}
            />
          </TouchableOpacityView>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter coupon code"
              onChangeText={setCouponCode}
              value={couponCode}
              placeholderTextColor={colors.white}
              style={styles.textStyle}
            />
            <View style={styles.buttonApply}>
              <AppText type={ELEVEN} weight={POPPINS_SEMI_BOLD}>
                APPLY
              </AppText>
            </View>
          </View>
        </View>
      </RBSheet>
    </AppSafeAreaView>
  );
};

export default AddMoney;
