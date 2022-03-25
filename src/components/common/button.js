
import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';


export const ButtonComponent = (props) => {
  const { title = 'Enter', style = {}, textStyle = {}, onPress, disabled } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={1}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 7,
    backgroundColor: '#1BA2FC',
    shadowColor: '#1BA2FC',
  },

  text: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ButtonComponent;