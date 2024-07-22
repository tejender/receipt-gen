import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import LabelText from './LabelText'

const DateField = ({ label, date, setDate,required }:any) => {
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
        <View className=' w-[48%]  mt-4'>
            <LabelText title={label} required={required}/>
            <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                    className='w-[100%] h-10 bg-[#292940]
       border-slate-700 border mt-2 p-2 capitalize rounded-md text-gray-300 font-bold'
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
