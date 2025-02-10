import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
export const getRoadmapItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "roadmap"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};
export const getRoadmapTable = async () => {
  try {
    const feedbacksQuery = query(
      collection(db, "feedbacks"),
      where("status", "!=", "draft")
    );
    const querySnapshot = await getDocs(feedbacksQuery);
    
    // Hujjatlarni o'qish va kerakli ma'lumotlarni olish
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching feedbacks: ", error);
    throw error;
  }
};