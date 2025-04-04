import {
  View,
  StatusBar,
  Alert,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../common/Header';
import {AppSafeAreaView} from '../common/AppSafeAreaView';
import {KeyBoardAware} from '../common/KeyboardAware';
import CommonImageBackground from '../common/commonImageBackground';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  ELEVEN,
  FORTEEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  TEN,
  THIRTEEN,
  GRY,
} from '../common/AppText';
import {useDispatch, useSelector} from 'react-redux';
import InputBox from '../common/InputBox';
import PrimaryButton from '../common/primaryButton';
import {
  BannerVerify,
  adhaarFront,
  adhaarback,
  calanderIcon,
  cameraIcon,
  checkAdhaar,
  gallaryIcon,
  plus,
  recommendedIcon,
  upload,
} from '../helper/image';
import FastImage from "@d11/react-native-fast-image";
import {universalPaddingHorizontal} from '../theme/dimens';
import ImagePicker from 'react-native-image-crop-picker';
import {TouchableOpacityView} from '../common/TouchableOpacityView';
import {SpinnerSecond} from '../common/SpinnerSecond';
import {appOperation} from '../appOperation';
// import {getAdharVerify} from '../slices/matchSlice';
import {
  checkValidAdharCardNumber,
  formatAadharNumber,
  toastAlert,
} from '../helper/utility';
import {fontFamilyPoppins, poppinsSemiBold} from '../theme/typography';
import {
  addharVerifiy,
  addharVerifiyOtp,
  getAdharVerify,
} from '../slices/matchSlice';
import Checkbox from '../common/CheckBox/CheckBox';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Screen} from 'react-native-screens';
import AdhaarOtp from '../common/AdhaarOtp';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import {NewColor, colors} from '../theme/color';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const VerifyAdhaarcard = () => {
  const dispatch = useDispatch();
  const RESEND_OTP_TIME_LIMIT = 600; // 10 minutes in seconds
  const autoSubmitOtpTimerIntervalCallbackReference = useRef();
  let resendOtpTimerInterval;
  const addharDetails = useSelector(state => state?.match?.addharDetails);
  const {request_id, task_id} = addharDetails ?? '';
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [dob, setDob] = useState('');
  const [state, setState] = useState('');
  const [panImage, setPanImage] = useState('');
  const [reason, setReason] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [imageDatattwo, setImageDatatwo] = useState('');
  const [forntImage, setForntImage] = useState(null);
  const [forntImageback, setForntImageback] = useState(null);
  const [saveType, setSaveType] = useState('');
  const [isVisable, setIsVisable] = useState(true);
  const [forSheet, setForSheet] = useState(false);
  const [numberCheck, setNumberCheck] = useState(false);
  const [isDatePickerVisible, serIsDatePickerVisible] = useState(false);
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );
  const [isTimerActive, setIsTimerActive] = useState(false);
  useEffect(() => {
    if (isTimerActive) {
      startResendOtpTimer();
    } else {
      clearInterval(resendOtpTimerInterval);
    }

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [isTimerActive, resendButtonDisabledTime]);
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        setIsTimerActive(false);
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const filterSheet = useRef();

  const data = [
    {value: 1, label: 'Delhi'},
    {value: 2, label: 'Jaipur'},
  ];
  const onChangeValue = value => {};
  const hideDatePicker = () => {
    serIsDatePickerVisible(false);
  };
  const handleConfirm = date => {
    setDob(moment(date).format('DD/MM/YYYY'));
    hideDatePicker();
  };

  const loading = useSelector(state => {
    return state.match.isLoading;
  });

  const sendOtp = () => {
    if (!checkValidAdharCardNumber(name.replace(/\s/g, ''))) {
      toastAlert.showToastError('Please enter vaild adhaar number');
    } else if (!dob) {
      toastAlert.showToastError('Please enter vaild DOB');
    } else {
      const data = {
        adhar_no: name.replace(/\s/g, ''),
      };
      dispatch(addharVerifiy(data, filterSheet, setIsTimerActive));
    }
  };
  const openPicker = async type => {
    ImagePicker.openCamera({
      width: 485,
      height: 485,
      cropping: true,
    }).then(image => {
      const data = {
        uri: image.path,
        name: image.modificationDate + '.' + image.mime.split('/')[1],
        type: image.mime,
      };
      if (!imageData) {
        setImageData(data);
      } else {
        setImageDatatwo(data);
      }
    });
  };
  const openGallery = () => {
    ImagePicker.openPicker({
      width: 485,
      height: 485,
      cropping: true,
    }).then(image => {
      const data = {
        uri: image.path,
        name: image.modificationDate + '.' + image.mime.split('/')[1],
        type: image.mime,
      };
      if (!imageData) {
        setImageData(data);
      } else {
        setImageDatatwo(data);
      }
    });
  };

  const uploadImage = async () => {
    try {
      const uploadData = new FormData();
      uploadData.append('file', imageData);
      const res = await appOperation.customer.uploadImg(uploadData);
      if (res?.code == 200) {
        if (saveType == 'back') {
          setForntImageback(res?.data);
        } else {
          setForntImage(res?.data);
        }
      }
    } catch (e) {
      console.log('error in upload', e);
    }
  };

  const onSubmit = () => {
    if (!checkValidAdharCardNumber(name.replace(/\s/g, ''))) {
      toastAlert.showToastError('Please enter vaild adhaar number');
    } else if (!dob) {
      toastAlert.showToastError('Please enter vaild DOB');
    } else if (!otp) {
      toastAlert.showToastError('Please enter vaild OTP');
    } else {
      let data = {
        request_id: request_id,
        otp: otp,
        task_id: task_id,
        adhar_no: name.replace(/\s/g, ''),
        dob: dob
          .split('/')
          .map(part => part.replace(/^0+/, ''))
          .join('/'),
      };
      dispatch(addharVerifiyOtp(data));
    }
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
          title="Aadhar Card Verification"
          style={{padding: universalPaddingHorizontal, marginTop: '10%'}}
        />
        <KeyBoardAware style={styles.bottomContainer}>
          <FastImage
            source={BannerVerify}
            resizeMode="stretch"
            style={styles.topBanner}
          />
          <View style={styles.box}>
            <View>
              <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                Enter your Aadhaar number
              </AppText>
              <FastImage
                source={recommendedIcon}
                resizeMode="contain"
                style={styles.recommended}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                allowFontScaling={false}
                placeholder={'Adhaar Number'}
                placeholderTextColor={NewColor.linerBlacklight}
                style={styles.inputStyle}
                value={formatAadharNumber(name)}
                onChangeText={value => setName(value)}
                maxLength={14}
                keyboardType={'decimal-pad'}
              />
              {checkValidAdharCardNumber(name?.replace(/\s/g, '')) ? (
                <FastImage
                  source={checkAdhaar}
                  resizeMode="contain"
                  style={styles.checkIcon}
                />
              ) : (
                <></>
              )}
            </View>
            <TouchableOpacityView
              onPress={() => serIsDatePickerVisible(true)}
              style={styles.inputContainer}>
              <AppText
                type={THIRTEEN}
                weight={POPPINS_SEMI_BOLD}
                color={dob ? GRY : BLACKOPACITY}>
                {dob ? dob : 'Date of birth'}
              </AppText>
              <FastImage
                source={calanderIcon}
                resizeMode="contain"
                style={styles.checkIcon}
              />
            </TouchableOpacityView>
            <View style={styles.inputContainer}>
              <TextInput
                allowFontScaling={false}
                placeholder={'Enter OTP'}
                placeholderTextColor={NewColor.linerBlacklight}
                style={styles.inputStyle}
                value={otp}
                onChangeText={value => setOtp(value)}
                maxLength={6}
                keyboardType={'decimal-pad'}
              />
              {isTimerActive ? (
                <AppText weight={POPPINS_SEMI_BOLD} type={THIRTEEN}>
                  {formatTime(resendButtonDisabledTime)}
                </AppText>
              ) : (
                <PrimaryButton
                  type={ELEVEN}
                  smallBtn={{height: 21, borderRadius: 5}}
                  buttonStyle={[
                    styles.buttonStyle,
                    {marginTop: Platform.OS == 'ios' ? -5 : 0},
                  ]}
                  title="Send OTP"
                  onPress={() => sendOtp()}
                />
              )}
            </View>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={moment().subtract(18, 'years').toDate()}
          />

          <View style={styles.commonFlow}>
            <Checkbox value={isVisable} />
            <AppText style={styles.commonText} weight={POPPINS_MEDIUM}>
              {` User must be 18 years of age or above to play\n pay-to-play contest on MyBattle11`}
            </AppText>
          </View>
          <View style={styles.commonFlow}>
            <Checkbox value={isVisable} />
            <AppText style={styles.commonText} weight={POPPINS_MEDIUM}>
              {`Users must not be residing in restricted states. To know\n more, read Terms & conditions.`}
            </AppText>
          </View>
          <View style={styles.commonFlow}>
            <Checkbox value={isVisable} />
            <AppText style={styles.commonText} weight={POPPINS_MEDIUM}>
              I
              {`hereby confirm that my attached documents are \ncredible and binding`}
            </AppText>
          </View>
        </KeyBoardAware>
        <View style={{paddingHorizontal: universalPaddingHorizontal}}>
          <PrimaryButton
            buttonStyle={styles.button}
            title="SUBMIT"
            onPress={onSubmit}
          />
        </View>
      </CommonImageBackground>
      <SpinnerSecond loading={loading} />
    </AppSafeAreaView>
  );
};

export default VerifyAdhaarcard;
const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  wallet: {
    // color: colors.code,
    marginTop: 15,
  },

  box: {
    borderWidth: 1,
    borderColor: '#002E610F',
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: 'rgba(61, 137, 236, 1)',
    marginTop: 0,
    marginBottom: 5,
  },
  label1: {
    color: 'red',
  },
  textInputBox: {
    fontFamily: fontFamilyPoppins,
    fontSize: 12,
  },
  boxContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
  },
  upload: {
    color: 'black',
    marginTop: 10,
  },
  image: {
    height: 34,
    width: 34,
    alignSelf: 'center',
    marginTop: 50,
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: 'rgba(63, 139, 238, 0.3)',
    borderRadius: 8,
    marginTop: 10,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  commonFlow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonText: {
    marginTop: 8,
    marginLeft: 10,
  },
  topBanner: {
    height: 90,
    width: '100%',
    marginTop: 20,
  },
  gallaryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#002E612B',
    marginTop: 20,
  },
  flexBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadBox: {
    borderRadius: 10,
    width: '48%',
    height: 98,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#002E610F',
    borderWidth: 1,
  },
  uploadBackBox: {
    borderRadius: 10,
    width: '48%',
    height: 98,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#002E610F',
    borderWidth: 1,
  },
  innerBox: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  plusIcon: {
    height: 20,
    width: 20,
  },
  openGallaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#002E610F',
    height: 40,
    marginTop: 15,
  },
  cameraIconStyle: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  recommended: {
    width: 82,
    height: 19,
    position: 'absolute',
    right: -12,
    top: 3,
  },
  inputStyle: {
    fontSize: 13,
    fontFamily: poppinsSemiBold,
    flex: 1,
    color: colors.gray,
  },
  inputContainer: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#002E6112',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkIcon: {
    height: 20,
    width: 20,
  },
  buttonStyle: {
    marginHorizontal: 5,
    marginBottom: 5,
    width: 66,
    height: 21,
  },
  adhaarIcon: {
    width: 170,
    height: 80,
    borderRadius: 10,
  },
});
