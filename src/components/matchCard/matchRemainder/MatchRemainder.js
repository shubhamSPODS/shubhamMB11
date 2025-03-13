import React, {useState} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  AppText,
  BLACKOPACITY,
  FIFTEEN,
  LIGHTBLUE,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  TEN,
  TWELVE,
} from '../../../common/AppText';
import {TouchableOpacityView} from '../../../common/TouchableOpacityView';
import {
  RADIO_BTN_OFF,
  RADIO_BTN_ON,
  notified,
  CLOSE_WHITE_ICON,
} from '../../../helper/image';
import styles from './styles';
import {setMatchRemainder} from '../../../slices/matchSlice';
import {useDispatch} from 'react-redux';
import {colors} from '../../../theme/color';
import { toastAlert } from '../../../helper/utility';

const MatchRemainder = ({onClose, data}) => {
  const dispatch = useDispatch();
  const [match, setMatch] = useState(false);
  const [ipl, setIpl] = useState(false);
  const {SeriesName, SeriesId, MatchId, _id, TeamA, TeamB} = data ?? '';
  const onMatchAlert = () => {
    setMatch(!match);
    let data = {
      match_id: _id,
      matchid: MatchId,
      allowed: !match,
    };
    dispatch(setMatchRemainder(data));
  };
  const onSeriesAlert = () => {
    setIpl(!ipl);
    let data = {
      match_id: _id,
      matchid: MatchId,
      cid: SeriesId,
      allowed: !ipl,
    };
    dispatch(setMatchRemainder(data));
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          width: '100%',
          height: 190,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
        }}>
        <View style={styles.top}>
          <FastImage
            source={notified}
            style={styles.remainderLogo}
            resizeMode="contain"
            tintColor={colors.borderBackColor}
          />
          <AppText
            style={{
              marginLeft: 15,
              flex: 1,
              textAlign: 'center',
              marginTop: 2,
            }}
            color={LIGHTBLUE}
            type={FIFTEEN}
            weight={POPPINS_SEMI_BOLD}>
            Set Match Reminder
          </AppText>
          <TouchableOpacityView
            style={[
              styles.remainderLogo,
              {alignItems: 'center', justifyContent: 'center'},
            ]}
            onPress={() => onClose()}>
            <FastImage
              source={CLOSE_WHITE_ICON}
              style={styles.closeIcon}
              resizeMode="contain"
              tintColor={colors.borderBackColor}
            />
          </TouchableOpacityView>
        </View>
        <View
          style={{
            width: '100%',
            height: '80%',
            paddingHorizontal: 10,
            bottom: 10,
          }}>
          <View style={styles.matchContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppText weight={POPPINS_SEMI_BOLD} type={TWELVE}>
                Match - {TeamA} vs {TeamB}
              </AppText>
              <TouchableOpacityView onPress={() => onMatchAlert()}>
                <FastImage
                  source={match ? RADIO_BTN_ON : RADIO_BTN_OFF}
                  style={styles.radioBtn}
                  resizeMode="contain"
                  tintColor={match ? null : colors.gray}
                />
              </TouchableOpacityView>
            </View>
            <AppText weight={POPPINS_MEDIUM} color={BLACKOPACITY} type={TEN}>
              will send reminder when lineup announced
            </AppText>
          </View>
          <View style={styles.matchContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppText weight={POPPINS_SEMI_BOLD} type={TWELVE}>
                {SeriesName}
              </AppText>
              <TouchableOpacityView onPress={() => onSeriesAlert()}>
                <FastImage
                  source={ipl ? RADIO_BTN_ON : RADIO_BTN_OFF}
                  style={styles.radioBtn}
                  resizeMode="contain"
                  tintColor={ipl ? null : colors.gray}
                />
              </TouchableOpacityView>
            </View>
            <AppText weight={POPPINS_MEDIUM} color={BLACKOPACITY} type={TEN}>
           will send reminder when lineup announced in every match
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MatchRemainder;
