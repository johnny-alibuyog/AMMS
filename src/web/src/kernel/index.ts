type Mappable<T> = {
  map: <R>(fn: (x: T) => R) => Mappable<R>;
  valueOf: () => T;
}

const functor = <T>(value: T): Mappable<T> => ({
  map: <R>(fn: (x: T) => R): Mappable<R> => functor(fn(value)),
  valueOf: () => value,
});

export { functor }
