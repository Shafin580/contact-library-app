import Image from "next/image"
import emptyRecords from "./empty-records.svg"
import { cn } from "tailwind-cn"
import { memo } from "react"

/**
 * @description A card to show when there are no records to display.
 * @copyright ARITS Limited
 * @author Emran
 * ([@emranffl](https://www.linkedin.com/in/emranffl/))
 */

const EmptyRecordsCard = ({
  className,
  text,
  image,
}: {
  className?: string
  text?: {
    className?: string
    value?: string
  }
  image?: {
    className?: string
    src?: string
    width?: number
    height?: number
  } | null
}) => {
  const mergedTextProps = {
    value: "No records to display",
    ...text,
  }

  const mergedImageProps = {
    src: emptyRecords,
    width: 40,
    height: 40,
    priority: true,
    ...image,
  } as const

  return (
    <div
      className={cn(
        "flex grow flex-col flex-wrap items-center justify-center space-y-16 rounded border px-12 py-16 shadow-sm",
        className
      )}
    >
      {image !== null && (
        <Image alt="empty records" className={cn("grayscale", image?.className)} {...mergedImageProps} />
      )}
      <p className={cn("text-sm text-slate-500", mergedTextProps.className)}>{mergedTextProps.value}</p>
    </div>
  )
}

export default memo(EmptyRecordsCard)
