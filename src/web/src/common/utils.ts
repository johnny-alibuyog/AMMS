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

const properCase = (value: string) => functor(value)
  .map(x => x.split(' '))
  .map(x => x.map(capitalize))
  .map(x => x.join(' '))
  .valueOf();

export {
  hasValue,
  replace,
  capitalize,
  properCase,
}
