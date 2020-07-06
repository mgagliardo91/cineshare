import { Op } from "sequelize";
import { LocalModel } from "../../models";

export async function batchId<P>(
  keys: string[],
  model: LocalModel<P>
): Promise<any[]> {
  const results = await model.findAll({
    where: {
      id: {
        [Op.in]: keys,
      },
    },
  });

  return keys.map((key) => results.find((result: any) => result.id === key));
}
