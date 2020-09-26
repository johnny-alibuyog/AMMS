import { DbContext } from "./db.context";
import { branchSeeder } from "./membership/branches/data/branch.seeder";
import { config } from "../config";
import { resourceSeeder } from "./membership/resources/data/resource.seeder";
import { roleSeeder } from "./membership/roles/data/role.seeder";
import { userSeeder } from "./membership/users/data/user.seeder";

const seedData = async (db: DbContext) => {
  if (config.environment === 'test') {
    await Promise.all([
      db.users.deleteMany({}),
      db.resources.deleteMany({}),
      db.roles.deleteMany({}),
      db.branches.deleteMany({}),
      db.images.deleteMany({})
    ]);
  }

  await branchSeeder(db.branches);
  await resourceSeeder(db.resources);
  await roleSeeder(db.roles);
  await userSeeder(db.users);
}

export { seedData }