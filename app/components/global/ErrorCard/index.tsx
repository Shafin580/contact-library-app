import Image from "next/image"
import error from "./error.svg"
import { cn } from "tailwind-cn"

/**
 * @description A card to show when there is an error.
 * @copyright ARITS Limited
 * @author Emran
 * ([@emranffl](https://www.linkedin.com/in/emranffl/))
 */

const ErrorCard = ({
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
    value: "Something went wrong, please try again later.",
    ...text,
  }

  const mergedImageProps = {
    src: error,
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
      {image !== null && <Image alt="error" {...mergedImageProps} />}
      <p className={cn("text-sm text-rose-400", mergedTextProps.className)}>{mergedTextProps.value}</p>
    </div>
  )
}

export default ErrorCard
