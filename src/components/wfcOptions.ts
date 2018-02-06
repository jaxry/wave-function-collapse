import {  buildDomTree } from "../util";
import { IComponent } from "./component";
import { createNumberInput, createCheckboxInput, IComponentInput, createRadioInput } from "./inputs";
import { IWfcOptions } from "../wfc/run";

function inputGroup() {
  const div = document.createElement("div");
  div.className = "inputGroup";
  return div;
}

export interface IComponentWfcOptions extends IComponent {
  options: IWfcOptions;
}

export function createWfcInput(): IComponentWfcOptions {
  const domElement = document.createElement("div");

  const components: { [P in keyof IWfcOptions]: IComponentInput<IWfcOptions[P]> } = {
    N: createRadioInput("Pattern size", [
      { label: "2", value: 2 },
      { label: "3", value: 3 },
      { label: "4", value: 4 },
    ]),
    symmetry: createRadioInput("Extra symmetry", [
      { label: "None", value: 1 },
      { label: "Reflections", value: 2 },
      { label: "Reflections and Rotations", value: 8 },
    ]),
    ground: createNumberInput("Ground", { min: "-9999", max: "9999", step: "1" }),
    periodicInput: createCheckboxInput("Periodic"),
    periodicOutput: createCheckboxInput("Periodic"),
    outputWidth: createNumberInput("Width", { min: "0", max: "128", step: "1" }),
    outputHeight: createNumberInput("Height", { min: "0", max: "128", step: "1" }),
  };

  const tooltips: { [P in keyof IWfcOptions]: string } = {
    N: "The width and height, in pixels, of each pattern sampled from the input bitmap. A higher value captures bigger features of the input, but runs more slowly.",
    symmetry: "Add extra patterns by reflecting or rotating each sampled pattern.",
    ground: "Indicates the pattern index that should be used for the bottom row of output pixels. Negative numbers are supported and start from the end of the pattern list. 0 for no ground pattern.",
    periodicInput: "Checking indicates that the input bitmap is tileable and wraps around its edges",
    periodicOutput: "Checking produces an output bitmap that is tileable and wraps around its edges",
    outputWidth: "The width, in pixels, of the output bitmap",
    outputHeight: "The height, in pixels, of the output bitmap",
  };

  for (const k in tooltips) {
    (components as any)[k].domElement.title = (tooltips as any)[k];
  }

  const wfcInput = {
    domElement: buildDomTree(domElement, [
      document.createElement("fieldset"), [
        document.createElement("legend"), ["Input Bitmap"],
        inputGroup(), [
          components.periodicInput.domElement,
        ],
        inputGroup(), [
          components.N.domElement,
        ],
        inputGroup(), [
          components.symmetry.domElement,
        ],
        inputGroup(), [
          components.ground.domElement,
        ],
      ],
      document.createElement("fieldset"), [
        document.createElement("legend"), ["Output Bitmap"],
        inputGroup(), [
          components.periodicOutput.domElement,
        ],
        inputGroup(), [
          components.outputWidth.domElement,
          components.outputHeight.domElement,
        ],
      ],
    ]),
    get options() {
      const vals: any = {};

      for (const k in components) {
        vals[k] = (components as any)[k].value;
      }

      return vals as IWfcOptions;
    },
    set options(x: IWfcOptions) {
      for (const k in x) {
        (components as any)[k].value = (x as any)[k];
      }
    },
  };

  wfcInput.options = {
    N: 3,
    symmetry: 8,
    ground: 0,
    periodicInput: true,
    periodicOutput: true,
    outputWidth: 48,
    outputHeight: 48,
  };

  return wfcInput;
}
