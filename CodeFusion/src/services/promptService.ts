import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    Timestamp 
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  import { Prompt } from '../components/PromptLibrary';
  
  export const promptService = {
    // Create a new prompt
    async createPrompt(promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
      try {
        const docRef = await addDoc(collection(db, 'prompts'), {
          ...promptData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          usageCount: 0,
          version: 1
        });
        return docRef.id;
      } catch (error) {
        console.error('Error creating prompt:', error);
        throw error;
      }
    },
  
    // Update an existing prompt
    async updatePrompt(promptId: string, updates: Partial<Prompt>): Promise<void> {
      try {
        await updateDoc(doc(db, 'prompts', promptId), {
          ...updates,
          updatedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Error updating prompt:', error);
        throw error;
      }
    },
  
    // Delete a prompt
    async deletePrompt(promptId: string): Promise<void> {
      try {
        await deleteDoc(doc(db, 'prompts', promptId));
      } catch (error) {
        console.error('Error deleting prompt:', error);
        throw error;
      }
    },
  
    // Get user's prompts
    async getUserPrompts(userId: string): Promise<Prompt[]> {
      try {
        const q = query(
          collection(db, 'prompts'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Prompt[];
      } catch (error) {
        console.error('Error fetching user prompts:', error);
        throw error;
      }
    },
  
    // Get public prompts
    async getPublicPrompts(): Promise<Prompt[]> {
      try {
        const q = query(
          collection(db, 'prompts'),
          where('isPublic', '==', true),
          orderBy('updatedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Prompt[];
      } catch (error) {
        console.error('Error fetching public prompts:', error);
        throw error;
      }
    },
  
    // Increment usage count
    async incrementUsageCount(promptId: string): Promise<void> {
      try {
        const promptRef = doc(db, 'prompts', promptId);
        await updateDoc(promptRef, {
          usageCount: Timestamp.now(), // This should use increment in real implementation
          updatedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Error incrementing usage count:', error);
        throw error;
      }
    },
  
    // Toggle favorite status
    async toggleFavorite(promptId: string, isFavorite: boolean): Promise<void> {
      try {
        await updateDoc(doc(db, 'prompts', promptId), {
          isFavorite: !isFavorite,
          updatedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
      }
    },
  
    // Duplicate a prompt
    async duplicatePrompt(originalPrompt: Prompt, userId: string): Promise<string> {
      try {
        const duplicatedPrompt = {
          ...originalPrompt,
          title: `${originalPrompt.title} (Copy)`,
          userId,
          parentId: originalPrompt.id,
          usageCount: 0,
          isFavorite: false,
          version: 1
        };
        
        delete duplicatedPrompt.id;
        return await this.createPrompt(duplicatedPrompt);
      } catch (error) {
        console.error('Error duplicating prompt:', error);
        throw error;
      }
    }
  };