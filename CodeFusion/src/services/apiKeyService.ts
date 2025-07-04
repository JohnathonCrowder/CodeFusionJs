import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    deleteDoc, 
    query, 
    getDocs,
    serverTimestamp,
    increment
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  
  export interface ApiKeyData {
    id: string;
    userId: string;
    keyName: string;
    encryptedKey: string;
    provider: 'openai' | 'anthropic' | 'google';
    isActive: boolean;
    createdAt: Date;
    lastUsed?: Date;
    usageCount: number;
  }
  
  // Simple encryption (for production, use proper encryption)
  
  function simpleEncrypt(text: string): string {
    // This is a basic example - use proper encryption in production
    return btoa(text);
  }
  
  function simpleDecrypt(encrypted: string): string {
    // This is a basic example - use proper encryption in production
    return atob(encrypted);
  }
  
  export const apiKeyService = {
    // Store API key for user
    async storeApiKey(
      userId: string, 
      keyName: string, 
      apiKey: string, 
      provider: 'openai' | 'anthropic' | 'google' = 'openai'
    ): Promise<string> {
      try {
        const keyId = `${provider}_${Date.now()}`;
        const encryptedKey = simpleEncrypt(apiKey);
        
        const apiKeyData: Omit<ApiKeyData, 'id' | 'createdAt'> = {
          userId,
          keyName,
          encryptedKey,
          provider,
          isActive: true,
          usageCount: 0
        };
  
        await setDoc(doc(db, 'users', userId, 'api_keys', keyId), {
          ...apiKeyData,
          createdAt: serverTimestamp()
        });
  
        return keyId;
      } catch (error) {
        console.error('Error storing API key:', error);
        throw error;
      }
    },
  
    // Get user's API keys
    async getUserApiKeys(userId: string): Promise<ApiKeyData[]> {
      try {
        const q = query(collection(db, 'users', userId, 'api_keys'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastUsed: doc.data().lastUsed?.toDate()
        })) as ApiKeyData[];
      } catch (error) {
        console.error('Error fetching API keys:', error);
        throw error;
      }
    },
  
    // Get specific API key
    async getApiKey(userId: string, keyId: string): Promise<string | null> {
      try {
        const docRef = doc(db, 'users', userId, 'api_keys', keyId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          return simpleDecrypt(data.encryptedKey);
        }
        
        return null;
      } catch (error) {
        console.error('Error retrieving API key:', error);
        throw error;
      }
    },
  
    // Get active OpenAI key for user
    async getActiveOpenAIKey(userId: string): Promise<string | null> {
      try {
        const keys = await this.getUserApiKeys(userId);
        const activeOpenAIKey = keys.find(key => 
          key.provider === 'openai' && key.isActive
        );
        
        if (activeOpenAIKey) {
          return simpleDecrypt(activeOpenAIKey.encryptedKey);
        }
        
        return null;
      } catch (error) {
        console.error('Error getting active OpenAI key:', error);
        return null;
      }
    },
  
    // Update API key usage
    async updateKeyUsage(userId: string, keyId: string): Promise<void> {
      try {
        const docRef = doc(db, 'users', userId, 'api_keys', keyId);
        await setDoc(docRef, {
          lastUsed: serverTimestamp(),
          usageCount: increment(1)
        }, { merge: true });
      } catch (error) {
        console.error('Error updating key usage:', error);
      }
    },
  
    // Delete API key
    async deleteApiKey(userId: string, keyId: string): Promise<void> {
      try {
        await deleteDoc(doc(db, 'users', userId, 'api_keys', keyId));
      } catch (error) {
        console.error('Error deleting API key:', error);
        throw error;
      }
    },
  
    
  };