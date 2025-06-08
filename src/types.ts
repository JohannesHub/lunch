export interface OpeningHours {
  day: string;
  open: string;
  close: string;
}

export interface Restaurant {
  name: string;
  dishes: string;
  rating?: number;
  distance: string;
  openingHours: OpeningHours[];
  price: string;
  tried: boolean;
  isFast?: boolean;
}