import React from "react";
import { AppSafeAreaView } from "../../common/AppSafeAreaView";
import { StatusBar, StyleSheet } from "react-native";
import CommonImageBackground from "../../common/commonImageBackground";
import CommonHeader from "../../components/matchCard/commonHeader/CommonHeader";
import ContestHeader from "../../common/ContestHeader";
const MyContestSwipe = () => {
    return (
        <AppSafeAreaView hidden={false}>
            <StatusBar
                backgroundColor={'transparent'}
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
            <CommonImageBackground common>
                <ContestHeader />
            </CommonImageBackground>
        </AppSafeAreaView>
    )
};
export default MyContestSwipe;
const styles = StyleSheet.create({

})