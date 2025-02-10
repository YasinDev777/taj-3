import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export const setData = async (userData) => {
  try {
    await addDoc(collection(db, "feedbacks"), {
      created_at: serverTimestamp(),
      description: userData.learnMore,
      tg_username: userData.telegramUsername,
      title: userData.title,
      status:  "draft",
      user_id: userData.user_id
    });
    console.log("Data sent successfully");
  } catch (error) {
    console.error("Error adding document: ", error);

  }
};
