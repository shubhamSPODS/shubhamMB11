import React, { useRef, useState, useEffect } from "react";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { KeyBoardAware } from "../common/KeyboardAware";
import { Platform, StatusBar, StyleSheet, View, Alert } from "react-native";
import Header from "../common/Header";
import { universalPaddingHorizontal } from "../theme/dimens";
import CommonImageBackground from "../common/commonImageBackground";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import FastImage from "@d11/react-native-fast-image";
import { cameraIcon, gallaryIcon, upload } from "../helper/image";
import RBSheet from "react-native-raw-bottom-sheet";
import { AppText, BLACK, POPPINS_SEMI_BOLD } from "../common/AppText";
import PrimaryButton from "../common/primaryButton";
import { useDispatch, useSelector } from "react-redux";
import { uploadSelfie } from "../slices/matchSlice";
import { appOperation } from "../appOperation";
import { toastAlert } from "../helper/utility";
import { SpinnerSecond } from "../common/SpinnerSecond";
import { imagePickerHelper, createImageData, openGalleryAlternative, openGalleryFinal, openGalleryMainThread, openGalleryRadical, openGalleryNative, openGalleryDelayed, openGalleryCameraFirst, openGalleryUltimate, openGalleryLastResort, openGalleryPermissionAware, openGalleryWithPermissionReset, openGalleryWithAppRestart, openGalleryWithLifecycleMonitoring } from "../helper/imagePickerHelper";
import { AppDispatch } from "../libs/configStore";

interface ImageData {
    uri: string;
    name: string;
    type: string;
}

const UploadSelfie = () => {
    const selectPicker = useRef<RBSheet>(null);
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: any) => state.match.isLoading);
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    
    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            imagePickerHelper.forceClosePicker();
        };
    }, []);

    const openPicker = async () => {
        try {
            const image = await imagePickerHelper.openCamera({
                width: 485,
                height: 485,
                cropping: true,
            });
            
            if (image) {
                const data = createImageData(image);
                if (data) {
                    setImageData(data);
                }
            }
            
        } catch (error) {
            console.log('Camera error:', error);
        }
    };

    const openGallery = async () => {
        try {
            console.log('🚀 [COMPONENT] Starting openGallery function...');
            console.log('🚀 [COMPONENT] Platform:', Platform.OS);
            
            // iOS-specific preparation
            if (Platform.OS === 'ios') {
                console.log('🚀 [COMPONENT] iOS detected, starting iOS-specific flow...');
                
                console.log('🚀 [COMPONENT] Calling ensurePickerReady...');
                await imagePickerHelper.ensurePickerReady();
                console.log('🚀 [COMPONENT] ensurePickerReady completed');
                
                // Try all methods in sequence until one works
                const methods = [
                    { name: 'Alternative', method: openGalleryAlternative },
                    { name: 'Final Workaround', method: openGalleryFinal },
                    { name: 'Main Thread', method: openGalleryMainThread },
                    { name: 'Radical Fix', method: openGalleryRadical },
                    { name: 'Native Approach', method: openGalleryNative },
                    { name: 'Delayed Execution', method: openGalleryDelayed },
                    { name: 'Camera First', method: openGalleryCameraFirst },
                    { name: 'Ultimate', method: openGalleryUltimate },
                    { name: 'Last Resort', method: openGalleryLastResort },
                    { name: 'Permission Aware', method: openGalleryPermissionAware },
                    { name: 'Permission Reset', method: openGalleryWithPermissionReset },
                    { name: 'App Restart', method: openGalleryWithAppRestart },
                    { name: 'Lifecycle Monitoring', method: openGalleryWithLifecycleMonitoring },
                ];
                
                console.log(`🚀 [COMPONENT] Will try ${methods.length} different methods`);
                
                for (const methodInfo of methods) {
                    try {
                        console.log(`🚀 [COMPONENT] ========================================`);
                        console.log(`🚀 [COMPONENT] Trying ${methodInfo.name} method...`);
                        console.log(`🚀 [COMPONENT] ========================================`);
                        
                        const image = await methodInfo.method({
                            width: 485,
                            height: 485,
                            cropping: true,
                        });
                        
                        if (image) {
                            console.log(`✅ [COMPONENT] ${methodInfo.name} method SUCCEEDED!`);
                            console.log(`✅ [COMPONENT] Image received:`, image ? 'YES' : 'NO');
                            if (image) {
                                console.log(`✅ [COMPONENT] Image path:`, image.path);
                                console.log(`✅ [COMPONENT] Image mime:`, image.mime);
                            }
                            
                            const data = createImageData(image);
                            if (data) {
                                console.log(`✅ [COMPONENT] Image data created successfully`);
                                setImageData(data);
                            } else {
                                console.log(`❌ [COMPONENT] Failed to create image data`);
                            }
                            return;
                        } else {
                            console.log(`⚠️ [COMPONENT] ${methodInfo.name} method returned null image`);
                        }
                    } catch (methodError: any) {
                        console.log(`❌ [COMPONENT] ${methodInfo.name} method FAILED:`);
                        console.log(`❌ [COMPONENT] Error:`, methodError);
                        console.log(`❌ [COMPONENT] Error code:`, methodError.code);
                        console.log(`❌ [COMPONENT] Error message:`, methodError.message);
                        console.log(`❌ [COMPONENT] Continuing to next method...`);
                        // Continue to next method
                    }
                }
                
                // If all methods failed
                console.log(`❌ [COMPONENT] All ${methods.length} iOS gallery picker methods failed`);
                throw new Error('All iOS gallery picker methods failed');
            }
            
            // Use regular method for Android
            console.log('🚀 [COMPONENT] Non-iOS platform, using standard method...');
            const image = await imagePickerHelper.openGallery({
                width: 485,
                height: 485,
                cropping: true,
            });
            
            if (image) {
                console.log('✅ [COMPONENT] Standard method succeeded');
                const data = createImageData(image);
                if (data) {
                    setImageData(data);
                }
            }
            
        } catch (error: any) {
            console.log('❌ [COMPONENT] Gallery error in component:');
            console.log('❌ [COMPONENT] Error:', error);
            console.log('❌ [COMPONENT] Error message:', error.message);
            toastAlert.showToastError('Failed to open gallery. Please try again.');
        }
    };

    const uploadImage = async () => {
        try {
            const uploadData = new FormData();
            uploadData.append('file', imageData as any);
            const res = await appOperation.customer.uploadImg(uploadData);
            if (res?.code == 200) {
                setImageUrl(res?.data);
            }
        } catch (e) {
            console.log('error in upload', e);
            toastAlert.showToastError('Failed to upload image. Please try again.');
        }
    };

    React.useEffect(() => {
        if (imageData) {
            uploadImage();
        }
    }, [imageData]);

    const onSubmit = () => {
        if (!imageUrl || imageUrl?.length == 0) {
            toastAlert.showToastError('Please upload your selfie')
        } else {
            const data = {
                userselfies: imageUrl,
                selfie_verified: 1,
            }
            dispatch(uploadSelfie(data) as any)
        }
    }

    // Prevent multiple picker operations
    const handlePickerAction = (action: 'camera' | 'gallery') => {
        if (imagePickerHelper.isPickerCurrentlyOpen()) {
            console.log('Picker is already open, please wait...');
            return;
        }
        
        if (action === 'camera') {
            openPicker();
        } else {
            openGallery();
        }
    };

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
                        <TouchableOpacityView 
                            onPress={() => handlePickerAction('gallery')} 
                            style={styles.openGallary}
                            disabled={imagePickerHelper.isPickerCurrentlyOpen()}>
                            <FastImage source={gallaryIcon} resizeMode='contain' style={styles.cameraIconStyle} />
                            <AppText style={{ marginTop: 3 }} color={BLACK} weight={POPPINS_SEMI_BOLD}>
                                Use gallery
                            </AppText>
                        </TouchableOpacityView>
                        <TouchableOpacityView 
                            onPress={() => handlePickerAction('camera')} 
                            style={styles.openGallary}
                            disabled={imagePickerHelper.isPickerCurrentlyOpen()}>
                            <FastImage source={cameraIcon} resizeMode='contain' style={styles.cameraIconStyle} />
                            <AppText style={{ marginTop: 3 }} color={BLACK} weight={POPPINS_SEMI_BOLD}>
                                Use camera
                            </AppText>
                        </TouchableOpacityView>
                    </View>
                </RBSheet>
            </CommonImageBackground>
            <SpinnerSecond loading={loading} style={{}}/>
        </AppSafeAreaView >
    )
};

const styles = StyleSheet.create({
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 10,
    },
    image: {
        width: 100,
        height: 100,
    },
    image2: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    button: {
        marginTop: 20,
    },
    rbContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    openGallary: {
        alignItems: 'center',
        padding: 10,
    },
    cameraIconStyle: {
        width: 30,
        height: 30,
    },
});

export default UploadSelfie;