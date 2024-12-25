import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../../assets'

export default function NoData({ message = "Tidak Ada Data" }) {
  return (
    <View className='bg-dark justify-center items-center py-8'>
        <Image source={images.chopperCrying} className='w-40 h-40 aspect-square' />
        <Text className='text-center text-white font-go font-medium mt-3'>{message}</Text>
    </View>
  )
}