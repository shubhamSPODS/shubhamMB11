import {
  GestureResponderEvent,
  StyleProp,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import {LegacyRef, ReactNode} from 'react';
import {KeyboardAwareScrollViewProps} from '@codler/react-native-keyboard-aware-scroll-view';

export interface CheckboxProps {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  value: boolean;
  checkbox?: boolean;
  style?: StyleProp<ViewStyle> | undefined;
  disabled?: boolean;
}

export interface TextPropsTemp extends TextProps {
  type?: string;
  weight?: string;
  color?: string;
  children?: any;
  line?: string;
}

export interface AppSafeAreaViewProps {
  children?: any;
  style?: StyleProp<ViewStyle> | undefined;
  // statusColor?: boolean;
  statusColor?: any;
  hidden?: any;
}

export interface BProps extends TouchableOpacityProps {
  activeOpacity?: number;
  children: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  disabled?: boolean;
  isSecond?: boolean;
}

export interface SpinnerProps {
  style?: ViewStyle;
  loading?: boolean;
}

export interface TouchableOpacityViewProps extends TouchableOpacityProps {
  children?: ReactNode;
  isGesture?: boolean;
}

export interface ToolbarProps {
  title?: string;
  isNotBack?: boolean;
  isWhite?: boolean;
}

export interface BottomTabProps {
  index: number;
}

export interface InputProps extends TextInputProps {
  label?: string;
  value: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  isError?: boolean;
  assignRef?: LegacyRef<T> | undefined;
  showHidePress?: ((event: GestureResponderEvent) => void) | undefined;
  errorText?: string;
  isRequired?: boolean;
  isImage?: boolean;
  onPress?: () => void;
  text?: string;
  showEyeWithLineIcon?: boolean;
  showEyeIcon?: boolean;
}

export interface KeyBoardAwareProps extends KeyboardAwareScrollViewProps {
  children: ReactNode;
  style?: ViewStyle;
}
