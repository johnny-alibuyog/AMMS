import * as faker from 'faker';

const randomizeElementsFn = <T>(elements: T[]) => () => faker.helpers.shuffle(elements).slice(0, faker.random.number({ min: 1, max: elements.length }))

const randomizeElementFn = <T>(elements: T[]) => () => faker.random.arrayElement(elements);

export {
  randomizeElementFn,
  randomizeElementsFn
}