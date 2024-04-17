import { Button } from '@/components/button'
import { createFileChunks } from '@/lib/utils'
import * as Crypto from 'expo-crypto'
import prettyBytes from 'pretty-bytes'
import { useState } from 'react'
import { Image, Modal, Text, View } from 'react-native'

type Props = {
  isOpen: boolean
  token: string
  base64: string
  onClose: () => void
}

export function ConfirmFileModal({ token, base64, isOpen, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    setIsLoading(true)

    try {
      const id = Crypto.randomUUID()
      const chunks = createFileChunks(base64, 1024 * 3)

      const promises = chunks.map((chunk, index) => {
        return fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: token,
            sound: 'default',
            title: id,
            data: {
              value: chunk,
              index,
              total: chunks.length,
            },
          }),
        })
      })

      await Promise.all(promises)

      onClose()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

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
          <Button disabled={isLoading} className={'mt-4'} onPress={handleSend}>
            {isLoading ? '送信中' : '送信する'}
          </Button>
          <Button
            disabled={isLoading}
            className={'bg-zinc-100 mt-2'}
            labelClassName={'text-black'}
            onPress={onClose}
          >
            閉じる
          </Button>
        </View>
      </View>
    </Modal>
  )
}
