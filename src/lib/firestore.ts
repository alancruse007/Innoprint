import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { app } from "./firebase";

// Initialize Firestore
const db = getFirestore(app);

// User addresses collection reference
const addressesCollection = "userAddresses";

// Interface for address
export interface Address {
  id?: string;
  userId: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// Save address for a user
export const saveAddress = async (address: Address) => {
  try {
    // If it's set as default, update all other addresses to non-default
    if (address.isDefault) {
      const userAddressesRef = collection(db, addressesCollection);
      const q = query(userAddressesRef, where("userId", "==", address.userId));
      const querySnapshot = await getDocs(q);

      // Update all existing addresses to non-default
      const updatePromises = querySnapshot.docs.map(async (document) => {
        const docRef = doc(db, addressesCollection, document.id);
        await setDoc(docRef, { isDefault: false }, { merge: true });
      });

      await Promise.all(updatePromises);
    }

    // Add the new address
    if (address.id) {
      // Update existing address
      const addressRef = doc(db, addressesCollection, address.id);
      await setDoc(addressRef, address, { merge: true });
      return address.id;
    } else {
      // Create new address
      const docRef = await addDoc(collection(db, addressesCollection), address);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving address:", error);
    throw error;
  }
};

// Get all addresses for a user
export const getUserAddresses = async (userId: string) => {
  try {
    const userAddressesRef = collection(db, addressesCollection);
    const q = query(userAddressesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Address[];
  } catch (error) {
    console.error("Error getting user addresses:", error);
    throw error;
  }
};

// Get default address for a user
export const getDefaultAddress = async (userId: string) => {
  try {
    const userAddressesRef = collection(db, addressesCollection);
    const q = query(
      userAddressesRef,
      where("userId", "==", userId),
      where("isDefault", "==", true)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Address;
  } catch (error) {
    console.error("Error getting default address:", error);
    throw error;
  }
};

// Delete an address
export const deleteAddress = async (addressId: string) => {
  try {
    await deleteDoc(doc(db, addressesCollection, addressId));
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

// Set an address as default
export const setDefaultAddress = async (addressId: string, userId: string) => {
  try {
    // First, set all user addresses to non-default
    const userAddressesRef = collection(db, addressesCollection);
    const q = query(userAddressesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const updatePromises = querySnapshot.docs.map(async (document) => {
      const docRef = doc(db, addressesCollection, document.id);
      await setDoc(
        docRef,
        { isDefault: document.id === addressId },
        { merge: true }
      );
    });

    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};
