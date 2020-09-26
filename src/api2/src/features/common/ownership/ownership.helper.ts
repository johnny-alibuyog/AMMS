import { ensure, isNotNullOrDefault, isNullOrDefault } from "../helpers/query.helpers";

import { BranchIdContract } from "../../membership/branches/branch.services";
import { DbContext } from "../../db.context";
import { HTTP403Error } from "../../../utils/http.errors";
import { context } from "../../../utils/request.context";
import { logger } from "../../../utils/logger";

// only allow branches on filter that bellongs to the current user
const qualifyBranch = async (db: DbContext, filterBrancheIds?: BranchIdContract[]) => {
  const userBranchIds = context.current()?.branchIds?.map(x => x.toHexString());
  await ensure(userBranchIds, {
    that: isNotNullOrDefault,
    else: () => {
      throw new HTTP403Error('You do not belong to any branch!');
    }
  });
  if (isNullOrDefault(filterBrancheIds)) {
    return userBranchIds;
  }
  const restrictedBranchIds = filterBrancheIds?.filter(x => !userBranchIds?.includes(x));
  await ensure(restrictedBranchIds, {
    that: isNullOrDefault,
    else: async (value: string[] | undefined) => {
      const restrictedBranchess = await db.branches.find({ _id: { $in: value } }).exec();
      const message = `You do not have access to branch/es ${restrictedBranchess?.map(x => x.name).join(', ')}`;
      throw new HTTP403Error(message);
    }
  });
  return filterBrancheIds;
}

export { qualifyBranch }