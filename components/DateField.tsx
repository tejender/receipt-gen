import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import LabelText from './LabelText'

const DateField = ({  date, setDate,required }:any) => {
    const [show, setShow] = useState(false)
    const [mode, setMode] = useState('date')

    const onChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate || date
        setShow(Platform.OS === 'ios')
        setDate(currentDate)
    }

    const showMode = (currentMode:any) => {
        setShow(true)
        setMode(currentMode)
    }

    const showDatepicker = () => {
        showMode('date')
    }

    return (
        <View className=' w-full '>
            
            <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                    className='pl-2 w-[100%]  bg-white mb-[20px]
       border  border-gray-300  capitalize rounded-md text-gray-400 h-[50px] '
                    value={date.toLocaleDateString()}
                    editable={false}
                />
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    value={date}
                   
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    )
}

export default DateField
