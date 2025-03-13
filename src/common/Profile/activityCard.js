import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
// import {AppText} from '../AppText';
import { AppText, EIGHT, POPPINS, POPPINS_SEMI_BOLD, TWELVE } from '../AppText';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { colors } from '../../theme/color';
import { TouchableOpacityView } from '../TouchableOpacityView';

const ActivityCard = props => {
  let space = props?.index % 2 == 0 ? { marginEnd: 5 } : { marginStart: 5 };
  return (
    <View
      style={[
        space,
        {
          flex: 1,
          marginVertical: 5,
          borderRadius: 16,
          // borderWidth: 1,
          // borderColor: colors.borderLightBlue,
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor:colors.bottomBackgroundColor
        },
      ]}>
      <View
        style={[
          {
            margin: 1,
            borderRadius: 10,
            flexDirection: 'row-reverse',
            alignItems: 'center'
          },
          !props.rowReverse && {
            flexDirection: 'row',
            borderRadius: 16,
          },
        ]}>
        <Image
          style={[
            { width: 35, height: 35 },
            props.rowReverse && {
              alignSelf: 'flex-end',
              width: 20,
              height: 20,
            },
          ]}
          resizeMode="contain"
          source={props?.image}
        />
        {/* {!props.rowReverse && (
            <AppText
              style={[styles.color(colors), {marginTop: 10}]}
              type={TWELVE}
              weight={POPPINS}>
              {props?.title}
            </AppText>
          )} */}
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 15,
          }}>
          <AppText weight={POPPINS_SEMI_BOLD}>{props?.value}</AppText>
          {props.rowReverse && (
            <AppText style={{ marginTop: 4 }} type={TWELVE} weight={POPPINS}>
              {props?.title}
            </AppText>
          )}
          {!props.rowReverse && (
            <AppText type={TWELVE} weight={POPPINS}>
              {props?.title}
            </AppText>
          )}
        </View>
      </View>


    </View>
  );
};

export default ActivityCard;

const styles = StyleSheet.create({});
