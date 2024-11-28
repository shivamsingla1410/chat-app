import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
 
const InputField = ({ label, value, onChangeText, placeholder, secureTextEntry }: any) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#888"
      />
    </View>
  );
};
 
const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
});
 
export default InputField;