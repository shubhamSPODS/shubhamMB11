import React, { useState, useEffect, Children } from 'react';
import { View, Text, FlatList, ImageBackground } from 'react-native';
import FastImage from "@d11/react-native-fast-image";
import {
  AppText,
  BLACK,
  EIGHT,
  ELEVEN,
  FIFTEEN,
  GREEN,
  GRY,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RED,
  SEMI_BOLD,
  TEN,
  TWELVE,
  WHITE,
} from '../../../common/AppText';
import { TouchableOpacityView } from '../../../common/TouchableOpacityView';
import { FILTER_ICON, LEFT_ARROW, wallet, notified, rightArrow, backIconMain, WalletIcon, headerIner, VS } from '../../../helper/image';
import moment from 'moment';
import NavigationService from '../../../navigation/NavigationService';
import styles from './styles';
import { useSelector, useDispatch } from 'react-redux';
import CommonTabs from '../commonTabs/CommonTabs';
import { MY_BALANCE } from '../../../navigation/routes';
import { NewColor, colors } from '../../../theme/color';
import { LiveTime } from '../../../common/LiveTime';
import { getFilterSortby, setAllContest, setLoading } from '../../../slices/matchSlice';
import LinearGradient from 'react-native-linear-gradient';
const DATA = [
  {
    id: 1,
    title: 'ENTRY',
  },
  {
    id: 2,
    title: 'SPOTS',
  },
  {
    id: 3,
    title: 'PRIZE POOL',
  },
  {
    id: 4,
    title: '%WINNER',
  },
];

const CommonHeader = ({
  showPopup,
  showFilter,
  activeTab,
  setActiveTab,
  allContest,
  walletIco,
  style,
  stylestwo,
  completeMatch,
  setModalRemove,
  otherContainer,
  title
}) => {
  const dispatch = useDispatch();
  const details = useSelector(state => state?.match?.contestData);
  const myTeam = useSelector(state => state?.match?.myTeams);
  const myContest = useSelector(state => state?.match?.myContest);
  const contestList = useSelector(state => state?.match?.contestList);
  const allContestList = useSelector(state => state?.match?.allContestList);
  const MyCreateContestData = useSelector(
    state => state?.match?.MyCreateContestData,
  );
  const currentDate = new Date();
  const inputDate = new Date(details?.StartDateTime);
  const isPastTime = inputDate < currentDate;
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedHighLow, setSelectedHighLow] = useState('high');
  const [removeTabs, setRemoveTabs] = useState(false)
  const [random, setRandom] = useState('')

  const { total_balance, cash_bonus, winning_amount, totaldeposit } = userData ?? '';
  let totalbalance = winning_amount + cash_bonus + totaldeposit
  useEffect(() => {
    setRandom(Math.random())
  }, [total_balance])
  const timeDifference = Math.floor(
    (inputDate - currentDate) / (24 * 60 * 60 * 1000),
  );
  const idArray =
    contestList &&
    contestList?.data?.flatMap(category =>
      category.data.map(entry => entry._id),
    );
  const filteredData =
    contestList &&
    contestList?.data?.map(value =>
      value?.data?.filter(e => idArray?.includes(e?._id)),
    );
  const idsFilter = filteredData && filteredData?.flat();
  const filterData = filterOption => {
    let sortedItems = [...idsFilter];
    if (filterOption?.title === 'PRIZE POOL') {
      if (selectedHighLow == 'high') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => b.winning_amount - a.winning_amount);
        dispatch(getFilterSortby(highPricedItems));
        setSelectedHighLow('low');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      } else if (selectedHighLow == 'low') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => a.winning_amount - b.winning_amount);
        dispatch(getFilterSortby(highPricedItems));
        setSelectedHighLow('high');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      }
    } else if (filterOption?.title === 'ENTRY') {
      if (selectedHighLow == 'high') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => b.EnteryFee - a.EnteryFee);
        dispatch(getFilterSortby(highPricedItems));
        setSelectedHighLow('low');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      } else if (selectedHighLow == 'low') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => a.EnteryFee - b.EnteryFee);
        dispatch(getFilterSortby(highPricedItems));
        setSelectedHighLow('high');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      }
    } else if (filterOption?.title === 'SPOTS') {
      if (selectedHighLow == 'high') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => b.Contestsize - a.Contestsize);
        dispatch(getFilterSortby(highPricedItems));
        setSelectedHighLow('low');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      } else if (selectedHighLow == 'low') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => a.Contestsize - b.Contestsize);
        dispatch(getFilterSortby(highPricedItems));
        setSelectedHighLow('high');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      }
    } else if (filterOption?.title === '%WINNER') {
      if (selectedHighLow == 'high') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => {
            // Check for undefined or missing Winning_percent values
            const winningPercentA = a.Winning_percent || Number.NEGATIVE_INFINITY;
            const winningPercentB = b.Winning_percent || Number.NEGATIVE_INFINITY;

            return winningPercentB - winningPercentA;
          });
        dispatch(getFilterSortby(highPricedItems));
        setSelectedHighLow('low');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      } else if (selectedHighLow == 'low') {
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => {
            // Check for undefined or missing Winning_percent values
            const winningPercentA = a.Winning_percent !== undefined ? a.Winning_percent : Number.POSITIVE_INFINITY;
            const winningPercentB = b.Winning_percent !== undefined ? b.Winning_percent : Number.POSITIVE_INFINITY;

            return winningPercentA - winningPercentB;
          });
        dispatch(getFilterSortby(highPricedItems));
        setSelectedHighLow('high');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      }
    }
    // setrandom(Math.random());
  };
  const filterDataTwo = filterOption => {
    let sortedItems = [...allContestList];
    if (filterOption?.title === 'PRIZE POOL') {
      if (selectedHighLow == 'high') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => b.winning_amount - a.winning_amount);
        dispatch(setAllContest(highPricedItems));
        setSelectedHighLow('low');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      } else if (selectedHighLow == 'low') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => a.winning_amount - b.winning_amount);
        dispatch(setAllContest(highPricedItems));
        setSelectedHighLow('high');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      }
    } else if (filterOption?.title === 'ENTRY') {
      if (selectedHighLow == 'high') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => b.EnteryFee - a.EnteryFee);
        dispatch(setAllContest(highPricedItems));
        setSelectedHighLow('low');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      } else if (selectedHighLow == 'low') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => a.EnteryFee - b.EnteryFee);
        dispatch(setAllContest(highPricedItems));
        setSelectedHighLow('high');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      }
    } else if (filterOption?.title === 'SPOTS') {
      if (selectedHighLow == 'high') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => b.Contestsize - a.Contestsize);
        dispatch(setAllContest(highPricedItems));
        setSelectedHighLow('low');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      } else if (selectedHighLow == 'low') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => a.Contestsize - b.Contestsize);
        dispatch(setAllContest(highPricedItems));
        setSelectedHighLow('high');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      }
    } else if (filterOption?.title === '%WINNER') {
      if (selectedHighLow == 'high') {
        dispatch(setLoading(true))
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => {
            // Check for undefined or missing Winning_percent values
            const winningPercentA = a.Winning_percent || Number.NEGATIVE_INFINITY;
            const winningPercentB = b.Winning_percent || Number.NEGATIVE_INFINITY;

            return winningPercentB - winningPercentA;
          });
        dispatch(setAllContest(highPricedItems));
        setSelectedHighLow('low');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      } else if (selectedHighLow == 'low') {
        const highPricedItems = sortedItems
          .slice()
          .sort((a, b) => {
            // Check for undefined or missing Winning_percent values
            const winningPercentA = a.Winning_percent !== undefined ? a.Winning_percent : Number.POSITIVE_INFINITY;
            const winningPercentB = b.Winning_percent !== undefined ? b.Winning_percent : Number.POSITIVE_INFINITY;

            return winningPercentA - winningPercentB;
          });
        dispatch(setAllContest(highPricedItems));
        setSelectedHighLow('high');
        setSelectedFilter(filterOption?.title);
        dispatch(setLoading(false))
      }
    }
    // setrandom(Math.random());
  };


  const renderItem = ({ item }) => {
    return (
      <TouchableOpacityView
        style={{
          padding: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          setSelectedFilter(item?.title),
            allContest ? filterDataTwo(item) : filterData(item);
        }}>
        <AppText type={TEN} weight={POPPINS_MEDIUM} style={styles.entryTitle}>
          {item?.title}
        </AppText>
        {item?.title == selectedFilter ? (
          <FastImage
            style={{
              height: 10,
              width: 8,
              marginRight: 10,
              transform: [
                { rotate: selectedHighLow == 'high' ? '270deg' : '90deg' },
              ],
            }}
            source={rightArrow}
            tintColor={colors.green}
            resizeMode="contain"
          />
        ) : (
          <></>
        )}

      </TouchableOpacityView>
    );
  };
  useEffect(() => {
    setModalRemove(removeTabs)
  }, [removeTabs])
  return (
    <View style={[styles.container, style]}>
      <View style={styles.top}>
        <TouchableOpacityView
          onPress={() => NavigationService.goBack()}
          style={{ flexDirection: "row", alignItems: "center" }}>
          <FastImage
            source={backIconMain}
            resizeMode="contain"
            style={styles.leftArrow}
          />
          <AppText>
            {title}
          </AppText>
        </TouchableOpacityView>
        <TouchableOpacityView
            onPress={() => NavigationService.navigate(MY_BALANCE)}>
            <LinearGradient
              colors={['#C1AA9966', '#C1AA9926']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              style={{
                borderRadius: 59,
                flexDirection: 'row',
                marginTop: 2,
                // height: 30,
                padding:3,
                width: 100,
                borderWidth: 2,
                borderColor: '#C1AA9966',
                marginLeft: 30,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 50,
                    right:5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: '#DBA73E',
                  }}>
                  <FastImage
                    style={{height: 12, width: 14}}
                    resizeMode="contain"
                    source={WalletIcon}
                  />
                </View>
                <View>
                  <AppText
                    style={{marginTop: -1,left:5 }}
                    type={TWELVE}
                    weight={POPPINS_SEMI_BOLD}
                    color={WHITE}>
                    ₹ {Math?.round(totalbalance).toFixed(0)}
                  </AppText>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacityView>
      </View>
      <ImageBackground source={headerIner} resizeMode='contain' style={styles.header}>
        <FastImage
          source={{ uri: details?.TeamAlogo }}
          style={styles.teamImage}
          resizeMode="contain"
        />
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AppText
              color={BLACK}
              weight={POPPINS_BOLD}>
              {details?.TeamsShortNames && details?.TeamsShortNames[0]}
            </AppText>
            <FastImage source={VS}
              resizeMode='contain'
              style={{ height: 27, width: 15, marginRight: 5, marginLeft: 5 }} />
            <AppText
              color={BLACK}
              weight={POPPINS_BOLD}>
              {details?.TeamsShortNames && details?.TeamsShortNames[1]}
            </AppText>
          </View>
          <LiveTime
            view={true}
            top={true}
            details={details}
            color={completeMatch ? WHITE : timeDifference >= 1 ? BLACK : BLACK}
            type={TEN}
            completeMatch={completeMatch}
            setRemoveTabs={setRemoveTabs}
          />
        </View>
        <FastImage
          source={{ uri: details?.TeamBlogo }}
          style={styles.teamImage}
          resizeMode="contain"
        />
      </ImageBackground>
      {allContest ? (
        <></>
      ) : (
        <View>
          <CommonTabs
            totalCount={[myContest?.length + MyCreateContestData?.length, myTeam?.length]}
            activeTab={activeTab}
            setActiveTab={e => setActiveTab(e)}
            filterShow={false}
            completeMatch={completeMatch}
            details={details}
            removeTabs={removeTabs}
          />
        </View>
      )}
      {activeTab === 2 ? (
        <View></View>
      ) : activeTab === 3 ? (
        <></>
      ) : activeTab === 4 ? (
        <></>
      ) : (
        <View style={[styles.filterContainer, { otherContainer }]}>
          <AppText
            weight={POPPINS_LIGHT}
            style={{ marginRight: 20, opacity: 0.8 }}
            type={ELEVEN}
            color={WHITE}>
            Sort By:
          </AppText>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={DATA}
            horizontal
            renderItem={renderItem}
          />
          <TouchableOpacityView onPress={showFilter} style={styles.filtermainbackground}>
            <FastImage
              source={FILTER_ICON}
              tintColor={colors.white}
              style={styles.filterIcon}
            />
          </TouchableOpacityView>

        </View>
      )}
    </View>
  );
};

export default CommonHeader;


