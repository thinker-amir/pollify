import { MockRepository } from "./type/mockRepository.type";

export const mockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  preload: jest.fn(),
  createQueryBuilder: jest.fn(),
});
