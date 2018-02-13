import { IWfcOptions } from "./wfc/run";

type IPreset = Partial<IWfcOptions> & { name: string };

export function getPresetPath(name: string) {
  return `images/${name}.png`;
}

export const presetDefaults: IPreset =  {
  name: "",
  N: 3,
  symmetry: 8,
  ground: 0,
  periodicInput: true,
  periodicOutput: true,
};

export const presets: IPreset[] =  [
  {name: "3Bricks", symmetry: 1},
  {name: "Angular"},
  {name: "Cat", symmetry: 2},
  {name: "Cats", symmetry: 2},
  {name: "Cave"},
  {name: "Chess", N: 2},
  {name: "City"},
  {name: "Colored City"},
  {name: "Dungeon"},
  {name: "Fabric"},
  {name: "Flowers", symmetry: 2, ground: -4},
  {name: "Forest"},
  {name: "Hogs", N: 2},
  {name: "Knot"},
  {name: "Lake"},
  {name: "Less Rooms"},
  {name: "Link"},
  {name: "Link 2"},
  {name: "Magic Office"},
  {name: "Maze"},
  {name: "Mazelike"},
  {name: "More Flowers", symmetry: 2, ground: -4},
  {name: "Mountains", symmetry: 2},
  {name: "Nested"},
  {name: "Office"},
  {name: "Office 2"},
  {name: "Paths"},
  {name: "Platformer", symmetry: 2, ground: -1},
  {name: "Qud"},
  {name: "Red Dot"},
  {name: "Red Maze", N: 2},
  {name: "Rooms"},
  {name: "Rule 126", N: 4, symmetry: 2, periodicInput: false, periodicOutput: false},
  {name: "Scaled Maze", N: 2},
  {name: "Sewers"},
  {name: "Simple Knot"},
  {name: "Simple Maze", N: 2},
  {name: "Simple Wall", symmetry: 2},
  {name: "Skew 1"},
  {name: "Skew 2"},
  {name: "Skyline", symmetry: 2, ground: -1 },
  {name: "Skyline 2", symmetry: 2, ground: -1 },
  {name: "Smile City"},
  {name: "Spirals"},
  {name: "Town"},
  {name: "Trick Knot"},
  {name: "Village", symmetry: 2},
  {name: "Water", symmetry: 1},
];
