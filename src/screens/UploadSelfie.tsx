import React, { useRef, useState } from "react";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { KeyBoardAware } from "../common/KeyboardAware";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import Header from "../common/Header";
import { universalPaddingHorizontal } from "../theme/dimens";
import CommonImageBackground from "../common/commonImageBackground";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import FastImage from "react-native-fast-image";
import { cameraIcon, gallaryIcon, upload } from "../helper/image";
import RBSheet from "react-native-raw-bottom-sheet";
import { AppText, BLACK, POPPINS_SEMI_BOLD } from "../common/AppText";
import ImagePicker from 'react-native-image-crop-picker';
import PrimaryButton from "../common/primaryButton";
import { useDispatch, useSelector } from "react-redux";
import { uploadSelfie } from "../slices/matchSlice";
import { appOperation } from "../appOperation";
import { toastAlert } from "../helper/utility";
import { SpinnerSecond } from "../common/SpinnerSecond";
const UploadSelfie = () => {
    const selectPicker = useRef();
    const dispatch = useDispatch();
    const loading = useSelector((state: any) => state.match.isLoading);
    const [imageData, setImageData] = useState(null);
    const [imageUrl, setImageUrl] = React.useState(null);
    const openPicker = async () => {
        ImagePicker.openCamera({
            width: 485,
            height: 485,
            cropping: true,
        }).then(image => {
            const data: any = {
                uri: image.path,
                name: image.modificationDate + '.' + image.mime.split('/')[1],
                type: image.mime,
            };
            setImageData(data);
        });
    };
    const openGallery = () => {
        ImagePicker.openPicker({
            width: 485,
            height: 485,
            cropping: true,
        }).then(image => {
            const data: any = {
                uri: image.path,
                name: image.modificationDate + '.' + image.mime.split('/')[1],
                type: image.mime,
            };
            setImageData(data);

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
    React.useEffect(() => {
        uploadImage();
    }, [imageData]);
    const onSubmit = () => {
        if (!imageUrl || imageUrl?.length == 0) {
            toastAlert.showToastError('Please upload your selfie')
        } else {
            const data = {
                userselfies: imageUrl,
                selfie_verified: 1,
            }
            dispatch(uploadSelfie(data))
        }
    }
    return (
        <AppSafeAreaView>
            <StatusBar
                backgroundColor={'transparent'}
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
            <CommonImageBackground common>
                <Header
                    style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
                    commonHeader
                    title="Upload you Selfie"
                />
                <KeyBoardAware style={styles.bottomContainer}>
                    <TouchableOpacityView
                        style={styles.uploadContainer}
                        onPress={() => selectPicker?.current?.open()}>
                        <FastImage
                            style={imageData?.uri ? styles.image2 : styles.image}
                            resizeMode="contain"
                            source={imageData?.uri ? { uri: imageData?.uri } : upload}
                        />
                    </TouchableOpacityView>
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
            </CommonImageBackground>
            <SpinnerSecond loading={loading}/>
        </AppSafeAreaView >
    )
};
export default UploadSelfie;
const styles = StyleSheet.create({
    bottomContainer: {
        paddingHorizontal: 20,
    },
    uploadContainer: {
        borderWidth: 1,
        borderColor: 'rgba(63, 139, 238, 0.3)',
        borderRadius: 8,
        marginTop: 10,
        height: 250,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        width: "100%",
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: "center"
    },
    image: {
        height: 34,
        width: 34,
        alignSelf: 'center',
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
    button: {
        marginTop: 30,
        marginBottom: 10
    }
})