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
    if (!item) {
      console.log('Skipping null or undefined contest item');
      return null;
    }
    
    // Add default values for required fields, but preserve original values from API
    const contestDetails = {
      ...item, // Spread item first to preserve original values
      Contestsize: item?.Contestsize || 2, // Default to 2 for head to head
      EnteryFee: item?.EnteryFee || 0, // Default entry fee
      Rankdata: item?.Rankdata || [{ Price: 0 }], // Default rank data
      // Preserve original JoinWithMULT and teams values - don't override with defaults
      JoinWithMULT: item?.JoinWithMULT,
      teams: item?.teams,
      name: item?.name || 'Contest',
      Winning_percent: item?.Winning_percent || 50, // Default to 50% for head to head
    };
    
    // Calculate entry fee if not provided but winning amount exists
    if (!contestDetails.EnteryFee && contestDetails.winning_amount) {
      contestDetails.EnteryFee = Math.ceil(contestDetails.winning_amount * 0.2);
    }
    
    console.log('🎯 [CONTEST] Original item from API:', {
      itemId: item?._id,
      itemTeams: item?.teams,
      itemJoinWithMULT: item?.JoinWithMULT,
      itemContestCategoryId: item?.contest_category_id
    });
    console.log('🎯 [CONTEST] Final contest details:', {
      contestId: contestDetails?._id,
      teams: contestDetails?.teams,
      JoinWithMULT: contestDetails?.JoinWithMULT,
      contestCategoryId: contestDetails?.contest_category_id,
      isMultipleEntry: contestDetails?.JoinWithMULT === true || contestDetails?.teams > 1
    });
    
    return <ContestCard details={contestDetails} totalTeamCount={totalTeamCount} />;
  };

  const onSubmit = () => {
    const checkId = details?.data?.[0]?.contest_category_id;
    if (!checkId) {
      console.log('No contest category ID found');
      return;
    }

    const filteredData = contestList?.data?.filter(category =>
      category?.data?.some(contest => contest?.contest_category_id === checkId),
    );

    if (!filteredData?.length) {
      console.log('No matching contests found');
      return;
    }

    const HighestData = filteredData[0]?.data || [];
    const highPricedItems = [...HighestData].sort(
      (a, b) => ((b?.winning_amount || 0) - (a?.winning_amount || 0)),
    );
    
    dispatch(setAllContest(highPricedItems));
    NavigationService.navigate(ALL_CONTEST_LIST, {
      contest_category_id: checkId,
      contestName: details?.name || 'Contest',
      matchId: matchId,
      totalTeamCount: totalTeamCount,
    });
  };

  // Check if we have contest data in the correct structure
  const contestData = details?.contest_details?.[0]?.data || details?.data || [];
  
  if (!contestData?.length) {
    console.log('No contest data available:', details);
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
          {details?.name || 'Contest'}
        </AppText>
      </View>
      <FlatList
        data={contestData}
        renderItem={renderContest}
        keyExtractor={item => item?.contest_category_id || item?._id || Math.random().toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Contest;
