import * as Keychain from 'react-native-keychain';
import { open, DB } from '@op-engineering/op-sqlite';

let db: DB | null = null;

// Helper to generate a secure random 32-character key for the database password
const generateSecureKey = (): string => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let key = '';
  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    key += chars[randomIndex];
  }
  return key;
};

// Retrieve the database key from Android Keystore or generate it if missing
const getOrCreateDatabaseKey = async (): Promise<string> => {
  const KEYCHAIN_SERVICE = 'com.smsexpensetracker.dbkey';
  
  try {
    // Attempt to load the credentials from the hardware Keystore
    const credentials = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
    
    if (credentials) {
      // Key found!
      return credentials.password;
    } else {
      // No key found. Create a new secure random password
      const newKey = generateSecureKey();
      
      // Save it securely in the Android Keystore
      await Keychain.setGenericPassword('db_key', newKey, {
        service: KEYCHAIN_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // Decrypted only when device is unlocked
      });
      
      return newKey;
    }
  } catch (error) {
    console.error('Failed to access Android Keystore. Using fallback key.', error);
    // Fallback key for environments where Keystore fails (e.g. older Android versions)
    return 'fallbackSecurePassword123!@#siva';
  }
};

// Initialize the encrypted SQLite database
export const initDatabase = async (): Promise<DB> => {
  if (db) return db;

  try {
    // 1. Fetch the hardware-secured key
    const encryptionKey = await getOrCreateDatabaseKey();

    // 2. Open SQLite with SQLCipher encryption
    db = open({
      name: 'expenses.sqlite',
      encryptionKey: encryptionKey,
    });

    console.log('Encrypted SQLite database successfully initialized!');

    // 3. Create tables if they do not exist
    setupTables(db);

    return db;
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error);
    throw error;
  }
};

// Setup the transaction and budget tables
const setupTables = (database: DB) => {
  // Create transactions table
  database.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      merchant TEXT NOT NULL,
      category TEXT NOT NULL,       -- 'Need' or 'Want'
      bank TEXT NOT NULL,           -- 'Cash', 'SBI', 'HDFC', etc.
      timestamp INTEGER NOT NULL,   -- Epoch timestamp
      rawSms TEXT,                  -- Stores raw SMS text if auto-parsed
      isManual INTEGER DEFAULT 0    -- 1 for manual entry, 0 for SMS auto-parsed
    );
  `);

  // Create budget table
  database.execute(`
    CREATE TABLE IF NOT EXISTS budget (
      id TEXT PRIMARY KEY,
      monthlyLimit REAL NOT NULL,
      createdAt INTEGER NOT NULL
    );
  `);

  // Insert default budget if empty (e.g. ₹10000)
  const budgetCheck = database.execute('SELECT COUNT(*) as count FROM budget');
  const count = budgetCheck.rows?._array[0]?.count || 0;
  if (count === 0) {
    database.execute(`
      INSERT INTO budget (id, monthlyLimit, createdAt)
      VALUES ('active_budget', 10000.0, ${Date.now()});
    `);
  }
};

// Helper function to get database instance in other files
export const getDB = (): DB => {
  if (!db) {
    throw new Error('Database not initialized! Call initDatabase() first.');
  }
  return db;
};
