import { View, Image, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from "@d11/react-native-fast-image";
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import {
  AppText,
  BLACK,
  EIGHTEEN,
  ELEVEN,
  FORTEEN,
  POPPINS,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  TEN,
  WHITE,
} from '../../common/AppText';
import InputBox from '../../common/InputBox';
import Header from '../../common/Header';
import {
  UserIcon,
  calender,
  camera,
  closeIcon,
  persons,
  placeholderImage,
} from '../../helper/image';
import { KeyBoardAware } from '../../common/KeyboardAware';
import RadioActive from '../../common/RadioActive';
import RadioUnActive from '../../common/RadioUnActive';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import CommonContainer from '../../common/Profile/commonContainer';
import { fontFamilyPoppins } from '../../theme/typography';
import { Primary, universalPaddingHorizontal } from '../../theme/dimens';
import PrimaryButton from '../../common/primaryButton';
import { editProfile } from '../../actions/profileAction';
import { appOperation } from '../../appOperation';
import { IMAGE_BASE_URL } from '../../helper/utility';
import CommonImageBackground from '../../common/commonImageBackground';
import { colors } from '../../theme/color';
import { NewColor } from '../../theme/color';

export default function EditProfile() {
  const isLoading = useSelector(state => {
    return state.profile.isLoading;
  });
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const [fullName, setFullName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [gender, setGender] = useState('Male');
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    userData?.logo ? userData?.logo : null,
  );
  const dispatch = useDispatch();
  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };
  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };
  const handleConfirm = date => {
    setDateOfBirth(moment(date).format('DD-MM-YYYY').toString());
    hideDatePicker();
  };
  useState(() => {
    setDateOfBirth(userData?.dob ? userData?.dob : '');
  }, [userData]);
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 485,
      height: 485,
      cropping: true,
      useFrontCamera: true,
    }).then(image => {
      const data = {
        uri: image.path,
        name: image.modificationDate + '.' + image.mime.split('/')[1],
        type: image.mime,
      };
      setProfileImage(data);
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
      setProfileImage(data);
    });
  };
  const handleSubmit = () => {
    const data = {
      full_name: fullName,
      email: email,
      gender: gender,
      mobile_number: userData?.mobile_number,
      dob: dateOfBirth,
      logo: imageUrl ? imageUrl : userData?.logo,
      logo: imageUrl ? imageUrl : userData?.logo,
      username: teamName,
      firsttime: false
    };
    dispatch(editProfile(data, userData?._id));
  };
  const uploadImage = async () => {
    try {
      const uploadData = new FormData();
      uploadData.append('file', profileImage);
      const res = await appOperation.customer.uploadImg(uploadData);
      if (res?.code == 200) {
        console.log(res, 'resresresres');
        setImageUrl(res?.data);
      }
    } catch (e) {
      console.log('error in upload', e);
    }
  };
  useEffect(() => {
    if (profileImage) {
      uploadImage();
    }
  }, [profileImage]);
  useEffect(() => {
    setFullName(userData?.full_name);
    setEmail(userData?.email);
    setMobileNumber(`${userData?.mobile_number}`);
    setTeamName(userData?.username)
  }, [userData]);
  const confimCamera = useRef();
  const onCamSelect = () => {
    confimCamera?.current?.close();
    openCamera();
  };
  const onGalerySelect = () => {
    confimCamera?.current?.close();
    openGallery();
  };
  const colors = useSelector(state => state.theme.colors);
  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <Header
          title={'Edit Profile'}
          commonHeader
          style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
        />

        <KeyBoardAware style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '90%',
              top: 10,
            }}>
            <View style={styles.avtarContainer}>
              <Image
                style={[styles?.avtharImage]}
                source={
                  profileImage?.uri
                    ? { uri: profileImage?.uri }
                    : userData?.logo
                      ? { uri: `${IMAGE_BASE_URL}${userData?.logo}` }
                      : UserIcon
                }
              />
              <TouchableOpacityView
                onPress={() => {
                  confimCamera.current.open();
                }}
                style={styles.cameraContainer}>
                <Image source={camera} style={styles.cameraIcon} />
              </TouchableOpacityView>
            </View>
            <View>
              <AppText type={EIGHTEEN} weight={POPPINS_SEMI_BOLD}>
                My Profile
              </AppText>
              <AppText type={FORTEEN} weight={POPPINS_MEDIUM}>
                Enter Your Details Here
              </AppText>
            </View>
          </View>
          <CommonContainer style={styles.InputBoxWrapper}>
            {/* <View style={styles.userIcon}>
              <Image source={userAvatar} style={styles.cameraIcon} />
              <AppText
                style={styles.color(colors)}
                type={EIGHTEEN}
                weight={POPPINS_EXTRA_BOLD_ITALIC}>
                {' Your Details'}
              </AppText>
            </View> */}

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 20,
                width: '100%',
              }}>
              <View style={{ marginBottom: 10 }}>
                <InputBox
                  placeholderTextColor={colors.white}
                  label={'Team Name'}
                  value={teamName}
                  keyboardType="default"
                  placeholder={'Enter your team name'}
                  onChange={setTeamName}
                  textInputBox={styles.textInputBox}
                  labelStyle={styles.label}
                />
              </View>
              <InputBox
                placeholderTextColor={colors.white}
                label={'Full Name'}
                value={fullName}
                keyboardType="default"
                placeholder={'Enter your name'}
                onChange={setFullName}
                textInputBox={styles.textInputBox}
                labelStyle={styles.label}
              />
              <InputBox
                placeholderTextColor={colors.white}
                label={'Email'}
                // editable={false}
                value={email}
                keyboardType="default"
                placeholder={'Enter your email'}
                onChange={setEmail}
                textInputBox={styles.textInputBox}
                labelStyle={[styles.label, { marginTop: 20 }]}
              />

              <AppText
                type={FORTEEN}
                weight={POPPINS_MEDIUM}
                style={[styles.label, { marginTop: 20 }]}>
                Gender
              </AppText>

              <View style={styles.radioContainer}>
                <TouchableOpacityView
                  style={styles.radioWrapper}
                  onPress={() => setGender('Male')}>
                  {gender == 'Male' ? <RadioActive /> : <RadioUnActive />}

                  <AppText type={ELEVEN} weight={POPPINS}>
                    Male
                  </AppText>
                </TouchableOpacityView>
                <TouchableOpacityView
                  style={styles.radioWrapper}
                  onPress={() => setGender('Female')}>
                  {gender == 'Female' ? <RadioActive /> : <RadioUnActive />}

                  <AppText type={ELEVEN} weight={POPPINS}>
                    Female
                  </AppText>
                </TouchableOpacityView>
              </View>
              <InputBox
                label={'Mobile number'}
                value={mobileNumber}
                placeholder={'Enter mobile number'}
                onChange={setMobileNumber}
                placeholderTextColor={colors.grey}
                textInputBox={styles.textInputBox}
                labelStyle={[styles.label, { marginTop: 20 }]}
                editable={false}
              />

              <TouchableOpacityView onPress={showDatePicker}>
                <View style={styles.InputBoxContainer}>
                  <AppText
                    type={FORTEEN}
                    weight={POPPINS_MEDIUM}
                    style={[styles.label, { marginTop: 20 }]}>
                    DATE OF BIRTH
                  </AppText>
                  <View
                    style={[
                      styles.InputBox,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}>
                    <AppText
                      style={{
                        marginLeft: 5,
                      }}
                      weight={POPPINS_MEDIUM}
                      type={TEN}
                      color={WHITE}>
                      {dateOfBirth && dateOfBirth}
                    </AppText>
                    <TouchableOpacityView
                      onPress={() => {
                        setIsDatePickerVisible(true);
                      }}
                      style={{
                        marginLeft: 'auto',
                        marginEnd: 10,
                      }}>
                      <Image style={styles.calandar} source={calender} tintColor={colors.white} />
                    </TouchableOpacityView>
                  </View>
                </View>
              </TouchableOpacityView>
            </View>
          </CommonContainer>

          {/* <View style={{marginBottom: 30, marginHorizontal: 20}}>
            <Button
              style={{width: '100%', height: 45}}
              onPress={() => {
                handleSubmit();
              }}>
              {'SAVE'}
            </Button>
          </View> */}
        </KeyBoardAware>
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            paddingVertical: 10,
          }}>
          <PrimaryButton
            onPress={() => handleSubmit()}
            buttonStyle={{
              marginHorizontal: universalPaddingHorizontal,
            }}
            title="SAVE"
          />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={moment().subtract(18, 'years').toDate()}
        />

        <RBSheet
          ref={confimCamera}
          closeOnDragDown={true}
          height={200}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: colors.black
            },
            draggableIcon: {
              display: 'none',
            },
          }}>
          <View style={styles.cameratypeSelect}>
            <View style={styles.header}>
              <TouchableOpacityView
                style={styles.closeIcon}
                onPress={() => confimCamera?.current?.close()}>
                <FastImage
                  tintColor={colors.white}
                  source={closeIcon}
                  style={{ height: 12, width: 12 }}
                />
              </TouchableOpacityView>
              <AppText weight={POPPINS_SEMI_BOLD}>Select </AppText>
            </View>

            <View style={styles.cameratypeSelectInside}>
              <TouchableOpacityView onPress={onCamSelect}>
                <View
                  style={[
                    styles.cameraContainer,
                    {
                      position: 'relative',
                      right: 0,
                      bottom: 0,
                      alignSelf: 'center',
                    },
                  ]}>
                  <Image source={camera} style={styles.cameraIcon} />
                </View>

                <AppText
                  weight={POPPINS_MEDIUM}
                  style={{
                    marginTop: 10,
                  }}>
                  Use Camera
                </AppText>
              </TouchableOpacityView>
              <TouchableOpacityView onPress={onGalerySelect}>
                <View
                  style={[
                    styles.cameraContainer,
                    {
                      position: 'relative',
                      right: 0,
                      bottom: 0,

                      alignSelf: 'center',
                    },
                  ]}>
                  <Image
                    source={{
                      uri: 'data:image/png;base64,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',
                    }}
                    style={styles.cameraIcon}
                  />
                </View>

                <AppText weight={POPPINS_MEDIUM} style={{ marginTop: 10 }}>
                  Use Galery
                </AppText>
              </TouchableOpacityView>
            </View>
          </View>
        </RBSheet>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundColorContainer: {
    height: 220,
  },
  ImageBackground: {
    width: '100%',
    height: 174,
  },
  avtarContainer: {
    width: 115,
    height: 114,
    alignSelf: 'center',
    borderRadius: 90,
    borderColor: colors.brownYellow,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  avtharImage: {
    width: 105,
    height: 105,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 90,
  },
  cameraContainer: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'absolute',
    right: 5,
    bottom: 0,
  },
  cameraIcon: {
    width: 14,
    height: 14,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  InputBoxWrapper: {
    marginHorizontal: universalPaddingHorizontal,
    padding: 0,
    paddingHorizontal: 0,
    marginTop: 30,
  },
  userIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  radioWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItem: 'center',
    marginRight: 30,
    // margin: 10,
    marginLeft: 0,
  },
  radioButton: {
    borderRadius: 20,
    borderWidth: 1,
    // borderColor: colors.pink,
  },
  InputBoxContainer: {
    marginBottom: 10,
  },
  InputBoxLabel: {
    color: colors.white,
    fontSize: 11,
  },
  InputBox: {
    backgroundColor: "#606060",
    borderRadius: 6,
    width: '100%',
    color: 'white',
    paddingLeft: 10,
    height: Primary.Height,
    borderRadius: 5,
    // paddingHorizontal: 15,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 15,
  },
  calandar: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NewColor.linerBlackFive,
    height: 54,
    paddingHorizontal: 25,
  },
  cameratypeSelectInside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 100,
    marginTop: '15%',

  },
  color: colors => ({
    color: colors.white,
  }),
  label: {
    marginTop: 0,
  },
  textInputBox: {
    fontFamily: fontFamilyPoppins,
    fontSize: 12,
    flex: 1,
    color: colors.white,
  },
});
