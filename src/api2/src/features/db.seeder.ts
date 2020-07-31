import { DbContext } from "./db.context";
import { config } from "../config";
import { roleSeeder } from "./membership/roles/data/role.seeder";
import { userSeeder } from "./membership/users/data/user.seeder";

const seedData = async (db: DbContext) => {
  if (config.environment === 'test') {
    await Promise.all([
      db.users.deleteMany({}),
      db.roles.deleteMany({})
    ]);
  }

  await roleSeeder(db.roles);
  await userSeeder(db.users);
}

export { seedData }