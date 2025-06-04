import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key
const serviceAccountPath = join(__dirname, './service-account-key.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();
const db = getFirestore();

async function createAdminUser(email, password) {
  try {
    // Create user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      emailVerified: true
    });

    // Set admin role in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      role: 'admin',
      displayName: 'Admin User',
      createdAt: new Date()
    });

    console.log('Admin user created successfully:', userRecord.uid);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Get email and password from command line arguments
const args = process.argv.slice(2);
const email = args[0] || 'admin@example.com';
const password = args[1] || 'securepassword123';

if (!args[0] || !args[1]) {
  console.log('Usage: node createAdmin.js <email> <password>');
  console.log('Using default credentials:', email);
}

// Create the admin user
createAdminUser(email, password).then(() => {
  console.log('Script completed');
  process.exit(0);
});