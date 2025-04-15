export interface ConfluencePage {
  content: {
    id: string;
    type: string;
    status: string;
    title: string;
    space: {
      key: string;
      name: string;
    };
    _links: {
      webui: string;
    };
  };
  space: {
    key: string;
    name: string;
  };
  title: string;
  url: string;
  lastModified: string;
  friendlyLastModified: string;
}

export interface ConfluenceSpace {
  id: number;
  key: string;
  name: string;
  type: string;
  status: string;
}

export interface ConfluenceSearchResponse {
  results: ConfluencePage[];
  start: number;
  limit: number;
  size: number;
  totalSize: number;
  _links: {
    next?: string;
  };
}

export interface ConfluenceSpacesResponse {
  results: ConfluenceSpace[];
  start: number;
  limit: number;
  size: number;
  totalSize: number;
  _links: {
    next?: string;
  };
} 