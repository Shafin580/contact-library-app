import { Metadata } from "next"
import BlogList from "./BlogList.Client"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { QUERY } from "query.config"
import { getBlogList } from "../services/api/Blog/get-blog-list"
import { getBlogCategoryList } from "../services/api/Blog/BlogCategory/get-blog-category-list"

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
    canonical: `/blogs`,
    languages: {
      "en-US": `/en-US/blogs`,
    },
  },
}

export default async function Page() {
  const serverQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000 * 2,
      },
    },
  })

  serverQueryClient.prefetchQuery({
    queryKey: [
      QUERY.WEBSITE_MODULE.BLOG.LIST.key,
      parseInt(process.env.NEXT_PUBLIC_SERVER_SIDE_PAGE_NO as string),
    ],
    queryFn: async () => {
      const data = await getBlogList(
        parseInt(process.env.NEXT_PUBLIC_SERVER_SIDE_PAGE_SIZE as string),
        "",
        ""
      )
      return data
    },
  })

  serverQueryClient.prefetchQuery({
    queryKey: [QUERY.WEBSITE_MODULE.BLOG_CATEGORY.LIST.key],
    queryFn: async () => {
      const data = await getBlogCategoryList()
      return data
    },
  })

  return (
    <HydrationBoundary state={dehydrate(serverQueryClient)}>
      <BlogList />
    </HydrationBoundary>
  )
}
