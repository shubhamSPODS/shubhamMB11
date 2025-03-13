import {View, ImageBackground, Text} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import {
  BAT,
  BAT_BOWL,
  BOWL,
  GLOVE,
  green,
  shapeParallelogram,
  white,
} from '../../helper/image';
import {AppText} from '../../common/AppText';
import {fontFamilyPoppins} from '../../theme/typography';

const PlayerRoleBadge = ({playerDetails, data}) => {
  return (
    <>
      <ImageBackground
        resizeMode="contain"
        source={shapeParallelogram}
        style={styles.container}>
        {data?.length == playerDetails ? (
          <AppText
            style={{
              color: 'white',
              fontSize: 12,
              fontFamily: fontFamilyPoppins,
              fontWeight: '500',
              marginTop:2
            }}>
            {playerDetails}
          </AppText>
        ) : (
          <></>
        )}
      </ImageBackground>
    </>
  );
};

export default PlayerRoleBadge;
