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
} from "lucide-react";
import { useLoading, useAsyncOperation } from "@/contexts/LoadingContext";
import { CardLoading, TableLoading } from "@/components/ui/loading";

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
      case "Admin":
        return "badge-admin";
      case "Moderator":
        return "badge-moderator";
      case "Customer":
        return "badge-customer";
      default:
        return "badge-inactive";
    }
  };

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUsers(sampleUsers);
      setIsPageLoading(false);

      // Simulate loading stats cards
      setTimeout(() => {
        setIsCardsLoading(false);
      }, 500);
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

  const handleRefreshData = () => {
    showLoading("Refreshing user data...");
    setTimeout(() => {
      hideLoading();
    }, 1500);
  };

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
                    <p className="text-3xl font-bold text-white">1,234</p>
                    <p className="text-trend-positive text-sm font-medium">
                      +12 this week
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
                    <p className="text-3xl font-bold text-white">987</p>
                    <p className="text-trend-positive text-sm font-medium">
                      80% online
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
                      New Signups
                    </p>
                    <p className="text-3xl font-bold text-white">45</p>
                    <p className="text-trend-negative text-sm font-medium">
                      -5% from last week
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
                    <p className="text-3xl font-bold text-white">12</p>
                    <p className="text-trend-neutral text-sm font-medium">
                      3 roles
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
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="table-row-hover"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="avatar-red">
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getRoleColor(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getStatusColor(user.status)}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {user.joinDate}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {user.lastLogin}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="action-btn-edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="action-btn-delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="action-btn-more">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-gray-400">Showing 1 to 5 of 1,234 results</p>
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
