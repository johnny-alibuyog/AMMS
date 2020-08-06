import { Branch, BranchFilter, BranchId, BranchSort } from "./branch.models";

import apiBuilder from "kernel/api-builder";

const branchApi = apiBuilder<BranchId, Branch, BranchFilter, BranchSort, Branch>('branches');

export { branchApi }
