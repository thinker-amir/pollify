import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiFile } from '../common/decorator/api-file.decorator';
import { OwnerGuard } from '../common/guard/owner.guard';
import { CoverService } from './cover.service';

@ApiTags('Polls')
@ApiBearerAuth()
@UseGuards(OwnerGuard)
@ApiNotFoundResponse({ description: 'Not found!' })
@ApiForbiddenResponse({ description: 'Forbidden Response' })
@ApiUnauthorizedResponse({ description: 'Unauthorized Response' })
@Controller('polls')
export class CoverController {
  constructor(private readonly coverService: CoverService) {}

  @ApiFile()
  @HttpCode(HttpStatus.OK)
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Response' })
  @ApiOperation({
    summary: 'Upload an image to be used as a poll cover.',
    description:
      'Upload image to serve as poll cover. Replace existing cover if present. Accepted formats: png, jpeg, jpg. Max file size: 2MB.',
  })
  @Patch('/:id/cover')
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 2, // 2MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.coverService.uploadCover(id, file);
  }

  @ApiOperation({
    summary: "Remove a poll's cover",
    description:
      "This operation removes a poll's cover with a given id if it exists. If the cover does not exist, an error will be returned.",
  })
  @Delete('/:id/cover')
  @UseInterceptors(FileInterceptor('file'))
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.coverService.removeCover(id);
  }
}
