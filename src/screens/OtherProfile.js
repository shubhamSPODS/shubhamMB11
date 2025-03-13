import { View, ImageBackground, FlatList, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import {
    contest_position,
    cricketKit,
    placeholderImage,
    PriceCupBlue,
    Profilebackground,
    ProfileBackgroundImage,
    reward,
} from '../helper/image';
import {
    AppText,
    POPPINS,
    POPPINS_MEDIUM,
    POPPINS_SEMI_BOLD,
    SIXTEEN,
    TEN,
    TWELVE,
    WHITE,
} from '../common/AppText';
import { useSelector } from 'react-redux';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import LinearGradient from 'react-native-linear-gradient';
import ActivityCard from '../common/Profile/activityCard';
import Level from '../common/Profile/level';
import FastImage from 'react-native-fast-image';
import SecondaryButton from '../common/secondaryButton';
import NavigationService from '../navigation/NavigationService';
import {
    MY_BALANCE,
    PROFILE_EDIT,
    ADD_MONEY_SCREEN,
} from '../navigation/routes';
import { IMAGE_BASE_URL } from '../helper/utility';
import { StatusBar } from 'native-base';
import PrimaryButton from '../common/primaryButton';
import { NewColor, colors } from '../theme/color';
import { fontFamilyPoppins } from '../theme/typography';
import { universalPaddingHorizontal } from '../theme/dimens';

const data = [
    {
        image: PriceCupBlue,
        title: 'Played Contest',
        earning: '10',
    },
    {
        image: cricketKit,
        title: 'Match Played',
        earning: '10',
    },
    {
        image: reward,
        title: 'Total Series',
        earning: '14',
    },
    {
        image: contest_position,
        title: 'Total Sports',
        earning: '21',
    },
];

const OtherUserProfile = (props: any) => {
    const userData = useSelector(state => {
        return state.profile.userData;
    });

    const { mobile_number, full_name, total_balance, cash_bonus, winning_amount } =
        userData ?? '';
    const data1 = [
        {
            title: 'Total Balance',
            earning: `${total_balance}`,
            color1: '#9E96FF',
            color2: '#DF9DFE',
        },
        {
            title: 'Cash Bonus',
            earning: `${cash_bonus}`,
            color1: '#3FAC8A',
            color2: '#9CCF75',
        },
        {
            title: 'Winning Amount',
            earning: `${winning_amount}`,
            color1: '#FB8D89',
            color2: '#FFB879',
        },
    ];
    return (
        <AppSafeAreaView statusColor={'transparent'} hidden={false}>
            <StatusBar
                backgroundColor={'transparent'}
                translucent={true}
                networkActivityIndicatorVisible={true}
            />

            <ScrollView style={{ backgroundColor: NewColor.linerWhite }}>
                <ImageBackground
                    source={Profilebackground}
                    resizeMode={'cover'}
                    style={styles.ImageBackground}>
                    <View style={styles.secondView}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={[
                                colors.profileOne,
                                colors.profileTwo,
                                colors.profileThree,
                            ]}
                            style={styles.profileImageView}>
                            <FastImage
                                style={styles.profileImage}
                                source={
                                    userData?.logo
                                        ? { uri: `${IMAGE_BASE_URL}${userData?.logo}` }
                                        : placeholderImage
                                }
                                resizeMode={'cover'}
                            />
                        </LinearGradient>
                        <View style={styles.informationView}>
                            <AppText
                                color={WHITE}
                                type={SIXTEEN}
                                numberOfLines={1}
                                weight={POPPINS_MEDIUM}>
                                {full_name}
                            </AppText>
                            <AppText
                                color={WHITE}
                                type={TWELVE}
                                numberOfLines={1}
                                weight={POPPINS}>
                                {mobile_number}
                            </AppText>
                        </View>
                        <SecondaryButton
                            title="Edit"
                            onPress={() => NavigationService.navigate(PROFILE_EDIT)}
                            buttonStyle={[styles.editButton, {
                                borderWidth: 1,
                                borderRadius: 10,
                                borderColor: colors.brownYellow

                            }]}
                            titleStyle={styles.editButtonTitle}
                            buttonViewStyle={{
                                height: 25,
                                backgroundColor: NewColor.linerWhite,
                                borderColor: colors.borderLightBlue,
                                borderRadius: 16,
                                borderWidth: 1,
                            }}
                        />
                    </View>
                </ImageBackground>
                <View style={styles.backgroundColorContainer}>
                    <View style={styles.topView}>
                        <View style={styles.balanceCard}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                }}>
                                {data1.map((item, index) => {
                                    return (
                                        <LinearGradient
                                            style={{
                                                height: 80,
                                                borderRadius: 16,
                                                backgroundColor: 'green',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                width: '31%',
                                            }}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={[item.color1, item.color2]}>
                                            <View
                                                style={{
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                }}>
                                                <AppText color={WHITE} weight={POPPINS_SEMI_BOLD}>
                                                    {item.earning == `INR ${undefined}` ||
                                                        item?.earning == `${undefined}`
                                                        ? 'INR 00'
                                                        : `INR ${Math.round(item.earning).toFixed(2)}`}
                                                </AppText>
                                                <AppText color={WHITE} type={TEN} weight={POPPINS}>
                                                    {item.title}
                                                </AppText>
                                            </View>
                                        </LinearGradient>
                                    );
                                })}
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    marginTop: 20,
                                    width: '100%',
                                    paddingHorizontal: 5,
                                }}>
                                <SecondaryButton
                                    onPress={() => NavigationService.navigate(ADD_MONEY_SCREEN)}
                                    buttonStyle={[styles.buttonStyle, {
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        borderColor: colors.brownYellow

                                    }]}
                                    titleStyle={{ color: colors.white, marginTop: -2 }}
                                    btnStyle={{
                                        backgroundColor: NewColor.linerWhite,
                                        borderColor: '#AD53CC',
                                        height: 45,
                                    }}
                                    title={'ADD CASH'}
                                />
                                <PrimaryButton
                                    buttonStyle={styles.buttonStyle}
                                    onPress={() => {
                                        NavigationService.navigate(MY_BALANCE);
                                    }}
                                    title="WITHDRAWl"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.topView}>
                    <Level data={userData} />
                    <AppText type={SIXTEEN} weight={POPPINS_SEMI_BOLD} style={{ top: 10 }}>
                        Your Activity
                    </AppText>

                    <FlatList
                        data={data}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{
                            marginTop: 10,
                        }}
                        renderItem={({ item, index }) => (
                            <ActivityCard
                                key={item?.title}
                                rowReverse={false}
                                title={item.title}
                                image={item.image}
                                value={item.earning}
                                index={index}
                            />
                        )}
                    />
                </View>
            </ScrollView>
            {/* </ImageBackground> */}
        </AppSafeAreaView>
    );
};

export default OtherUserProfile;
const styles = StyleSheet.create({
    backgroundColorContainer: {
        width: '100%',
        marginTop: '-20%',
    },
    ImageBackground: {
        height: 234,
        paddingHorizontal: 20,
    },
    color: {
        color: colors.playerDetailsLinerThree,
    },
    buttonStyle: {
        flex: 1,
        marginHorizontal: 5,
    },
    topView: {
        paddingHorizontal: universalPaddingHorizontal,
        width: '95%',
        alignSelf: 'center',
    },
    secondView: {
        marginTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',

    },
    profileImageView: {
        width: 85,
        height: 85,
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 45,
        // padding: 1,
    },
    profileImage: {
        width: 83,
        height: 83,
        borderRadius: 45,
        margin: 1,
    },
    informationView: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    editButton: { width: 60 },
    editButtonTitle: {
        fontSize: 12,
        fontFamily: fontFamilyPoppins,
        color: colors.black,
        marginTop: 2
    },
    balanceCard: {
        paddingVertical: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.borderLightBlue,
        borderRadius: 16,
        backgroundColor: NewColor.linerWhite
    },
    balanceCardFirst: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginHorizontal: 25,
    },
    balanceCardSecond: {
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    secondContainer: {
        paddingHorizontal: universalPaddingHorizontal,
    },
});