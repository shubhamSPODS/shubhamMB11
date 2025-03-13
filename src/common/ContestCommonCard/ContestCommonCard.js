import {View, Text, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from '../ProgressBar/ProgressBar';
import ProgressBarComponent from '../ProgressBar/ProgressBar';
import FastImage from 'react-native-fast-image';
import {Badge, Cup, Ellipse, Dollar, CheckMark} from '../../helper/image';
import {
  contestCommonCardData,
  practiceCommonCardData,
} from '../../DummyData';
import styles from './styles';
const ContestCommonCard = props => {
  return (
    <ScrollView>
      <>
        {contestCommonCardData?.map(each => (
          <View key={each?.id} style={styles.contestCommonCard}>
            <View style={styles.cardPercentage}>
              <View style={styles.cardcontainer}>
                <View style={styles.cardInsideView}>
                  <View style={styles.cardBottomView}>
                    <Text style={styles.prizePool}>{each?.prizePool}</Text>
                    <Text style={styles.multipleText}>{each?.multiple}</Text>
                  </View>
                  {/* Rupees */}
                  <View style={styles.rupeeContainer}>
                    <Text style={styles.amountText}>{each?.amount}</Text>
                    <Text style={styles.discountText}>
                      {each?.winnerDiscount}
                    </Text>
                    <View style={styles.rightSideRupee}>
                      <Text style={styles.rightSideRupeText}>
                        {each?.rupee}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <ProgressBarComponent />
                  </View>
                  <View style={styles.spotContainer}>
                    <Text style={{marginTop: 0}}>{each?.noOfSpot}</Text>
                    <Text style={{marginTop: 0, color: '#37CC4C'}}>
                      {each?.leftSpot}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardBottomPartContainer}>
                <View style={styles.cardBottomWrapper}>
                  <View style={styles.bottomCardInnerWrapper}>
                    <View style={styles.bottomContentWrapper}>
                      <View>
                        <FastImage
                          source={each?.Badge}
                          style={styles.bottomImageBadge}
                          resizeMode="contain"
                        />
                      </View>

                      <View>
                        <Text style={styles.badgeAmountText}>
                          {each?.badgeAmount}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cupContainer}>
                      <View>
                        <FastImage
                          source={each?.Cup}
                          style={styles.cupImage}
                          resizeMode="contain"
                        />
                      </View>

                      <View>
                        <Text style={styles.cupPercentage}>
                          {each?.cupPercentage}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.ellipseContainer}>
                      <View>
                        <FastImage
                          resizeMode="contain"
                          source={each?.Ellipse}
                          style={styles.ellipseImage}>
                          <FastImage
                            source={each?.Dollar}
                            style={styles.dollarImg}
                            resizeMode="contain"
                          />
                        </FastImage>
                      </View>

                      <View>
                        <Text style={styles.playText}>{each?.playStatus}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.checkMarkContainer}>
                  <View>
                    <FastImage
                      source={CheckMark}
                      style={styles.checkMark}
                      resizeMode="contain"
                    />
                  </View>

                  <View>
                    <Text style={styles.guarenteeText}>Guranteed</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </>
    </ScrollView>
  );
};

export default ContestCommonCard;