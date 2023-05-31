import { ValidationOptions, registerDecorator } from 'class-validator';
import { HasNotParticipatedValidator } from '../validator/has-not-participate-validator';

export function HasNotParticipated(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: HasNotParticipatedValidator,
    });
  };
}
