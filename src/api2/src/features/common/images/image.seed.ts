import * as faker from 'faker';
import { Image } from "./image.models";

const randomBase64Image = (size: number = 2) => {
  return Array.from({ length: size },
    (x, i) => new Image({ data: faker.image.avatar() })
  );
};

export const imageSeed = {
  randomBase64Image
};