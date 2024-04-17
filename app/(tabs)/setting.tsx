import { Button } from '@/components/button'
import { useCameraPermissions } from 'expo-camera/next'
import { PermissionStatus } from 'expo-modules-core'
import { usePermissions as useNotificationPermissions } from 'expo-notifications'
import React from 'react'
import { Linking, Text, TouchableOpacity, View } from 'react-native'
import { match } from 'ts-pattern'

export default function SettingScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [notificationPermission, requestNotificationPermission] =
    useNotificationPermissions()

  const getPermissionLabel = (permission: PermissionStatus | undefined) => {
    return match(permission)
      .with(PermissionStatus.GRANTED, () => '許可済み')
      .with(PermissionStatus.UNDETERMINED, () => '未設定')
      .with(PermissionStatus.DENIED, () => '拒否')
      .with(undefined, () => '読込中')
      .exhaustive()
  }

  return (
    <View className={'flex-1 p-4 gap-6'}>
      <View className={'bg-white p-4 rounded-lg'}>
        <View className={'flex-row justify-between items-center'}>
          <Text className={'font-bold text-lg'}>通知</Text>
          <Text className={'font-medium'}>
            {getPermissionLabel(notificationPermission?.status)}
          </Text>
        </View>
        <Button
          className={'w-full h-14 mt-4'}
          onPress={requestNotificationPermission}
        >
          通知を許可する
        </Button>
      </View>

      <View className={'bg-white p-4 rounded-lg'}>
        <View className={'flex-row justify-between items-center'}>
          <Text className={'font-bold text-lg'}>カメラ</Text>
          <Text className={'font-medium'}>
            {getPermissionLabel(cameraPermission?.status)}
          </Text>
        </View>
        <Button
          className={'w-full h-14 mt-4'}
          onPress={requestCameraPermission}
        >
          通知を許可する
        </Button>
      </View>

      <View className={'justify-center items-end'}>
        <TouchableOpacity onPress={() => Linking.openSettings()}>
          <Text className={'font-medium'}>アプリ設定を開く</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
