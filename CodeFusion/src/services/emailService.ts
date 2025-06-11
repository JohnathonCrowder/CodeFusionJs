import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    Timestamp,
    deleteDoc,
    doc,
    updateDoc
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  
  export interface EmailSubscriber {
    id?: string;
    email: string;
    source: 'user_signup' | 'newsletter' | 'footer' | 'manual';
    subscribed: boolean;
    subscribedAt: Date;
    unsubscribedAt?: Date;
    metadata?: {
      userAgent?: string;
      ipAddress?: string;
      referrer?: string;
      displayName?: string;
      userId?: string;
    };
  }
  
  class EmailService {
    private readonly COLLECTION_NAME = 'email_subscribers';
  
    // Add email to collection
    async addEmail(emailData: Omit<EmailSubscriber, 'id' | 'subscribedAt'>): Promise<string> {
      try {
        // Check if email already exists
        const existingEmail = await this.findByEmail(emailData.email);
        
        if (existingEmail) {
          // If exists but unsubscribed, resubscribe
          if (!existingEmail.subscribed) {
            await this.resubscribe(existingEmail.id!);
            return existingEmail.id!;
          }
          // Already subscribed
          return existingEmail.id!;
        }
  
        // Add new email
        const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
          ...emailData,
          subscribedAt: Timestamp.now(),
          subscribed: true
        });
  
        return docRef.id;
      } catch (error) {
        console.error('Error adding email:', error);
        throw new Error('Failed to add email to list');
      }
    }
  
    // Find email by address
    async findByEmail(email: string): Promise<EmailSubscriber | null> {
      try {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          where('email', '==', email.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return {
            id: doc.id,
            ...doc.data(),
            subscribedAt: doc.data().subscribedAt?.toDate(),
            unsubscribedAt: doc.data().unsubscribedAt?.toDate()
          } as EmailSubscriber;
        }
        
        return null;
      } catch (error) {
        console.error('Error finding email:', error);
        return null;
      }
    }
  
    // Get all emails (admin only)
    async getAllEmails(): Promise<EmailSubscriber[]> {
      try {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          orderBy('subscribedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          subscribedAt: doc.data().subscribedAt?.toDate(),
          unsubscribedAt: doc.data().unsubscribedAt?.toDate()
        })) as EmailSubscriber[];
      } catch (error) {
        console.error('Error getting emails:', error);
        throw new Error('Failed to fetch email list');
      }
    }
  
    // Get subscribed emails only
    async getSubscribedEmails(): Promise<EmailSubscriber[]> {
      try {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          where('subscribed', '==', true),
          orderBy('subscribedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          subscribedAt: doc.data().subscribedAt?.toDate()
        })) as EmailSubscriber[];
      } catch (error) {
        console.error('Error getting subscribed emails:', error);
        throw new Error('Failed to fetch subscribed emails');
      }
    }
  
    // Unsubscribe email
    async unsubscribe(emailId: string): Promise<void> {
      try {
        await updateDoc(doc(db, this.COLLECTION_NAME, emailId), {
          subscribed: false,
          unsubscribedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Error unsubscribing email:', error);
        throw new Error('Failed to unsubscribe email');
      }
    }
  
    // Resubscribe email
    async resubscribe(emailId: string): Promise<void> {
      try {
        await updateDoc(doc(db, this.COLLECTION_NAME, emailId), {
          subscribed: true,
          unsubscribedAt: null,
          subscribedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Error resubscribing email:', error);
        throw new Error('Failed to resubscribe email');
      }
    }
  
    // Delete email (admin only)
    async deleteEmail(emailId: string): Promise<void> {
      try {
        await deleteDoc(doc(db, this.COLLECTION_NAME, emailId));
      } catch (error) {
        console.error('Error deleting email:', error);
        throw new Error('Failed to delete email');
      }
    }
  
    // Get email statistics
    async getEmailStats(): Promise<{
      total: number;
      subscribed: number;
      unsubscribed: number;
      bySource: Record<string, number>;
    }> {
      try {
        const emails = await this.getAllEmails();
        
        const stats = {
          total: emails.length,
          subscribed: emails.filter(e => e.subscribed).length,
          unsubscribed: emails.filter(e => !e.subscribed).length,
          bySource: {} as Record<string, number>
        };
  
        // Group by source
        emails.forEach(email => {
          stats.bySource[email.source] = (stats.bySource[email.source] || 0) + 1;
        });
  
        return stats;
      } catch (error) {
        console.error('Error getting email stats:', error);
        throw new Error('Failed to fetch email statistics');
      }
    }
  }
  
  export const emailService = new EmailService();