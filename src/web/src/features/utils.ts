import { functor } from "kernel";

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const properCase = (value: string) => functor(value)
  .map(x => x.split(' '))
  .map(x => x.map(capitalize))
  .map(x => x.join(' '));
