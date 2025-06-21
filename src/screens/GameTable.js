import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { AppSafeAreaView } from '../common/AppSafeAreaView'
import { colors, NewColor } from '../theme/color'
import { HomeTopHeader } from '../common/HomeTopHeader'
import { FULL_WIDTH, GET_WITH_TOKEN } from '../Backend/Backend'
import { AppText } from '../common/AppText'
import { setUserData } from '../slices/profileSlice'
import { useDispatch, useSelector } from 'react-redux'
import { PROFILE } from '../navigation/routes'
import { MEDIUM, REGULAR } from '../components/AppFonts'
import { PROFILE_2, WATCH } from '../helper/image'
import PrimaryButton from '../common/primaryButton'
import { toastAlert } from '../helper/utility'
import Header from '../common/Header'
import { universalPaddingHorizontal } from '../theme/dimens'

const GameTable = ({ route,navigation }) => {
    const [listData, setListData] = useState([]);
    const [visible, setVisible] = useState(false)
    const [filteredData, setFilteredData] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const userData = useSelector(state => {
        return state.profile.userData;
      });
    const walletBalance = Number(userData?.winning_amount || 0) + Number(userData?.cash_bonus || 0) + Number(userData?.totaldeposit || 0)

      console.log(userData,'==userdadta');
      
    const gameType = route?.params?.gameType;
    const gameMode = route?.params?.gameMode;
    const isRummy = gameType === 'Rummy';
    const themeColor = isRummy ? colors.backGroundBlue : colors.golden;
    const dispatch = useDispatch()
    const [tabs, setTabs] = useState([
        { id: 0, name: 'All Tables' },
        { id: 1, name: '1v1 Game' },
        { id: 2, name: '4 Players' },
    ]);
    const updateProfile = async () => {
        try {
            const profileData = await GET_WITH_TOKEN('user/profile')
            if (profileData?.success === true) {
                // console.log(profileData,'==profile');
                
                // dispatch(updateUserProfile(profileData?.data))
                dispatch(setUserData(profileData?.data));
            }
        } catch (error) {
            console.log(error, '==error==');
        }
    }
    const getTableData = useCallback(async () => {
        try {
            setVisible(true)
            const response = await GET_WITH_TOKEN(`table`);
            
            
            if (response?.success === true) {
                setVisible(false)
                const filterData = response?.data?.filter(item => 
                    item?.game === gameType && 
                    (gameMode ? item?.gameMode === gameMode : true)
                );
                setListData(filterData);
                // console.log(filterData,'==filterdata');
                
            } else {
                setVisible(false)
            }
        } catch (error) {
            setVisible(false)
            console.log('Fetch Error:', error);
        }
    }, [gameType, gameMode]);
    useEffect(() => {
        updateProfile()
        getTableData();
    }, [getTableData]);
    useEffect(() => {
        let data = [...listData];
        if (selectedTab === 1) {
            data = data?.filter(item => item?.gameType === '2 Player');
        } else if (selectedTab === 2) {
            data = data?.filter(item => item?.gameType === '4 Player');
        }
        data.sort((a, b) => Number(a?.bet || 0) - Number(b?.bet || 0));
        setFilteredData(data);
    }, [selectedTab, listData]);
    const onJoinTable = (item) => {
        if (walletBalance === 0) {
            toastAlert.showToastError('Please add money on your wallet.');
            return;
        } else {
            navigation.navigate('GameJoinTable', { playerDetails: item ,gameType:gameType});
        }
    }
    return (
        <AppSafeAreaView
            statusColor={true}
            style={{ backgroundColor: NewColor.linerWhite }}
            hidden={false}>
            {/* <HomeTopHeader
            /> */}

            <Header
                commonHeader
              title={`${gameType} Tables`}
                style={{ padding: universalPaddingHorizontal, }}
            />

            <View style={styles.tabContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={tabs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: selectedTab === item.id ? colors.golden : colors.background,
                                    borderColor: colors.gray
                                }
                            ]}
                            onPress={() => setSelectedTab(item?.id)}
                        >
                            <AppText
                                size={12}
                                color={colors.white}
                            >
                                {item.name}
                            </AppText>
                        </TouchableOpacity>
                    )}
                />

            </View>

            <FlatList
                data={filteredData} 
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item?._id || index.toString()}
                renderItem={({ item }) => (
                    <TableItem 
                        item={item} 
                        navigation={navigation} 
                        onJoinTable={onJoinTable}
                        isRummy={isRummy}
                        themeColor={themeColor}
                    />
                )}
            />



        </AppSafeAreaView>
    )
}

const TableItem = React.memo(({ item, navigation, onJoinTable, isRummy, themeColor }) => {
    return (
        <View style={[styles.tableCard, { backgroundColor:  '#3f3f3f' }]}>
            <View style={styles.rowBetween}>
                <View style={styles.row}>
                    <Image source={PROFILE_2} style={{width:20,height:20,resizeMode:"contain",
                        tintColor:isRummy ? colors.backGroundBlue : colors.golden
                    }}  />
                    <AppText type={MEDIUM} size={14} color={colors.black}> {item?.gameType || ''}</AppText>
                </View>
                <View style={styles.row}>
                <Image source={WATCH} style={{width:15,height:15,resizeMode:"contain",
                        tintColor:isRummy ? colors.backGroundBlue : colors.golden
                    }}  />
                    <AppText type={MEDIUM} size={14} color={colors.black}>  {item?.gameMode}</AppText>
                </View>
            </View>

            <View style={styles.rowBetweenMargin}>
                <AppText type={REGULAR} size={14} color={colors.black}>Entry Fees</AppText>
                <AppText type={REGULAR} size={14} color={colors.black}>Prize Pool</AppText>
            </View>
            <View style={styles.rowBetweenMargin}>
                <AppText type={REGULAR} size={20} color={'#10B981'}>{item?.bet === 0 ? 'Free' : `₹${item?.bet}`}</AppText>
                <AppText type={REGULAR} size={20} color={'#10B981'}>{item?.totalBet === 0 ? 'Free' : `₹${item?.totalBet}`}</AppText>
            </View>

            <PrimaryButton
            title="Join Table"
            buttonStyle={{marginTop:10}}
            onPress={() => {
                onJoinTable(item)
            }}
            />
        </View>
    );
});

export default GameTable

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        width: FULL_WIDTH - 40,
        marginVertical: 10,
        alignSelf: 'center',
    },
    tab: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 30,
        borderWidth: 1,
    },
    tableCard: {
        width: FULL_WIDTH - 50,
        alignSelf: 'center',
        elevation: 1,
        marginVertical: 10,
        borderRadius: 5,
        padding: 15,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    rowBetweenMargin: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    joinButton: {
        marginBottom: 15,
        left: 0,
    },
})