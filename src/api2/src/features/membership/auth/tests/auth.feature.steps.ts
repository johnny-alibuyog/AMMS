import { AccessControl, Action, Ownership, Permission, Resource } from '../../roles/role.models';
import { IBuilder, UserBuilderArgs, createUserBuilder } from '../../../../utils/client.data.builder';
import { LoginRequest, LoginResponse } from '../auth.service';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { UserContract } from '../../users/user.services';
import { basePath } from '..';
import { logger } from '../../../../utils/logger';
import { request } from '../../../../client';

const feature = loadFeature('./auth.feature', { loadRelativePath: true });

defineFeature(feature, (test) => {
  test('User logs in with bad credentials', ({ given, when, then }) => {
    let actualStatusCode: number;

    given(/^username (.*) does not exists$/, async (username: string) => {
      logger.info(`User ${username} does not exists.`);
    });

    when(/^credentials (.*) and password (.*) is submitted$/, async (username: string, password: string) => {
      const loginUrl = basePath().resource('login').build();
      const credentials: LoginRequest = { username, password };
      const response = await request.post(loginUrl).send(credentials);
      actualStatusCode = response.status;
    });

    then(/^(\d+) status code is returned$/, async (expectedStatusCode: string) => {
      expect(actualStatusCode).toBe(parseInt(expectedStatusCode));
    });
  });

  test('User accessing resource without permission', ({ given, when, then }) => {
    let actualStatusCode: number;
    let userBuilder: IBuilder<UserBuilderArgs, UserContract>;
    let accessControl: AccessControl;
    let token: string;

    beforeAll(async () => {
      userBuilder = await createUserBuilder();
      accessControl = new AccessControl({
        resource: Resource.membership_user,
        permissions: [new Permission({ action: Action.update, ownership: Ownership.all })]
      })
    });

    afterAll(async () => {
      await userBuilder.clean();
    });

    given(/^username (.*) with email (.*) and password (.*) does exists$/, async (username: string, email: string, password: string) => {
      await userBuilder.build({ email, username, password, accessControl });
    });

    when(/^credentials (.*) and password (.*) is submitted$/, async (username: string, password: string) => {
      const loginUrl = basePath().resource('login').build();
      const credentials: LoginRequest = { username, password };
      const response = await request.post(loginUrl).send(credentials);
      const result: LoginResponse = response.body;
      token = result.token;
    });

    when('try to access secure page without proper permission', async () => {
      const secureUrl = basePath().resource('secure').build();
      const response = await request.post(secureUrl).set('Authorization', `Bearer ${token}`).send({});
      actualStatusCode = response.status;
    });

    then(/^(\d+) status code is returned$/, async (expectedStatusCode: string) => {
      expect(actualStatusCode).toBe(parseInt(expectedStatusCode));
    });
  });

  test('User logs in with good credentials', ({ given, when, then }) => {
    let actualStatusCode: number;
    let userBuilder: IBuilder<UserBuilderArgs, UserContract>;
    let accessControl: AccessControl;

    beforeAll(async () => {
      userBuilder = await createUserBuilder();
      accessControl = new AccessControl({
        resource: Resource.all,
        permissions: [new Permission({ action: Action.all, ownership: Ownership.own })]
      })
    });

    afterAll(async () => {
      await userBuilder.clean();
    });

    given(/^username (.*) with email (.*) and password (.*) does exists$/, async (username: string, email: string, password: string) => {
      await userBuilder.build({ email, username, password, accessControl });
    });

    when(/^credentials (.*) and password (.*) is submitted$/, async (username: string, password: string) => {
      const loginUrl = basePath().resource('login').build();
      const credentials: LoginRequest = { username, password };
      const response = await request.post(loginUrl).send(credentials);
      actualStatusCode = response.status;
    });

    then(/^(\d+) status code is returned$/, async (expectedStatusCode: string) => {
      expect(actualStatusCode).toBe(parseInt(expectedStatusCode));
    });
  });

  test('User accessing resource with proper permission', ({ given, when, then }) => {
    let actualStatusCode: number;
    let userBuilder: IBuilder<UserBuilderArgs, UserContract>;
    let accessControl: AccessControl;
    let userToken: string;

    beforeAll(async () => {
      userBuilder = await createUserBuilder();
      accessControl = new AccessControl({
        resource: Resource.membership_user,
        permissions: [new Permission({ action: Action.read, ownership: Ownership.all })]
      });
    });

    afterAll(async () => {
      await userBuilder.clean();
    });

    given(/^username (.*) with email (.*) and password (.*) does exists$/, async (username: string, email: string, password: string) => {
      await userBuilder.build({ email, username, password, accessControl });
    });

    when(/^credentials (.*) and password (.*) is submitted$/, async (username: string, password: string) => {
      const loginUrl = basePath().resource('login').build();
      const credentials: LoginRequest = { username, password };
      const response = await request.post(loginUrl).send(credentials);
      const result: LoginResponse = response.body;
      userToken = result.token;
    });

    when('try to access secure page user has permission to', async () => {
      const secureUrl = basePath().resource('secure').build();
      const response = await request.post(secureUrl).set('Authorization', `Bearer ${userToken}`).send({});
      actualStatusCode = response.status;
    });

    then(/^(\d+) status code is returned$/, async (expectedStatusCode: string) => {
      expect(actualStatusCode).toBe(parseInt(expectedStatusCode));
    });
  });
});