import { MockRepository } from 'test/helper/type/mockRepository.type';

export const mockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  preload: jest.fn(),
  createQueryBuilder: jest.fn(),
});
