import { collection, getDocs } from "firebase/firestore";


export const getScreeningType = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "screening_type"));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching users: ", error);
      throw error;
    }
  };
//   type_id


  export const getScreeningTypeValue = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "screening_type_value"));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching users: ", error);
      throw error;
    }
  };

//   screening_type_id