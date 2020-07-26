type ImageId = string;

type Image = {
  id: ImageId,
  data: string;
}

type ImageSort = {}

type ImageFilter = {}

const initImage = (): Image => ({
  id: null,
  data: null
});

export {
  Image,
  ImageId,
  ImageSort,
  ImageFilter,
  initImage
}