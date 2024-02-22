import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"


export interface ContactListAPIProps {
  id: number
  name: string
  email: string
  phone_number: string | null
  address: string | null
}


/**
 * Fetches the contact list from API
 */
export const getContactList = async (token: string) => {
  try {
    const { results, status_code } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.CONTACT.LIST.root,
      token,
      "GET"
    )

    if (status_code === 200) {
      return results as ContactListAPIProps[]
    } else
      throw Error("Error fetching contact list", {
        cause: status_code,
      })
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
