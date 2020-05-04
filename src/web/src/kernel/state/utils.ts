import { store } from './store';
import { State, initialState } from './models';
import { filter, first, map, distinct } from 'rxjs/operators';

// REFERENCE: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick

const hasValue = <T>(value: T) => value != null;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const setFn = <K extends keyof State>(key: K) => {
  return (state: State, value: State[K]): State => {
    const newState = Object.assign({}, state ?? initialState);
    newState[key] = Object.assign({}, value);
    return newState;
  }
}

const resetFn = <K extends keyof State>(key: K, value: State[K]) => {
  return (state: State): State => {
    const newState = Object.assign({}, state ?? initialState);
    newState[key] = Object.assign({}, value);
    return newState;
  }
}

const dispatchSetFn = <K extends keyof State>(key: K, set: (state: State, value: State[K]) => State) => {
  return (value: State[K]) => {
    store.dispatch(set, value);
  }
}

const dispatchResetFn = (reset: (state: State) => State) => {
  return () => {
    store.dispatch(reset);
  }
}

const stateFn = <K extends keyof State>(key: K) => {
  return () => {
    return store.state
      .pipe(
        map(x => x && x[key] || null),
        filter(hasValue),
        distinct()
      );
  }
}

const currentFn = <K extends keyof State>(key: K) => {
  return () => {
    return store.state
      .pipe(
        map(x => x && x[key] || null),
        filter(hasValue),
        first()
      )
      .toPromise();
  }
}

const buildActions = <K extends keyof State>(key: K, initialValue: State[K]) => {

  const set = setFn(key);

  const reset = resetFn(key, initialValue);

  const state = stateFn(key);

  const current = currentFn(key);

  const dispatchSet = dispatchSetFn(key, set);

  const dispatchReset = dispatchResetFn(reset);

  const suffix = capitalize(key);

  store.registerAction(`set${suffix}`, set);

  store.registerAction(`reset${suffix}`, reset);

  return {
    state: state,
    current: current,
    set: dispatchSet,
    reset: dispatchReset
  }
}

export { 
  buildActions
}
