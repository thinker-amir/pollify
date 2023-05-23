import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorator/curent-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PreventUpdateInterceptor } from './interceptor/prevent-update.interceptor';
import { PollsService } from './polls.service';

@ApiTags('Polls')
@ApiBearerAuth()
@ApiUnauthorizedResponse({description: 'Unauthorized Response'})
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) { }

  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  create(@Body() createPollDto: CreatePollDto, @CurrentUser() user: User) {
    return this.pollsService.create(createPollDto, user);
  }

  @Get()
  async findAll() {
    return await this.pollsService.findAll();
  }

  @ApiNotFoundResponse({ description: 'Not found!' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(+id);
  }

  @ApiNotFoundResponse({ description: 'Not found!' })
  @Patch(':id')
  @UseInterceptors(PreventUpdateInterceptor)
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollsService.update(+id, updatePollDto);
  }

  @ApiNotFoundResponse({ description: 'Not found!' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollsService.remove(+id);
  }
}
