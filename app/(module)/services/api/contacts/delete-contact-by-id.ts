import { getAPIResponse } from "@utils/helpers/misc"
import { redirect } from "@utils/helpers/redirect"
import { PATHS } from "app/(module)/router.config"

/**
 * delete contact
 */
export const deleteContact = async ({ id, token }: { id: string | number; token: string }) => {
  try {
    const { results, status_code, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.CONTACT.DELETE(id).root,
      token,
      "DELETE"
    )

    if (status_code === 200) {
      return { status_code: status_code, message: message }
    } else
      throw Error("Error deleting contact", {
        cause: status_code,
      })
  } catch (err) {
    console.error(err)

    return redirect((err as Error).cause as number) // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
