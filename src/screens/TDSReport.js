import React from "react";
import { View, StyleSheet, FlatList } from 'react-native';
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { KeyBoardAware } from "../common/KeyboardAware";
import { StatusBar } from "native-base";
import CommonImageBackground from "../common/commonImageBackground";
import Header from "../common/Header";
import { AppText, BLACK, LATO_MEDIUM, LATO_SEMI_BOLD, POPPINS_SEMI_BOLD, SEMI_BOLD, SIXTEEN, THIRTEEN, TWELVE, WHITE } from "../common/AppText";
import { universalPaddingHorizontal } from "../theme/dimens";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { colors } from "../theme/color";

const TDSReport = () => {
    const data = [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
    ]
    const renderItem = ({ item, index }) => {
        return (
            <>
                <View style={{
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    paddingHorizontal: universalPaddingHorizontal,
                    backgroundColor:colors.bottomBackgroundColor
                }}>
                    <AppText
                        style={{ flex: 0.5, textAlign: 'center', marginLeft: -5 }}
                        type={TWELVE} weight={POPPINS_SEMI_BOLD}>
                        {index + 1}
                    </AppText>
                    <View style={{ backgroundColor: '#BEBEBE', width: 1, height: '100%' }} />
                    <AppText
                        style={{ flex: 1.4, textAlign: 'center' }}
                        type={TWELVE} weight={POPPINS_SEMI_BOLD}>
                        498
                    </AppText>
                    <View style={{ backgroundColor: '#BEBEBE', width: 1, height: '100%' }} />
                    <AppText
                        style={{ flex: 1, textAlign: 'center', }}
                        type={TWELVE} weight={POPPINS_SEMI_BOLD}>
                        0
                    </AppText>
                    <View style={{ backgroundColor: '#BEBEBE', width: 1, height: '100%' }} />
                    <AppText
                        style={{ flex: 1, textAlign: 'center' }}
                        type={TWELVE} weight={POPPINS_SEMI_BOLD}>
                        May 19 2023 8:27PM
                    </AppText>
                </View>
                <View style={{ height: 1, backgroundColor: '#BEBEBE' }} />
            </>
        )
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
                    title={'TDS Report'}
                    commonHeader
                />
                <View style={{
                    flex: 1, alignItems: "center",
                    justifyContent: "center"
                }} >
                    <AppText type={SIXTEEN} weight={POPPINS_SEMI_BOLD} color={WHITE}>
                        No TDS Report
                    </AppText>
                </View>
                {/* <View style={{ flex: 1 }} >
                    <View style={{ height: 1, backgroundColor: 'white', marginTop: 15, }} />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: 'space-between',
                        paddingHorizontal: universalPaddingHorizontal,

                        backgroundColor: colors.bottomBackgroundColor,
                    }} >
                        <AppText
                            style={{ flex: 0.5, textAlign: 'center', marginLeft: -5 }}
                            type={TWELVE} weight={POPPINS_SEMI_BOLD}>
                            S. No.
                        </AppText>
                        <View style={{ backgroundColor: '#BEBEBE', width: 1, height: '100%' }} />
                        <AppText
                            style={{ flex: 1.4, textAlign: 'center' }}
                            type={TWELVE} weight={POPPINS_SEMI_BOLD}>
                            Bank Transfer Amount
                        </AppText>
                        <View style={{ backgroundColor: '#BEBEBE', width: 1, height: '100%' }} />
                        <AppText
                            style={{ flex: 1, textAlign: 'center', }}
                            type={TWELVE} weight={POPPINS_SEMI_BOLD}>
                            TDS Amount
                        </AppText>
                        <View style={{ backgroundColor: '#BEBEBE', width: 1, height: '100%' }} />
                        <AppText
                            style={{ flex: 1, textAlign: 'center' }}
                            type={TWELVE} weight={POPPINS_SEMI_BOLD}>
                            Date
                        </AppText>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#BEBEBE' }} />
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => { index.toString() }}
                        showsHorizontalScrollIndicator={false}
                    />
                </View> */}
            </CommonImageBackground>
        </AppSafeAreaView>
    )
}
export default TDSReport;
const styles = StyleSheet.create({
})