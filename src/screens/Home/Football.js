import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import Card from './Card';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  POPINS_THIN_ITALIC,
  POPPINS,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  THIRTEEN,
  TWENTY_FOUR,
} from '../../common/AppText';
import NavigationService from '../../navigation/NavigationService';
import {BOTTOM_TAB_CONTEST_SCREEN} from '../../navigation/routes';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
const Football = () => {
  return (
    <ScrollView style={{marginTop: 30, height: 700}}>
      <View style={{}}>
        <AppText
          weight={POPPINS_SEMI_BOLD}
          type={TWENTY_FOUR}
          style={{
            textAlign: 'center',
          }}>
          Coming Soon
        </AppText>
      </View>
    </ScrollView>
  );
};

export default Football;
