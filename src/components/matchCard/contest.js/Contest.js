import React from 'react';
import { FlatList, View } from 'react-native';
import { AppText, POPPINS_BOLD, SIXTEEN } from '../../../common/AppText';
import NavigationService from '../../../navigation/NavigationService';
import { ALL_CONTEST_LIST, PRACTISE_SCREEN } from '../../../navigation/routes';
import ContestCard from '../contestCard/ContestCard';
import ViewAll from '../viewAll/ViewAll';
import { setAllContest } from '../../../slices/matchSlice';
import { useDispatch, useSelector } from 'react-redux';

const Contest = ({ details, totalTeamCount, matchId }) => {
  // console.log(details?.data,'==daaa');
  const dispatch = useDispatch();
  const contestList = useSelector(state => state?.match?.contestList);
  const renderContest = ({ item }) => {
    return (
      <ContestCard details={item} totalTeamCount={totalTeamCount} />
    );
  };
  const onSubmit = () => {
    const checkId = details?.data[0]?.contest_category_id
    const filteredData = contestList?.data.filter(category => category.data.some(contest => contest.contest_category_id === checkId));
    const HighestData = filteredData && filteredData[0]?.data
    const highPricedItems = HighestData
      .slice()
      .sort((a, b) => b.winning_amount - a.winning_amount);
    dispatch(setAllContest(highPricedItems))
    NavigationService.navigate(ALL_CONTEST_LIST, {
      contest_category_id: details?.data[0]?.contest_category_id,
      contestName: details?.name,
      matchId: matchId,
      totalTeamCount: totalTeamCount,
    })
  }
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <AppText
          type={SIXTEEN}
          style={{ marginTop: 5, marginBottom: 10 }}
          weight={POPPINS_BOLD}>
          {details?.name}
        </AppText>
        {/* {details?.more && (
          <ViewAll
            onPress={onSubmit}
          />
        )} */}
      </View>
      <FlatList
        data={details?.data} renderItem={renderContest} />
    </>
  );
};

export default Contest;
