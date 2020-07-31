import * as faker from 'faker';

import { Image } from "../image.models";

const randomizeBase64Image = (size: number = 2) => {
  return Array.from({ length: size },
    (x, i) => new Image({ data: faker.image.dataUri() })
  );
};

export { randomizeBase64Image }