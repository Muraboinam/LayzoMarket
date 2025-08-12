import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { HomepageSection } from '../utils/firestoreCollections';

export const useFirestoreSection = (sectionId: string) => {
  const [section, setSection] = useState<HomepageSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionId) {
      setLoading(false);
      return;
    }

    const sectionDocRef = doc(db, 'homepage', sectionId);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      sectionDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as HomepageSection;
          setSection({ ...data, id: docSnap.id });
          setError(null);
        } else {
          setSection(null);
          setError('Section not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to section updates:', err);
        setError('Failed to load section data');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [sectionId]);

  return { section, loading, error };
};