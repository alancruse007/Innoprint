import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  Address,
  getUserAddresses,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/firestore";

interface AddressContextType {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  addAddress: (address: Omit<Address, "id" | "userId">) => Promise<string>;
  updateAddress: (address: Address) => Promise<string>;
  removeAddress: (addressId: string) => Promise<void>;
  setAsDefault: (addressId: string) => Promise<boolean>;
  getDefaultAddress: () => Address | null;
  refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | null>(null);

export function useAddress() {
  return useContext(AddressContext) as AddressContextType;
}

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user addresses when user changes
  useEffect(() => {
    if (currentUser) {
      refreshAddresses();
    } else {
      // Clear addresses when user logs out
      setAddresses([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch addresses from Firestore
  const refreshAddresses = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const userAddresses = await getUserAddresses(currentUser.uid);
      setAddresses(userAddresses);
    } catch (err: any) {
      console.error("Error fetching addresses:", err);
      setError(err.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  // Add a new address
  const addAddress = async (addressData: Omit<Address, "id" | "userId">) => {
    if (!currentUser)
      throw new Error("You must be logged in to add an address");

    try {
      setLoading(true);
      setError(null);

      // If this is the first address, make it default
      const isDefault = addresses.length === 0 ? true : addressData.isDefault;

      const newAddress: Address = {
        ...addressData,
        userId: currentUser.uid,
        isDefault,
      };

      const addressId = await saveAddress(newAddress);
      await refreshAddresses();
      return addressId;
    } catch (err: any) {
      console.error("Error adding address:", err);
      setError(err.message || "Failed to add address");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing address
  const updateAddress = async (address: Address) => {
    if (!currentUser)
      throw new Error("You must be logged in to update an address");
    if (address.userId !== currentUser.uid)
      throw new Error("You can only update your own addresses");

    try {
      setLoading(true);
      setError(null);
      const addressId = await saveAddress(address);
      await refreshAddresses();
      return addressId;
    } catch (err: any) {
      console.error("Error updating address:", err);
      setError(err.message || "Failed to update address");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove an address
  const removeAddress = async (addressId: string) => {
    if (!currentUser)
      throw new Error("You must be logged in to remove an address");

    try {
      setLoading(true);
      setError(null);
      await deleteAddress(addressId);
      await refreshAddresses();
    } catch (err: any) {
      console.error("Error removing address:", err);
      setError(err.message || "Failed to remove address");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set an address as default
  const setAsDefault = async (addressId: string) => {
    if (!currentUser)
      throw new Error("You must be logged in to set a default address");

    try {
      setLoading(true);
      setError(null);
      await setDefaultAddress(addressId, currentUser.uid);
      await refreshAddresses();
      return true;
    } catch (err: any) {
      console.error("Error setting default address:", err);
      setError(err.message || "Failed to set default address");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get the default address
  const getDefaultAddress = () => {
    return addresses.find((address) => address.isDefault) || null;
  };

  const value = {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    removeAddress,
    setAsDefault,
    getDefaultAddress,
    refreshAddresses,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
}
