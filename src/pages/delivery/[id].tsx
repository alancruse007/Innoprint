import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAddress } from "@/contexts/AddressContext";
import { Address } from "@/lib/firestore";

// Mock data for Indian states
const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Mock data for cities (simplified)
const CITIES = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirapalli"],
  // Add more as needed
};

// Default country
const DEFAULT_COUNTRY = "India";

const DeliveryPage = () => {
  const router = useRouter();
  const { id, price, time } = router.query;
  const { currentUser } = useAuth();
  const {
    addresses,
    loading: addressesLoading,
    addAddress,
    getDefaultAddress,
  } = useAddress();

  // Delivery method state
  const [deliveryMethod, setDeliveryMethod] = useState("HOME");

  // Address form state
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [name, setName] = useState("");

  // Selected saved address
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showAddressForm, setShowAddressForm] = useState(true);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available cities based on selected state
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser && typeof window !== "undefined") {
      // Redirect to login page if not logged in
      router.push(
        `/auth/login?redirect=/delivery/${id}?price=${price}&time=${time}`
      );
    }
  }, [currentUser, router, id, price, time]);

  // Update available cities when state changes
  useEffect(() => {
    if (selectedState && CITIES[selectedState]) {
      setAvailableCities(CITIES[selectedState]);
      setSelectedCity(""); // Reset city when state changes
    } else {
      setAvailableCities([]);
    }
  }, [selectedState]);

  // Set default address if available
  useEffect(() => {
    if (!addressesLoading && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = getDefaultAddress();
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setShowAddressForm(false);
      }
    }
  }, [addresses, addressesLoading, getDefaultAddress, selectedAddressId]);

  // Handle address selection
  const handleAddressSelect = (addressId: string | null) => {
    setSelectedAddressId(addressId);
    setShowAddressForm(!addressId);

    if (addressId) {
      const selectedAddress = addresses.find((addr) => addr.id === addressId);
      if (selectedAddress) {
        // Pre-fill form with selected address data in case user wants to edit
        setName(selectedAddress.name);
        setAddressLine1(selectedAddress.line1);
        setAddressLine2(selectedAddress.line2 || "");
        setSelectedState(selectedAddress.state);
        setSelectedCity(selectedAddress.city);
        setZipCode(selectedAddress.zipCode);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (deliveryMethod === "HOME" && showAddressForm) {
      if (!name.trim()) newErrors.name = "Name is required";
      if (!addressLine1.trim()) newErrors.addressLine1 = "Address is required";
      if (!selectedState) newErrors.state = "State is required";
      if (!selectedCity) newErrors.city = "City is required";
      if (!zipCode.trim()) {
        newErrors.zipCode = "ZIP code is required";
      } else if (!/^\d{6}$/.test(zipCode)) {
        newErrors.zipCode = "ZIP code must be 6 digits";
      }
    } else if (deliveryMethod === "HOME" && !selectedAddressId) {
      newErrors.address = "Please select an address or add a new one";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      router.push(
        `/auth/login?redirect=/delivery/${id}?price=${price}&time=${time}`
      );
      return;
    }

    if (validateForm()) {
      try {
        // If showing address form and not using a saved address, save the new address
        if (deliveryMethod === "HOME" && showAddressForm) {
          await addAddress({
            name,
            line1: addressLine1,
            line2: addressLine2,
            state: selectedState,
            city: selectedCity,
            zipCode,
            country: DEFAULT_COUNTRY,
            isDefault: addresses.length === 0, // Make default if it's the first address
          });
        }

        // Navigate to payment page with order details
        router.push(`/payment/${id}?price=${price}&time=${time}`);
      } catch (error) {
        console.error("Error saving address:", error);
        setErrors({ submit: "Failed to save address. Please try again." });
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Delivery Options | Innoprint</title>
        <meta name="description" content="Choose your delivery method" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Delivery Options
        </h1>

        {!currentUser ? (
          <div className="text-center py-8">
            <p className="mb-4">Please log in to continue with your delivery</p>
            <button
              onClick={() =>
                router.push(
                  `/auth/login?redirect=/delivery/${id}?price=${price}&time=${time}`
                )
              }
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Log In
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              {/* Delivery Method Selection */}
              <div className="flex space-x-4 mb-8">
                <button
                  type="button"
                  className={`flex-1 py-3 rounded-lg border ${
                    deliveryMethod === "HOME"
                      ? "border-blue-500 bg-white"
                      : "border-gray-300 bg-gray-100"
                  }`}
                  onClick={() => setDeliveryMethod("HOME")}
                >
                  HOME
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 rounded-lg border ${
                    deliveryMethod === "OFFICE"
                      ? "border-blue-500 bg-white"
                      : "border-gray-300 bg-gray-100"
                  }`}
                  onClick={() => setDeliveryMethod("OFFICE")}
                >
                  Office
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 rounded-lg border ${
                    deliveryMethod === "PICKUP"
                      ? "border-blue-500 bg-white"
                      : "border-gray-300 bg-gray-100"
                  }`}
                  onClick={() => setDeliveryMethod("PICKUP")}
                >
                  Pick up
                </button>
              </div>

              {/* Saved Addresses (only shown for HOME or OFFICE delivery) */}
              {deliveryMethod !== "PICKUP" && (
                <div className="space-y-6">
                  {addresses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">
                        Your Saved Addresses
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer ${
                              selectedAddressId === address.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300"
                            }`}
                            onClick={() => handleAddressSelect(address.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{address.name}</p>
                                <p>{address.line1}</p>
                                {address.line2 && <p>{address.line2}</p>}
                                <p>
                                  {address.city}, {address.state}{" "}
                                  {address.zipCode}
                                </p>
                                <p>{address.country}</p>
                              </div>
                              {address.isDefault && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedAddressId(null);
                            setShowAddressForm(true);
                            // Clear form fields
                            setName("");
                            setAddressLine1("");
                            setAddressLine2("");
                            setSelectedState("");
                            setSelectedCity("");
                            setZipCode("");
                          }}
                        >
                          + Add New Address
                        </button>
                      </div>
                    </div>
                  )}

                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}

                  {/* Address Form */}
                  {(showAddressForm || addresses.length === 0) && (
                    <div className="space-y-6 border rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-medium mb-3">
                        {addresses.length === 0
                          ? "Add Address"
                          : "Add New Address"}
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.addressLine1
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Street address, house number"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                        />
                        {errors.addressLine1 && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.addressLine1}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300"
                          placeholder="Apartment, suite, unit, building, floor, etc."
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State<span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.state ? "border-red-500" : "border-gray-300"
                          }`}
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                        >
                          <option value="">Select state</option>
                          {STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City<span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          disabled={!selectedState}
                        >
                          <option value="">Select city</option>
                          {availableCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.zipCode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter ZIP code"
                          value={zipCode}
                          onChange={(e) =>
                            setZipCode(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          maxLength={6}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pickup Location Info (only shown for PICKUP) */}
              {deliveryMethod === "PICKUP" && (
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Pickup Information
                  </h3>
                  <p className="text-gray-700 mb-4">
                    You can pick up your order at our main office location once
                    it's ready.
                  </p>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Address:</span> 123 Printing
                      Avenue, Tech Park
                    </p>
                    <p>
                      <span className="font-medium">City:</span> Bangalore
                    </p>
                    <p>
                      <span className="font-medium">Hours:</span> Monday-Friday,
                      9:00 AM - 6:00 PM
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span> +91
                      9876543210
                    </p>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 text-center bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryPage;
