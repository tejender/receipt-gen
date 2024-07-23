import { View, Text } from 'react-native'
import React from 'react'

const Footer = () => {
  return (
    <View className='bg-gray-300 px-3 py-3'>
      <View className='space-y-2'>
        

         <Text className='text-xs'> <Text className='font-bold text-teal-700'>European Plan</Text> : Only Accomodation Included</Text>
         <Text className='text-xs'><Text className='font-bold text-teal-700'>Continental Plan</Text> : Breakfast Included</Text>
         <Text className='text-xs'><Text className='font-bold text-teal-700'>Extended American Plan</Text> : Breakfast and  Lunch or Dinner Included</Text>
         <Text className='text-xs'><Text className='font-bold text-teal-700'>American Plan</Text> : Breakfast, Lunch and Dinner Included</Text>
        
      </View>
    </View>
  )
}

export default Footer