import {
  Store,
  LogLevel,
  logMiddleware,
  MiddlewarePlacement,
  localStorageMiddleware,
  rehydrateFromLocalStorage
} from 'aurelia-store';
import { Container } from 'aurelia-framework';
import { State } from './models';

const storageKey: string = 'STORAGE-KEY';
const store: Store<State> = Container.instance.get(Store) as Store<State>;
store.registerMiddleware(logMiddleware, MiddlewarePlacement.After, { logType: LogLevel.log });
store.registerMiddleware(localStorageMiddleware, MiddlewarePlacement.After, { key: storageKey });
store.registerAction('rehydrate', rehydrateFromLocalStorage);
store.dispatch(rehydrateFromLocalStorage, storageKey);

export { store }
