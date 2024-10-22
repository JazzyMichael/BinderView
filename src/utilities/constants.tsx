type BinderType = {
  class: string;
  cols: number;
  rows: number;
  page: number;
};

type BinderTypesMap = {
  [key: number]: BinderType;
};

export const BinderTypes: BinderTypesMap = {
  2: {
    class: "grid-cols-2 grid-rows-2",
    cols: 2,
    rows: 2,
    page: 4,
  },
  3: {
    class: "grid-cols-3 grid-rows-3",
    cols: 3,
    rows: 3,
    page: 9,
  },
  4: {
    class: "grid-cols-4 grid-rows-3",
    cols: 4,
    rows: 3,
    page: 12,
  },
};

export const subsetIDs = {
  sma: {
    mainSetID: "sm115",
    label: "Shiny Vault",
  },
  swsh45sv: {
    mainSetID: "swsh45",
    label: "Shiny Vault",
  },
  cel25c: {
    mainSetID: "cel25",
    label: "Classic Collection",
  },
  swsh9tg: {
    mainSetID: "swsh9",
    label: "Trainer Gallery",
  },
  swsh10tg: {
    mainSetID: "swsh10",
    label: "Trainer Gallery",
  },
  swsh11tg: {
    mainSetID: "swsh11",
    label: "Trainer Gallery",
  },
  swsh12tg: {
    mainSetID: "swsh12",
    label: "Trainer Gallery",
  },
  swsh12pt5gg: {
    mainSetID: "swsh12pt5",
    label: "Galarian Gallery",
  },
};

export const BlackStarPromos = {
  basep: true,
  np: true,
  dpp: true,
  hsp: true,
  bwp: true,
  xyp: true,
  smp: true,
  swshp: true,
  svp: true,
};

export const PopPromos = {
  pop1: true,
  pop2: true,
  pop3: true,
  pop4: true,
  pop5: true,
  pop6: true,
  pop7: true,
  pop8: true,
  pop9: true,
};

export const McDonaldsPromos = {
  mcd11: true,
  mcd12: true,
  mcd14: true,
  mcd15: true,
  mcd16: true,
  mcd17: true,
  mcd18: true,
  mcd19: true,
  mcd21: true,
  mcd22: true,
};

export const ExTrainerKitPromos = {
  tk1a: true,
  tk1b: true,
  tk2a: true,
  tk2b: true,
};

export const OtherPromos = {
  si1: true,
  base6: true,
  bp: true,
  ru1: true,
  fut20: true,
};

export const series = {
  base: [""],
  neo: [""],
  "e-series": [""],
  ex: [""],
  "diamond-pearl-platinum": [""],
};
