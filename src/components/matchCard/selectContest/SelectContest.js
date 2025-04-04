import {Dimensions, FlatList, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import FastImage from "@d11/react-native-fast-image";

import {
  AppText,
  POPPINS_BOLD,
  POPPINS_BOLD_ITALIC,
  THIRTEEN,
} from '../../../common/AppText';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
// import Confirmation from '../../common/Confirmation';
import MyTeam from '../myTeam/MyTeam';
import { toastAlert } from '../../../helper/utility';
import { CLOSE_WHITE_ICON } from '../../../helper/image';
const SelectContest = ({onClose, contestDetails, matchDetails}) => {
  const dispatch = useDispatch();
  const myTeam = useSelector(state => state?.match?.myTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const onSelectTeam = item => {
    setSelectedTeam(item);
  };
  const onJoinContest = async () => {
    if (!selectedTeam) {
      return toastAlert.showToastError('Please Select Team Before Join Contest');
    }
    setIsAdd(true);
  };
  const renderMyTeam = ({item}) => {
    return (
      <MyTeam
        item={item}
        isFromSelect={true}
        onSelectTeam={data => onSelectTeam(data)}
        isTeamSelected={selectedTeam?._id == item?._id}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeImageContainer} onPress={onClose}>
        <FastImage
          source={CLOSE_WHITE_ICON}
          style={styles.closeIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={{height: 42, justifyContent: 'center'}}>
        <AppText
          weight={POPPINS_BOLD}
          style={{textAlign: 'center', fontSize: 15}}>
          Select Contest
        </AppText>
      </View>
      <View
        style={{marginTop: 20, height: Dimensions.get('window').height - 60}}>
        <FlatList
          data={myTeam}
          renderItem={renderMyTeam}
          contentContainerStyle={{paddingHorizontal: 10 ,  paddingBottom: 120}}
        />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={[]} onPress={onJoinContest}>
          <LinearGradient
            style={styles.btn}
            start={{x: 0, y: 0}}
            colors={['#00B4C3', '#7B57D0']}>
            <AppText
              type={THIRTEEN}
              style={{
                color: 'white',
              }}
              weight={POPPINS_BOLD_ITALIC}>
              Join Contest
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* <Confirmation
        isModalVisible={isAdd}
        details={contestDetails}
        setIsModalVisible={setIsAdd}
        matchDetails={matchDetails}
        onClose={onClose}
      /> */}
    </View>
  );
};

export default SelectContest;
