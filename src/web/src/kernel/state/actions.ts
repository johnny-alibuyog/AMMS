import { buildActions } from "./builder";
import { initialAuthState, initialUserState } from "./models";

const authActions = buildActions('auth', initialAuthState);
const userActions = buildActions('user', initialUserState);

export {
  authActions,
  userActions
}
