import React, { useEffect, useRef, useState } from "react";
import { Platform, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { KeyBoardAware } from "../common/KeyboardAware";
import CommonImageBackground from "../common/commonImageBackground";
import Header from "../common/Header";
import { AppText, FORTEEN, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, THIRTEEN, WHITE } from "../common/AppText";
import FastImage from "@d11/react-native-fast-image";
import { CurrentStar, PhonePeSamIcon, googlepay, paytmIcon, phonepay } from "../helper/image";
import { colors } from "../theme/color";
import { Screen, universalPaddingHorizontal } from "../theme/dimens";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import { useDispatch } from "react-redux";
import { paymentGetwayPhonepeText } from "../slices/matchSlice";
import RBSheet from "react-native-raw-bottom-sheet";
import { WebViewComponent } from "../components/WebView";
import DeviceInfo from "react-native-device-info";
import PhonePePaymentSDK from "react-native-phonepe-pg";

const PaymentScreen = ({ route }: any) => {
    const dispatch = useDispatch();
    const sheet = useRef();
    const amount = route?.params?.amount || 0;

    const [upiApps, setUpiApps]:any = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [packageSignature, setPackageSignature] = useState('');

    const environmentForSDK = 'SANDBOX'; 
    const merchantId = 'MYBATTLE11UAT';
    const flowId = 'NjkzMzMzMWMtM2NhMC00NWE4LWJjMjItY2ZjY2U3YWQ1YWNi';
    const enableLogging = true;

    const staticUPIData = [
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
    ];

    const initPhonePeSDK = () => {
        PhonePePaymentSDK.init(
          environmentForSDK,
          merchantId,
          flowId,
          true
        ).then(result => {
        console.log("Message: SDK Initialisation ->" + JSON.stringify(result));
        }).catch(error => {
            console.log("error:" + error.message);
        })
      };

    const checkApps = async () => {
        try {
            initPhonePeSDK();
            const response = await PhonePePaymentSDK.getUpiAppsForAndroid();
            console.log('Available UPI Apps:', response);
            console.log('Response Type:', typeof response);
            console.log('Response Content:', response);
   
            // Parse the response if it's a string
            let parsedResponse = [];
            if (typeof response === 'string') {
                parsedResponse = JSON.parse(response);
                console.log('Parsed Response:', parsedResponse);
            } else {
                parsedResponse = response;
            }
   
            // Now handle parsedResponse as an array
            if (Array.isArray(parsedResponse)) {
                setUpiApps(parsedResponse);
                const installedPackages = parsedResponse.map(app => app.packageName?.toLowerCase());
                console.log('installedPackages =>', installedPackages);
   
                const matchedData:any = staticUPIData.filter(item => {
                    console.log(item, '==itemMatchedData');
                    return installedPackages.includes(item.packageName?.toLowerCase());
                });
                console.log('matchedData= =>', matchedData);
                setFilteredData(matchedData);
            } else {
                console.warn('Response is still not an array:', parsedResponse);
                setUpiApps([]);
            }
    
        } catch (error) {
            console.error('Error fetching installed UPI apps:', error);
        }
    };
   
   
 

    const generateTransactionId = () => {
        const timeStamp = Date.now();
        const random = Math.floor(Math.random() * 1000000);
        const merchantPrefix = '1';
        return `${merchantPrefix}${timeStamp}${random}`;
    };

    const handleUPIPayment = (packageName: string) => {
        const title = "UPI_INTENT";
        const data = {
            amount: amount,
            type: title,
            targetapp: packageName,
        };

        dispatch(paymentGetwayPhonepeText(data));
    };

    useEffect(() => {
        checkApps()
        const bundleId = DeviceInfo.getBundleId(); 
        setPackageSignature(bundleId);
    }, []);

    return (
        <AppSafeAreaView hidden={false}>
            <StatusBar backgroundColor={'transparent'} translucent={true} networkActivityIndicatorVisible={true} />
            <KeyBoardAware>
                <CommonImageBackground common>
                    <Header
                        style={{ marginTop: '12%' }}
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

                        {/* Show available filtered UPI apps */}
                        {filteredData.length > 0 ? filteredData.map((item) => (
                            <View style={styles.upiContainer} key={item.id}>
                                <View style={styles.underContainer}>
                                    <FastImage source={item.icon} style={styles.appIcon} />
                                    <AppText weight={POPPINS_MEDIUM}>
                                        UPI{'\n'}
                                        <AppText weight={POPPINS_SEMI_BOLD} type={THIRTEEN}>
                                            {item.appName}
                                        </AppText>
                                    </AppText>
                                </View>
                                <TouchableOpacityView
                                    onPress={() => handleUPIPayment(item.packageName)}
                                    style={styles.payContainer}
                                >
                                    <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                        ADD ₹{amount}
                                    </AppText>
                                </TouchableOpacityView>
                            </View>
                        )) : (
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <AppText color={WHITE} type={FORTEEN}>
                                    No UPI apps found. Please install Paytm, PhonePe, or GPay.
                                </AppText>
                            </View>
                        )}
                    </View>

                </CommonImageBackground>
            </KeyBoardAware>

            {/* Bottom Sheet */}
            <RBSheet
                ref={sheet}
                closeOnDragDown={true}
                height={Screen.Height}
                customStyles={{
                    container: {
                        height: Screen.Height,
                    },
                    draggableIcon: {
                        backgroundColor: 'transparent',
                        display: 'none',
                    },
                }}
            >
                <WebViewComponent />
            </RBSheet>
        </AppSafeAreaView>
    );
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
    upiContainer: {
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
    }
});
