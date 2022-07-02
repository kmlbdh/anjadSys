import { ValidationErrors, AbstractControl } from '@angular/forms';

export function requiredDisabledInput(controlNames: string[]) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    let errors = 0;
    controlNames.forEach(control => {
      const controlElement = formGroup.get(control);
      if (controlElement?.value === '') {
        controlElement?.setErrors({ required: true });
        errors += 1;
      } else {
        controlElement?.setErrors(null);
      }
    });
    return ((errors === 0) ? null: { required: true });
  };
}
