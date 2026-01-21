import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "../firebase";

export async function uploadFile(file) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const fileRef = ref(
    storage,
    `users/${user.uid}/original/${Date.now()}-${file.name}`
  );

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  await addDoc(collection(db, "uploads"), {
    userId: user.uid,
    fileName: file.name,
    url,
    createdAt: serverTimestamp(),
  });
}
