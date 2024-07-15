import { View, Text,Button,TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { printToFileAsync } from 'expo-print'
import { shareAsync } from 'expo-sharing'

const Home = () => {
    const [name, setName] = useState("")
    const html = `<html>
    <Body>
        <H1> Hello ${name} </hi>
    </Body>
    </html>`

    let genPdf = async ()=>{
        const file = await printToFileAsync({
            html:html,
            base64:false
        })
        await shareAsync(file.uri)
    }
  return (
    <SafeAreaView className='bg-primary h-full justify-center'>
        <View>
            <Text className='text-gray-600 font-bold text-xl mt-10 text-center'>Booking Receipt Generator</Text>
        <TextInput className='w-[90%] h-10 bg-white mt-2 mx-auto p-2 capitalize
        rounded-md'  value= {name} placeholder='Enter name' 
        onChangeText={(value)=>setName(value)}>

        </TextInput>
        <TouchableOpacity className='bg-red-400 p-3 w-[150px] items-center mt-2 mx-auto
         rounded-lg' onPress={genPdf}>
            <Text className='font-bold'>Generate Pdf</Text>
        </TouchableOpacity>
        </View>
        
    </SafeAreaView>
  )
}

export default Home