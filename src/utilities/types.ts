export interface Card {
  id: string;
  name: string;
  // supertype: Pokémon, Energy, Trainer, etc
  supertype: string;
  // subtypes: Basic, EX, Mega, Rapid Strike, etc
  subtypes: string[];
  types?: string[];
  evolesFrom?: string;
  evolvesTo?: string[];
  set: Set;
  number: string;
  artist?: string;
  rarity: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  regulationMark?: string;
  images: CardImage;
  tcgplayer?: any; // ITCGPlayer;
  cardmarket?: any; // ICardmarket;
}

export interface Set {
  id: string;
  images: SetImage;
  legalities: any;
  name: string;
  printedTotal: number;
  ptcgoCode: string;
  releaseDate: string;
  series: string;
  total: number;
  updatedAt: string;
}

export interface SetImage {
  symbol: string;
  logo: string;
}

export interface CardImage {
  small: string;
  large: string;
}
