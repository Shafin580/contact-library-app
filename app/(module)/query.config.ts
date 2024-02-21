/**
 * List of all the Graph Queries in the app for backend data fetching
 */

export const QUERY_KEYS = {
  CONTACT: {
    LIST: { key: "contact-list" as const },
    DYNAMIC: (id: number | string) => {
      return { key: `contact-details-${id}` as const }
    },
  },
} as const
