import { Button } from '@/components/button'
import { Text, View } from 'react-native'

export default function TabOneScreen() {
  return (
    <View className={'flex-1 justify-center items-center'}>
      <Text className={'text-xl font-bold'}>Tab One</Text>
      <Button onPress={() => console.log('pressed')}>Press me</Button>
    </View>
  )
}
