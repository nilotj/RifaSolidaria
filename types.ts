
export enum NumberStatus {
  Available = 'available',
  Reserved = 'reserved',
  Paid = 'paid',
}

export interface RaffleNumber {
  id: number;
  status: NumberStatus;
  buyerName?: string;
  buyerContact?: string;
  reservationTime?: number;
}

export interface RaffleSettings {
  prizeDescription: string;
  prizeDimensions: string;
  prizeImage: string;
  drawDate: string;
  numberPrice: number;
  pixKey: string;
  totalNumbers: number;
}

export interface RaffleData {
  settings: RaffleSettings;
  numbers: RaffleNumber[];
}

export interface RaffleContextType {
  settings: RaffleSettings;
  numbers: RaffleNumber[];
  reserveNumber: (id: number, buyerName: string, buyerContact: string) => void;
  confirmPayment: (id: number) => void;
  releaseNumber: (id: number) => void;
  updateSettings: (newSettings: Partial<RaffleSettings>) => void;
  getStats: () => { paid: number; reserved: number; available: number };
}
