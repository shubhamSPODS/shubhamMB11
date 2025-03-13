import React from "react";
import { View, StyleSheet } from 'react-native';
import { AppSafeAreaView } from "./AppSafeAreaView";
import { KeyBoardAware } from "./KeyboardAware";
import WebView from "react-native-webview";
import Header from "./Header";
import CommonImageBackground from "./commonImageBackground";
import { StatusBar } from "native-base";


const WebUrl = ({ route }) => {
    let title = route?.params?.titleNames;
   
        let titleName = () => {
        if (title == 'Terms & Conditions') {
            return 'https://mybattle11.com/termsNConditionsmobile'
        } else if (title == 'About Us') {
            return 'https://mybattle11.com/aboutmobile'
        } else if (title == 'HowToPlay') {
            return 'https://mybattle11.com/howToPlaymobile'
        } else if (title == 'Privacy Policy') {
            return 'https://mybattle11.com/policymobile'
        } else if (title == 'Points System') {  
            return 'https://mybattle11.com/fantasy_points_systemmobile'
        } else if (title == 'Responsible Gaming') {
            return 'https://mybattle11.com/responsible_gamingmobile'
        } else if (title == 'Legalities') {
            return 'https://mybattle11.com/legalitiesmobile'
        } else if (title == 'Fair Play Policy') {
            return 'https://mybattle11.com/fairPlaymobile'
        } else{
        }
    }

    return (
        <AppSafeAreaView hidden={false}>
            <StatusBar
                backgroundColor={'transparent'}
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
            <CommonImageBackground common>
                <Header
                    style={{
                        marginTop: '12%',
                    }}
                    title={title}
                    commonHeader
                />
                <KeyBoardAware>
                    <WebView
                        source={{ uri: titleName() }}
                    />
                </KeyBoardAware>
            </CommonImageBackground>
        </AppSafeAreaView>
    )
}
const styles = StyleSheet.create({

})
export default WebUrl
