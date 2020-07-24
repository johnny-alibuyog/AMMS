import { ImageBase } from './image.models';
import { initDbContext } from '../../db.context';
import { PageResponse, PageRequest, SortDirection, parsePageFrom, builderDef, Lookup } from '../../common/contract.models';

type ImageIdContract = string;

type ImageContract = ImageBase;

type ImageFilterRequest = { keyword: string }

type ImageSortRequest = { name: SortDirection }

type ImagePageRequest = PageRequest<ImageFilterRequest, ImageSortRequest>;

type ImagePageResponse = PageResponse<ImageContract>;

const get = async (id: ImageIdContract) => {
  const db = await initDbContext();
  const role = await db.images.findById(id).exec();
  return <ImageContract>role;
}

const create = async (role: ImageContract) => {
  const db = await initDbContext();
  const { id } = await db.images.create(role);
  return <ImageIdContract>id;
}

const update = async (id: ImageIdContract, role: ImageContract) => {
  const db = await initDbContext();
  await db.roles.findByIdAndUpdate(id, role).exec();
}

const remove = async (id: ImageIdContract) => {
  const db = await initDbContext();
  await db.roles.findByIdAndDelete(id).exec();
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