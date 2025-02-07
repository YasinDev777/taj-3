import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export const setData = async (userData) => {
  try {
    await addDoc(collection(db, "user_requaries"), {
      user_id: "ananymus",
      title: userData.title,
      telegram_username: userData.telegramUsername,
      learn_more: userData.learnMore,
      created_at: serverTimestamp()
    });
    console.log("Data sent successfully");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
