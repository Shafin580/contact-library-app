import Spinner, { SpinnerProps } from "@library/Spinner"
import { memo } from "react"
import { cn } from "tailwind-cn"

interface PartialComponentLoaderProps {
  className?: string
  spinnerProps?: SpinnerProps
}

const PartialComponentLoader = ({ className, spinnerProps }: PartialComponentLoaderProps) => {
  const mergedSpinnerProps = {
    containerClassName: "m-auto w-32",
    variant: "info",
    size: "lg",
    ...spinnerProps,
  } as const

  return (
    <>
      <div className={cn("flex h-full w-full grow", className)}>
        <Spinner {...mergedSpinnerProps} />
      </div>
    </>
  )
}

export default memo(PartialComponentLoader)
