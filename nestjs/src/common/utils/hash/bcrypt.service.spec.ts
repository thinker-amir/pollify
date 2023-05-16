import { Test, TestingModule } from '@nestjs/testing';
import { compare, genSalt, hash } from 'bcrypt';
import { BcryptService } from './bcrypt.service';

jest.mock('bcrypt');


describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should call genSalt and hash with the correct arguments then return the hashed data', async () => {
      const data = 'test';
      const salt = 'salt';
      const hashedData = 'hashedData';

      (genSalt as jest.Mock).mockResolvedValue(salt);
      (hash as jest.Mock).mockResolvedValue(hashedData);
      const result = await service.hash(data);

      expect(genSalt).toHaveBeenCalled();
      expect(hash).toHaveBeenCalledWith(data, salt);
      expect(result).toBe(hashedData);
    });
  })

  describe('compare', () => {
    const data = 'test';
    const encrypted = 'encrypted';
    it('should call compare with the correct arguments', async () => {
      await service.compare(data, encrypted);
      expect(compare).toHaveBeenCalledWith(data, encrypted);
    });

    it('should return the result of compare', async () => {
      const result = true;
      (compare as jest.Mock).mockResolvedValue(result);
      const compareResult = await service.compare(data, encrypted);
      expect(compareResult).toBe(result);
    });
  });
});
