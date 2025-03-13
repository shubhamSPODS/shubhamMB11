import React, { useState, useEffect } from 'react';
import { FlatList, ImageBackground, ScrollView, View } from 'react-native';
import { AppText, POPPINS_SEMI_BOLD, TWELVE, TWENTY } from '../../common/AppText';
import PrimaryButton from '../../common/primaryButton';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';

import SecondaryButton from '../../common/secondaryButton';
import {
  bg,
  bell,
  battle,
  wallet,
  personIcon,
  right_arrow,
  refer_earn,
  terms_conditions,
  combine,
  notification,
  balance,
  helpDesk,
  aboutUs,
  Privacy,
  howto,
  fsPoints,
  responsibleGame,
  legalities,
} from '../../helper/image';
import { RootState } from '../../libs/rootReducer';
import styles from './styles';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { KeyBoardAware } from '../../common/KeyboardAware';
import FastImage from 'react-native-fast-image';
import { userLogout } from '../../actions/authActions';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import NavigationService from '../../navigation/NavigationService';
import {
  MY_BALANCE,
  NFC,
  REFER_EARN,
  Notification__SCREEN,
  BOTTOM_TAB_PROFILE_SCREEN,
  WEB_URL,
  DESK_HELP,
  MYBATTLEREFEREARN,
  PROFILE,
  PROFILE_EDIT,
} from '../../navigation/routes';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar } from 'native-base';
import CommonImageBackground from '../../common/commonImageBackground';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { NewColor, colors } from '../../theme/color';
import { HomeTopHeader } from '../../common/HomeTopHeader';
import { getUserProfile } from '../../actions/profileAction';

const DATA = [
  {
    id: '1',
    source: balance,
    heading: 'My Balance',
    type: right_arrow,
  },
  {
    id: '10',
    source: helpDesk,
    heading: 'Help Desk',
    type: right_arrow,
  },
  {
    id: '2',
    source: refer_earn,
    heading: 'Refer & Earn',
    type: right_arrow,
  },
  {
    id: '3',
    source: terms_conditions,
    heading: 'Terms & Conditions',
    type: right_arrow,
  },
  {
    id: '4',
    source: aboutUs,
    heading: 'About Us',
    type: right_arrow,
  },
  {
    id: '8',
    source: Privacy,
    heading: 'Privacy Policy',
    type: right_arrow,
  },
  {
    id: '5',
    source: howto,
    heading: 'How To Play',
    type: right_arrow,
  },
  {
    id: '6',
    source: fsPoints,
    heading: 'Fantasy Points System',
    type: right_arrow,
  },
  {
    id: '7',
    source: responsibleGame,
    heading: 'Responsible Gaming',
    type: right_arrow,
  },
  {
    id: '9',
    source: legalities,
    heading: 'Legalities',
    type: right_arrow,
  },
  {
    id: '11',
    source: Privacy,
    heading: 'Fair Play Policy',
    type: right_arrow,
  },
];

const More = () => {
  const dispatch = useDispatch();
  const [mdlVisibile, setMdlVisible] = useState(false);
  useEffect(() => {
    dispatch(getUserProfile(false, false));
  }, [])
  const onPressAction = (id, heading) => {
    if (id == '1') return NavigationService.navigate(MY_BALANCE);
    if (id == '2') return NavigationService.navigate(MYBATTLEREFEREARN);
    if (id == '10') return NavigationService.navigate(DESK_HELP);
    if (id >= '3' || id == '11') return NavigationService.navigate(WEB_URL, { titleNames: heading });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacityView
        key={item.id}
        onPress={() => onPressAction(item.id, item.heading)}
        style={styles.box}>
        <View style={styles.boxContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.phoneContainer}>
              <FastImage
                source={item.source}
                tintColor={colors.lightOrange}
                resizeMode="contain"
                style={{ height: 20, width: 20 }}
              />
            </View>
            <View style={styles.mobileContainer}>
              <AppText type={TWELVE} style={styles.mobile}>
                {item.heading}
              </AppText>
            </View>
          </View>
          <View style={styles.arrow}>
            <FastImage
              source={item.type}
              resizeMode="contain"
              style={{ width: 6, height: 12, marginRight: 10 }}
              tintColor={colors.white}
            />
          </View>
        </View>
      </TouchableOpacityView>
    );
  };

  return (
    <AppSafeAreaView statusColor={true} hidden={false}>
      <CommonImageBackground common>
        <HomeTopHeader
          personClick={() =>
            NavigationService.navigate(PROFILE)
          }
        />

        <ScrollView style={styles.bottomContainer}>
          {DATA.map(item => {
            return renderItem({ item });
          })}
          <PrimaryButton
            onPress={() => setMdlVisible(true)}
            buttonStyle={styles.button}
            title="LOG OUT"
          />
        </ScrollView>
      </CommonImageBackground>

      <Modal
        isVisible={mdlVisibile}
        style={{ margin: 0 }}
        animationIn="fadeIn"
        animationOut={'fadeOut'}
        hasBackdrop={true}
        onBackdropPress={() => setMdlVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: NewColor.linerBlackFive,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.modalBox}>
            <AppText
              style={styles.modalText}
              type={TWENTY}
              weight={POPPINS_SEMI_BOLD}>
              Are you sure you want to {'\n'} logout?
            </AppText>
            <PrimaryButton
              onPress={() => dispatch(userLogout())}
              title="LOGOUT"
            />

            <SecondaryButton
              onPress={() => setMdlVisible(false)}
              title="CANCEL"
            />
          </View>
        </View>
      </Modal>
    </AppSafeAreaView>
  );
};

export default More;
