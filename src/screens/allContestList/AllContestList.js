import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { appOperation } from '../../appOperation';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import {
  AppText,
  BLACK,
  POPPINS,
  POPPINS_MEDIUM,
  SIXTEEN,
} from '../../common/AppText';
import { SpinnerSecond } from '../../common/SpinnerSecond';
import CommonHeader from '../../components/matchCard/commonHeader/CommonHeader';
import ContestCard from '../../components/matchCard/contestCard/ContestCard';
import styles from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import FilterSheet from '../../components/filterSheet/FilterSheet';
import MatchRemainder from '../../components/matchCard/matchRemainder/MatchRemainder';
import { Screen } from '../../theme/dimens';
import { useSelector } from 'react-redux';
import { StatusBar } from 'native-base';
import CommonImageBackground from '../../common/commonImageBackground';
const AllContestList = ({ }) => {
  const route = useRoute();
  const filterSheet = useRef();
  const sheet = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [modalRemove, setModalRemove] = useState(false)
  const contestData = useSelector(state => state?.match?.contestData);
  const allContestList = useSelector(state => state?.match?.allContestList);
  const renderAllContestList = ({ item }) => {
    return (
      <ContestCard
        details={item}
        totalTeamCount={route?.params?.totalTeamCount}
      />
    );
  };

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <CommonHeader
          allContest={true}
          style={{
            marginBottom: 0,
          }}
          details={route?.params?.matchDetails}
          showPopup={() => sheet.current?.open()}
          activeTab={activeTab}
          setActiveTab={e => setActiveTab(e)}
          setModalRemove={setModalRemove}
          otherContainer={{ marginTop: '-20%' }}
        />
        <View style={{ marginHorizontal: 10, flex: 1 }}>
          <FlatList
            data={allContestList}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={renderAllContestList}
          />
        </View>
      </CommonImageBackground>
      <RBSheet
        ref={sheet}
        closeOnDragDown={true}
        height={201}
        customStyles={{
          container: {
            backgroundColor: '#172C66',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
            display: 'none',
          },
        }}>
        <MatchRemainder
          data={contestData}
          onClose={() => sheet?.current?.close()}
        />
      </RBSheet>
      <SpinnerSecond loading={isLoading} />
    </AppSafeAreaView>
  );
};

export default AllContestList;
