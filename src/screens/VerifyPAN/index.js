import { View, StatusBar, Platform, TextInput, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import Header from '../../common/Header';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { KeyBoardAware } from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  FORTEEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RED,
  SEMI_BOLD,
  THIRTEEN,
  WHITE,
} from '../../common/AppText';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import PrimaryButton from '../../common/primaryButton';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { checkValidPanCardNumber, toastAlert } from '../../helper/utility';
import { NewColor, colors } from '../../theme/color';
import { panVerifiy } from '../../slices/matchSlice';
import { SpinnerSecond } from '../../common/SpinnerSecond';
import { calanderIcon, cameraIcon, gallaryIcon, panIconUpload, recommendedIcon, upload } from '../../helper/image';
import FastImage from "@d11/react-native-fast-image";
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { appOperation } from '../../appOperation';
import { poppinsSemiBold } from '../../theme/typography';
import RBSheet from 'react-native-raw-bottom-sheet';
import { updateKyc } from '../../actions/profileAction';
const VerifyPAN = () => {
  const selectPicker = useRef();
  const dispatch = useDispatch();
  const loading = useSelector(state => {
    return state.match.isLoading;
  });
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [imageData, setImageData] = useState(null);
  const [imageDatattwo, setImageDatatwo] = useState('');
  const [isDatePickerVisible, serIsDatePickerVisible] = useState(false);
  const [dob, setDob] = useState('');
  const [imageUrl, setImageUrl] = useState(null)
  const [state, setState] = useState('')
  const hideDatePicker = () => {
    serIsDatePickerVisible(false);
  };
  const handleConfirm = date => {
    setDob(moment(date).format('DD-MM-YYYY'));
    hideDatePicker();
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
  const onSubmit = () => {
    if (!name) {
      toastAlert.showToastError('Please Enter Your Name');
    } else if (!checkValidPanCardNumber(pan)) {
      toastAlert.showToastError('Please Enter Vaild Pan Number');
    }
    // } else if (!dob) {
    //   toastAlert.showToastError('Please Enter Your DOB')
    // }
    // else if (!imageUrl) {
    //   toastAlert.showToastError('Please Upload Pan Image')
    // } else if (!state) {
    //   toastAlert.showToastError('Please enter your state')
    // }
    else {
      const data = {
        // type: 'pan',
          name: name?.toLocaleUpperCase(),
          PanNumber: pan?.toLocaleUpperCase(),
          // dob: dob,
          // state: state,
        // file: imageUrl,
      };
      dispatch(panVerifiy(data));
    }
  };
  const nameWithoutspace = name.trimLeft();
  const trailingTrimmedName = nameWithoutspace.trimRight();
  const uploadImage = async () => {
    try {
      const uploadData = new FormData();
      uploadData.append('file', imageData);
      const res = await appOperation.customer.uploadImg(uploadData);
      if (res?.code == 200) {
        setImageUrl(res?.data);
      }
    } catch (e) {
    }
  };
  React.useEffect(() => {
    if (imageData) {
      uploadImage();
    }
  }, [imageData]);


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
          commonHeader
          title="Verify PAN Card"
        />
        <KeyBoardAware style={styles.bottomContainer}>

          <View style={styles.box}>
            <View>
              <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                Enter your Pan number
              </AppText>
              <FastImage source={recommendedIcon} resizeMode='contain' style={styles.recommended} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                allowFontScaling={false}
                placeholder={'Pan Number'}
                placeholderTextColor={colors.white}
                style={styles.inputStyle}
                value={pan?.toLocaleUpperCase()}
                onChangeText={(value) => setPan(value)}
                maxLength={12}
              />
              {checkValidPanCardNumber(name) ?
                <FastImage source={checkAdhaar} resizeMode='contain' style={styles.checkIcon} />
                : <></>}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                allowFontScaling={false}
                placeholder={'Pan Card Holder Name '}
                placeholderTextColor={colors.white}
                style={styles.inputStyle}
                value={name?.toLocaleUpperCase()}
                onChangeText={(value) => setName(value)}
              />
              
            </View>
            {/* <View style={styles.inputContainer}>
              <TextInput
                allowFontScaling={false}
                placeholder={'State'}
                placeholderTextColor={colors.white}
                style={styles.inputStyle}
                value={state}
                onChangeText={(value) => setState(value)}
              />
            </View> */}
            {/* <TouchableOpacityView
              onPress={() => serIsDatePickerVisible(true)}
              style={styles.inputContainer}>
              <AppText type={THIRTEEN} weight={POPPINS_SEMI_BOLD} color={dob ? WHITE : WHITE}>
                {dob ? dob : 'Date of birth'}
              </AppText>
              <FastImage source={calanderIcon} resizeMode='contain' style={styles.checkIcon} tintColor={colors.white} />
            </TouchableOpacityView> */}
          </View>
          {/* <AppText type={THIRTEEN} color={WHITE} weight={SEMI_BOLD}>
            Upload your PAN Card
          </AppText>
          <TouchableOpacityView
            style={styles.uploadContainer}
            onPress={() => selectPicker?.current?.open()}>
            <FastImage
              style={imageData?.uri ? styles.image2 : styles.image}
              resizeMode="contain"
              source={imageData?.uri ? { uri: imageData?.uri } : upload}
            />
          </TouchableOpacityView> */}
          <RBSheet
            ref={selectPicker}
            closeOnPressBack={true}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={80}
            customStyles={{
              container: {
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                backgroundColor: 'white',
                backgroundColor: 'white',
                paddingVertical: 20,
                paddingHorizontal: universalPaddingHorizontal
              },
              draggableIcon: {
                backgroundColor: 'transparent',
                display: 'none',
              },
            }}>
            <View style={styles.rbContainer}>
              <TouchableOpacityView onPress={() => openGallery()} style={styles.openGallary}>
                <FastImage source={gallaryIcon} resizeMode='contain' style={styles.cameraIconStyle} />
                <AppText style={{ marginTop: 3 }} color={BLACK} weight={POPPINS_SEMI_BOLD}>
                  Use gallery
                </AppText>
              </TouchableOpacityView>
              <TouchableOpacityView onPress={() => openPicker()} style={styles.openGallary}>
                <FastImage source={cameraIcon} resizeMode='contain' style={styles.cameraIconStyle} />
                <AppText style={{ marginTop: 3 }} color={BLACK} weight={POPPINS_SEMI_BOLD}>
                  Use camera
                </AppText>
              </TouchableOpacityView>
            </View>
          </RBSheet>
        </KeyBoardAware>
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            marginBottom: Platform.OS == 'ios' ? 20 : 0
          }}>
          <PrimaryButton
            onPress={onSubmit}
            buttonStyle={styles.button}
            title="SUBMIT"
          />
        </View>
      </CommonImageBackground>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={moment().subtract(18, 'years').toDate()}
      />
      <SpinnerSecond loading={loading} />
    </AppSafeAreaView>
  );
};

export default VerifyPAN;

const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  box: {
    borderWidth: 1,
    borderColor: "#002E610F",
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 20,
    backgroundColor: colors.bottomBackgroundColor
  },
  recommended: {
    width: 82,
    height: 19,
    position: "absolute",
    right: -12,
    top: 3
  },
  inputContainer: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#BEBEBE",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
  inputStyle: {
    fontSize: 13,
    fontFamily: poppinsSemiBold,
    flex: 1,
    color: colors.white
  },
  checkIcon: {
    height: 20,
    width: 20
  },
  button: {
    marginTop: 30,
    marginBottom: 10
  },
  openGallary: {
    height: 40,
    width: "48%",
    borderWidth: 1,
    borderColor: 'rgba(63, 139, 238, 0.3)',
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  cameraIconStyle: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: 'rgba(63, 139, 238, 0.3)',
    borderRadius: 8,
    marginTop: 10,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.4)"
  },
  image: {
    height: 34,
    width: 34,
    alignSelf: 'center',
    marginTop: 50,
  },
  image2: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  rbContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
});

