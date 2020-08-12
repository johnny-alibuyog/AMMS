import { Resource } from "../resource.model";
import { ReturnModelType } from "@typegoose/typegoose";
import { data } from "./resource.data";
import { logger } from "../../../../utils/logger";

const resourceSeederFn = (resources: Resource[]) => {
  return async (model: ReturnModelType<typeof Resource, unknown>) => {
    logger.info('Seeding resources ...');
    const bulk = model.collection.initializeOrderedBulkOp();
    resources.forEach(resource => bulk.find({ '_id': resource._id }).upsert().updateOne({ "$setOnInsert": resource }));
    await bulk.execute();
  }
}

const resourceSeeder = resourceSeederFn(data);

export {
  resourceSeeder,
  resourceSeederFn
}