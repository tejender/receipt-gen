import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import LabelText from './LabelText'

const SelectPicker = ({ items, title, value, onValueChange,required, otherStyles }:any) => {
    const [selectedLanguage, setSelectedLanguage] = useState(value)
    const defaultValue = value || (items.length > 0 ? items[0].value : null);
    useEffect(() => {
        if (!value && items.length > 0) {
          // If no value is provided, set the first item as selected
          handleValueChange(items[0].value);
        }
      }, [items]);
    
    const handleValueChange = (itemValue:any) => {
        setSelectedLanguage(itemValue)
        onValueChange(itemValue)
    }

    return (
        <View className={`mt-5 ${otherStyles}`}>
            <LabelText title={title} required={required}/>
            <View className='bg-[#292940]  border-slate-700 border rounded-md mt-2 text-slate-300 '>
                <Picker style={{color:'white',}}
                    selectedValue={selectedLanguage}
                    onValueChange={handleValueChange}
                >
                    {items.map((item:any, index:any) => (
                        <Picker.Item key={index} label={item.label} value={item.value}
                         />
                    ))}
                </Picker>
            </View>
        </View>
    )
}

export default SelectPicker
