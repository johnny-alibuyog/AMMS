import { functor } from "kernel";

const hasValue = <T>(value: T) => value != null;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const replace = <T>(items: T[], replacing: T, replacement: T) => {
  const index = items.indexOf(replacing);
  if (~index) {
    items[index] = replacement;
  }
  return items;
}

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
  if (value instanceof Object) {
    return Object.keys(value).length > 0;
  }
  return false;
}

const isNotNullOrDefault = <T>(value: T): boolean => !isNullOrDefault(value);

const properCase = (value: string) => functor(value)
  .map(x => x.split(' '))
  .map(x => x.map(capitalize))
  .map(x => x.join(' '))
  .valueOf();


const dirtyChecker = <T>(obj1: T) => (obj2: T) => JSON.stringify(obj1) != JSON.stringify(obj2);

// const dirtyChecker = <T>(obj1: T) => {
//   const objStr1 = JSON.stringify(obj1);
//   return (obj2: T) => {
//     const objStr2 = JSON.stringify(obj2);
//     console.log(objStr1);
//     console.log(objStr2);
//     return objStr1 != objStr2;
//   }
// };

export {
  hasValue,
  dirtyChecker,
  isNullOrDefault,
  isNotNullOrDefault,
  replace,
  capitalize,
  properCase,
}
