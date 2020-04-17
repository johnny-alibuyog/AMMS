import * as bcrypt from 'bcrypt';

const saltRounds: number = 10;

const encrypt = (value: string): Promise<string> => bcrypt.hash(value, saltRounds);

const verify = (value: string, hash: string = '') => bcrypt.compare(value, hash);

const encryptor = {
  encrypt,
  verify
}

export {
  encryptor
}