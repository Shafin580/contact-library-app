import { formatDateString } from "@utils/helpers/misc"
import request, { gql } from "graphql-request"
import { QUERY } from "query.config"
import { PATHS } from "router.config"

// + Function To Get Impact Story Detail
export const getImpactStoryDetail = async (id: string) => {
  const data: any = await request(
    String(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_API_URL),
    gql`
      ${PATHS.WP_MODULE.IMPACT_STORY.DYNAMIC.query(id).root}
    `
  )
  const tempData: any = data["impactStory"]
  const formattedData: ImpactStoryProps | null =
    tempData != null
      ? {
          id: tempData.databaseId,
          title: tempData.impactStoryFields.title,
          description: tempData.impactStoryFields.description,
          imageUrl: tempData.impactStoryFields.image.node.sourceUrl,
          postDate: formatDateString(String(tempData.date)),
        }
      : null

  console.log("Impact Story Details:", formattedData)

  return formattedData
}
