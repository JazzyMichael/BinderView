import Link from "next/link";
import { getSets, formatSets } from "@/utilities/data";

export default async function Sets() {
  const { english } = await getSets();
  const seriesData = formatSets(english.data);

  delete seriesData.Promos;
  delete seriesData.SubSets;

  const omitted: any = { sve: true };

  return (
    <>
      <h1 className="text-xl text-center py-4 mb-4 bg-slate-100">Sets</h1>

      <div className="w-full">
        {Object.entries(seriesData)
          .reverse()
          .filter(([series, sets]: any) => !(!sets || series.Promos))
          .map(([series, sets]: any) => (
            <div key={series}>
              <h4 className="ml-2 text-lg">{series}</h4>
              <ul>
                {sets.map((set: any) => (
                  <li key={set.id} className="px-6 hover:bg-slate-600">
                    {!omitted[set.id] && (
                      <Link href={`/${set.id}`}>
                        <img
                          src={set.images.logo}
                          className="mx-auto py-10 h-40"
                        />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </>
  );
}
