import { Month } from './standard';

export namespace RequestFilters {

  export interface AgesRange {
    adults: number;
    children?: number;
    infants?: number;
  }

  export interface AgesRangeDetail extends AgesRange {
    childAges?: number[];
  }

  export interface Origin {
    suggest?: string;
    pos?: {
      lat: string;
      lon: string;
    };
  }

  export interface Destination {
    originCode: string;
    budgetFrom?: number;
    budget: number;
    months?: Month[];
    datesFrom?: string;
    datesTo?: string;
    daysMin?: number;
    daysMax?: number;
    hasHotels?: boolean;
    suggest?: string;
    tagsCode?: string[];
    continentsCode?: string[];
  }

  export interface Dates {
    budget: number;
    originCode: string;
    destinationCode: string;
    type?: 'weekends' | 'weeks' | 'longs';
    hasHotels?: boolean;
    months?: Month[];
  }

  export interface Pack {
    budget: number;
    outwardDate: string;
    returnDate: string;
    travelers: AgesRange;
    originCode: string;
    destinationCode: string;
  }

  export interface PackOverview extends Pack {
    accomodations?: {
      guests: AgesRangeDetail[];
    }
  }

  export interface Accomodation {
    checkin: string;
    checkout: string;
    destinationCode: string;
    guests: AgesRangeDetail[];
    priceNightMin?: number;
    priceNightMax?: number;
    ratingMin?: number;
    stars?: string[]; // ['1', '3']
    metersFromCenterMin?: number;
    metersFromCenterMax?: number;
    facilities?: string[];
  }
}