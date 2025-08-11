"use client";

import React from "react";
import { Users as UsersIcon, Shield, Calendar } from "lucide-react";
import { CardLoading, TableLoading } from "@/components/ui/loading";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useUsers } from "@/hooks/useUsers";

const Users = () => {
  const {
    users,
    isPageLoading,
    isCardsLoading,
    handleAddUser,
    handleRefreshData,
  } = useUsers();

  // console.log(users);

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
                      {users.length > 0 ? "Live data" : "No data"}
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
                      {users.filter((user) => !user.is_locked).length}
                    </p>
                    <p className="text-trend-positive text-sm font-medium">
                      {users.length > 0
                        ? Math.round(
                            (users.filter((user) => !user.is_locked).length /
                              users.length) *
                              100
                          ) + "% active"
                        : "No data"}
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
                      {users.filter((user) => user.role === "customer").length}
                    </p>
                    <p className="text-trend-positive text-sm font-medium">
                      {users.length > 0
                        ? Math.round(
                            (users.filter((user) => user.role === "customer")
                              .length /
                              users.length) *
                              100
                          ) + "% customers"
                        : "No data"}
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
                      {users.length > 0
                        ? new Set(users.map((user) => user.role)).size +
                          " roles"
                        : "No data"}
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

        {/* Users Data Table */}
        {isPageLoading ? (
          <TableLoading rows={10} />
        ) : (
          <DataTable
            columns={columns}
            data={users}
            onRefresh={handleRefreshData}
            onAddUser={handleAddUser}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
