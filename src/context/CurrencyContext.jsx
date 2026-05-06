import { createContext, useContext, useState } from "react";

// Rates relative to USD (base). Update these as needed.
const RATES = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  NGN: 1620,
};

export const CURRENCIES = [
  { code: "USD", symbol: "$",  label: "US Dollar"      },
  { code: "GBP", symbol: "£",  label: "British Pound"  },
  { code: "EUR", symbol: "€",  label: "Euro"           },
  { code: "NGN", symbol: "₦",  label: "Nigerian Naira" },
];

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("currency") || "USD"
  );

  const setAndPersist = (code) => {
    setCurrency(code);
    localStorage.setItem("currency", code);
  };

  // Returns a formatted price string in the active currency
  const format = (usdAmount) => {
    const rate   = RATES[currency] ?? 1;
    const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";
    const converted = usdAmount * rate;

    // NGN uses no decimals at this scale; others use 2
    const formatted =
      currency === "NGN"
        ? Math.round(converted).toLocaleString()
        : converted.toFixed(2);

    return `${symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setAndPersist, format, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
