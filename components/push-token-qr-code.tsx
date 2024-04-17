import { usePushToken } from '@/hooks/use-push-token'
import { BlurView } from 'expo-blur'
import { Text, View } from 'react-native'
import QRCode from 'react-native-qrcode-styled'

export function PushTokenQrCode() {
  const { data: token } = usePushToken()

  return (
    <View className={'items-center'}>
      <View className={'bg-white p-5'}>
        <QRCode data={token} style={{ maxWidth: 300 }} pieceSize={10} />
        {!token && (
          <BlurView
            tint={'light'}
            className={
              'absolute top-0 bottom-0 left-0 right-0 justify-center items-center'
            }
          >
            <Text className={'text-base font-bold'}>
              通知を許可してください
            </Text>
          </BlurView>
        )}
      </View>
    </View>
  )
}
