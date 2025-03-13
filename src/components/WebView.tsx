import React from "react";
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from "react-redux";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { NewColor } from "../theme/color";

const WebViewComponent = () => {
    const phonePeGetway_Response = useSelector((state: any) => state?.match?.phonePeGetway_Response);
    return (
        <AppSafeAreaView
            statusColor={true}
            style={{ backgroundColor: NewColor.linerWhite }}
            hidden={false}>
            <WebView
            containerStyle={{
                marginTop:Platform.OS == 'ios' ? '10%' : 0
            }}
                source={{ uri: `${phonePeGetway_Response?.instrumentResponse?.redirectInfo?.url}` }}
            />
        </AppSafeAreaView>
    )
}
export { WebViewComponent }