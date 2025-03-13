import React from 'react';
import {View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {AppText, FORTEEN, POPPINS_SEMI_BOLD} from '../../common/AppText';
import FastImage from 'react-native-fast-image';
import {universalPaddingHorizontal} from '../../theme/dimens';
import {NewColor, colors} from '../../theme/color';
import LinearGradient from 'react-native-linear-gradient';
const Toggle = props => {
  const {onPress, extraContainerStyle, extraJob, extraDetail, selectedLabel} =
    props;
  const data = [
    {
      id: 1,
      nameLabel: 'Cricket',
      icons: require('../../../assets/images/b1.png'),
    },
    // {
    //   id: 2,
    //   nameLabel: 'Football',
    //   icons: require('../../../assets/images/b4.png'),
    // },
    // {
    //   id: 3,
    //   nameLabel: 'Basketball',
    //   icons: require('../../../assets/images/b2.png'),
    // },
    // {
    //   id: 4,
    //   nameLabel: 'Kabbadi',
    //   icons: require('../../../assets/images/b3.png'),
    // },
  ];
  const onClick = Cricket => {
    onPress(Cricket);
  };
  const renderItem = ({item, index}) => {
    return (
      <>
        {selectedLabel === item.nameLabel ? (
          <TouchableOpacity onPress={() => onClick(item.nameLabel)}>
            <LinearGradient
              start={{x: 0, y: 2}}
              end={{x: 0.7, y: 0}}
              colors={[NewColor.linerBabyPink, NewColor.linerWhite]}
              style={[
                styles.detailContainer,
                extraDetail,
                {
                  marginLeft:
                    data?.length + 1 == index ? 0 : universalPaddingHorizontal,
                  marginRight:
                    data?.length - 1 == index ? universalPaddingHorizontal : 0,
                },
              ]}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                style={[styles.detailContainerTwo, extraDetail]}
                colors={[NewColor.linerLightBlue, NewColor.linerLightBlueTen]}>
                <View style={styles.one}>
                  <FastImage
                    resizeMode="contain"
                    style={styles.two}
                    source={item.icons}
                    tintColor={colors.black}
                  />
                  <AppText
                    weight={POPPINS_SEMI_BOLD}
                    style={
                      selectedLabel === item.nameLabel
                        ? styles.detail
                        : styles.job
                    }>
                    {item.nameLabel}
                  </AppText>
                </View>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onClick(item.nameLabel)}>
            <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 0.9, y: 0.9}}
              colors={[NewColor.linerLightBlue, NewColor.linerWhite]}
              style={[
                styles.jobContainer,
                extraJob,
                {
                  marginLeft:
                    data?.length + 1 == index ? 0 : universalPaddingHorizontal,
                  marginRight:
                    data?.length - 1 == index ? universalPaddingHorizontal : 0,
                },
              ]}>
              <View style={[styles.jobContainertwo, extraJob]}>
                <View style={styles.one}>
                  <FastImage
                    style={styles.three}
                    resizeMethod="contain"
                    source={item.icons}
                    tintColor={colors.black}
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </>
    );
  };
  return (
    <View style={{alignItems:'center'}} /* style={[extraContainerStyle]} */>
         {/* <TouchableOpacity onPress={() => onClick(item.nameLabel)}> */}
            <LinearGradient
              start={{x: 0, y: 2}}
              end={{x: 0.7, y: 0}}
              colors={[NewColor.linerBabyPink, NewColor.linerWhite]}
              style={[
                styles.detailContainer,
                extraDetail,
                // {
                //   marginLeft:
                //     data?.length + 1 == index ? 0 : universalPaddingHorizontal,
                //   marginRight:
                //     data?.length - 1 == index ? universalPaddingHorizontal : 0,
                // },
              ]}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 0.7, y: 0}}
                style={[styles.detailContainerTwo, extraDetail]}
                colors={[NewColor.linerLightBlue, NewColor.linerLightBlueTen]}>
                <View style={styles.one}>
                  <FastImage
                    resizeMode="contain"
                    style={styles.two}
                    source={require('../../../assets/images/b1.png')}
                    tintColor={colors.black}
                  />
                  <AppText
                    weight={POPPINS_SEMI_BOLD}
                    type={FORTEEN}
                    style={
                      // selectedLabel === item.nameLabel
                        // ? styles.detail
                        // : 
                        styles.job
                    }>
                  Cricket
                  </AppText>
                </View>
              </LinearGradient>
            </LinearGradient>
          {/* </TouchableOpacity> */}
      {/* <FlatList horizontal={true} data={data} renderItem={renderItem} /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  detailContainer: {
    borderRadius: 20,
    width: 212,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobContainer: {
    borderRadius: 20,
    width: 66,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainerTwo: {
    width: 209,
    height: 32,
    justifyContent: 'center',
    borderRadius: 20,
  },
  jobContainertwo: {
    borderRadius: 20,
    backgroundColor: NewColor.linerWhite,
    width: 62,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detail: {
    marginLeft: 5,
  },
  job: {
    marginLeft: 2,
    textTransform:'uppercase'
  },
  one: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    alignItems: 'center',
  },
  two: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  three: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    maginRight: 2,
  },
});

export default Toggle;
