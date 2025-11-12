
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RaffleData, RaffleSettings, RaffleNumber, NumberStatus, RaffleContextType } from '../types';

const RAFFLE_STORAGE_KEY = 'raffleSolidariaData';
const RESERVATION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

const initialSettings: RaffleSettings = {
  prizeDescription: "Quadro Santa Ceia",
  prizeDimensions: "1,50m x 1,20m",
  prizeImage: "https://upload.wikimedia.org/wikipedia/commons/4/4b/%C3%9Altima_Ceia_-_Da_Vinci_5.jpg",
  drawDate: "12/12/2025",
  numberPrice: 5,
  pixKey: "24999882503",
  totalNumbers: 100,
};

const generateInitialNumbers = (total: number): RaffleNumber[] => {
  return Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    status: NumberStatus.Available,
  }));
};

const defaultRaffleData: RaffleData = {
  settings: initialSettings,
  numbers: generateInitialNumbers(initialSettings.totalNumbers),
};

export const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export const RaffleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [raffleData, setRaffleData] = useState<RaffleData>(defaultRaffleData);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(RAFFLE_STORAGE_KEY);
      if (storedData) {
        const parsedData: RaffleData = JSON.parse(storedData);
        // Ensure numbers match settings
        if (parsedData.settings.totalNumbers !== parsedData.numbers.length) {
            parsedData.numbers = generateInitialNumbers(parsedData.settings.totalNumbers);
        }
        setRaffleData(parsedData);
      } else {
        setRaffleData(defaultRaffleData);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setRaffleData(defaultRaffleData);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(RAFFLE_STORAGE_KEY, JSON.stringify(raffleData));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [raffleData]);

  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;
      const now = Date.now();
      const updatedNumbers = raffleData.numbers.map(num => {
        if (num.status === NumberStatus.Reserved && num.reservationTime && (now - num.reservationTime > RESERVATION_TIMEOUT_MS)) {
          changed = true;
          return { ...num, status: NumberStatus.Available, buyerName: undefined, buyerContact: undefined, reservationTime: undefined };
        }
        return num;
      });

      if (changed) {
        setRaffleData(prevData => ({ ...prevData, numbers: updatedNumbers }));
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [raffleData.numbers]);


  const reserveNumber = useCallback((id: number, buyerName: string, buyerContact: string) => {
    setRaffleData(prevData => {
      const newNumbers = prevData.numbers.map(num =>
        num.id === id ? { ...num, status: NumberStatus.Reserved, buyerName, buyerContact, reservationTime: Date.now() } : num
      );
      return { ...prevData, numbers: newNumbers };
    });
  }, []);

  const confirmPayment = useCallback((id: number) => {
    setRaffleData(prevData => {
      const newNumbers = prevData.numbers.map(num =>
        num.id === id ? { ...num, status: NumberStatus.Paid, reservationTime: undefined } : num
      );
      return { ...prevData, numbers: newNumbers };
    });
  }, []);

  const releaseNumber = useCallback((id: number) => {
    setRaffleData(prevData => {
      const newNumbers = prevData.numbers.map(num =>
        num.id === id ? { ...num, status: NumberStatus.Available, buyerName: undefined, buyerContact: undefined, reservationTime: undefined } : num
      );
      return { ...prevData, numbers: newNumbers };
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<RaffleSettings>) => {
    setRaffleData(prevData => {
        const updatedSettings = { ...prevData.settings, ...newSettings };
        let updatedNumbers = prevData.numbers;

        if (newSettings.totalNumbers && newSettings.totalNumbers !== prevData.settings.totalNumbers) {
            updatedNumbers = generateInitialNumbers(newSettings.totalNumbers);
        }

        return { settings: updatedSettings, numbers: updatedNumbers };
    });
  }, []);
  
  const getStats = useCallback(() => {
    return raffleData.numbers.reduce((acc, num) => {
        acc[num.status]++;
        return acc;
    }, { paid: 0, reserved: 0, available: 0 });
  }, [raffleData.numbers]);


  const value = {
    settings: raffleData.settings,
    numbers: raffleData.numbers,
    reserveNumber,
    confirmPayment,
    releaseNumber,
    updateSettings,
    getStats,
  };

  return (
    <RaffleContext.Provider value={value}>
      {children}
    </RaffleContext.Provider>
  );
};
