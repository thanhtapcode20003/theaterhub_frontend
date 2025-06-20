import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Dashboard = () => {
  // Sample data - you can replace with real data later
  const metrics = [
    {
      title: "Total Revenue",
      value: "$1,250.00",
      change: "+12.5%",
      trend: "up",
      description: "Trending up this month",
      subtitle: "Visitors for the last 6 months",
      icon: DollarSign,
    },
    {
      title: "New Customers",
      value: "1,234",
      change: "-20%",
      trend: "down",
      description: "Down 20% this period",
      subtitle: "Acquisition needs attention",
      icon: Users,
    },
    {
      title: "Active Accounts",
      value: "45,678",
      change: "+12.5%",
      trend: "up",
      description: "Strong user retention",
      subtitle: "Engagement exceed targets",
      icon: Activity,
    },
    {
      title: "Growth Rate",
      value: "4.5%",
      change: "+4.5%",
      trend: "up",
      description: "Steady performance increase",
      subtitle: "Meets growth projections",
      icon: TrendingUp,
    },
  ];

  const timeRanges = ["Last 3 months", "Last 30 days", "Last 7 days"];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 px-6 py-6 space-y-8">
        {/* Header */}
        <div className="pt-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-zinc-400 ml-8 text-lg">
            Welcome to the TheaterHub admin dashboard
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon =
              metric.trend === "up" ? ArrowUpRight : ArrowDownRight;

            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700/70 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/5 backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Header with title and trend */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-zinc-400" />
                    <h3 className="text-sm font-medium text-zinc-300">
                      {metric.title}
                    </h3>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      metric.trend === "up"
                        ? "text-green-400 bg-green-400/10"
                        : "text-red-400 bg-red-400/10"
                    }`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {metric.change}
                  </div>
                </div>

                {/* Main metric */}
                <div className="mb-2">
                  <div className="text-2xl font-bold text-white">
                    {metric.value}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-zinc-300">
                    <TrendingUp className="h-3 w-3" />
                    {metric.description}
                  </div>
                  <p className="text-xs text-zinc-500">{metric.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Section */}
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-sm shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Total Visitors
              </h2>
              <p className="text-sm text-zinc-400">
                Total for the last 3 months
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex bg-zinc-800 rounded-lg p-1">
              {timeRanges.map((range, index) => (
                <button
                  key={range}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    index === 0
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-64 bg-gradient-to-br from-zinc-800/40 to-zinc-900/60 rounded-lg flex items-center justify-center border border-zinc-700/50 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.zinc.800/10)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.zinc.800/10)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="text-center relative z-10">
              <Activity className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">
                Chart will be displayed here
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Integration with chart library coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Additional Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-sm shadow-xl shadow-black/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-300">New user registration</p>
                  <p className="text-xs text-zinc-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-300">Ticket purchased</p>
                  <p className="text-xs text-zinc-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-300">Show scheduled</p>
                  <p className="text-xs text-zinc-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-sm shadow-xl shadow-black/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg hover:bg-red-600/20 transition-colors group">
                <Users className="h-5 w-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-red-400">Add User</p>
              </button>
              <button className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg hover:bg-blue-600/20 transition-colors group">
                <ShoppingCart className="h-5 w-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-blue-400">New Show</p>
              </button>
              <button className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg hover:bg-green-600/20 transition-colors group">
                <DollarSign className="h-5 w-5 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-green-400">
                  View Revenue
                </p>
              </button>
              <button className="p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg hover:bg-purple-600/20 transition-colors group">
                <Activity className="h-5 w-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-purple-400">Analytics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
