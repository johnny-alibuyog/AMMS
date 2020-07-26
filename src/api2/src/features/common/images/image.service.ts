import { Image } from './image.models';
import { initDbContext } from '../../db.context';
import { PageResponse, PageRequest, SortDirection } from '../../common/contract.models';

type ImageIdContract = string;

type ImageContract = Image;

type ImageFilterRequest = { keyword: string }

type ImageSortRequest = { name: SortDirection }

type ImagePageRequest = PageRequest<ImageFilterRequest, ImageSortRequest>;

type ImagePageResponse = PageResponse<ImageContract>;

const get = async (id: ImageIdContract) => {
  const db = await initDbContext();
  const image = await db.images.findById(id).exec();
  return <ImageContract>image;
}

const create = async (image: ImageContract) => {
  const db = await initDbContext();
  const { id } = await db.images.create(image);
  return <ImageIdContract>id;
}

const update = async (id: ImageIdContract, role: ImageContract) => {
  const db = await initDbContext();
  await db.images.findByIdAndUpdate(id, role).exec();
}

const remove = async (id: ImageIdContract) => {
  const db = await initDbContext();
  await db.images.findByIdAndDelete(id).exec();
}

const imageService = {
  get,
  create,
  update,
  remove
};

export {
  imageService,
  ImageContract,
  ImageIdContract,
  ImagePageRequest,
  ImagePageResponse
}