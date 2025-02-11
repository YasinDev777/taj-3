import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
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
      where("status", "not-in", ["draft", "reject"])
    );
    const querySnapshot = await getDocs(feedbacksQuery);

    // Hujjatlarni o'qish va kerakli ma'lumotlarni olish
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching feedbacks: ", error);
    throw error;
  }
};

export const setData = async (userData) => {
  try {
    await addDoc(collection(db, "feedbacks"), {
      created_at: serverTimestamp(),
      description: userData.learnMore,
      tg_username: userData.telegramUsername,
      title: userData.title,
      status: "draft",
      user_id: userData.user_id,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
