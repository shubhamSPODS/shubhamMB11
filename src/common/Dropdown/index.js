import React, {useState} from 'react';
import styles from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import {AppText, POPPINS_MEDIUM, TWELVE} from '../AppText';
import {colors} from '../../theme/color';

const DropdownComponent = props => {
  const {items, value, placeholder, onSelectItem, label, setValue,style} = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      {label && (
        <AppText
          {...props}
          weight={POPPINS_MEDIUM}
          type={TWELVE}
          style={[styles.NameLabel]}>
          {label}
        </AppText>
      )}

      <DropDownPicker
        placeholder={placeholder}
        placeholderStyle={styles.placeholderText}
        textStyle={styles.textStyle}
        arrowIconStyle={styles.arrowIcon}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        labelStyle={{color: colors.white}}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        style={[styles.background, style]}
        onSelectItem={onSelectItem}
        dropDownDirection="TOP"
      />
    </>
  );
};

export default DropdownComponent;
