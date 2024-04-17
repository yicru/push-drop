import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef } from 'react'
import { Text, TouchableOpacity } from 'react-native'

interface ButtonProps
  extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
  children: string
  labelClassName?: string
}

export function Button({
  children,
  className,
  labelClassName,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        'flex flex-row items-center justify-center rounded-md bg-black h-10 px-4',
        className,
      )}
      {...props}
    >
      <Text
        className={cn(
          'text-center font-medium text-white text-base',
          labelClassName,
        )}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}
