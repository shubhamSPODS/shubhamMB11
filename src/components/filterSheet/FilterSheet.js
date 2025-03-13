import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { MATCH_REMAINDER_CLOSE_ICON } from '../../helper/image';
import {
  AppText,
  BLACKOPACITY,
  FORTEEN,
  LATO_SEMI_BOLD,
  LIGHTBLUE,
  POPPINS_BOLD,
  POPPINS_BOLD_ITALIC,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  THIRTEEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { colors } from '../../theme/color';
import { useDispatch, useSelector } from 'react-redux';
import { getContestList } from '../../slices/matchSlice';

const FilterSheet = ({
  onClose,
  filterdata,
  setFilterData,
  entry,
  setEntry,
  team,
  setTeam,
  prize,
  setPrize,
  contest,
  setContest,
}) => {
  const dispatch = useDispatch();
  const contestDataOne = useSelector(state => state?.match?.contestData);
  const { _id, isFromMyMatch, match_id, isHome } = contestDataOne ?? '';
  const [random, setRandom] = useState(10);
  const entryData = [
    {
      id: 1,
      value: '₹1 - ₹50',
      filter: `entryfee_one_to_fifty: true`,
    },
    {
      id: 2,
      value: '₹51 - ₹100',
      filter: `enteryfee_fifty_one_to_hund: true`,
    },
    {
      id: 3,
      value: '₹101 - ₹1000',
      filter: `enteryfee_onehundone_to_thous: true`,
    },
    {
      id: 4,
      value: '₹1001 & above',
      filter: `enteryfee_thoushandone_above: true`,
    },
  ];

  const teamData = [
    {
      id: 1,
      value: '2',
      filter: `num_of_spots_two: true`,
    },
    {
      id: 2,
      value: '3 - 10',
      filter: `num_of_spts_thre_to_ten: true`,
    },
    {
      id: 3,
      value: '11 - 100',
      filter: `num_of_spts_elvn_onethoshand: true`,
    },
    {
      id: 4,
      value: '101 -  1,000',
      filter: `num_of_one_zero_one_abv_onethoudhand: true`,
    },
    {
      id: 5,
      value: '₹1001 & above',
      filter: `num_of_spots_abv_onethouOne: true`,
    },
  ];

  const priseData = [
    {
      id: 1,
      value: '₹1 - ₹10,000',
      filter: `prize_pool_one_to_tenthoushand: true`,
    },
    {
      id: 2,
      value: '₹10,000 - ₹1 Lakh',
      filter: `prize_pool_ten_to_lakh: true`,
    },
    {
      id: 3,
      value: '₹1 Lakh & above',
      filter: `prize_pool_lakhonehabove: true`,
    },
  ];
  const contestData = [
    {
      id: 1,
      value: 'Single Entry',
      filter: `join_with_mult: false`,
    },
    {
      id: 2,
      value: 'Multi Entry',
      filter: `join_with_mult: true`,
    },
    // {
    //   id: 3,
    //   value: 'Single Winner',
    // },
    // {
    //   id: 4,
    //   value: 'Multi Winner',
    // },
    // {
    //   id: 5,
    //   value: 'Multi Winner',
    // },
  ];
  const onPress = (item, selectedData, setSelectedData, filteritems) => {
    let indexOf = selectedData.findIndex(i => i?.id === item?.id);
    indexOf !== -1 ? selectedData.splice(indexOf, 1) : selectedData?.push(item);
    setSelectedData(selectedData);
    setRandom(Math.random());
    let truefalse = filterdata.findIndex(i => i === filteritems);
    if (truefalse > -1) {
      let indexOf = filterdata.findIndex(i => i === filteritems);
      let filter = [...filterdata];
      filter?.splice(indexOf, 1);
      setFilterData(filter);
    } else {
      let filter = [...filterdata];
      filter?.push(filteritems);
      setFilterData(filter);
    }
  };
  const outputObject = filterdata.reduce((result, item) => {
    const [key, value] = item.split(': ');
    result[key] = value === 'true';
    return result;
  }, {});

  const onSubmit = () => {
    dispatch(getContestList(outputObject, isHome ? match_id : _id));
    onClose();
  };
  const Onclear = () => {
    dispatch(getContestList({}, isHome ? match_id : _id));
    setFilterData([]);
    setEntry([]);
    setTeam([]);
    setPrize([]);
    setContest([]);
    onClose();
  };
  const CommonContainer = ({ title, data, selectedData, setSelectedData }) => {
    return (
      <>
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
          }}>
          <AppText type={FORTEEN} style={styles.label}>
            {title}
          </AppText>
          <View style={styles.entryContainer}>
            {data.map((item, index) => {
              let indexOf = selectedData.findIndex(i => i?.id === item?.id);
              let indexOfTwo = filterdata.findIndex(i => i === item?.filter);
              return (
                <TouchableOpacityView
                  onPress={() =>
                    onPress(item, selectedData, setSelectedData, item?.filter)
                  }
                  key={index}
                  style={[
                    indexOf !== -1 || indexOfTwo !== -1
                      ? styles.entry2
                      : styles.entry,
                  ]}>
                  <AppText weight={LATO_SEMI_BOLD} >{item?.value}</AppText>
                </TouchableOpacityView>
              );
            })}
          </View>
        </View>
        <LinearGradient
          style={{
            height: 1,
            opacity: 0.2,
          }}
          colors={[colors.linerLineBlue, colors.linerLinePick, '#FFFFFF20']}
        />
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={styles.top}>
        <TouchableOpacity
          style={{
            padding: 5,
          }}
          onPress={onClose}>
          <FastImage
            source={MATCH_REMAINDER_CLOSE_ICON}
            style={styles.closeIcon}
            resizeMode="contain"
            tintColor={colors.white}
          />
        </TouchableOpacity>
        <AppText color={WHITE} weight={POPPINS_SEMI_BOLD} type={FORTEEN}>
          Filter
        </AppText>
        <TouchableOpacityView onPress={Onclear}>
          <AppText
            color={WHITE}
            type={TWELVE} weight={{ POPPINS_MEDIUM }}>
            Clear
          </AppText>
        </TouchableOpacityView>
      </View>
      <View
        style={{
          flexGrow: 1,
          backgroundColor: colors.borderGry
        }}>
        <CommonContainer
          title={'Entry'}
          data={entryData}
          selectedData={entry}
          setSelectedData={setEntry}
        />
        <CommonContainer
          title={'Number Of Teams'}
          data={teamData}
          selectedData={team}
          setSelectedData={setTeam}
        />
        <CommonContainer
          title={'Prize Pool'}
          data={priseData}
          selectedData={prize}
          setSelectedData={setPrize}
        />
        <CommonContainer
          title={'Contest Type'}
          data={contestData}
          selectedData={contest}
          setSelectedData={setContest}
        />
        <TouchableOpacity
          onPress={onSubmit}
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            marginBottom: 10,
            marginTop:20
          }}>
          <LinearGradient
            style={styles.btn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.0, y: 0 }}
            colors={[colors.playerDetailsLinerOne, colors.playerDetailsLinerTwo]}>
            <AppText
              style={{ color: 'white' }}
              type={THIRTEEN}
              weight={POPPINS_BOLD_ITALIC}>
              APPLY
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default FilterSheet;
