import { RenderInstruction, ValidateResult } from "aurelia-validation";

export class ValidationFormRenderer {
  public render(instruction: RenderInstruction): void {
    for (let { result, elements } of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let { result, elements } of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  public add(element: Element, result: ValidateResult): void {
    const group = element.closest('.group');
    if (!group) {
      return;
    }

    if (result.valid) {
      if (!group.classList.contains('has-error')) {
        group.classList.add('has-success');
      }
    }
    else {
      // add the has-error class to the enclosing group div
      group.classList.remove('has-success');
      group.classList.add('has-error');

      // add help-block
      const message = document.createElement('p');
      message.className = 'error-message';
      message.textContent = result.message;
      message.id = `error-message-${result.id}`;
      group.appendChild(message);
    }
  }

  public remove(element: Element, result: ValidateResult): void {
    const group = element.closest('.group');
    if (!group) {
      return;
    }

    if (result.valid) {
      if (group.classList.contains('has-success')) {
        group.classList.remove('has-success');
      }
    } else {
      // remove help-block
      const message = group.querySelector(`#error-message-${result.id}`);
      if (message) {
        group.removeChild(message);

        // remove the has-error class from the enclosing group div
        if (group.querySelectorAll('.error-message').length === 0) {
          group.classList.remove('has-error');
        }
      }
    }
  }
}
