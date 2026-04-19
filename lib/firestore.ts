import { 
    db 
  } from "./firebase";
  import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    limit, 
    serverTimestamp,
    Timestamp
  } from "firebase/firestore";
  
  export interface QuizAttempt {
    userId: string;
    userEmail: string;
    userName?: string;
    topic: string;
    score: number;
    total: number;
    timeTaken: number;
    timestamp: Timestamp;
  }
  
  export const saveQuizAttempt = async (attempt: Omit<QuizAttempt, 'timestamp'>) => {
    try {
      const docRef = await addDoc(collection(db, "attempts"), {
        ...attempt,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      throw error;
    }
  };
  
  export const getUserAttempts = async (userId: string) => {
    const q = query(
      collection(db, "attempts"), 
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAttempt & { id: string }));
  };
  
  export const getGlobalLeaderboard = async () => {
    const q = query(
      collection(db, "attempts"),
      orderBy("score", "desc"),
      orderBy("timeTaken", "asc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAttempt & { id: string }));
  };
