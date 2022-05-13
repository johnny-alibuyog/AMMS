import { SortDirection } from "../contract.models";
import { Types } from "mongoose";

const isNullOrDefault = <T>(value: T): boolean => {
  if (value == null) {
    return true;
  }
  if (value == undefined) {
    return true;
  }
  if (typeof value === 'string' /* value instanceof String */) {
    return value.trim().length === 0;
  }
  if (value instanceof Array) {
    return value.length === 0;
  }
  if (value instanceof Types.ObjectId) {
    return value.toHexString() == null || value.toHexString() == undefined || value.toHexString() == ''; 
  }
  if (value instanceof Object) {
    return Object.keys(value).length == 0;
  }
  return false;
}

const isNotNullOrDefault = <T>(value: T): boolean => !isNullOrDefault(value);

type EvalParam<T, M> = {
  when: (item: T) => boolean,
  map: (item: T) => M
}

const addItemWhen = <T, M>(value: T, evaluator: EvalParam<T, M>): M[] =>
  evaluator.when(value) ? [evaluator.map(value)] : [];

const addItemIf = <T>(condition: () => boolean, item: T): T[] =>
  condition() ? [item] : [];

const addEntryWhen = <T, M>(value: T, evaluator: EvalParam<T, M>): {} =>
  evaluator.when(value) && evaluator.map(value);

const addEntryIf = (condition: () => boolean, entry: {}): {} =>
  condition() && entry;


const sortDirectionIsNotNone = (dir: SortDirection = 'none') =>
  isNotNullOrDefault(dir) && dir != 'none';

const valueOrNone = (dir?: SortDirection) => dir ? dir : 'none';


type EnsureEvaluator<T> = {
  that: (value: T) => boolean,
  else: (value: T) => Promise<void>
}

const ensure = async <T>(value: T, evaluator: EnsureEvaluator<T>) => {
  if (!evaluator.that(value)) {
    await evaluator.else(value);
  }
}


export {
  isNullOrDefault,
  isNotNullOrDefault,
  addItemWhen,
  addItemIf,
  addEntryWhen,
  addEntryIf,
  sortDirectionIsNotNone,
  valueOrNone,
  ensure
}