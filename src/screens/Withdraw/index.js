import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  BLACKOPACITY,
  ELEVEN,
  FORTEEN,
  LIGHTBLUE,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RUSSO,
  SEMI_BOLD,
  SIXTEEN,
  TEN,
  THIRTEEN,
  THIRTY,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import InputBox from '../../common/InputBox';
import SecondaryButton from '../../common/secondaryButton';
import {PrivateValueStore, useIsFocused} from '@react-navigation/native';
import PrimaryButton from '../../common/primaryButton';
import DropdownComponent from '../../common/Dropdown';
import {bankIcon, deleteIcon, icici, upiIcon} from '../../helper/image';
import FastImage from 'react-native-fast-image';
import {BASE_URL, IMAGE_BASE_URL, toastAlert} from '../../helper/utility';
import {NewColor, colors} from '../../theme/color';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import NavigationService from '../../navigation/NavigationService';
import {
  CREATE_CONTEST,
  MY_BALANCE,
  VERIFY_BANK_SCREEN,
  VERIFY_UPI,
} from '../../navigation/routes';
import {
  deleteAccount,
  deleteupi,
  matchSlice,
  payoutWithdraw,
} from '../../slices/matchSlice';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_TOKEN_KEY} from '../../libs/constants';

const Withdraw = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const kycDetails = useSelector(state => {
    return state.profile.kycDetails;
  });
  const [userToken, setUserToken] = useState('');
  const loadingKyc = useSelector(state => state?.match?.isLoading);
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
      console.log(token, '==token');
      setUserToken(token);
    } catch (e) {}
  };
  const {winning_amount} = userData ?? '';
  const {bank_details} = kycDetails ?? '';
  const {upi_details} = kycDetails ?? '';
  const {AccountNumber, bank_name, Bankimagepath} = bank_details ?? '';
  const [amount, setAmount] = useState();
  const [condition, setCondition] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [select, setSelect] = useState('1');
  const [bankData, setBankData] = useState(null);
  const [tdsAmount, setTdsAmount] = useState(0);
  const [withdrawAmount, setWithdrawAount] = useState(0);
  const onSubmit = () => {
    if (winning_amount == 0) {
      toastAlert.showToastError(
        'Since your current winnings are at 0, why not join the contest and strive to win',
      );
    } else if (amount <= 99) {
      toastAlert.showToastError('Withdraw amount minimum is 100');
    } else if (condition) {
      toastAlert.showToastError(
        ' You can not withdraw more then your winning amount',
      );
    } else if (!userData?.canWithdraw) {
      toastAlert.showToastError(
        ' You can not withdraw until your previous withraw request in process ',
      );
    } else {
      const data = {
        amountowithdraw: Number(amount),
      };
      dispatch(payoutWithdraw(data));
    }
  };

  const handleTdsAmount = () => {
    if (userData.tdsless === 0) {
      setTdsAmount(parseFloat((amount * 0.3))?.toFixed(2));
      setWithdrawAount(amount - parseFloat((amount  * 0.3))?.toFixed(2));
    } else {
      setTdsAmount(parseFloat(((amount - userData.tdsless) * 0.3))?.toFixed(2));
      setWithdrawAount(amount - parseFloat(( (amount - userData.tdsless) * 0.3))?.toFixed(2));
    }
  };
  // const tdsAmount = amount > 1000 ? amount - 1000 : 0.0;
  // let tdsamountTwo = parseFloat((tdsAmount / 100) * 30).toFixed(2);
  // let taxamount = 0;
  // let tdsamount = 0;
  // let netwiningtds =
  //   userData.total_withdrawl +
  //   Number(amount) -
  //   (userData.totaldeposit + userData.tdsamount);
  // if (netwiningtds <= 0) {
  //   taxamount = Number(amount);
  // } else {
  //   tdsamount = netwiningtds * 0.3;
  //   taxamount = Number(amount) - tdsamount;
  // }
  // if (netwiningtds < 0) {
  //   netwiningtds = 0;
  // }

  useEffect(() => {
    handleTdsAmount();
  }, [amount, setAmount]);
  useEffect(() => {
    if (amount > winning_amount) {
      setCondition(true);
    } else {
      setCondition(false);
    }
  }, [amount]);
  const onDelete = () => {
    if (bank_details !== null) {
      setIsModalVisible(false);
      dispatch(deleteAccount());
      NavigationService.navigate(MY_BALANCE);
    } else {
      setIsModalVisible(false);
      dispatch(deleteupi());
      NavigationService.navigate(MY_BALANCE);
    }
  };
  const isFocus = useIsFocused();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/bankDetails`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      setBankData(json?.data);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching data:', error);
    } finally {
    }
  }, [userToken]);

  useEffect(() => {
    if (isFocus) {
      fetchData();
    }
  }, [isFocus, fetchData]);

  console.log(amount, "amount");

  return (
    <AppSafeAreaView>
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
            title="Withdraw"
          />
          <View style={styles.bottomContainer}>
            <View style={styles.topContainer}>
              <AppText
                type={THIRTEEN}
                weight={POPPINS_SEMI_BOLD}
                color={WHITE}
                style={{marginTop: 20}}>
                Your winnings
              </AppText>
              <AppText
                type={TWELVE}
                weight={POPPINS_SEMI_BOLD}
                color={WHITE}
                style={{marginTop: 20}}>
                INR {winning_amount?.toFixed(2)}
              </AppText>
            </View>
            <View style={styles.box}>
              <View style={styles.bottomBoxContainer}>
                <AppText type={ELEVEN} weight={POPPINS_SEMI_BOLD} color={WHITE}>
                  Amount
                </AppText>
                <InputBox
                  textInputBox={styles.textInputBox}
                  placeholder="Enter your amount"
                  placeholderTextColor={'white'}
                  value={amount}
                  onChange={value => setAmount(value)}
                  keyboardType={'numeric'}
                />
                {winning_amount == 0 ? (
                  <AppText
                    style={{marginTop: 10}}
                    type={TEN}
                    weight={POPPINS_SEMI_BOLD}
                    color={WHITE}>
                    Since your current winnings are at 0, why not join the
                    contest and strive to win
                  </AppText>
                ) : condition ? (
                  <AppText
                    style={{marginTop: 10}}
                    type={TEN}
                    weight={POPPINS_SEMI_BOLD}
                    color={WHITE}>
                    You cannot withdraw more than your winning amount
                  </AppText>
                ) : userData?.tdsless == 0 || userData?.tdsless == undefined ? (
                  <></>
                ) : (
                  <AppText
                    style={{marginTop: 10}}
                    type={TEN}
                    weight={POPPINS_SEMI_BOLD}
                    color={WHITE}>
                    You can withdraw upto {Number(userData?.tdsless).toFixed(0)}{' '}
                    without any TDS
                  </AppText>
                )}
              </View>
            </View>
            <AppText
              style={{marginTop: 20}}
              type={FORTEEN}
              weight={POPPINS_MEDIUM}>
              Choose withdrawal option
            </AppText>
            <View style={stylesTwo.newContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <AppText>Withdraw Amount</AppText>
                <AppText>
                  {amount ? !withdrawAmount ? 0 : Math.abs(withdrawAmount) : 0}
                  {/* {tdsamount ? Number(amount - tdsamount).toFixed(2) : 0} */}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <AppText>TDS (30%)</AppText>
                <AppText>
                  {amount ? tdsAmount === 'NaN' ? 0 : Math.abs(tdsAmount) : 0}
                  {/* {tdsamount ? Number(tdsamount).toFixed(2) : 0} */}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <AppText>Total Amount</AppText>
                <AppText>{amount ? Number(amount).toFixed(2) : 0}</AppText>
              </View>
            </View>
            <TouchableOpacityView
              // onPress={() => {
              //   bank_details ?
              //     setSelect(1) :
              //     NavigationService.navigate(VERIFY_BANK_SCREEN)
              // }}
              style={styles.boxTwo}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={stylesTwo.bankContainer}>
                  <FastImage
                    source={bankIcon}
                    resizeMode="contain"
                    style={{height: 20, width: 20}}
                    tintColor={colors.white}
                  />
                </View>
                <View style={{marginLeft: 10}}>
                  <AppText color={WHITE} weight={POPPINS_MEDIUM}>
                    {bank_name}
                  </AppText>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <AppText
                      weight={POPPINS_MEDIUM}
                      color={WHITE}
                      type={TWELVE}
                      style={styles.rightText(colors)}>
                      A/C:{'  '}
                    </AppText>
                    <AppText
                      weight={POPPINS_SEMI_BOLD}
                      type={TWELVE}
                      style={styles.rightText(colors)}>
                      {AccountNumber}
                    </AppText>
                  </View>
                </View>
              </View>
              <View style={styles.tickContainer}>
                {select == 1 ? <View style={styles.tick} /> : <></>}
              </View>
            </TouchableOpacityView>

            <TouchableOpacityView
              style={{
                backgroundColor: colors.bottomBackgroundColor,
                borderRadius: 16,
                paddingVertical: 5,
                paddingHorizontal: 5,
                borderWidth: 2,
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  padding: 5,
                  alignItems: 'center',
                }}>
                <View style={{width: '50%'}}>
                  <AppText>Bank Name</AppText>
                </View>
                <View style={{width: '45%', alignItems: 'flex-end'}}>
                  <AppText>{bankData?.bank_name}</AppText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  padding: 5,
                  alignItems: 'center',
                }}>
                <View style={{width: '50%'}}>
                  <AppText>Bank account number</AppText>
                </View>
                <View style={{width: '45%', alignItems: 'flex-end'}}>
                  <AppText>{bankData?.account_number}</AppText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  padding: 5,
                  alignItems: 'center',
                }}>
                <View style={{width: '50%'}}>
                  <AppText>IFSC code</AppText>
                </View>
                <View style={{width: '45%', alignItems: 'flex-end'}}>
                  <AppText>{bankData?.ifsc}</AppText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  padding: 5,
                  alignItems: 'center',
                }}>
                <View style={{width: '50%'}}>
                  <AppText>Branch Name</AppText>
                </View>
                <View style={{width: '45%', alignItems: 'flex-end'}}>
                  <AppText>{bankData?.branch_name}</AppText>
                </View>
              </View>
            </TouchableOpacityView>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}>
            <PrimaryButton onPress={onSubmit} title="WITHDRAWL" />
          </View>
        </CommonImageBackground>
      </KeyBoardAware>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}>
        <View style={stylesTwo.centeredView}>
          <View style={stylesTwo.modalContainer}>
            <AppText
              style={{marginTop: 10}}
              type={SIXTEEN}
              weight={POPPINS_SEMI_BOLD}>
              MyBattle11
            </AppText>
            <AppText
              style={{marginTop: 10}}
              type={FORTEEN}
              weight={POPPINS_SEMI_BOLD}
              color={BLACKOPACITY}>
              Are sure you want to delete your account details?
            </AppText>
            <View
              style={[
                stylesTwo.buttonContainer,
                {marginVertical: Platform.OS == 'ios' ? 20 : 0},
              ]}>
              <SecondaryButton
                onPress={onDelete}
                buttonStyle={[
                  stylesTwo.buttonStyle,
                  {
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: colors.brownYellow,
                  },
                ]}
                title={'YES'}
                titleStyle={{color: colors.black, marginTop: -5}}
                btnStyle={{
                  backgroundColor: NewColor.linerWhite,
                  borderWidth: 2,
                  height: 45,
                  borderRadius: 10,
                }}
              />
              <PrimaryButton
                buttonStyle={[
                  stylesTwo.buttonStyle,
                  {marginTop: Platform.OS == 'ios' ? -5 : 0},
                ]}
                onPress={() => setIsModalVisible(false)}
                title="NO"
              />
            </View>
          </View>
        </View>
      </Modal>
      <SpinnerSecond loading={loadingKyc} />
    </AppSafeAreaView>
  );
};

export default Withdraw;
const stylesTwo = StyleSheet.create({
  minnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  deleteAccountContainer: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    borderColor: colors.borderLightBlue,
  },
  deleteicon: {
    height: 15,
    width: 15,
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NewColor.linerBlacklight,
  },
  modalContainer: {
    width: Dimensions.get('window').width - 20,
    backgroundColor: NewColor.linerWhite,
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
    marginTop: 20,
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
  },
  bankContainer: {
    height: 42,
    width: 42,
    borderRadius: 10,
    backgroundColor: '#1E94F110',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newContainer: {
    borderColor: NewColor.linerBlackFive,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
});
