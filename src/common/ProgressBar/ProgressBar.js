import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import LinearGradient from 'react-native-linear-gradient';

export default function ProgressBarComponent() {
  return (
    <View style={styles.container}>
      {/* <View style={styles.example}>
        <Text>Circle Progress Indicator</Text>
        <ProgressBar />
      </View> */}
      {/* <View style={styles.example}>
        <Text>Horizontal Progress Indicator</Text>
        <ProgressBar styleAttr="Horizontal" />
      </View> */}
      {/* <View style={styles.example}>
        <Text>Colored Progress Indicator</Text>
        <ProgressBar styleAttr="Horizontal" color="#2196F3" animating={true} />
      </View> */}
      <View style={styles.example}>
        {/* <Text>Fixed Progress Value</Text> */}
        <LinearGradient
          start={{x: 0.0, y: 1.0}}
          end={{x: 1.0, y: 1.0}}
          colors={['#003E9B', '#AD53CC']}
          style={{height: 3, width: '50%'}}>
          <ProgressBar
            styleAttr="Horizontal"
            indeterminate={false}
            progress={0.5}
            style={{
              position: 'absolute',
              top: -6,
              left: 0,
              right: 0,
              width: '70%',
            }}
            color="transparent"
          />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  example: {
    marginVertical: 30,
    // marginBottom: 0,
    // marginTop: 0,

    backgroundColor: 'grey',
    width: '100%',
    height: 3,
    marginTop: 0,
  },
});
