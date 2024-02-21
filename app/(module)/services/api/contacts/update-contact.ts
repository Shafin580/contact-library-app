import { getAPIResponse } from "@utils/helpers/misc"
import { redirect } from "@utils/helpers/redirect"
import { PATHS } from "app/(module)/router.config"
import { CreateUpdateContactAPIProps } from "./create-contact"

/**
 * Update contact
 */
export const updateContact = async ({ data, token }: CreateUpdateContactAPIProps) => {
  try {
    const { status_code, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.CONTACT.UPDATE(data.id ?? 0).root,
      token,
      "PUT",
      JSON.stringify(data)
    )

    if (status_code < 200 || status_code >= 400) {
      return { status_code, message }
    }

    return { status_code, message }
  } catch (err) {
    console.error(err)

    return redirect((err as Error).cause as number) // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
