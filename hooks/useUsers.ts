"use client";
import { useState, useEffect } from "react";
import { useAsyncOperation } from "@/contexts/LoadingContext";
import { getUsers } from "@/lib/services/userService";
import { User } from "@/app/[role]/users/columns";

export const useUsers = () => {
  const { executeWithLoading } = useAsyncOperation();
  const [users, setUsers] = useState<User[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCardsLoading, setIsCardsLoading] = useState(true);

  // Load users from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsPageLoading(true);
        setIsCardsLoading(true);

        // Get users from API
        const apiUsers = (await getUsers()) as any;
        // console.log("API Users:", apiUsers);

        if (apiUsers && apiUsers.users && apiUsers.users.length > 0) {
          // Transform API data to match User type
          const transformedUsers: User[] = apiUsers.users.map((user: any) => ({
            user_id: user.id || user.user_id,
            name: user.userName || user.name,
            email: user.email,
            phone: user.phoneNumber || user.phone || "",
            role: user.role || "customer",
            avatar: user.avatar || "/icons/default-avatar.png",
            is_locked: Boolean(user.is_locked),
            provider: user.provider || "null",
            email_verified: Boolean(user.email_verified),
          }));
          setUsers(transformedUsers);
        } else {
          // No users available
          // console.log("No users available from API");
          setUsers([]);
        }

        setIsPageLoading(false);

        // Load stats cards after a short delay
        setTimeout(() => {
          setIsCardsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error loading users:", error);
        // Set empty array on error
        setUsers([]);
        setIsPageLoading(false);
        setIsCardsLoading(false);
      }
    };

    loadData();
  }, []);

  // Add user function
  const handleAddUser = async () => {
    await executeWithLoading(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Add user logic here
    }, "Adding new user...");
  };

  // Refresh data function
  const handleRefreshData = async () => {
    await executeWithLoading(async () => {
      try {
        const apiUsers = (await getUsers()) as any;
        // console.log("Refreshed API Users:", apiUsers);

        if (apiUsers && apiUsers.users && apiUsers.users.length > 0) {
          const transformedUsers: User[] = apiUsers.users.map((user: any) => ({
            user_id: user.id || user.user_id,
            name: user.userName || user.name,
            email: user.email,
            phone: user.phoneNumber || user.phone || "",
            role: user.role || "customer",
            avatar: user.avatar || "/icons/default-avatar.png",
            is_locked: Boolean(user.is_locked),
            provider: user.provider || "local",
            email_verified: Boolean(user.email_verified),
          }));
          setUsers(transformedUsers);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error refreshing users:", error);
        setUsers([]);
      }
    }, "Refreshing user data...");
  };

  return {
    users,
    isPageLoading,
    isCardsLoading,
    handleAddUser,
    handleRefreshData,
  };
};
