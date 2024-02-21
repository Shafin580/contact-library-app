import { Metadata } from "next"
import request, { gql } from "graphql-request"
import { QUERY } from "query.config"
import BlogDetails from "./BlogDetails.Client"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { formatDateString } from "@utils/helpers/misc"
import { getBlogList } from "app/(module)/services/api/Blog/get-blog-list"
import { getBlogDetail } from "app/(module)/services/api/Blog/get-blog"
import { PATHS } from "router.config"

/**
 * * Metadata for current page
 */
export async function generateMetadata({ params: { id } }: { params: { id: string } }): Promise<Metadata> {
  
  return {
    title: `${blogDetails != null ? `Blogs - ${blogDetails["title"]}` : `Blogs - Blog Details`}`,
    openGraph: {
      title: `${blogDetails != null ? `Blogs - ${blogDetails["title"]}` : `Blogs - Blog Details`}`,
    },
    twitter: {
      title: `${blogDetails != null ? `Blogs - ${blogDetails["title"]}` : `Blogs - Blog Details`}`,
    },
    description: blogDetails?.description,
    alternates: {
      canonical: `/blogs/${id}`,
      languages: {
        "en-US": `/en-US/blogs/${id}`,
      },
    },
  }
}

export async function generateStaticParams() {
  // + Function To Fetch Blog Details
  const blogList = await getBlogList(10000000)

  return blogList.data.map((blog) => ({ id: blog.id.toString() }))
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const serverQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000 * 2,
      },
    },
  })

  serverQueryClient.prefetchQuery({
    queryKey: [QUERY.WEBSITE_MODULE.BLOG.DYNAMIC(id).key, id],
    queryFn: async () => {
      const data = await getBlogDetail(id)
      return data
    },
  })

  return (
    <HydrationBoundary state={dehydrate(serverQueryClient)}>
      <BlogDetails id={id} />
    </HydrationBoundary>
  )
}
