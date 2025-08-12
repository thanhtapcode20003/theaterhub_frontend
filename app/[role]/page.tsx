"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

import { getPublicEvents } from "@/lib/services/eventService";
import { getUsers } from "@/lib/services/userService";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("3months");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [eventsRes, usersRes] = await Promise.all([
          getPublicEvents(),
          getUsers(),
        ]);

        setEvents(Array.isArray(eventsRes) ? eventsRes : []);

        // Handle user data structure - check if it has a 'users' property
        if (usersRes && typeof usersRes === "object" && "users" in usersRes) {
          setUsers(Array.isArray(usersRes.users) ? usersRes.users : []);
        } else {
          setUsers(Array.isArray(usersRes) ? usersRes : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Calculate metrics based on events and users
  const metrics = useMemo(() => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => e.status === "upcoming").length;
    const ongoingEvents = events.filter((e) => e.status === "ongoing").length;
    const endedEvents = events.filter((e) => e.status === "ended").length;

    const totalUsers = users.length;
    const customerUsers = users.filter((u) => u.role === "customer").length;
    const staffUsers = users.filter((u) => u.role === "staff").length;
    const adminUsers = users.filter((u) => u.role === "admin").length;

    return [
      {
        title: "Total Events",
        value: loading ? "..." : totalEvents.toString(),
        change: "+0%",
        trend: "up",
        description: "All events created",
        subtitle: `${upcomingEvents} upcoming • ${ongoingEvents} ongoing`,
        icon: Activity,
      },
      {
        title: "Total Users",
        value: loading ? "..." : totalUsers.toString(),
        change: "+0%",
        trend: "up",
        description: "Registered accounts",
        subtitle: `${customerUsers} customers • ${staffUsers} staff`,
        icon: Users,
      },
      {
        title: "Active Events",
        value: loading ? "..." : (upcomingEvents + ongoingEvents).toString(),
        change: "+0%",
        trend: "up",
        description: "Upcoming + Ongoing",
        subtitle: "Live inventory",
        icon: ShoppingCart,
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
  }, [events, users, loading]);

  // Generate chart data based on selected time range
  const chartData = useMemo(() => {
    if (!events.length) return { labels: [], datasets: [] };

    const now = new Date();
    let daysToShow = 90; // 3 months default

    switch (selectedTimeRange) {
      case "7days":
        daysToShow = 7;
        break;
      case "30days":
        daysToShow = 30;
        break;
      case "3months":
        daysToShow = 90;
        break;
    }

    const labels = [];
    const data = [];
    const eventCounts = new Map();

    // Count events by creation date
    events.forEach((event) => {
      const eventDate = new Date(event.created_at);
      const dateKey = eventDate.toISOString().split("T")[0];
      eventCounts.set(dateKey, (eventCounts.get(dateKey) || 0) + 1);
    });

    // Generate date range
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const count = eventCounts.get(dateKey) || 0;

      labels.push(
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
      data.push(count);
    }

    return {
      labels,
      datasets: [
        {
          label: "Events Created",
          data: data,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#ef4444",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [events, selectedTimeRange]);

  // Chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#ef4444",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (context: any) => `Date: ${context[0].label}`,
            label: (context: any) => `Events: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(63, 63, 70, 0.3)",
            drawBorder: false,
          },
          ticks: {
            color: "#9ca3af",
            font: {
              size: 11,
            },
          },
        },
        y: {
          grid: {
            color: "rgba(63, 63, 70, 0.3)",
            drawBorder: false,
          },
          ticks: {
            color: "#9ca3af",
            font: {
              size: 11,
            },
            stepSize: 1,
          },
          beginAtZero: true,
        },
      },
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
    }),
    []
  );

  // Generate pie chart data for user roles
  const userRoleData = useMemo(() => {
    if (!users.length) return { labels: [], datasets: [] };

    const roleCounts = new Map();
    users.forEach((user) => {
      const role = user.role || "unknown";
      roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
    });

    const labels = Array.from(roleCounts.keys());
    const data = Array.from(roleCounts.values());

    return {
      labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "#ef4444", // red-500
            "#3b82f6", // blue-500
            "#10b981", // emerald-500
            "#8b5cf6", // violet-500
            "#f59e0b", // amber-500
          ],
          borderColor: "#121214",
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      ],
    };
  }, [users]);

  // Pie chart options
  const pieChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: "#9ca3af",
            font: {
              size: 12,
            },
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#ef4444",
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: (context: any) => {
              const label = context.label || "";
              const value = context.parsed;
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    }),
    []
  );

  // Recent activity based on latest events only (since users don't have created_at)
  const recentActivity = useMemo(() => {
    const activities: any[] = [];

    // Add latest events only
    const latestEvents = [...events]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 3); // Show more events since we're not showing users

    latestEvents.forEach((event) => {
      const eventDate = new Date(event.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - eventDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let timeAgo = "";
      if (diffDays === 0) {
        timeAgo = "just created";
      } else if (diffDays === 1) {
        timeAgo = "1 day ago";
      } else {
        timeAgo = `${diffDays} days ago`;
      }

      activities.push({
        type: "event",
        message: `Event created: ${event.title}`,
        time: timeAgo,
        color: "blue",
      });
    });

    return activities;
  }, [events]);

  const timeRanges = [
    { key: "3months", label: "Last 3 months" },
    { key: "30days", label: "Last 30 days" },
    { key: "7days", label: "Last 7 days" },
  ];

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
                Events Created
              </h2>
              <p className="text-sm text-zinc-400">
                {timeRanges.find((r) => r.key === selectedTimeRange)?.label} •
                Total{" "}
                {chartData.datasets?.[0]?.data?.reduce(
                  (sum: number, count: number) => sum + count,
                  0
                ) || 0}
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex bg-zinc-800 rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setSelectedTimeRange(range.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedTimeRange === range.key
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 rounded-lg border border-zinc-700/50 backdrop-blur-sm relative overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-zinc-500">Loading chart data...</div>
              </div>
            ) : !chartData.labels || chartData.labels.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                No events data available
              </div>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Additional Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-sm shadow-xl shadow-black/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              User Roles Distribution
            </h3>
            <div className="h-64 relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-zinc-500">Loading user data...</div>
                </div>
              ) : !userRoleData.labels || userRoleData.labels.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                  No user data available
                </div>
              ) : (
                <Pie data={userRoleData} options={pieChartOptions} />
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-sm shadow-xl shadow-black/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 bg-${activity.color}-400 rounded-full`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-300">
                        {activity.message}
                      </p>
                      <p className="text-xs text-zinc-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-zinc-500">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
