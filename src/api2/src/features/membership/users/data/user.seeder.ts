import { User, preUserSave } from "../user.models";

import { ReturnModelType } from "@typegoose/typegoose";
import { data } from "./user.data";
import { logger } from "../../../../utils/logger";

const userSeederFn = (users: User[]) => {
  return async (model: ReturnModelType<typeof User, unknown>) => {
    logger.info('Seeding users ...');
    const bulk = model.collection.initializeOrderedBulkOp();
    for (const user of users) { /* array.forEach doesn't support async iteration yet we are using for loop instead */
      await preUserSave(user);  /* since mongodb middleware insn't invoke with upsert, might as well manually call */
      bulk.find({ 'username': user.username }).upsert().updateOne({ "$setOnInsert": user })  
    }
    await bulk.execute();
  }
}

const userSeeder = userSeederFn(data);

export { userSeeder }