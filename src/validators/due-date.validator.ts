import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    if (!(value instanceof Date) || isNaN(value.getTime())) return false;

    const now = new Date();
    const input = new Date(value);

    // Clear hours, minutes, seconds from both dates
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDay = new Date(
      input.getFullYear(),
      input.getMonth(),
      input.getDate(),
    );

    return inputDay.getTime() >= today.getTime();
  }

  defaultMessage(): string {
    return 'Due date must be a valid future date';
  }
}
