import { NavigationInstruction } from 'aurelia-router';

export class InstructionFilterValueConverter {
  toView(instruction: NavigationInstruction[]) {
    return instruction ? instruction.filter(i => i.config.title) : [];
  }
}
