export interface Preferences {
  confluenceEmail: string;
  confluenceApiToken: string;
  confluenceDomain: string;
}

export interface ConfluencePage {
  content: {
    id: string;
    type: string;
    status: string;
    title: string;
    space: {
      key: string;
      name: string;
      type: string;
      status: string;
      _expandable: Record<string, unknown>;
      _links: Record<string, unknown>;
    };
    history: {
      latest: boolean;
    };
    version: {
      when: string;
      number: number;
      minorEdit: boolean;
    };
    _links: Record<string, unknown>;
  };
  user?: {
    type: string;
    username: string;
    userKey: string;
    accountId: string;
    accountType: string;
    email: string;
    publicName: string;
    profilePicture: {
      path: string;
      width: number;
      height: number;
      isDefault: boolean;
    };
    displayName: string;
    timeZone: string;
    externalCollaborator: boolean;
    isExternalCollaborator: boolean;
    isGuest: boolean;
    operations: Array<{
      operation: string;
      targetType: string;
    }>;
    details: Record<string, unknown>;
    personalSpace: {
      key: string;
      name: string;
      type: string;
      status: string;
      _expandable: Record<string, unknown>;
      _links: Record<string, unknown>;
    };
    _expandable: Record<string, unknown>;
    _links: Record<string, unknown>;
  };
  space?: {
    id: number;
    key: string;
    name: string;
    type: string;
    status: string;
    _expandable: Record<string, unknown>;
    _links: Record<string, unknown>;
  };
  title: string;
  excerpt: string;
  url: string;
  resultGlobalContainer: {
    title: string;
    displayUrl: string;
  };
  breadcrumbs: Array<{
    label: string;
    url: string;
    separator: string;
  }>;
  entityType: string;
  iconCssClass: string;
  lastModified: string;
  friendlyLastModified: string;
  score: number;
  _links: {
    next?: string;
    prev?: string;
  };
}

export interface ConfluenceSpace {
  id: number;
  key: string;
  name: string;
  type: string;
  status: string;
  isFavorite?: boolean;
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
