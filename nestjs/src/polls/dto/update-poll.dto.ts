import { PartialType } from '@nestjs/swagger';
import { CreatePollDto } from './create-poll.dto';

export class UpdatePollDto extends PartialType(CreatePollDto) {}
