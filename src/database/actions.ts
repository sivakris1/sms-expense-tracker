import { getDB } from './db';

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: 'Need' | 'Want';
  bank: string;
  timestamp: number; // epoch milliseconds
  rawSms?: string;
  isManual: number; // 1 = true, 0 = false
}

// Add a transaction to the encrypted database
export const addExpense = (
  amount: number,
  merchant: string,
  category: 'Need' | 'Want',
  bank: string,
  isManual: boolean = false,
  rawSms?: string
): Transaction => {
  const db = getDB();
  const id = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  const manualFlag = isManual ? 1 : 0;

  db.execute(
    `INSERT INTO transactions (id, amount, merchant, category, bank, timestamp, rawSms, isManual)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [id, amount, merchant, category, bank, timestamp, rawSms || null, manualFlag]
  );

  return { id, amount, merchant, category, bank, timestamp, rawSms, isManual: manualFlag };
};

// Retrieve all transactions sorted by latest first
export const getExpenses = (): Transaction[] => {
  const db = getDB();
  const result = db.execute('SELECT * FROM transactions ORDER BY timestamp DESC;');
  return (result.rows?._array || []) as Transaction[];
};

// Retrieve the currently active budget limit
export const getBudgetLimit = (): number => {
  const db = getDB();
  const result = db.execute("SELECT monthlyLimit FROM budget WHERE id = 'active_budget';");
  const limit = result.rows?._array[0]?.monthlyLimit;
  return limit !== undefined ? limit : 10000;
};

// Update the monthly budget limit
export const updateBudgetLimit = (newLimit: number) => {
  const db = getDB();
  db.execute(
    "UPDATE budget SET monthlyLimit = ? WHERE id = 'active_budget';",
    [newLimit]
  );
};
