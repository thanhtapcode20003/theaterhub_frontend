"use client";
import React, { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useLoading, useAsyncOperation } from "@/contexts/LoadingContext";
import { CardLoading, TableLoading } from "@/components/ui/loading";
import { getUsers } from "@/lib/services/userService";

const Users = () => {
  const { showLoading, hideLoading } = useLoading();
  const { executeWithLoading } = useAsyncOperation();
  const [users, setUsers] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCardsLoading, setIsCardsLoading] = useState(true);

  // Sample user data
  const sampleUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Customer",
      status: "Active",
      joinDate: "2024-01-15",
      lastLogin: "2024-03-15",
      avatar: "/icons/default-avatar.png",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-12-01",
      lastLogin: "2024-03-16",
      avatar: "/icons/default-avatar.png",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "Customer",
      status: "Inactive",
      joinDate: "2024-02-20",
      lastLogin: "2024-03-10",
      avatar: "/icons/default-avatar.png",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      role: "Moderator",
      status: "Active",
      joinDate: "2024-01-05",
      lastLogin: "2024-03-16",
      avatar: "/icons/default-avatar.png",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@example.com",
      role: "Customer",
      status: "Active",
      joinDate: "2024-03-01",
      lastLogin: "2024-03-14",
      avatar: "/icons/default-avatar.png",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "badge-active";
      case "Inactive":
        return "badge-inactive";
      default:
        return "badge-inactive";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "staff":
        return "badge-moderator";
      case "customer":
        return "badge-customer";
      default:
        return "badge-inactive";
    }
  };

  // Load users from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsPageLoading(true);
        setIsCardsLoading(true);

        // Get users from API
        const apiUsers = (await getUsers()) as any;
        console.log("API Users:", apiUsers);

        if (apiUsers && apiUsers.users && apiUsers.users.length > 0) {
          // Use API data
          setUsers(apiUsers.users);
        } else {
          // Fallback to sample data if API returns empty
          console.log("API returned empty, using sample data");
          setUsers(sampleUsers);
        }

        setIsPageLoading(false);

        // Load stats cards after a short delay
        setTimeout(() => {
          setIsCardsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error loading users:", error);
        // Fallback to sample data on error
        setUsers(sampleUsers);
        setIsPageLoading(false);
        setIsCardsLoading(false);
      }
    };

    loadData();
  }, []);

  // Example function to demonstrate loading usage
  const handleAddUser = async () => {
    await executeWithLoading(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Add user logic here
    }, "Adding new user...");
  };

  const handleRefreshData = async () => {
    await executeWithLoading(async () => {
      try {
        const apiUsers = (await getUsers()) as any;
        console.log("Refreshed API Users:", apiUsers);

        if (apiUsers && apiUsers.users && apiUsers.users.length > 0) {
          setUsers(apiUsers.users);
        } else {
          setUsers(sampleUsers);
        }
      } catch (error) {
        console.error("Error refreshing users:", error);
        setUsers(sampleUsers);
      }
    }, "Refreshing user data...");
  };

  console.log(users);

  return (
    <div className="admin-page-bg">
      {/* Background Effects */}
      <div className="admin-bg-effects" />
      <div className="admin-bg-radial" />

      <div className="relative z-10 px-6 py-6 space-y-8">
        {/* Header */}
        <div className="pt-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="admin-header-icon bg-red-gradient">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="admin-header-title">User Management</h1>
              <p className="admin-header-subtitle">
                Manage and monitor user accounts
              </p>
            </div>
          </div>
          <div className="admin-header-line bg-red-gradient"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {isCardsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <CardLoading key={i} />)
          ) : (
            <>
              <div className="group glass-card glass-card-hover p-6 shadow-red-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {users.length}
                    </p>
                    <p className="text-trend-positive text-sm font-medium">
                      Live data
                    </p>
                  </div>
                  <div className="icon-container-blue">
                    <UsersIcon className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="group glass-card glass-card-hover p-6 shadow-red-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {
                        users.filter(
                          (user) => (user.status || "Active") === "Active"
                        ).length
                      }
                    </p>
                    <p className="text-trend-positive text-sm font-medium">
                      {users.length > 0
                        ? Math.round(
                            (users.filter(
                              (user) => (user.status || "Active") === "Active"
                            ).length /
                              users.length) *
                              100
                          )
                        : 0}
                      % active
                    </p>
                  </div>
                  <div className="icon-container-green">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="group glass-card glass-card-hover p-6 shadow-red-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Customer Users
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {
                        users.filter(
                          (user) => (user.role || "customer") === "customer"
                        ).length
                      }
                    </p>
                    <p className="text-trend-positive text-sm font-medium">
                      {users.length > 0
                        ? Math.round(
                            (users.filter(
                              (user) => (user.role || "customer") === "customer"
                            ).length /
                              users.length) *
                              100
                          )
                        : 0}
                      % customers
                    </p>
                  </div>
                  <div className="icon-container-purple">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="group glass-card glass-card-hover p-6 shadow-red-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Admin Users
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {users.filter((user) => user.role === "admin").length}
                    </p>
                    <p className="text-trend-neutral text-sm font-medium">
                      {
                        new Set(users.map((user) => user.role || "customer"))
                          .size
                      }{" "}
                      roles
                    </p>
                  </div>
                  <div className="icon-container-red">
                    <Shield className="h-6 w-6 text-red-primary" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-3 input-glass w-full sm:w-80"
              />
            </div>
            <button className="btn-glass">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button onClick={handleRefreshData} className="btn-glass">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
          <button onClick={handleAddUser} className="btn-red-primary">
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>

        {/* Users Table */}
        {isPageLoading ? (
          <TableLoading rows={5} />
        ) : (
          <div className="table-glass">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Role
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Join Date
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Last Login
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/50">
                  {users.map((user, index) => {
                    // Handle both API data and sample data formats
                    const userName = user.userName || user.name;
                    const userEmail = user.email;
                    const userRole = user.role || "Customer";
                    const userStatus = user.status || "Active";
                    const userJoinDate = user.joinDate || "N/A";
                    const userLastLogin = user.lastLogin || "N/A";
                    const userId = user.id;

                    return (
                      <tr
                        key={userId}
                        className="table-row-hover"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {user.avatar && user.avatar !== null ? (
                              <img
                                src={user.avatar}
                                alt={userName}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/icons/default-avatar.png";
                                }}
                              />
                            ) : (
                              <img
                                src="/icons/default-avatar.png"
                                alt={userName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-white">
                                {userName}
                              </p>
                              <p className="text-sm text-gray-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {userEmail}
                              </p>
                              {user.phoneNumber && (
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.phoneNumber}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={getRoleColor(userRole)}>
                            {userRole}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={getStatusColor(userStatus)}>
                            {userStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {userJoinDate}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {userLastLogin}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              className="action-btn-edit"
                              title="Edit user"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="action-btn-delete"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              className="action-btn-more"
                              title="More options"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Showing 1 to {users.length} of {users.length} results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-gray-300 hover:bg-zinc-700/50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              1
            </button>
            <button className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-gray-300 hover:bg-zinc-700/50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-gray-300 hover:bg-zinc-700/50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-gray-300 hover:bg-zinc-700/50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
