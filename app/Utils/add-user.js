import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();

export const addUser = async (uid, name, creation_date) => {
  console.log("UID:", uid); // Add console logs
  console.log("Name:", name);
  console.log("Creation Date:", creation_date);

  if (!uid || !name || !creation_date) {
    throw new Error("Invalid input data");
  }

  try {
    const userRef = doc(db, "users", uid); // Use the UID as the document ID
    await setDoc(userRef, {
      name: name,
      creation_date: creation_date,
    });
  } catch (error) {
    console.error("Firestore error:", error);
    throw error; // Re-throw error after logging
  }
};
