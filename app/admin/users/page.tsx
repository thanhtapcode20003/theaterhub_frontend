import React from "react";
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

const Users = () => {
  // Sample user data
  const users = [
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
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Moderator":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Customer":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 px-6 py-6 space-y-8">
        {/* Header */}
        <div className="pt-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-400 text-lg">
                Manage and monitor user accounts
              </p>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="group bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-white">1,234</p>
                <p className="text-green-400 text-sm font-medium">
                  +12 this week
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30">
                <UsersIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-white">987</p>
                <p className="text-green-400 text-sm font-medium">80% online</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">New Signups</p>
                <p className="text-3xl font-bold text-white">45</p>
                <p className="text-red-400 text-sm font-medium">
                  -5% from last week
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Admin Users</p>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-yellow-400 text-sm font-medium">3 roles</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-500/30">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 w-full sm:w-80"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-gray-300 hover:bg-zinc-700/50 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50 border-b border-zinc-700/50">
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
                    className="hover:bg-zinc-800/30 transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-semibold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{user.joinDate}</td>
                    <td className="py-4 px-6 text-gray-300">
                      {user.lastLogin}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-400/10 rounded-lg transition-colors">
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
