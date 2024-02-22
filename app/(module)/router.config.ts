import { decrypt } from "../../utils/helpers/crypto"

/**
 * List of all the routes in the app for frontend rendering
 */
export const LINKS = {
  HOME: "/" as const,
  REGISTER: "/register" as const,
  CONTACT: {
    LIST: { home: `/contact/list` as const },
    DYNAMIC: (id: string | number) => {
      return { home: `/contact/${id}` as const }
    },
  },
} as const

/**
 * List of all the paths in the app for backend data fetching
 */

export const PATHS = {
  LOGIN: { root: `auth/login` as const },
  REGISTER: { root: `/auth/register` as const },
  CONTACT: {
    LIST: {
      root: `/contacts/list` as const,
    },
    DETAILS: (id: string | number) => {
      return { root: `/contacts/${id}` as const }
    },
    ADD: {
      root: `/contacts/add` as const,
    },
    DELETE: (id: string | number) => {
      return { root: `/contacts/delete/${id}` as const }
    },
    UPDATE: (id: number) => {
      return { root: `/contacts/update/${id}` as const }
    },
  },
}
