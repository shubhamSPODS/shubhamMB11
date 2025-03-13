import React from "react";
import { View, StyleSheet } from 'react-native';
import { AppSafeAreaView } from "./AppSafeAreaView";
import { KeyBoardAware } from "./KeyboardAware";
import WebView from "react-native-webview";
import Header from "./Header";
import CommonImageBackground from "./commonImageBackground";
import { StatusBar } from "native-base";


const HomePrivacy = ({ route }: any) => {
    let title = route?.params?.titleNames
    let titleName = () => {
        if (title == 'Terms & Conditions') {
            return 'https://mybattle11.com/termsNConditions'
        } else if (title == 'About Us') {
            return 'https://mybattle11.com/about'
        } else if (title == 'How To Play') {
            return 'https://mybattle11.com/howToPlay'
        } else if (title == 'Privacy Policy') {
            return 'https://mybattle11.com/policy'
        } else if (title == 'Fantasy Points System') {
            return 'https://mybattle11.com/coming_soon'
        } else if (title == 'Responsible Gaming') {
            return 'https://mybattle11.com/responsible_gaming'
        } else if (title == 'Legalities') {
            return 'https://mybattle11.com/coming_soon'
        } else if (title == 'Fair Play Policy') {
            return 'https://mybattle11.com/coming_soon'
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
                        height:70
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
export default HomePrivacy
