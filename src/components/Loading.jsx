import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../../assets'

export default function Loading({ isHeightFull = true }) {
  return (
    <View className={`${isHeightFull ? 'min-h-screen' : 'min-h-72'} z-50 bg-dark justify-center items-center`}>
      <View className='bg-dark justify-center items-center py-8'>
        <Image source={images.animeLoading} className='w-40 h-40 aspect-square' />
        <Text className='text-center text-white font-go font-medium mt-3'>Loading...</Text>
    </View>

    </View>
  )
}