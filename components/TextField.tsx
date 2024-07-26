import { View, Text, TextInput } from 'react-native'
import React from 'react'
import LabelText from './LabelText'

const TextField = ({title, value, placeholder, handleChangeText, required, otherStyles,keyboardType,...props}:any) => {
  return (
    <View className={`items-center  gap-2 mt-4 ${otherStyles  && 'w-[50%] items-start'} ` }>
    <LabelText title={title}  required={required}/>
      
      <TextInput  className={`${otherStyles ? 'w-[95%]' : 'w-[100%]'} h-10  mt-2  bg-[#292940]
        border-slate-700 border p-2 capitalize rounded-md text-gray-300 font-bold`}  value= {value} 
        placeholder={placeholder} onChangeText={handleChangeText} keyboardType={keyboardType} placeholderTextColor='gray'/>

    </View>
  )
}

export default TextField