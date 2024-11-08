import { View, Text } from 'react-native'
import React from 'react'

const LabelText = ({title,required}:any) => {
  return (
    
    <Text className='text-gray-700 text-md mb-2 font-medium w-[100%] relative 'style={{zIndex:-1}}>{title}  
          {required &&(

              <Text className='text-xs text-red-500 px-5'>
                    &nbsp; *
              </Text>
        
          )}
    </Text>
    
  )
}

export default LabelText