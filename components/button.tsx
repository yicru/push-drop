import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef } from 'react'
import { Text, TouchableOpacity } from 'react-native'

interface ButtonProps
  extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
  children: string
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        'flex flex-row items-center justify-center rounded-md bg-black h-10 px-4',
        className,
      )}
      {...props}
    >
      <Text className={'text-center font-medium text-white text-base'}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}
