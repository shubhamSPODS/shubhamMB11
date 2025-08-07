import React from "react";
import { StatusBar, StyleSheet, TextInput, View } from "react-native";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import CommonImageBackground from "../common/commonImageBackground";
import Header from "../common/Header";
import { universalPaddingHorizontal } from "../theme/dimens";
import { KeyBoardAware } from "../common/KeyboardAware";
import FastImage from "@d11/react-native-fast-image";
import { BannerVerify, adhaarFront, adhaarback, cameraIcon, checkAdhaar, gallaryIcon, recommendedIcon } from "../helper/image";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import { AppText, BLACKOPACITY, FORTEEN, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, THIRTEEN } from "../common/AppText";
import ImagePicker from 'react-native-image-crop-picker';
import { checkValidAdharCardNumber, formatAadharNumber, toastAlert } from "../helper/utility";
import { NewColor, colors } from "../theme/color";
import { poppinsSemiBold } from "../theme/typography";
import PrimaryButton from "../common/primaryButton";
import { appOperation } from "../appOperation";
import { useDispatch } from "react-redux";
import { getAdharVerify } from "../slices/matchSlice";

const UploadAadhar = () => {
    const dispatch = useDispatch();
    const [imageData, setImageData] = React.useState<any>(null);
    const [imageDatattwo, setImageDatatwo] = React.useState<any>(null);
    const [name, setName] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState(null);
    const [imageUrlTwo, setImageUrlTwo] = React.useState(null);
    const [selectedImageSlot, setSelectedImageSlot] = React.useState('first'); // 'first' or 'second'

    const openPicker = async (slot = 'first') => {
        setSelectedImageSlot(slot);
        ImagePicker.openCamera({
            width: 1000,
            height: 1000,
            cropping: false,
            mediaType: 'photo',
            includeBase64: false,
            includeExif: true,
            forceJpg: true,
        }).then(image => {
            const data: any = {
                uri: image.path,
                name: image.modificationDate + '.' + image.mime.split('/')[1],
                type: image.mime,
            };
            if (slot === 'first') {
                setImageData(data);
            } else {
                setImageDatatwo(data);
            }
        }).catch(error => {
            console.log('Camera error:', error);
            if (error.code === 'E_PICKER_CANCELLED') {
                console.log('User cancelled camera');
            } else {
                toastAlert.showToastError('Failed to capture image from camera');
            }
        });
    };
    const openGallery = (slot = 'first') => {
        setSelectedImageSlot(slot);
        ImagePicker.openPicker({
            width: 1000,
            height: 1000,
            cropping: false,
            mediaType: 'photo',
            includeBase64: false,
            includeExif: true,
            forceJpg: true,
        }).then(image => {
            const data: any = {
                uri: image.path,
                name: image.modificationDate + '.' + image.mime.split('/')[1],
                type: image.mime,
            };
            if (slot === 'first') {
                setImageData(data);
            } else {
                setImageDatatwo(data);
            }
        }).catch(error => {
            console.log('Image picker error:', error);
            if (error.code === 'E_PICKER_CANCELLED') {
                console.log('User cancelled image picker');
            } else {
                toastAlert.showToastError('Failed to select image from gallery');
            }
        });
    };
    const uploadImage = async () => {
        try {
            const uploadData = new FormData();
            uploadData.append('file', imageData);
            const res = await appOperation.customer.uploadImg(uploadData);
            if (res?.code == 200) {
                setImageUrl(res?.data);
            }
        } catch (e) {
            console.log('error in upload', e);
        }
    };
    const uploadImageTwo = async () => {
        try {
            const uploadData = new FormData();
            uploadData.append('file', imageDatattwo);
            const res = await appOperation.customer.uploadImg(uploadData);
            if (res?.code == 200) {
                setImageUrlTwo(res?.data)
            }
        } catch (e) {
            console.log('error in upload', e);
        }
    };

    React.useEffect(() => {
        uploadImage();
        uploadImageTwo()
    }, [imageData, imageDatattwo]);
    const onSubmit = () => {
        if (!checkValidAdharCardNumber(name.replace(/\s/g, ''))) {
            toastAlert.showToastError('Please enter vaild adhaar number')
        } else if (!imageData) {
            toastAlert.showToastError('Please upload front adhaar image')
        } else if (!imageDatattwo) {
            toastAlert.showToastError('Pleas upload back adhaar image')
        } else {
            const uploadData = new FormData();
            uploadData.append('adhar_front_image', imageData);
            uploadData.append('adhar_back_image', imageDatattwo);
            uploadData.append('aadhar_number', name.replace(/\s/g, ''));
            uploadData.append('adhar_verified', 2);
            dispatch(getAdharVerify(uploadData))
        }
    }
    
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
                    title="Upload Aadhar"
                    style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
                />
                <KeyBoardAware style={styles.bottomContainer}>
                    <View style={styles.gallaryContainer}>
                        <View style={styles.flexBoxContainer}>
                            <TouchableOpacityView 
                                style={[
                                    styles.uploadBox,
                                    selectedImageSlot === 'first' && styles.selectedImageContainer
                                ]}
                                onPress={() => setSelectedImageSlot('first')}>
                                <FastImage source={imageData ? { uri: imageData?.uri } : adhaarFront} resizeMode='stretch' style={styles.adhaarIcon} />
                            </TouchableOpacityView>
                            <TouchableOpacityView 
                                style={[
                                    styles.uploadBackBox,
                                    selectedImageSlot === 'second' && styles.selectedImageContainer
                                ]}
                                onPress={() => setSelectedImageSlot('second')}>
                                <FastImage source={imageDatattwo ? { uri: imageDatattwo?.uri } : adhaarback} resizeMode='stretch' style={styles.adhaarIcon} />
                            </TouchableOpacityView>
                        </View>
                        <TouchableOpacityView
                            onPress={() => openPicker(selectedImageSlot)}
                            style={styles.openGallaryContainer}>
                            <FastImage source={cameraIcon} resizeMode='contain' style={styles.cameraIconStyle} />
                            <AppText type={THIRTEEN} weight={POPPINS_MEDIUM} color={BLACKOPACITY}>
                                Use camera
                            </AppText>
                        </TouchableOpacityView>
                        <TouchableOpacityView
                            onPress={() => openGallery(selectedImageSlot)}
                            style={styles.openGallaryContainer}>
                            <FastImage source={gallaryIcon} resizeMode='contain' style={styles.cameraIconStyle} />
                            <AppText type={THIRTEEN} weight={POPPINS_MEDIUM} color={BLACKOPACITY}>
                                Select from the gallery
                            </AppText>
                        </TouchableOpacityView>
                    </View>
                    <View style={styles.box}>
                        <View>
                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                Enter your Aadhaar number
                            </AppText>
                            <FastImage source={recommendedIcon} resizeMode='contain' style={styles.recommended} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                allowFontScaling={false}
                                placeholder={'Adhaar Number'}
                                placeholderTextColor={colors.white}
                                style={styles.inputStyle}
                                value={formatAadharNumber(name)}
                                onChangeText={(value) => setName(value)}
                                maxLength={14}
                                keyboardType={'decimal-pad'}
                            />
                            {checkValidAdharCardNumber(name.replace(/\s/g, '')) ?
                                <FastImage source={checkAdhaar} resizeMode='contain' style={styles.checkIcon} />
                                : <></>}
                        </View>
                    </View>
                </KeyBoardAware>
                <View style={{ paddingHorizontal: universalPaddingHorizontal }}>
                    <PrimaryButton
                        buttonStyle={styles.button}
                        title="SUBMIT"
                        onPress={onSubmit}
                    />
                </View>
            </CommonImageBackground>
        </AppSafeAreaView>
    )
};

export default UploadAadhar;
const styles = StyleSheet.create({
    bottomContainer: {
        paddingHorizontal: universalPaddingHorizontal,
    },
    topBanner: {
        height: 90,
        width: "100%",
        marginTop: 20
    },
    gallaryContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.darkGreen,
        marginTop: 20
    },
    flexBoxContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    uploadBox: {
        borderRadius: 10,
        width: '48%',
        height: 98,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colors.darkGreen,
        borderWidth: 1,
    },
    uploadBackBox: {
        borderRadius: 10,
        width: '48%',
        height: 98,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colors.darkGreen,
        borderWidth: 1,
    },
    selectedImageContainer: {
        borderColor: colors.darkGreen,
        borderWidth: 3,
        backgroundColor: colors.golden,
    },
    openGallaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.darkGreen,
        height: 45,
        marginTop: 15,
        marginBottom: 10
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        gap: 15
    },
    selectionIndicator: {
        alignItems: "center",
        marginTop: 10,
        paddingVertical: 5,
        backgroundColor: colors.darkGreen,
        borderRadius: 5
    },
    cameraIconStyle: {
        height: 20,
        width: 20,
        marginRight: 10
    },
    adhaarIcon: {
        width: 150,
        height: 80,
        borderRadius: 10
    },
    box: {
        borderWidth: 1,
        borderColor: colors.darkGreen,
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 20
    },
    recommended: {
        width: 82,
        height: 19,
        position: "absolute",
        right: -12,
        top: 3
    },
    checkIcon: {
        height: 20,
        width: 20
    },
    inputStyle: {
        fontSize: 13,
        fontFamily: poppinsSemiBold,
        flex: 1,
        color: colors.white
    },
    inputContainer: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: colors.darkGreen,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        marginTop: 30,
        marginBottom: 20
    }
})
