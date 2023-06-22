import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

interface OwnerGuardService {
  findOne(options: FindOneOptions): Promise<{ user: { id: string } }>;
}

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @Inject('OwnerGuardService') private readonly service: OwnerGuardService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const entityId = request.params.id;
    const userId = request.user.id;

    const entity = await this.service.findOne({
      where: { id: entityId },
      relations: ['user'],
    });

    return entity.user.id === userId;
  }
}
