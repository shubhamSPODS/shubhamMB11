import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import {
  fontFamilyPoppins,
  fontFamilyRusso,
  latoBold,
  latoBoldItalic,
  latoHeavy,
  latoMedium,
  latoSemiBold,
  poppinsBold,
  poppinsBoldItalic,
  poppinsExtraBoldItalic,
  poppinsLight,
  poppinsMedium,
  poppinsSemiBold,
} from '../theme/typography';
import { TextPropsTemp } from '../types/common';
import { NewColor, colors } from '../theme/color';

export const THIRTEEN = 'THIRTEEN';
export const FIFTEEN = 'FIFTEEN';
export const SIXTEEN = 'SIXTEEN';
export const TWENTY = 'TWENTY';
export const TWENTY_FOUR = 'TWENTY_FOUR';
export const FORTEEN = 'FORTEEN';
export const EIGHTEEN = 'EIGHTEEN';
export const NINETEEN = 'NINETEEN';
export const TWELVE = 'TWELVE';
export const FORTY = 'FORTY';
export const TWENTY_TWO = 'TWENTY_TWO';
export const TEN = 'TEN';
export const ELEVEN = 'ELEVEN';
export const TWENTY_FIVE = 'TWENTY_FIVE';
export const NORMAL = 'normal';
export const SEMI_BOLD = 'semibold';
export const BOLD = 'bold';
export const RUSSO = 'russo';
export const POPPINS = 'poppins';
export const POPPINS_BOLD = 'POPPINS_BOLD';
export const POPPINS_MEDIUM = 'POPPINS_MEDIUM';
export const POPPINS_BOLD_ITALIC = 'POPPINS_BOLD_ITALIC';
export const POPPINS_LIGHT = 'POPPINS_LIGHT';
export const POPPINS_SEMI_BOLD = 'POPPINS_SEMI_BOLD';
export const POPPINS_EXTRA_BOLD_ITALIC = 'POPPINS_EXTRA_BOLD_ITALIC';
export const POPINS_THIN_ITALIC = 'Poppins-Thin-Italic';
export const LATO_MEDIUM = 'LATO_MEDIUM';
export const LATO_BOLD = 'LATO_BOLD';
export const LATO_BOLD_Italic = 'LATO_BOLD_Italic';
export const LATO_HEAVY = 'LATO_HEAVY';
export const LATO_SEMI_BOLD = 'LATO_SEMI_BOLD';


export const WHITE = 'WHITE';
export const GREEN = 'GREEN';
export const RED = 'RED';
export const BORDERPINK = 'BORDERPINK';
export const LIGHTGOLDEN = 'LIGHTGOLDEN';
export const LIGHTWHITE = 'LIGHTWHITE';





export const GRY = 'GRY';
export const BOTTOMTEXT = 'BOTTOMTEXT';
export const BLUE = 'BLUE';
export const RBBACKGROUND = 'RBBACKGROUND';
export const BROWNYELLOW = 'BROWNYELLOW';



export const LIGHTPINK = 'LIGHTPINK';
export const BLACK = 'BLACK';
export const LIGHTBLUE = 'LIGHTBLUE';
export const BLACKOPACITY = 'BLACKOPACITY';
export const EIGHT = 'EIGHT';
export const THIRTEENTH = 'THIRTEENTH';
export const FIFTEENTH = 'FIFTEENTH';
export const THIRTY = 'THIRTY';

export const TWENTY_ONE_L = 'TWENTY_ONE_L';
export const THIRTY_SIX_L = 'THIRTY_SIX_L';

const AppText = ({
  type,
  weight,
  style,
  color,
  line,
  ...props
}: TextPropsTemp) => {
  return (
    <Text
      allowFontScaling={false}
      style={StyleSheet.flatten([
        styles.text(type, weight, color, line),
        style,
      ])}
      {...props}
    />
  );
};

const getTextStyle = (
  type: string,
  weight: string,
  color: string,
  line: string,
) => {
  var style: TextStyle = {};
  switch (type) {
    case EIGHT:
      style['fontSize'] = 8;
      break;
    case ELEVEN:
      style['fontSize'] = 11;
      break;
    case FORTEEN:
      style['fontSize'] = 13;
      break;
    case THIRTEEN:
      style['fontSize'] = 14;
      break;
    case FIFTEEN:
      style['fontSize'] = 15;
      break;
    case TWENTY:
      style['fontSize'] = 20;
      break;
    case TWENTY_FOUR:
      style['fontSize'] = 24;
      break;
    case FORTEEN:
      style['fontSize'] = 14;
      break;
    case EIGHTEEN:
      style['fontSize'] = 18;
      break;
    case TWELVE:
      style['fontSize'] = 12;
      break;
    case NINETEEN:
      style['fontSize'] = 19;
      break;
    case THIRTY:
      style['fontSize'] = 30;
      break;
    case FORTY:
      style['fontSize'] = 40;
      break;
    case SIXTEEN:
      style['fontSize'] = 16;
      break;
    case TWENTY_TWO:
      style['fontSize'] = 22;
      break;
    case TEN:
      style['fontSize'] = 10;
      break;
    case TWENTY_FIVE:
      style['fontSize'] = 25;
      break;
    default:
      style['fontSize'] = 12;
  }

  switch (weight) {
    case RUSSO:
      style['fontFamily'] = fontFamilyRusso;
      break;
    case POPPINS:
      style['fontFamily'] = fontFamilyPoppins;
      break;

    case POPPINS_BOLD:
      style['fontFamily'] = poppinsBold;
      break;

    case POPPINS_LIGHT:
      style['fontFamily'] = poppinsLight;
      break;

    case POPPINS_BOLD_ITALIC:
      style['fontFamily'] = poppinsBoldItalic;
      break;

    case POPPINS_MEDIUM:
      style['fontFamily'] = poppinsMedium;
      break;

    case POPPINS_SEMI_BOLD:
      style['fontFamily'] = poppinsSemiBold;
      break;

    case POPPINS_EXTRA_BOLD_ITALIC:
      style['fontFamily'] = poppinsExtraBoldItalic;
      break;
    case LATO_SEMI_BOLD:
      style['fontFamily'] = latoSemiBold;
      break;
    case LATO_MEDIUM:
      style['fontFamily'] = latoMedium;
      break;
    case LATO_BOLD:
      style['fontFamily'] = latoBold;
      break;
    case LATO_BOLD_Italic:
      style['fontFamily'] = latoBoldItalic;
      break;
    case LATO_HEAVY:
      style['fontFamily'] = latoHeavy;
      break;
    default:
      style['fontFamily'] = fontFamilyPoppins;
  }
  switch (line) {
    case TWENTY_ONE_L:
      style['lineHeight'] = 21;
      break;
    case THIRTY_SIX_L:
      style['lineHeight'] = 36;
      break;
  }

  switch (color) {
    case WHITE:
      style['color'] = 'white';
      break;
    case GREEN:
      style['color'] = colors.green;
      break;
    case RED:
      style['color'] = colors.lightRed;
      break;
    case LIGHTPINK:
      style['color'] = colors.ligthPickText;
      break;
    case BLACK:
      style['color'] = colors.black;
      break;
    case LIGHTBLUE:
      style['color'] = colors.borderBackColor;
      break;
    case BLACKOPACITY:
      style['color'] = NewColor.linerBlacklight;
      break;
    case RED:
      style['color'] = 'red';
      break;
    case GRY:
      style['color'] = 'gray';
      break;
    case BOTTOMTEXT:
      style['color'] = colors.bottomtext;
      break;
    case BLUE:
      style['color'] = '#7B3995';
      break;
    case RBBACKGROUND:
      style['color'] = colors.rbBackground;
      break;
    case BROWNYELLOW:
      style['color'] = colors.brownYellow;
      break;
      case LIGHTGOLDEN:
        style['color'] = colors.lightGolden;
        break;
        case LIGHTWHITE:
          style['color'] = colors.lightWhite;
          break;
      case BORDERPINK:
        style['color'] = colors.borderPick;
        break;

    // case SIXTH:
    //   style['color'] = colors.sixth;
    //   break;
    // case SEVEN:
    //   style['color'] = colors.seven;
    //   break;
    // case EIGHT:
    //   style['color'] = colors.eight;
    //   break;
    // case THIRTEENTH:
    //   style['color'] = colors.thirteen;
    //   break;
    // case FIFTEENTH:
    //   style['color'] = colors.fifteen;
    //   break;
    default:
      style['color'] = 'white';
      break;
  }

  return style;
};

const styles = {
  text: (type: string, weight: string, color: string, line: string) => ({
    ...getTextStyle(type, weight, color, line),
  }),
};

export { AppText };
