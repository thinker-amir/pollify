import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from '../aws/s3/s3.service';
import { S3_BUCKET_NAME } from './constant/constants';
import { Poll } from './entities/poll.entity';
import { PollsService } from './polls.service';

@Injectable()
export class CoverService {
  constructor(
    private readonly s3: S3Service,
    private readonly pollsService: PollsService,
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  async uploadCover(id: number, file: Express.Multer.File): Promise<void> {
    let oldCover: string;
    const poll = await this.pollsService.findOne({ where: { id } });
    const fileName = await this.s3.uploadFile(file, S3_BUCKET_NAME);
    if (poll.cover) {
      oldCover = poll.cover;
    }
    poll.cover = fileName;
    await this.pollRepository.update(id, poll);
    if (oldCover) {
      await this.s3.deleteFile(oldCover, S3_BUCKET_NAME);
    }
  }

  async removeCover(id: number) {
    const poll = await this.pollsService.findOne({ where: { id } });
    if (poll.cover) {
      await this.s3.deleteFile(poll.cover, S3_BUCKET_NAME);
      poll.cover = null;
      await this.pollRepository.update(id, poll);
    }
  }
}
