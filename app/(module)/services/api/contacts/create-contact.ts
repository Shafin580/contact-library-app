import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

interface CreateUpdateContactParams {
  id?: number
  name: string
  email: string
  phone_number?: string
  address?: string
}

export interface CreateUpdateContactAPIProps {
  data: CreateUpdateContactParams
  token: string
}

/**
 * Creates a new contact
 */
export const createContact = async ({ data, token }: CreateUpdateContactAPIProps) => {
  try {
    const { status_code, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.CONTACT.ADD.root,
      token,
      "POST",
      JSON.stringify(data)
    )

    if (status_code < 201 || status_code >= 400) {
      return { status_code, message }
    }

    return { status_code, message }
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
