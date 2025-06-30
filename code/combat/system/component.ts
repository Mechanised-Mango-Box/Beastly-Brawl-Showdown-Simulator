import { Monster } from "./monster";

export type Component = {
  name: string;

  [key: string]: any;
};

const FUNCTION_ATTRIBUTE_LABEL = "function";
export function hasEvent(component: Component, eventName: string) {
  return typeof component[eventName] === FUNCTION_ATTRIBUTE_LABEL;
}

export function getComponent(entity: Monster, name: string): Component | null {
  for (const component of entity.components) {
    if (component.name === name) {
      return component;
    }
  }
  return null;
}

export function getComponentAll(entity: Monster, name: string): Component[] {
  return entity.components.filter((component) => component.name === name);
}
