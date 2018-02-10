import { buildDomTree } from "../util";
import { IComponent } from "./component";

export interface IComponentInput<T> extends IComponent {
  value: T;
}

export function createNumberInput(
  labelText: string,
  props: Partial<HTMLInputElement> = {},
  integer = true,
): IComponentInput<number> {

  const input = document.createElement("input");
  Object.assign(input, props, { type: "number" });

  return {
    domElement: buildDomTree(
      Object.assign(document.createElement("label"), { className: "numberInputComponent" }), [
        `${labelText} `,
        input,
      ],
    ),
    get value() {
      return integer ? parseInt(input.value, 10) : parseFloat(input.value);
    },
    set value(x) {
      input.value = x.toString();
    },
  };
}

export function createCheckboxInput(
  labelText: string,
  props: Partial<HTMLInputElement> = {},
): IComponentInput<boolean> {

  const input = document.createElement("input");
  Object.assign(input, props, { type: "checkbox" });

  return {
    domElement: buildDomTree(
      Object.assign(document.createElement("label"), { className: "checkboxInputComponent" }), [
        input,
        labelText,
      ],
    ),
    get value() {
      return input.checked;
    },
    set value(x) {
      input.checked = x;
    },
  };
}

export function createRadioInput<T>(
  radioName: string,
  choices: Array<{ label: string, value: T }>,
  id?: string,
): IComponentInput<T> {
  const values: T[] = [];
  const inputs: HTMLInputElement[] = [];

  const domElement = buildDomTree(
    Object.assign(document.createElement("div"), { className: "radioComponent" }), [
      `${radioName} `,
    ],
  );

  id = id || radioName;

  for (let i = 0; i < choices.length; i++) {
    const { label, value } = choices[i];
    values.push(value);

    const input = document.createElement("input");
    inputs.push(input);

    input.type = "radio";
    input.name = id;
    input.value = i.toString();
    if (i === 0) {
      input.checked = true;
    }

    domElement.appendChild(
      buildDomTree(
        document.createElement("label"), [
          input,
          label,
        ],
      ),
    );
  }

  return {
    domElement,
    get value() {
      for (const input of inputs) {
        if (input.checked) {
          const index = parseInt(input.value, 10);
          return values[index];
        }
      }
      return values[0];
    },
    set value(x: T) {
      for (let i = 0; i < values.length; i++) {
        if (values[i] === x) {
          inputs[i].checked = true;
        }
      }
    },
  };
}
