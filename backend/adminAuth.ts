import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const ADMIN_FILE = './admin.json';

type AdminData = {
  username: string;
  passwordHash: string;
};

type SessionStore = {
  [token: string]: boolean;
};

export let adminData: AdminData | null = null;
const sessions: SessionStore = {};

// Load admin credentials
export const loadAdmin = async () => {
  try {
    const data = await fs.readFile(ADMIN_FILE, 'utf-8');
    adminData = JSON.parse(data);
  } catch (error) {
    console.warn('⚠️  No admin credentials found yet. Proceed to set up via /admin/setup.');
  }
};

// Save new admin credentials
export const saveAdmin = async (username: string, password: string) => {
  const passwordHash = await bcrypt.hash(password, 10);
  adminData = { username, passwordHash };
  await fs.writeFile(ADMIN_FILE, JSON.stringify(adminData));
};

// Check if admin is already setup
export const isAdminSetup = async () => {
  if (!adminData) {
    await loadAdmin();
  }
  return adminData !== null;
};

// Validate admin login
export const validateAdmin = async (username: string, password: string) => {
  if (!adminData) return false;
  return username === adminData.username && await bcrypt.compare(password, adminData.passwordHash);
};

// Create a new session token
export const createAdminSession = () => {
  const token = uuidv4();
  sessions[token] = true;
  return token;
};

// Verify session token
export const verifyAdminSession = (token: string) => {
  return sessions[token] === true;
};
