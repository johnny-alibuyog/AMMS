import { ReturnModelType } from "@typegoose/typegoose";
import { Role } from "../role.models";
import { data } from "./role.data";
import { logger } from "../../../../utils/logger";

// https://stackoverflow.com/questions/32430384/mongodb-insert-if-it-doesnt-exist-else-skip
const roleSeederFn = (roles: Role[]) => {
  return async (model: ReturnModelType<typeof Role, unknown>) => {
    logger.info('Seeding roles ...');
    const bulk = model.collection.initializeOrderedBulkOp();
    roles.forEach(role => bulk.find({ 'name': role.name }).upsert().updateOne({ "$setOnInsert": role }));
    await bulk.execute();
  }
}

const roleSeeder = roleSeederFn(data);

export {
  roleSeeder,
  roleSeederFn
}