import { View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../../common/Header';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { KeyBoardAware } from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import { AppText, BLACK, BLACKOPACITY, FORTEEN, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, RED, SEMI_BOLD } from '../../common/AppText';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import PrimaryButton from '../../common/primaryButton';
import DropdownComponent from '../../common/Dropdown';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { RootState } from '../../libs/rootReducer';
import { ifsclNumber, toastAlert } from '../../helper/utility';
import { updateKyc } from '../../actions/profileAction';
import { StatusBar } from 'native-base';
import FastImage from "@d11/react-native-fast-image";
import { bank, cameraIcon, gallaryIcon, upload } from '../../helper/image';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import ImagePicker from 'react-native-image-crop-picker';
import { appOperation } from '../../appOperation';
import { bankVerifiy, ifscVerifiy } from '../../slices/matchSlice';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SpinnerSecond } from '../../common/SpinnerSecond';

const VerifyBank = () => {
  const selectPicker = useRef();
  const dispatch = useDispatch();
  const loading = useSelector(state => {
    return state.match.isLoading;
  });
  const ifscDetails = useSelector(state => state?.match?.ifscDetails);
  const { bank: bankName, branch: branchName } = ifscDetails ?? "";
  const [accountNo, setAccountNo] = useState('');
  const [accountNoRe, setAccountNoRe] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [isbank, setBank] = useState('');
  const [branch, setBranch] = useState('');
  const [state, setState] = useState('');
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageDatattwo, setImageDatatwo] = useState('');
  useEffect(() => {
    setBank(bankName ? bankName : '');
    setBranch(branchName ? branchName : '');
  }, [ifscDetails])
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  const onSubmit = () => {
    if (!accountNo) {
      toastAlert.showToastError('Please enter your account number')
    } else if (accountNoRe != accountNo) {
      toastAlert.showToastError('Please check confirm account number')
    } else if (!ifsclNumber(ifsc)) {
      toastAlert.showToastError('Please enter vaild ifsc code')
    } else if (!isbank) {
      toastAlert.showToastError('Please enter bank name')
    } else if (!branch) {
      toastAlert.showToastError('Please enter branch name')
    } 
    else {
      const data = {
          account_number: accountNo,
          ifsc_code: ifsc,
          bank_name: isbank,
          branch_name: branch,
          name: state
      }
      console.log(JSON.stringify(data));
      dispatch(bankVerifiy(data));
    }
  };
  const formatUserName = (textValue) => {
    setIfsc(textValue);
  }
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
  useEffect(() => {
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
          commonHeader
          title="Verify Bank Account"
          style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
        />
        <KeyBoardAware style={styles.bottomContainer}>
          <AppText type={FORTEEN} style={[styles.withdraw, { marginLeft: 2 }]}>
            Enter Your Bank Details
          </AppText>
          <View style={styles.box}>
            <InputBox
              placeholder="Enter Your Name"
              value={state}
              placeholderTextColor={colors.white}
              labelStyle={[styles.label, { marginTop: 15 }]}
              label="Name"
              returnKeyType="next"
              onChange={value => setState(value)}
              textInputBox={styles.textInputBox}
            />
            <AppText color={RED} style={{marginTop: 5}}>Please give correct name as per PAN*</AppText>
            <InputBox
              placeholder="Enter your account number"
              value={accountNo}
              placeholderTextColor={colors.white}
              labelStyle={styles.label}
              label="Account Number"
              returnKeyType="next"
              onChange={value => setAccountNo(value)}
              textInputBox={styles.textInputBox}
              keyboardType={'decimal-pad'}
              maxLength={17}
            />
            <InputBox
              placeholder="Confirm account number"
              value={accountNoRe}
              placeholderTextColor={colors.white}
              labelStyle={styles.label}
              label="Confirm Account Number"
              returnKeyType="next"
              onChange={value => setAccountNoRe(value)}
              textInputBox={styles.textInputBox}
              keyboardType={'decimal-pad'}
              maxLength={17}
            />
            <InputBox
              placeholder="Enter 11 digit IFSC code"
              value={ifsc}
              placeholderTextColor={colors.white}
              labelStyle={[styles.label, { marginTop: 15 }]}
              label="IFSC Code"
              returnKeyType="next"
              onChange={value => formatUserName(value)}
              textInputBox={styles.textInputBox}
              maxLength={11}
            />

            <InputBox
              placeholder="Enter your bank name"
              value={isbank}
              placeholderTextColor={colors.white}
              labelStyle={[styles.label, { marginTop: 15 }]}
              label="Bank Name"
              returnKeyType="next"
              onChange={value => setBank(value)}
              textInputBox={styles.textInputBox}
            />
            <InputBox
              placeholder="Your branch name"
              value={branch}
              placeholderTextColor={colors.white}
              labelStyle={[styles.label, { marginTop: 15 }]}
              label="Branch Name"
              returnKeyType="next"
              onChange={value => setBranch(value)}
              textInputBox={styles.textInputBox}
            />
            
          </View>
          {/* <AppText type={FORTEEN} weight={SEMI_BOLD} style={{ marginTop: 10 }}>
            Upload bank statement
          </AppText> */}
          {/* <TouchableOpacityView
            style={styles.uploadContainer}
            onPress={() => selectPicker?.current?.open()}>
            <FastImage
              style={imageData?.uri ? styles.image2 : styles.image}
              resizeMode="contain"
              source={imageData?.uri ? { uri: imageData?.uri } : upload}
            />
          </TouchableOpacityView> */}
        </KeyBoardAware>
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
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            marginBottom: 20
          }}>
          <PrimaryButton
            onPress={onSubmit}
            buttonStyle={styles.button}
            title="SUBMIT"
          />
        </View>
      </CommonImageBackground>
      <SpinnerSecond loading={loading}/>
    </AppSafeAreaView>
  );
};

export default VerifyBank;
