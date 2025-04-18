export type CQLCondition = {
  field: string;
  operator: string;
  value: string;
};

export type SortOrder = "asc" | "desc";

export type SortCondition = {
  field: string;
  order: SortOrder;
};

export type CQLQuery = {
  conditions: CQLCondition[];
  sort?: SortCondition[];
};

export function buildCQLQuery(query: CQLQuery): string {
  const conditions = query.conditions
    .map(({ field, operator, value }) => {
      const escapedValue = value.replace(/"/g, '\\"');
      return `${field} ${operator} "${escapedValue}"`;
    })
    .join(" and");

  const sortClause = query.sort
    ? ` order by ${query.sort.map(({ field, order }) => `${field} ${order}`).join(", ")}`
    : "";

  return conditions + sortClause;
} 