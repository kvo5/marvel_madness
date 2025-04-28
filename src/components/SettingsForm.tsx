"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
// Import both server actions
import { updateUserProfile, deleteUserAccount } from "@/action";
import Image from "./Image"; // Use your Image component for previews
import NextImage from "next/image"; // For previews and current images
// Remove unused custom Image import if no longer needed elsewhere in this file
// import Image from "./Image";

// Revert to standard import
import { Role } from "@prisma/client";

// Define a type for the user profile data we expect
type UserProfileData = {
  displayName: string | null;
  bio: string | null;
  location: string | null;
  // job: string | null; // Remove
  // website: string | null; // Remove
  role: Role | null; // Use direct import
  rank: string | null; // Add rank
  img: string | null; // Existing image path from ImageKit
  cover: string | null; // Existing cover path
  username: string; // Needed for revalidation
};

const SettingsForm = ({ initialData }: { initialData: UserProfileData }) => {
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState(initialData);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [coverPicPreview, setCoverPicPreview] = useState<string | null>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const coverPicRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(updateUserProfile, {
    success: false,
    error: null,
  });

  // Add action state for the delete action
  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteUserAccount, {
    success: false,
    error: null,
  });

  useEffect(() => {
    // Update local state if initialData changes (e.g., after successful update)
    // This might not be strictly necessary if revalidatePath works perfectly,
    // but can help ensure UI consistency.
    setFormData(initialData);
    setProfilePicPreview(null); // Clear previews after update
    setCoverPicPreview(null);
  }, [initialData]);

  const handleInputChange = (
    // Include HTMLSelectElement for dropdowns
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (type === "profile") {
        setProfilePicPreview(previewUrl);
      } else {
        setCoverPicPreview(previewUrl);
      }
    } else {
      // Clear preview if file is removed
      if (type === "profile") {
        setProfilePicPreview(null);
      } else {
        setCoverPicPreview(null);
      }
    }
  };

  if (!isLoaded) {
    return <div>Loading settings...</div>;
  }

  if (!user) {
    // Should be handled by the page redirect, but good practice
    return <div>Please log in to view settings.</div>;
  }

  // Remove the manual handleSubmit, formAction will handle it via the action prop
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => { ... };


  return (
    // Use the action prop directly with formAction
    // Remove onSubmit
    <form action={formAction} className="space-y-6">
       {/* Add hidden input for username needed by the server action */}
      <input type="hidden" name="username" value={user?.username || ''} />

      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-medium text-textGrayLight mb-1">
          Profile Picture
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden relative bg-inputGray">
            {profilePicPreview ? (
              <NextImage src={profilePicPreview} alt="Preview" layout="fill" objectFit="cover" />
            ) : formData.img ? (
              <NextImage src={formData.img} alt="Current Profile Picture" layout="fill" objectFit="cover" />
            ) : (
              <span className="text-xs text-textGray flex items-center justify-center h-full">No Image</span>
            )}
          </div>
          <input
            type="file"
            name="profilePic"
            ref={profilePicRef}
            onChange={(e) => handleFileChange(e, "profile")}
            accept="image/*"
            className="hidden"
            id="profilePicInput"
          />
          <button
            type="button"
            onClick={() => profilePicRef.current?.click()}
            className="py-1 px-3 border border-borderGray rounded-md text-sm hover:bg-inputGray"
          >
            Change
          </button>
        </div>
      </div>

      {/* Cover Picture */}
      <div>
        <label className="block text-sm font-medium text-textGrayLight mb-1">
          Cover Picture
        </label>
        <div className="flex items-center gap-4">
          <div className="w-full h-32 rounded-md overflow-hidden relative bg-inputGray">
             {coverPicPreview ? (
              <NextImage src={coverPicPreview} alt="Preview" layout="fill" objectFit="cover" />
            ) : formData.cover ? (
              <NextImage src={formData.cover} alt="Current Cover Picture" layout="fill" objectFit="cover" />
            ) : (
               <span className="text-xs text-textGray flex items-center justify-center h-full">No Cover Image</span>
            )}
          </div>
           <input
            type="file"
            name="coverPic"
            ref={coverPicRef}
            onChange={(e) => handleFileChange(e, "cover")}
            accept="image/*"
            className="hidden"
            id="coverPicInput"
          />
           <button
            type="button"
            onClick={() => coverPicRef.current?.click()}
            className="py-1 px-3 border border-borderGray rounded-md text-sm hover:bg-inputGray"
          >
            Change
          </button>
        </div>
      </div>


      {/* Display Name */}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-textGrayLight mb-1">
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={formData.displayName || ""}
          onChange={handleInputChange}
          className="w-full bg-inputGray p-2 rounded-md border border-borderGray outline-none focus:border-iconBlue"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-textGrayLight mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={formData.bio || ""}
          onChange={handleInputChange}
          className="w-full bg-inputGray p-2 rounded-md border border-borderGray outline-none focus:border-iconBlue"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-textGrayLight mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={handleInputChange}
          className="w-full bg-inputGray p-2 rounded-md border border-borderGray outline-none focus:border-iconBlue"
         />
       </div>

       {/* Role */}
       <div>
         <label htmlFor="role" className="block text-sm font-medium text-textGrayLight mb-1">
           Main Role
         </label>
         <select
           id="role"
           name="role"
           value={formData.role || ""}
           onChange={handleInputChange}
           className="w-full bg-inputGray p-2 rounded-md border border-borderGray outline-none focus:border-iconBlue appearance-none" // appearance-none to style dropdown arrow if needed
         >
           <option value="">Select Role...</option>
           {/* Use direct import */}
           <option value={Role.DUELIST}>Duelist</option>
           <option value={Role.VANGUARD}>Vanguard</option>
           <option value={Role.STRATEGIST}>Strategist</option>
         </select>
       </div>

       {/* Rank */}
       <div>
         <label htmlFor="rank" className="block text-sm font-medium text-textGrayLight mb-1">
           Rank
         </label>
         <select
           id="rank"
           name="rank"
           value={formData.rank || ""}
           onChange={handleInputChange}
           className="w-full bg-inputGray p-2 rounded-md border border-borderGray outline-none focus:border-iconBlue appearance-none"
         >
           <option value="">Select Rank...</option>
           {/* Generate Rank Options */}
           {["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "GRANDMASTER", "CELESTIAL"].flatMap(rank =>
             ["III", "II", "I"].map(tier => <option key={`${rank}-${tier}`} value={`${rank} ${tier}`}>{`${rank} ${tier}`}</option>)
           )}
           <option value="ETERNITY">ETERNITY</option>
           <option value="ONE ABOVE ALL">ONE ABOVE ALL</option>
         </select>
       </div>


       {/* Submit Button & Status */}
       {/* Added pt-4 and border-t for separation */}
       <div className="flex items-center gap-4 pt-4 border-t border-borderGray">
        <button
          type="submit"
          disabled={isPending}
          className="bg-white text-black font-bold py-2 px-5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        {state?.success && <span className="text-green-500">Profile updated successfully!</span>}
{/* Delete Account Section */}
      {/* Added pt-4 mt-4 and border-t for separation */}
      <div className="pt-4 mt-4 border-t border-red-500/50">
        <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
        <p className="text-sm text-textGray mb-4">
          Deleting your account is permanent and cannot be undone. All your data, including posts and profile information, will be removed.
        </p>
        {/* Add a separate form for the delete action */}
        {/* Wire up the deleteAction */}
        <form action={deleteAction}>
           <button
            type="submit"
            disabled={isDeletePending} // Use pending state
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeletePending ? "Deleting..." : "Delete Account Permanently"} {/* Show pending text */}
          </button>
           {/* Show delete error message */}
           {deleteState?.error && <span className="text-red-500 ml-4 text-sm">Error: {deleteState.error}</span>}
           {/* Note: On success, Clerk should handle redirect/sign-out automatically */}
        </form>
      </div>
        {state?.error && <span className="text-red-500">Error: {state.error}</span>}
      </div>
    </form>
  );
};

export default SettingsForm;