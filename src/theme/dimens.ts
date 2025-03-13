import {Dimensions} from 'react-native';

export const Screen = {
  Width: Dimensions.get('window').width,
  Height: Dimensions.get('window').height,
};

export const Primary = {
  Width: 353,
  Height: 45,
};

export const SmallPrimary = {
  Width: 120,
  // Height: 35,
};

export const Logo = {
  Height: 60,
  Width: 200,
};

export const Battle_Infinity = {
  Height: 41,
  Width: 138,
};

export const sheetOpenDuration = 200;
export const sheetCloseDuration = 200;
export const sheetHeightFull = Screen.Height * 0.8;
export const sheetHeightHalf = Screen.Height * 0.3;

export const initialLayout = {width: Dimensions.get('window').width};

export const Scanner = {
  Height: 251,
  Width: 227,
};
export const flexOne = 1;
export const universalPaddingHorizontal = 10;
