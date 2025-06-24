import React from 'react';
import { FlatList, View } from 'react-native';
import { AppText, POPPINS_BOLD, SIXTEEN } from '../../../common/AppText';
import NavigationService from '../../../navigation/NavigationService';
import { ALL_CONTEST_LIST } from '../../../navigation/routes';
import ContestCard from '../contestCard/ContestCard';
import { useDispatch, useSelector } from 'react-redux';
import { setAllContest } from '../../../slices/matchSlice';

const Contest = ({ details, totalTeamCount, matchId }) => {
  const dispatch = useDispatch();
  const contestList = useSelector(state => state?.match?.contestList);

  const renderContest = ({ item }) => {
    console.log('Rendering contest item:', item);
    return <ContestCard details={item} totalTeamCount={totalTeamCount} />;
  };

  const onSubmit = () => {
    const checkId = details?.data?.[0]?.contest_category_id;
    const filteredData = contestList?.data?.filter(category =>
      category.data?.some(contest => contest.contest_category_id === checkId),
    );
    const HighestData = filteredData?.[0]?.data || [];
    const highPricedItems = [...HighestData].sort(
      (a, b) => b.winning_amount - a.winning_amount,
    );
    dispatch(setAllContest(highPricedItems));
    NavigationService.navigate(ALL_CONTEST_LIST, {
      contest_category_id: details?.data?.[0]?.contest_category_id,
      contestName: details?.name,
      matchId: matchId,
      totalTeamCount: totalTeamCount,
    });
  };

  if (!details?.data?.length) {
    return null;
  }

  return (
    <View style={{marginBottom: 15}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <AppText
          type={SIXTEEN}
          style={{marginVertical: 10}}
          weight={POPPINS_BOLD}>
          {details?.name}
        </AppText>
      </View>
      <FlatList
        data={details?.data}
        renderItem={renderContest}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Contest;
