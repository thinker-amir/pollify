import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OwnerGuard } from '../common/guard/owner.guard';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { UpdatePolicyInterceptor } from './interceptor/update.policy.interceptor';
import { PollsService } from './polls.service';

@ApiTags('Polls')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized Response' })
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollsService.create(createPollDto);
  }

  @Get()
  async findAll() {
    return await this.pollsService.findAllWithUserParticipation();
  }

  @ApiNotFoundResponse({ description: 'Not found!' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findOneWithUserParticipation({ where: { id } });
  }

  @ApiNotFoundResponse({ description: 'Not found!' })
  @Patch(':id')
  @UseGuards(OwnerGuard)
  @ApiForbiddenResponse({ description: 'Forbidden Response' })
  @UseInterceptors(UpdatePolicyInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    return this.pollsService.update(id, updatePollDto);
  }

  @ApiNotFoundResponse({ description: 'Not found!' })
  @UseGuards(OwnerGuard)
  @ApiForbiddenResponse({ description: 'Forbidden Response' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.remove(id);
  }
}
