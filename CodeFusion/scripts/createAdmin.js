const admin = require('firebase-admin');

// Initialize admin SDK (you'll need to download service account key from Firebase Console)
const serviceAccount = require('./path-to-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createAdminUser(email, password) {
  try {
    // Create user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      emailVerified: true
    });

    // Set admin role in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
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

// Usage
createAdminUser('admin@example.com', 'securepassword123');