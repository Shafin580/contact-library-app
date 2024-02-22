import { Metadata } from "next"
import ContactList from "./ContactList.Client"

/**
 * * Metadata for current page
 */
const TITLE = {
  absolute: `${process.env.NEXT_PUBLIC_SITE_TITLE} | Blogs`,
}
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
  },
  twitter: {
    title: TITLE,
  },
  alternates: {
    canonical: `/contacts`,
    languages: {
      "en-US": `/en-US/contacts`,
    },
  },
}

export default async function Page() {

  return (
    <ContactList />
  )
}
