import { formatDateString } from "@utils/helpers/misc"
import request, { gql } from "graphql-request"
import { QUERY } from "query.config"
import { PATHS } from "router.config"

// + Function To Get Impact Story List
export const getImpactStoryList = async (
  pageSize: number = 10,
  endCursor: string = "",
  startCursor: string = "",
  searchText: string = ""
) => {
  const data: any = await request(
    String(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_API_URL),
    gql`
      ${PATHS.WP_MODULE.IMPACT_STORY.LIST.query(pageSize, endCursor, startCursor, searchText).root}
    `
  )

  const tempData: Array<any> = data["impactStories"] != null ? data["impactStories"]["nodes"] : []
  const formattedData: Array<ImpactStoryProps> = []

  tempData.length > 0 &&
    tempData.forEach((element: any) => {
      const temp: ImpactStoryProps = {
        id: element.databaseId,
        title: element.impactStoryFields.title,
        description: element.impactStoryFields.description,
        imageUrl: element.impactStoryFields.image.node.sourceUrl,
        postDate: formatDateString(String(element.date)),
      }
      formattedData.push(temp)
    })

  const result = {
    data: formattedData,
    pageInfo: {
      startCursor: data["impactStories"] != null ? String(data["impactStories"]["pageInfo"].startCursor) : "",
      endCursor: data["impactStories"] != null ? String(data["impactStories"]["pageInfo"].endCursor) : "",
      hasNextPage:
        data["impactStories"] != null ? (data["impactStories"]["pageInfo"].hasNextPage as boolean) : false,
      hasPreviousPage:
        data["impactStories"] != null
          ? (data["impactStories"]["pageInfo"].hasPreviousPage as boolean)
          : false,
    },
  }

  console.log("Impact Story List Data:", result)

  return result
}
