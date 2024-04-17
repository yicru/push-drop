import { Button } from '@/components/button'
import prettyBytes from 'pretty-bytes'
import { Image, Modal, Text, View } from 'react-native'

type Props = {
  isOpen: boolean
  base64: string
  onClose: () => void
}

export function ReceivedFileModal({ base64, isOpen, onClose }: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View className={'flex-1 justify-center items-center bg-black/75'}>
        <View className={'w-full max-w-xs bg-white p-4 rounded-lg'}>
          <View
            className={
              'justify-center items-center object-contain object-center'
            }
          >
            <Image
              src={`data:image/png;base64,${base64}`}
              className={'w-40 h-40'}
            />
          </View>
          <View className={'mt-4'}>
            <Text>ファイルサイズ: {prettyBytes(base64.length)}</Text>
          </View>

          <Button className={'mt-4'} onPress={onClose}>
            閉じる
          </Button>
        </View>
      </View>
    </Modal>
  )
}
