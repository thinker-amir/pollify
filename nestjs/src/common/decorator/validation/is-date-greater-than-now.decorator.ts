import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsDateGreaterThanNow(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isDateGreaterThanNow',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const currentDate = new Date();
                    const inputDate = new Date(value);
                    return inputDate >= currentDate;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be greater than or equal to the current date (${new Date()})`;
                },
            },
        });
    };
}