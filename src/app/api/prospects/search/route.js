import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ error: "Missing query param" }, { status: 400 });
  }

  try {
    const searchResp = await client.textSearch({
      params: { query, key: process.env.GOOGLE_MAPS_API_KEY },
    });

    const leads = [];
    for (const place of searchResp.data.results) {
      const details = await client.placeDetails({
        params: {
          place_id: place.place_id,
          fields: ["name", "formatted_address", "formatted_phone_number", "website"],
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      const info = details.data.result;
      if (!info.website) {
        leads.push({
          name: info.name,
          address: info.formatted_address || "",
          phone: info.formatted_phone_number || null,
          placeId: place.place_id,
        });
      }
    }

    return Response.json({ found: leads.length, leads });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}