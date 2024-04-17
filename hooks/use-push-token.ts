import Constants from 'expo-constants'
import { PermissionStatus } from 'expo-modules-core'
import * as Notifications from 'expo-notifications'
import { usePermissions } from 'expo-notifications/build/NotificationPermissions'
import useSWR from 'swr'

export const usePushToken = () => {
  const [permission] = usePermissions()

  return useSWR(
    permission?.status === PermissionStatus.GRANTED &&
      'push-notification-token',
    async () => {
      const { data } = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      })
      return data
    },
  )
}
