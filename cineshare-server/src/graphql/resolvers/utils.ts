import { FindAndCountOptions, Op, ModelCtor, Model } from "sequelize";
import { fromCursorHash, toCursorHash } from "../../graphql/utils/hash";

interface CursorOptions {
  limit?: number;
  cursor?: string;
}

export async function findAllWithCursor<M>(
  model: ModelCtor<Model<any, any>>,
  cursorOptions: CursorOptions,
  findOptions: FindAndCountOptions = {}
) {
  const { limit = 100, cursor } = cursorOptions;

  const { where, order, ...rest } = findOptions;

  const cursorClause = cursor
    ? { id: { [Op.lt]: fromCursorHash(cursor) } }
    : {};
  const { rows, count: totalCount } = await model.findAndCountAll({
    order: [...((order as any[]) || []), ["id", "DESC"]],
    limit: limit + 1,
    where: {
      ...where,
      ...cursorClause,
    },
    ...rest,
  });
  const hasNextPage = rows.length > limit;
  const edges = hasNextPage ? rows.slice(0, -1) : rows;

  return {
    edges,
    totalCount,
    pageInfo: {
      hasNextPage,
      cursor: edges.length
        ? toCursorHash(edges[edges.length - 1].id.toString())
        : undefined,
    },
  };
}
