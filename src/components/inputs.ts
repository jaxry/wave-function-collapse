import { buildDomTree } from "../util";
import { IComponent } from "./component";

export interface IComponentInput<T> extends IComponent {
  value: T;
  onInput?: ((value: T) => void);
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
    // TODO: add onInput property
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
    // TODO: add onInput property
  };
}

export function createRadioInput<T>(
  radioName: string,
  choices: Array<{ label: string, value: T }>,
  id?: string,
): IComponentInput<T> {

  const domElement = document.createElement("div");
  domElement.className = "radioComponent";
  domElement.textContent = `${radioName} `;

  id = id || radioName;

  const inputs: HTMLInputElement[] = [];

  for (let i = 0; i < choices.length; i++) {
    const { label, value } = choices[i];

    const input = document.createElement("input");
    inputs.push(input);

    input.type = "radio";
    input.name = id;
    if (i === 0) {
      input.checked = true;
    }

    domElement.appendChild(
      buildDomTree(
        document.createElement("label"), [input, label],
      ),
    );
  }

  return {
    domElement,
    get value() {
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          return choices[i].value;
        }
      }
      return choices[0].value;
    },
    set value(x: T) {
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].value === x) {
          inputs[i].checked = true;
        }
      }
    },
    // TODO: add onInput property
  };
}

export function createSelectInput<T>(
  selectName: string,
  choices: Array<{ label: string, value: T }>,
): IComponentInput<T> & { deselect(): void } {

  const selectElem = document.createElement("select");

  const options: HTMLOptionElement[] = [];

  const emptyOption = document.createElement("option");
  emptyOption.disabled = true;
  emptyOption.selected = true;
  emptyOption.style.display = "none";
  selectElem.append(emptyOption);

  for (const { label, value } of choices) {
    const option = document.createElement("option");
    option.textContent = label;

    selectElem.appendChild(option);
    options.push(option);
  }

  let onInput: IComponentInput<T>["onInput"];

  const selectInput = {
    domElement: buildDomTree(
      Object.assign(document.createElement("label"), { className: "selectComponent" }), [
        `${selectName} `,
        selectElem,
      ],
    ),
    get value() {
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          return choices[i].value;
        }
      }
      return choices[0].value;
    },
    set value(x: T) {
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].value === x) {
          options[i].selected = true;
        }
      }
    },
    get onInput() {
      return onInput;
    },
    set onInput(fn) {
      onInput = fn;
      (selectElem.onchange as any) = fn ? () => fn(selectInput.value) : undefined;
    },
    deselect() {
      emptyOption.selected = true;
    },
  };

  return selectInput;
}
