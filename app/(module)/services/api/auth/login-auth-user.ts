import { getAPIResponse } from "@utils/helpers/misc"
import { redirect } from "@utils/helpers/redirect"
import { PATHS } from "app/(module)/router.config"


interface LoginUserParams {
  email: string
  password: string
}

/**
 * Creates a new intervention
 */
export const loginAuthUser = async ({ email, password }: LoginUserParams) => {
  try {
    const { status_code, user, token } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.LOGIN.root,
      "",
      "POST",
      JSON.stringify({ email: email, password: password })
    )

    if (status_code < 200 || status_code >= 400) {
      throw Error("Failed to login", { cause: status_code })
    }

    return { status_code, user, token }
  } catch (err) {
    console.error(err)

    return redirect((err as Error).cause as number) // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
