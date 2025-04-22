import axios, { AxiosInstance } from "axios";
import { getPreferenceValues } from "@raycast/api";
import { ConfluenceSearchResponse, ConfluenceSpacesResponse, Preferences } from "./types";

export type ExcerptType = "highlight" | "indexed" | "none" | "highlight_unescaped" | "indexed_unescaped";
export type SpaceType = "global" | "collaboration" | "knowledge_base" | "personal";
export type SpaceStatus = "current" | "archived";

class ConfluenceClient {
  private client: AxiosInstance;
  private preferences: Preferences;

  constructor() {
    this.preferences = getPreferenceValues<Preferences>();
    this.client = axios.create({
      baseURL: `https://${this.preferences.confluenceDomain}/wiki`,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${this.preferences.confluenceEmail}:${this.preferences.confluenceApiToken}`,
        ).toString("base64")}`,
        Accept: "application/json",
      },
    });
  }

  private async request<T>(method: string, url: string, params?: URLSearchParams): Promise<T> {
    try {
      const response = await this.client.request<T>({
        method,
        url,
        params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Confluence API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Confluenceのページを検索します。
   *
   * @param options - 検索オプション
   * @param options.cql - CQLクエリ文字列
   * @param options.cursor - ページネーション用のカーソル（オプション）
   * @param options.limit - 1ページあたりの取得件数（オプション）
   * @param options.excerpt - 検索結果のハイライト表示設定（オプション）
   * @returns 検索結果を含むConfluenceSearchResponseオブジェクト
   * @throws {Error} APIリクエストが失敗した場合
   */
  async searchPages({
    cql,
    cursor,
    limit,
    excerpt,
  }: {
    cql: string;
    cursor?: string;
    limit?: number;
    excerpt?: ExcerptType;
  }): Promise<ConfluenceSearchResponse> {
    const params = new URLSearchParams({ cql });
    if (limit) {
      params.append("limit", limit.toString());
    }
    if (cursor) {
      params.append("cursor", cursor);
    }
    if (excerpt) {
      params.append("excerpt", excerpt);
    }

    return this.request<ConfluenceSearchResponse>("GET", "/rest/api/search", params);
  }

  /**
   * Confluenceのスペース一覧を取得します。
   *
   * @param options - 取得オプション
   * @param options.cursor - ページネーション用のカーソル（オプション）
   * @param options.limit - 1ページあたりの取得件数（オプション）
   * @param options.type - スペースのタイプ（オプション）
   * @param options.status - スペースのステータス（オプション）
   * @returns スペース一覧を含むConfluenceSpacesResponseオブジェクト
   * @throws {Error} APIリクエストが失敗した場合
   */
  async getSpaces({
    cursor,
    limit,
    type,
    status,
    myFavorite,
  }: {
    cursor?: string;
    limit?: number;
    type?: SpaceType;
    status?: SpaceStatus;
    myFavorite?: boolean;
  } = {}): Promise<ConfluenceSpacesResponse> {
    const params = new URLSearchParams();
    if (type) {
      params.append("type", type);
    }
    if (status) {
      params.append("status", status);
    }
    if (limit) {
      params.append("limit", limit.toString());
    }
    if (cursor) {
      params.append("cursor", cursor);
    }
    if (myFavorite !== undefined) {
      params.append("favourite", myFavorite.toString());
      params.append("favouriteUserKey", "currentUser()");
    }
    return this.request<ConfluenceSpacesResponse>("GET", "rest/api/space", params);
  }
}

const confluenceClient = new ConfluenceClient();

export const searchPages = confluenceClient.searchPages.bind(confluenceClient);
export const getSpaces = confluenceClient.getSpaces.bind(confluenceClient);
