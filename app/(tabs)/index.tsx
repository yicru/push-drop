import { Button } from '@/components/button'
import { ConfirmFileModal } from '@/components/confirm-file-dialog'
import { PushTokenQrCode } from '@/components/push-token-qr-code'
import { ReceivedFileModal } from '@/components/received-file-dialog'
import { joinFileChunks } from '@/lib/utils'
import { type BarcodeScanningResult, CameraView } from 'expo-camera/next'
import * as ImagePicker from 'expo-image-picker'
import { addNotificationReceivedListener } from 'expo-notifications'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type NotificationBody = {
  token: string
  base64: string
}

type ReceivedState =
  | {
      status: 'receiving'
      id: string
      total: number
      chunks: { value: string; index: number }[]
    }
  | {
      status: 'received'
      base64: string
    }

export default function HomeScreen() {
  const [isOpenCamera, setIsOpenCamera] = useState(false)
  const [notificationBody, setNotificationBody] =
    useState<NotificationBody | null>(null)
  const [receivedState, setReceivedState] = useState<ReceivedState | null>(null)

  useEffect(() => {
    const receivedListener = addNotificationReceivedListener((event) => {
      const id = event.request.content.title
      const { index, total, value } = event.request.content.data

      setReceivedState((prev) => {
        if (!id || (prev?.status === 'receiving' && prev.id !== id)) {
          console.log({ id, prev })
          return prev
        }

        if (total === 1) {
          return { status: 'received', base64: value }
        }

        if (!prev || prev.status === 'received') {
          return { status: 'receiving', id, total, chunks: [{ value, index }] }
        }

        const newChunks = [...prev.chunks, { value, index }]

        if (newChunks.length === total) {
          const sorted = newChunks.sort((a, b) => a.index - b.index)
          setReceivedState({
            status: 'received',
            base64: joinFileChunks(sorted.map(({ value }) => value)),
          })
        }

        return {
          status: 'receiving',
          id,
          total,
          chunks: [...prev.chunks, { value, index }],
        }
      })
    })

    return () => {
      receivedListener.remove()
    }
  }, [])

  const handleOnScanned = async (result: BarcodeScanningResult) => {
    setIsOpenCamera(false)

    const { assets } = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    })
    const base64 = assets?.[0].base64
    if (!base64) return

    const isExceed100Kb = base64.length > 1024 * 100
    if (isExceed100Kb) {
      alert('100KBを超えるファイルは送信できません。')
      return
    }

    setNotificationBody({
      token: result.data,
      base64,
    })
  }

  return (
    <View className={'flex-1 p-4 gap-6'}>
      <View>
        <PushTokenQrCode />
      </View>

      <View>
        <Button className={'w-full h-14'} onPress={() => setIsOpenCamera(true)}>
          QRコードを読み取る
        </Button>
      </View>

      {receivedState?.status === 'receiving' && (
        <View
          className={
            'flex-row justify-between items-center bg-white p-4 rounded'
          }
        >
          <Text className={'text-base font-medium'}>
            ファイル受信中 (
            {Math.floor(
              (receivedState.chunks.length / receivedState.total) * 100,
            )}
            %)
          </Text>
          <TouchableOpacity onPress={() => setReceivedState(null)}>
            <Text className={'font-medium'}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      )}

      {isOpenCamera && (
        <View className={'absolute top-0 left-0 right-0 bottom-0 bg-black'}>
          <View className={'absolute top-2 right-2 z-10'}>
            <Button
              className={'bg-white'}
              labelClassName={'text-black'}
              onPress={() => setIsOpenCamera(false)}
            >
              閉じる
            </Button>
          </View>

          <CameraView
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleOnScanned}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      )}

      {notificationBody && (
        <ConfirmFileModal
          isOpen
          token={notificationBody.token}
          base64={notificationBody.base64}
          onClose={() => setNotificationBody(null)}
        />
      )}

      {receivedState?.status === 'received' && (
        <ReceivedFileModal
          isOpen
          base64={receivedState.base64}
          onClose={() => setReceivedState(null)}
        />
      )}
    </View>
  )
}
