import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import cardStyles from './cardStyles';
import {horizontalLine} from '../../helper/image';
import FastImage from 'react-native-fast-image';

const Card = props => {
  const {eachItem} = props;
  const {
    id,
    img,
    title,
    amount,
    daysLeft,
    commission,
    owner,
    rentee,
    commisionPercentage,
    renteePercentage,
  } = eachItem;

  return (
    <View style={cardStyles.cardContainer}>
      <View style={cardStyles.eachCard}>
        <Image
          source={img}
          style={{width: 150, height: 190}}
          resizeMode="cover"
        />

        {/* <FastImage
          source={img}
          style={{height: 100, minWidth: '100%', padding: 0}}
          resizeMode="cover"
        /> */}

        {renteePercentage ? (
          <View style={cardStyles.descContainer}>
            <View style={cardStyles.titleAmount}>
              <View style={cardStyles.leftSide}>
                <Text style={cardStyles.title}>{title}</Text>
                <Text style={cardStyles.daysLeft}>{daysLeft}</Text>
              </View>
              <View style={cardStyles.rightSide}>
                <Text style={cardStyles.amount}>{amount}</Text>
              </View>
            </View>
            <View style={cardStyles.horizontalImg}>
              <Image
                source={horizontalLine}
                style={cardStyles.horizontalLine}
              />
            </View>
            <View style={cardStyles.commissionContainer}>
              <Text style={cardStyles.commissionText}>{commission}</Text>
              <View style={cardStyles.percentContainer}>
                <Text style={cardStyles.owner}>{owner}</Text>
                <Text style={cardStyles.ownerPercent}>
                  {commisionPercentage}
                </Text>
              </View>
              <View style={cardStyles.percentContainer}>
                <Text style={cardStyles.owner}>{rentee}</Text>
                <Text style={cardStyles.ownerPercent}>{renteePercentage}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={cardStyles.textContainer}>
            <Text style={cardStyles.title}>{title}</Text>
            <Text style={cardStyles.amount}>{amount}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Card;
