import { buildActions } from "./builder";
import { initialAuthState, initialUserState, initialListPageState } from "./models";

const authActions = buildActions('auth', initialAuthState);
const userActions = buildActions('user', initialUserState);
const listPageActions = buildActions('listPage', initialListPageState);

export {
  authActions,
  userActions,
  listPageActions
}
