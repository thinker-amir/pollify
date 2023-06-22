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
import { CreateParticipateDto } from './dto/create-participate.dto';
import { UpdateParticipateDto } from './dto/update-participate.dto';
import { ParticipatesService } from './participates.service';

@ApiTags('participates')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized Response' })
@Controller('participates')
export class ParticipatesController {
  constructor(private readonly participateService: ParticipatesService) {}

  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not found!' })
  @Post()
  create(@Body() createParticipateDto: CreateParticipateDto) {
    return this.participateService.create(createParticipateDto);
  }

  @Get()
  async findAll() {
    return await this.participateService.findAll();
  }

  @ApiNotFoundResponse({ description: 'Not found!' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.participateService.findOne({ where: { id } });
  }

  @UseGuards(OwnerGuard)
  @ApiNotFoundResponse({ description: 'Not found!' })
  @ApiForbiddenResponse({ description: 'Forbidden response' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParticipateDto: UpdateParticipateDto,
  ) {
    return this.participateService.update(id, updateParticipateDto);
  }

  @UseGuards(OwnerGuard)
  @ApiNotFoundResponse({ description: 'Not found!' })
  @ApiForbiddenResponse({ description: 'Forbidden response' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.participateService.remove(id);
  }
}
