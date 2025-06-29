"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Globe,
  User as UserIcon,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type User = {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  is_locked: boolean;
  provider: string;
  email_verified: boolean;
};

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "badge-admin";
    case "staff":
    case "moderator":
      return "badge-moderator";
    case "customer":
      return "badge-customer";
    default:
      return "badge-inactive";
  }
};

const getStatusColor = (isLocked: boolean) => {
  return isLocked ? "badge-inactive" : "badge-active";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-white hover:bg-zinc-600/60 p-0 h-auto font-semibold transition-colors"
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || "/icons/default-avatar.png"}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/icons/default-avatar.png";
            }}
          />
          <div>
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-gray-400">{user.phone}</p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-white hover:bg-zinc-600/60 p-0 h-auto font-semibold transition-colors"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <span className={getRoleColor(role)}>{role}</span>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-white hover:bg-zinc-600/60 p-0 h-auto font-semibold transition-colors"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <span className="text-gray-300">{email}</span>;
    },
  },
  {
    accessorKey: "provider",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-white hover:bg-zinc-600/60 p-0 h-auto font-semibold transition-colors"
        >
          Provider
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const provider = row.getValue("provider") as string;
      const getProviderIcon = (provider: string) => {
        switch (provider.toLowerCase()) {
          case "google":
            return <FaGoogle className="h-4 w-4 text-blue-400" />;
          case "local":
            return <UserIcon className="h-4 w-4 text-green-400" />;
          default:
            return <Globe className="h-4 w-4 text-gray-400" />;
        }
      };
      const getProviderColor = (provider: string) => {
        switch (provider.toLowerCase()) {
          case "google":
            return "text-blue-400";
          case "local":
            return "text-green-400";
          default:
            return "text-gray-400";
        }
      };
      return (
        <div className="flex items-center gap-2">
          {getProviderIcon(provider)}
          <span
            className={`text-sm font-medium capitalize ${getProviderColor(provider)}`}
          >
            {provider === "null" ? "Unknown" : provider}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email_verified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-white hover:bg-zinc-600/60 p-0 h-auto font-semibold transition-colors"
        >
          Verified
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isVerified = row.getValue("email_verified") as boolean;
      return (
        <div className="flex items-center gap-2">
          {isVerified ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Yes</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">No</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "is_locked",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-white hover:bg-zinc-600/50 p-0 h-auto font-semibold"
        >
          Locked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isLocked = row.getValue("is_locked") as boolean;
      return (
        <div className="flex items-center gap-2">
          {isLocked ? (
            <>
              <Lock className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">Yes</span>
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">No</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-zinc-600/60 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-zinc-800 border-zinc-700 text-white"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(user.user_id.toString())
              }
              className="hover:bg-zinc-700 cursor-pointer"
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              {user.is_locked ? "Unlock" : "Lock"} user
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-red-600 cursor-pointer text-red-400">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
