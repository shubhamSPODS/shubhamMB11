import React, {useState} from 'react';
import {View, Text, TouchableOpacity,StyleSheet} from 'react-native';
import {AppText} from '../AppText';


const TripleToggle = props => {
  const {
    label1,
    label2,
    label3,
    onPress,
    extraContainerStyle,
    extraJob,
    extraDetail,
    selectedLabel,
  } = props;

  // const [selectedLabel, setSelectedLabel] = useState('upcoming');

  const onClick = upcoming => {
    // setSelectedLabel(upcoming);
    onPress(upcoming);
  };

  return (
    <View style={[styles.container, extraContainerStyle]}>
      <TouchableOpacity
        onPress={() => onClick('upcoming')}
        style={
          selectedLabel === 'upcoming'
            ? [styles.detailContainer, extraDetail]
            : [styles.jobContainer, extraJob]
        }>
        <AppText
          style={selectedLabel === 'upcoming' ? styles.detail : styles.job}>
          {label1}
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onClick('live')}
        style={
          selectedLabel === 'live'
            ? [styles.detailContainer, extraDetail]
            : styles.jobContainer
        }>
        <Text style={selectedLabel === 'live' ? styles.detail : styles.job}>
          {label2}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={
          selectedLabel === 'completed'
            ? [styles.detailContainer, extraDetail]
            : styles.jobContainer
        }
        onPress={() => onClick('completed')}>
        <Text
          style={selectedLabel === 'completed' ? styles.detail : styles.job}>
          {label3}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
         backgroundColor: 'rgba(7, 3, 12, 1)',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent:"space-around",
        width:"90%",
        alignContent:"center",
        alignSelf:"center",
  },
  detailContainer: {
    borderBottomColor: '#D192E0',
    borderBottomWidth:1,
  
    // paddingHorizontal: 200,
  },
  doubleContainer: {
    //  backgroundColor: 'red',
    width: '90%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
  },
  bgContainer: {
    backgroundColor: 'yellow',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    width: '53.7%',
    alignItems: 'center',
  },
  jobContainer: {
    // backgroundColor: 'white',
    paddingHorizontal: 34,
    paddingVertical: 10,
    borderRadius: 20,
  },
  detail: {
    fontSize: 12,
    color: '#D192E0',
    paddingHorizontal: 10,
  },
  job: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 8,
  },
  label3: {
    fontSize: 12,
    color: 'green',
    paddingHorizontal: 10,
  },
});

export default TripleToggle;
