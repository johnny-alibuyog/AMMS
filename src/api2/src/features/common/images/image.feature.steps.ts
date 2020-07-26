import { basePath } from ".";
import { Image } from "./image.models";
import { imageSeed } from './image.seed';
import { buildClient } from "../../../client";
import { loadFeature, defineFeature } from "jest-cucumber";
import { ImageContract, ImageIdContract } from "./image.service";
import { UserContract } from "../../membership/users/user.services";
import { UserBuilderArgs, IBuilder, createUserBuilder, getToken } from "../../../utils/client.data.builder";
import { AccessControl, Resource, Permission, Action, Ownership } from "../../membership/roles/role.models";
import { HTTP404Error } from "../../../utils/http.errors";
import { expectCt } from "helmet";

const feature = loadFeature('./image.feature', { loadRelativePath: true });

const client = buildClient<ImageIdContract, ImageContract>(() => basePath());

defineFeature(feature, (test) => {

  test('Base64Image CRUD', ({ given, when, then }) => {
    let imageToBeCreated: Image;
    let imageToBeUpdatedWith: Image;
    let userBuilder: IBuilder<UserBuilderArgs, UserContract>;
    let imageId: ImageIdContract;
    let token: string;

    beforeAll(async () => {
      imageToBeCreated = imageSeed.randomBase64Image(1)[0];
      imageToBeUpdatedWith = imageSeed.randomBase64Image(1)[0];
      userBuilder = await createUserBuilder();
      const user: UserBuilderArgs = {
        email: 'some_email@gmail.com',
        username: 'some_user_with_role_admin',
        password: 'some_password',
        accessControl: new AccessControl({
          resource: Resource.common_image,
          permissions: [
            new Permission({ action: Action.read, ownership: Ownership.own }),
            new Permission({ action: Action.create, ownership: Ownership.own }),
            new Permission({ action: Action.update, ownership: Ownership.own }),
            new Permission({ action: Action.delete, ownership: Ownership.own }),
          ]
        })
      };
      await userBuilder.build(user);
      token = await getToken({ username: user.username, password: user.password });
    });

    afterAll(async () => {
      userBuilder.clean();
    })

    given(/^a base64Image has been created$/, async () => {
      imageId = await client(token).create(imageToBeUpdatedWith);
    });

    when(/^the base64Image has been updated$/, async () => {
      await client(token).update(imageId, imageToBeUpdatedWith);
    })

    then(/^the base64Image reflects the changes$/, async () => {
      const imageFromServer = await client(token).get(imageId);
      expect(imageFromServer.data).toBe(imageToBeUpdatedWith.data);
    });

    then(/^the base64Image is deletable$/, async () => {
      try {
        await client(token).remove(imageId);
        await client(token).get(imageId);
      }
      catch (err) {
        const notFound = new HTTP404Error();
        expect(err.message).toBe(notFound.message);
      }
      // expect(async () => {
      //   await client(token).remove(imageId);
      //   await client(token).get(imageId);
      // })
      // .toThrow(new HTTP404Error().message);
      // await client(token).remove(imageId);
      // const notFound = new HTTP404Error();
      // const roleFromServer = await client(token).get(imageId);
      // expect(roleFromServer).toEqual(notFound.message);
    });
  });
});