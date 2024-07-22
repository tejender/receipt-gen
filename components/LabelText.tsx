import { View, Text } from 'react-native'
import React from 'react'

const LabelText = ({title,required}:any) => {
  return (
    
    <Text className='text-gray-200 text-md font-bold w-[100%] relative '>{title}  
          {required &&(

              <Text className='text-xs text-red-500 px-5'>
                    &nbsp; *
              </Text>
        
          )}
    </Text>
    
  )
}

export default LabelText