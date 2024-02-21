import { redirect as r } from "next/navigation"
import { LINKS } from "router.config"

/**
 * Redirect to the corresponding page based on the status code
 * @param status number
 * - Courtesy: [@emranffl](https://www.linkedin.com/in/emranffl/)
 */
export const redirect = (status: string | number): never => {
  if (typeof status !== "number") status = 500

  const mapper = {
    400: () => {
      r(LINKS.badRequest)
    },
    401: () => {
      r(LINKS.unauthorized)
    },
    403: () => {
      r(LINKS.forbidden)
    },
    404: () => {
      r(LINKS.notFound)
    },
    500: () => {
      r(LINKS.internalServerError)
    },
  } as Record<number, () => void>

  // if development, log the status code // => log path
  if (process.env.NODE_ENV === "development") {
    throw Error(`API call terminated with status ${status} will redirect to respective page in production!`)
  }

  // if mapper found, redirect to the corresponding page
  if (mapper[status]) mapper[status]()

  // if no mapper found, redirect to 500
  return r(LINKS.internalServerError)
}
