import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';


const SelectPicker = ({ items, title, value, onValueChange, required, otherStyles }: any) => {
  // Initialize the selected value state based on the value prop or default to the first item
  const [selectedLanguage, setSelectedLanguage] = useState(value || (items.length > 0 ? items[0].value : null));

  // Update the state when the value prop changes or when nothing is selected
  useEffect(() => {
    if (!value && items.length > 0) {
      // If no value is provided, set the first item as selected
      handleValueChange(items[0].value);
    }
  }, [items,value]);

  // Handle value changes and call onValueChange
  const handleValueChange = (itemValue: any) => {
    setSelectedLanguage(itemValue);
    onValueChange(itemValue);
  };

  return (
    <View style={[{ marginTop: 10 }, otherStyles]}>
      {title && (
        <Text style={{ marginBottom: 5, fontSize: 16, fontWeight: 'bold' }}>
          {title}
          {required && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
      )}

      <View
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          overflow: 'hidden',
          borderRadius: 5,
          backgroundColor: 'white',
        }}
      >
        <Picker
          style={{ color: 'gray', backgroundColor: 'white' }}
          selectedValue={selectedLanguage}
          onValueChange={handleValueChange}
        >
          {items.map((item: any, index: any) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default SelectPicker;
