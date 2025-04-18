import axios from "axios";
import { getPreferenceValues } from "@raycast/api";
import { ConfluenceSearchResponse, ConfluenceSpacesResponse, Preferences } from "./types";

const PAGES_LIST_LIMIT = 25;

export async function searchPages(
  query: string,
  spaceKey?: string,
  cursor?: string,
): Promise<ConfluenceSearchResponse> {
  const preferences = getPreferenceValues<Preferences>();
  const cqlParams = [];
  cqlParams.push(`text ~ "${query}"`);
  cqlParams.push(`type = page`);
  if (spaceKey) {
    cqlParams.push(`space = "${spaceKey}"`);
  }
  const cql = cqlParams.join(" AND ");
  const params = new URLSearchParams({
    cql,
    limit: PAGES_LIST_LIMIT.toString(),
    excerpt: "highlight",
  });
  if (cursor) {
    params.append("cursor", cursor);
  }

  const response = await axios.get<ConfluenceSearchResponse>(
    `https://${preferences.confluenceDomain}/wiki/rest/api/search`,
    {
      params,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${preferences.confluenceEmail}:${preferences.confluenceApiToken}`,
        ).toString("base64")}`,
        Accept: "application/json",
      },
    },
  );

  return response.data;
}

export async function getSpaces(cursor?: string): Promise<ConfluenceSpacesResponse> {
  const preferences = getPreferenceValues<Preferences>();
  const params = new URLSearchParams({
    type: "global",
    status: "current",
    limit: "250",
  });
  if (cursor) {
    params.append("cursor", cursor);
  }

  const response = await axios.get<ConfluenceSpacesResponse>(
    `https://${preferences.confluenceDomain}/wiki/api/v2/spaces`,
    {
      params,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${preferences.confluenceEmail}:${preferences.confluenceApiToken}`,
        ).toString("base64")}`,
      },
    },
  );

  return response.data;
}
