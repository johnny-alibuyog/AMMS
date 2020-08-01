import { HTTP401Error } from "../../../utils/http.errors";
import { UserContract } from "../users/user.services";
import { encryptor } from '../../../utils/encryptor';
import { initDbContext } from "../../db.context";
import { jwtService } from "../../../middlewares/auth"
import { logger } from "../../../utils/logger";

type LoginCredential = {
  username: string,
  password: string
}

type LoginRequest = LoginCredential;

type LoginResponse = {
  token: string,
  user: UserContract
}

const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const db = await initDbContext();
  const user = await db.users.findOne({ username: request.username }).exec();
  if (!user) {
    throw new HTTP401Error();
  }
  const verified = await encryptor.verify(request.password, user.password);
  if (!verified) {
    throw new HTTP401Error();
  }
  const token = jwtService.sign({ userId: user.id, tenantId: 'Rapide' });
  return { token: token, user: user };
}

const logout = async (): Promise<void> => {
  logger.info('THIS IS LOGOUT METHOD!');
  return Promise.resolve();
}

const secure = (): Promise<void> => {
  logger.info('THIS IS SECURED METHOD!');
  return Promise.resolve();
}

const authService = {
  login,
  logout,
  secure
}

export {
  authService,
  LoginCredential,
  LoginRequest,
  LoginResponse
}
