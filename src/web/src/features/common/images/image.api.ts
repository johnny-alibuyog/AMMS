import apiBuilder from "kernel/api-builder";
import { ImageId, Image, ImageFilter, ImageSort } from './image.models';

const imageApi = apiBuilder<ImageId, Image, ImageFilter, ImageSort, Image>('images');

export { imageApi }
