import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setColors,
  setLanguage,
  setTheme,
} from '../slices/themeSlice/themeSlice';
// import {setTheme, setColors} from '../slices/homeSlice';

export const darkTheme = {
  white: '#ffffff',
  black: '#000000',
  code: '#98A2FF',
  textInput: '#4C5199',
  bottomTab: '#151C24',
  green: '#37CC4C',
  verified: '#37CC4C33',
  lightBlue: '#88D1F2',
  red: '#FF4F4F',
  link: '#4299FF',
  line: '#D6B6FF',
  grey: '#808080',
  whitefade: '#ffffff20',
};

export const lightTheme = {
  white: '#ffffff',
  black: '#000000',
  code: '#98A2FF',
  textInput: '#4C5199',
  bottomTab: '#151C24',
  green: '#37CC4C',
  verified: '#37CC4C33',
  lightBlue: '#88D1F2',
  red: '#FF4F4F',
  link: '#4299FF',
  line: '#D6B6FF',
  grey: '#808080',
  whitefade: '#ffffff20',
};

export const EnglishText = {
  Login: 'Login',
};
export const HindiText = {
  Login: 'लॉग इन करें',
};

const Preferences = () => {
  const dispatch = useDispatch();

  const defaultTheme = useSelector(state => {
    return state.home.defaultTheme;
  });

  const [mode, setMode] = useState(defaultTheme);

  const data_3 = [
    {label: 'Light', value: 'Light'},
    {label: 'Dark', value: 'Dark'},
  ];

  const onChangeTheme = async e => {
    setMode(e);
    dispatch(setTheme(e));
    dispatch(setColors(e == 'Light' ? lightTheme : darkTheme));
    await AsyncStorage.setItem('theme', e);
  };

  const onChangeLanguage = async e => {
    dispatch(setLanguage(e == 'English' ? EnglishText : HindiText));
    await AsyncStorage.setItem('language', e);
  };

  return (
    <View>
      <Text>Preferences</Text>
      {/* <Spinner data={data_3} value={mode} onChange={onChangeTheme} /> */}
    </View>
  );
};

export default Preferences;
