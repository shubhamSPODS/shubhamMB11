import React, { useEffect, useRef, useState } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { KeyBoardAware } from "../common/KeyboardAware";
import CommonImageBackground from "../common/commonImageBackground";
import Header from "../common/Header";
import { AppText, FORTEEN, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, THIRTEEN, WHITE } from "../common/AppText";
import FastImage from "@d11/react-native-fast-image";
import { CurrentStar, PhonePeSamIcon, googlepay, panCard, paytmIcon, phonepay } from "../helper/image";
import { colors } from "../theme/color";
import { Screen, universalPaddingHorizontal } from "../theme/dimens";
import PhonePePaymentSDK from 'react-native-phonepe-pg'
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import { useDispatch } from "react-redux";
import { paymentGetwayPhonepeText } from "../slices/matchSlice";
import RBSheet from "react-native-raw-bottom-sheet";
import { WebViewComponent } from "../components/WebView";

const PaymentScreen = ({ route }: any) => {
    const dispatch = useDispatch();
    const sheet = useRef();
    const amount = route?.params?.data?.amount ?? "";
    const [upiApps, setUpiApps] = useState('');
    const [packageSignture, setPackageSignture] = useState('');
    
    let environmentForSDK = "PRODUCTION";
    let merchantId = "MYBATTLE11ONLINE";
    let appId = packageSignture;
    let enableLogging = true;


useEffect(() => {
    if (Platform.OS === 'android') {
        PhonePePaymentSDK.getPackageSignatureForAndroid()
            .then((signature: string) => {
                setPackageSignture(signature);

                return PhonePePaymentSDK.init({
                    environment: environmentForSDK,
                    merchantId,
                    flowId: signature, // In Android, we're using package signature as flowId
                    enableLogging,
                });
            })
            .then((result) => {
                console.log("Android SDK Init result:", result);
            })
            .catch((err) => {
                console.log("Android Init Error:", err.message);
            });

        PhonePePaymentSDK.getUpiAppsForAndroid()
            .then(upiApps => {
                console.log("Android UPI Apps:", upiApps);
                if (upiApps) {
                    setUpiApps(JSON.stringify(JSON.parse(upiApps)));
                }
            })
            .catch(error => {
                setUpiApps("error:" + error.message);
            });
    } else if (Platform.OS === 'ios') {
        const flowId = "someUserIdOrFlowId"; 
        PhonePePaymentSDK.init({
            environment: "PRODUCTION",
            merchantId: "MYBATTLE11ONLINE",
            flowId: "userId123",
            enableLogging: true
        })
        
            .then((result) => {
                console.log("iOS SDK Init result:", result);
            })
            .catch((err) => {
                console.log("iOS Init Error:", err.message);
            });

        PhonePePaymentSDK.getUpiAppsForIos()
            .then(upiApps => {
                console.log("iOS UPI Apps:", upiApps);
                if (upiApps) {
                    setUpiApps(JSON.stringify(JSON.parse(upiApps)));
                }
            })
            .catch(error => {
                setUpiApps("error:" + error.message);
            });
    }
}, []);

    // PhonePePaymentSDK.getPackageSignatureForAndroid().then((packageSignture: any) => {
    //     setPackageSignture(packageSignture)
    // })
    // PhonePePaymentSDK.init(
    //     environmentForSDK,
    //     merchantId,
    //     appId,
    //     enableLogging,
    // ).then(result => {
    //     console.log("result", result);
    // })
    // PhonePePaymentSDK.getUpiAppsForAndroid().then(upiApps => {
    //     console.log(upiApps, "upiApps");
    //     if (upiApps != null)
    //         setUpiApps(JSON.stringify(JSON.parse(upiApps)));
    // }).catch(error => {
    //     setUpiApps("error:" + error.message);
    // });
    let data = [
        {
            id: 1,
            packageName: "com.phonepe.simulator",
            icon: PhonePeSamIcon,
            appName: "PhonePe Simulator",
        },
        {
            id: 2,
            packageName: "com.phonepe.app",
            icon: phonepay,
            appName: "PhonePe",
        },
        {
            id: 3,
            packageName: "net.one97.paytm",
            icon: paytmIcon,
            appName: "Paytm",
        },
        {
            id: 4,
            packageName: "com.google.android.apps.nbu.paisa.user",
            icon: googlepay,
            appName: "Google Pay",
        }
    ]
    const PayUpi = (packageName: any) => {
        let title = "UPI_INTENT";
        let targetapp = packageName;
        let sheet = null;
        let data = {
            amount: amount,
            type: 'UPI_INTENT',
            targetapp: packageName
        }
        dispatch(paymentGetwayPhonepeText(data, title, sheet, targetapp, appId))
    }
    // const PayCard = () => {
    //     let title = "UPI_INTENT";
    //     let data = {
    //         amount: amount,
    //         type: 'UPI_INTENT'
    //     }
    //     dispatch(paymentGetwayPhonepeText(data, title, sheet))
    // }
    console.log(upiApps, "upiApps");
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
                        title="Payment Option"
                    />
                    <View style={[styles.preferredContainer, { marginTop: "10%" }]}>
                        <View style={styles.containerPre}>
                            <FastImage tintColor={colors.white} source={CurrentStar} resizeMode="contain" style={styles.currentStar} />
                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                {'  '}PREFERRED PAYMENT
                            </AppText>
                        </View>
                        {data?.map((item) => {
                            const isMatchingPackage = upiApps?.includes(item.packageName);
                            console.log(isMatchingPackage, "isMatchingPackage");
                            if (isMatchingPackage) {
                                return (
                                    <View style={styles.upiConatiner}>
                                        <View style={styles.underContainer}>
                                            <FastImage source={item.icon} resizeMode="contain" style={styles.appIcon} />
                                            <AppText weight={POPPINS_MEDIUM}>
                                                UPI{'\n'}<AppText weight={POPPINS_SEMI_BOLD} type={THIRTEEN}>{item.appName}
                                                </AppText>
                                            </AppText>
                                        </View>
                                        <TouchableOpacityView onPress={() => PayUpi(item.packageName)} style={styles.payContainer}>
                                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                                ADD ₹{amount}
                                            </AppText>
                                        </TouchableOpacityView>
                                    </View>
                                )
                            }
                        })}
                        
                    </View>
                    {upiApps && <View style={{justifyContent: "center", alignItems: "center"}}>
                            <AppText color={WHITE} type={FORTEEN}>Please Install UPI Apps in your Device to add funds</AppText>
                            <AppText color={WHITE} type={FORTEEN}>Ex. Paytm, Phonepe,Gpay.</AppText>
                        </View>}
                    {/* <View style={[styles.preferredContainer, {
                        flexDirection: "row",
                        alignItems: "center", justifyContent: "space-between"
                    }]}>
                        <View style={styles.underContainer}>
                            <FastImage tintColor={colors.white} source={panCard} resizeMode="contain" style={styles.cardIcon} />
                            <AppText type={THIRTEEN} weight={POPPINS_SEMI_BOLD}>
                                {'  '}Pay With Card
                            </AppText>
                        </View>
                        <TouchableOpacityView onPress={() => PayCard()} style={styles.payContainer}>
                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                ADD ₹{amount}
                            </AppText>
                        </TouchableOpacityView>
                    </View> */}
                </CommonImageBackground>
            </KeyBoardAware>
            <RBSheet
                ref={sheet}
                closeOnDragDown={true}
                height={201}
                customStyles={{
                    container: {
                        height: Screen.Height
                    },
                    draggableIcon: {
                        backgroundColor: 'transparent',
                        display: 'none',
                    },
                }}>
                <WebViewComponent />
            </RBSheet>
        </AppSafeAreaView>
    )
};
export default PaymentScreen;
const styles = StyleSheet.create({
    preferredContainer: {
        paddingHorizontal: universalPaddingHorizontal,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.gray,
        marginHorizontal: universalPaddingHorizontal,
        borderRadius: 10,
        marginVertical: 10
    },
    currentStar: {
        height: 20,
        width: 20,
        marginBottom: 2
    },
    containerPre: {
        flexDirection: "row",
        alignItems: "center"
    },
    upiConatiner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10
    },
    appIcon: {
        height: 35,
        width: 35,
        borderRadius: 10,
        marginRight: 10
    },
    underContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    payContainer: {
        height: 35,
        borderRadius: 10,
        backgroundColor: colors.borderBackColor,
        width: "35%",
        alignItems: "center",
        justifyContent: "center"
    },
    cardIcon: {
        height: 35,
        width: 35
    }
})