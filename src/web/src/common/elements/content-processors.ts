import { FEATURE } from "aurelia-pal";
import {
  ViewCompiler,
  ViewResources,
  BehaviorInstruction
} from "aurelia-framework";

export function replaceElementWithTemplate(elementTags: string[]): Function {
  return function replaceParts(
    viewCompiler: ViewCompiler,
    resources: ViewResources,
    node: Element,
    instruction: BehaviorInstruction
  ): boolean {
    let result = true;
    for (let i = 0; i < elementTags.length; i++) {
      const elementTag = elementTags[i];
      result = result && replacePart(node, elementTag);
    }
    return result;
  };

  function replacePart(node: Element, partName: string): boolean {
    const elements = node.getElementsByTagName(partName);
    for (let i = 0; i < elements.length; i++) {
      const part = elements[i];

      // create the <template>
      const template = document.createElement("template");

      // support browsers that do not have a real <template> element implementation (IE)
      if (!FEATURE.htmlTemplateElement) {
        (FEATURE as any).ensureHTMLTemplateElement(template);
      }

      // indicate the part this <template> replaces.
      template.setAttribute("replace-part", partName);

      // replace the element's content with the <template>
      node.insertBefore(template, part);
      node.removeChild(part);
      template.content.appendChild(part);
      return true;
    }
    return false;
  }
}
