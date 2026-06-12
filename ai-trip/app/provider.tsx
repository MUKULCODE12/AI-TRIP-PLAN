"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type UserType = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
};

type UserContextType = {
  userDetail: UserType | null;
  setUserDetail: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
};

const UserDetailContext = createContext<UserContextType | null>(null);

export const UserDetailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userDetail, setUserDetail] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const { user: clerkUser, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!clerkUser) {
      setUserDetail(null);
      setLoading(false);
      return;
    }

    setUserDetail({
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.firstName || "User",
      email:
        clerkUser.primaryEmailAddress?.emailAddress || "",
      imageUrl: clerkUser.imageUrl,
    });

    setLoading(false);
  }, [clerkUser, isLoaded]);

  return (
    <UserDetailContext.Provider
      value={{
        userDetail,
        setUserDetail,
        loading,
      }}
    >
      {children}
    </UserDetailContext.Provider>
  );
};

export const useUserDetail = () => {
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error(
      "useUserDetail must be used inside UserDetailProvider"
    );
  }

  return context;
};