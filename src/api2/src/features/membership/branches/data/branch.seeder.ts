import { Branch } from "../branch.models";
import { ReturnModelType } from "@typegoose/typegoose";
import { data } from "./branch.data";
import { logger } from "../../../../utils/logger";

const branchSeederFn = (branches: Branch[]) => {
  return async (model: ReturnModelType<typeof Branch, unknown>) => {
    logger.info('Seeding branches ...');
    const bulk = model.collection.initializeOrderedBulkOp();
    branches.forEach(branch => bulk.find({ '_id': branch._id }).upsert().updateOne({ "$setOnInsert": branch }))
    await bulk.execute();
  }
}

const branchSeeder = branchSeederFn(data);

export { branchSeeder }