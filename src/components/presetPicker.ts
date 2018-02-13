import getImageData from "../getImageData";
import {  buildDomTree } from "../util";
import { IComponent } from "./component";
import { createSelectInput } from "./inputs";
import { inputGroup } from "./common";
import { presets, presetDefaults, getPresetPath } from "../presets";
import { IWfcOptions } from "../wfc/run";

interface IComponentPresetPicker extends IComponent {
  onPick?: (image: ImageData, options: Partial<IWfcOptions>) => void;
}

export function createPresetPicker(): IComponentPresetPicker {

  const presetPicker: IComponentPresetPicker = {
    domElement: Object.assign(document.createElement("div"), { className: "presetPickerComponent" }),
  };

  const onPick = (image: ImageData, options: Partial<IWfcOptions>) => {
    if (presetPicker.onPick) {
      presetPicker.onPick(image, options);
    }
  };

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";

  const presetChoices = [];
  for (const preset of presets) {
    presetChoices.push({ label: preset.name || "", value: preset });
  }
  const presetSelect = createSelectInput("Preset", presetChoices);

  imageInput.onchange = () => {
    if (imageInput.files) {
      getImageData(imageInput.files[0]).then((image) => onPick(image, {}));
      presetSelect.deselect();
    }
  };

  presetSelect.onInput = (value) => {
    imageInput.value = "";
    const preset = {...presetDefaults, ...value};
    const path = getPresetPath(preset.name);
    getImageData(path).then((image) => onPick(image, preset));
  };

  buildDomTree(presetPicker.domElement, [
    document.createElement("p"), [
      "Select a preset or upload a custom image. Custom images should be simple - e.g. less than 64x64 pixels, with only a handful of colors.",
    ],
    inputGroup(), [
      presetSelect.domElement,
    ],
    inputGroup(), [
      document.createElement("label"), [
        "Custom Bitmap: ", imageInput,
      ],
    ],
  ]);

  return presetPicker;
}