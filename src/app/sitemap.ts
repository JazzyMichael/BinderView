import { formatSets, getSets, seriesNameToSlug } from "@/utilities/data";
import { getSlugFromSetId } from "@/utilities/slugs";
import { Set } from "@/utilities/types";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://binderview.com";

  const highPriority = {
    "evolving-skies": true,
    "151": true,
    "neo-genesis": true,
    "neo-discovery": true,
    "neo-revelation": true,
    "neo-destiny": true,
    "firered-leafgreen": true,
    "ruby-sapphire": true,
    "team-rocket-returns": true,
  };

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, priority: 0.6, changeFrequency: "monthly" },
    { url: `${baseUrl}/search`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${baseUrl}/binders`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${baseUrl}/sets`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/series`, priority: 0.8, changeFrequency: "monthly" },
  ];

  const { english } = await getSets();
  const seriesData = formatSets(english.data) ?? {};

  delete seriesData.Promos;
  delete seriesData.SubSets;

  const seriesPages: MetadataRoute.Sitemap = Object.keys(seriesData).map(
    (series: string) => ({
      url: `${baseUrl}/series/${seriesNameToSlug(series)}`,
      priority: 0.8,
      changeFrequency: "weekly",
    })
  );

  const setPages: MetadataRoute.Sitemap = Object.keys(seriesData)
    .map((series: string) => {
      return seriesData[series].map((set: Set) => ({
        url: `${baseUrl}/${getSlugFromSetId(set.id)}`,
        priority: highPriority[getSlugFromSetId(set.id)] ? 0.9 : 0.7,
        changeFrequency: "weekly",
        // lastModified: getLastModified(set.updatedAt)
      }));
    })
    .flat();

  return [...staticPages, ...seriesPages, ...setPages];
}

// const getLastModified = (str: string): string => {
//   if (!str) return "";
//   const [year, month, day] = str.split("/");
//   return `${year}-${month}-${day.substring(0, 2)}`;
// };
