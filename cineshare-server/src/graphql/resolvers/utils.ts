import { FindAndCountOptions, Op, ModelCtor, Model } from 'sequelize';
import { fromCursorHash, toCursorHash } from '../../utils/hash';

interface CursorOptions {
  limit?: number;
  cursor?: string;
}

export async function findAllWithCursor<M>(model: ModelCtor<Model<any,any>>, cursorOptions: CursorOptions, findOptions: FindAndCountOptions = {}) {
  const {
    limit = 100,
    cursor
  } = cursorOptions;

  const {
    where,
    order,
    ...rest
  } = findOptions;

  const cursorClause = cursor ? { id: { [Op.lt]: fromCursorHash(cursor) }} : {};
  const { rows, count: totalCount } = await model.findAndCountAll({
    order: [
      ...(order as any[] || []),
      ['id', 'DESC'],
    ],
    limit: limit + 1,
    where: {
      ...where,
      ...cursorClause
    },
    ...rest
  });
  const hasNextPage = rows.length > limit;
  const edges = hasNextPage ? rows.slice(0, -1) : rows;

  return {
    edges,
    totalCount,
    pageInfo: {
      hasNextPage,
      cursor: toCursorHash(edges[edges.length - 1].id.toString()),
    }
  }
}

// export async function findAllWithCursor<M>(find: FindModelFunction<FindModel<M>>, findOptions: FindAndCountOptions, cursorOptions: CursorOptions) {
//   const {
//     limit: cursorLimit = 100,
//     cursor
//   } = cursorOptions;

//   const {
//     where,
//     limit,
//     order,
//     ...rest
//   } = findOptions;

//   const cursorClause = cursor ? { id: { [Op.lt]: fromCursorHash(cursor) }} : {};
//   const { rows, count: totalCount } = await find({
//     order: [
//       ...(order as any[] || []),
//       ['id', 'ASC'],
//     ],
//     limit: limit + 1,
//     where: {
//       ...where,
//       ...cursorClause
//     },
//     ...rest
//   });
//   const hasNextPage = rows.length > limit;
//   const nodes = hasNextPage ? rows.slice(0, -1) : rows;

//   return {
//     nodes,
//     pageInfo: {
//       hasNextPage,
//       nextCursor: toCursorHash(rows[rows.length - 1].id.toString()),
//       totalCount
//     }
//   }
// }