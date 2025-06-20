import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the TheaterHub admin dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Users</h3>
          </div>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Active Shows</h3>
          </div>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Today's Tickets</h3>
          </div>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Revenue</h3>
          </div>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Activity feed will be displayed here
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Quick action buttons will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
