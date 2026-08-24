'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

export interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  containerClassName?: string
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  fallbackSrc = '/images/hero/students-polymer-lab.jpg',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <div className={cn('relative overflow-hidden bg-slate-100 dark:bg-slate-800', containerClassName)}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        className={cn(
          'object-cover transition-all duration-500',
          isLoading ? 'scale-105 blur-sm opacity-80' : 'scale-100 blur-0 opacity-100',
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc)
          }
        }}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    </div>
  )
}
