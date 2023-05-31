import { ValidationOptions, registerDecorator } from 'class-validator';
import { ParticipateTimeValidator } from '../validator/participate-time-validator';

export function IsItTimeToParticipate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ParticipateTimeValidator,
    });
  };
}
