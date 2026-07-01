import { useState } from "react";
import {
  BarChart3,
  Package,
  AlertCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";

const AdminDashboard = () => {
  const admin = useAdmin();
  const { stats, products, orders, rentals, maintenanceRequests, users } =
    admin;
  const [activeTab, setActiveTab] = useState("overview");

  // Dashboard Stats Cards
  const statsCards = [
    {
      title: "Active Rentals",
      value: stats.activeRentals,
      icon: Calendar,
      color: "blue",
      trend: "+12%",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      color: "green",
      trend: "+8%",
    },
    {
      title: "Inventory Count",
      value: stats.inventoryCount,
      icon: Package,
      color: "purple",
      trend: "-3%",
    },
    {
      title: "Pending Maintenance",
      value: stats.pendingMaintenance,
      icon: AlertCircle,
      color: "red",
      trend: "+5",
    },
  ];

  const getIconBgColor = (color) => {
    const colors = {
      blue: "bg-blue-100",
      green: "bg-green-100",
      purple: "bg-purple-100",
      red: "bg-red-100",
    };
    return colors[color];
  };

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      red: "text-red-600",
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8">
      <div className="w-full px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's your business overview.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {[
            "overview",
            "products",
            "orders",
            "rentals",
            "maintenance",
            "users",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-all ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
                  >
                    {/* Header with Icon */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">
                          {card.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {card.value}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${getIconBgColor(card.color)}`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${getIconColor(card.color)}`}
                        />
                      </div>
                    </div>

                    {/* Trend */}
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        card.color === "red"
                          ? "bg-red-100 text-red-600"
                          : card.color === "green"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {card.trend} this month
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Revenue Trend
                </h2>
                <div className="h-64 bg-gradient-to-b from-blue-50 to-transparent rounded-lg flex items-end justify-around p-4">
                  {[65, 78, 92, 85, 76, 88, 95].map((height, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-8 hover:from-blue-700 hover:to-blue-500 transition-all"
                      style={{ height: `${height}%` }}
                      title={`Day ${idx + 1}: ₹${height * 10000}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mt-4 text-center">
                  Last 7 days revenue
                </p>
              </div>

              {/* Orders Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Order Status
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "Active Orders",
                      value: 245,
                      color: "bg-blue-600",
                      percent: 60,
                    },
                    {
                      label: "Pending",
                      value: 89,
                      color: "bg-yellow-500",
                      percent: 22,
                    },
                    {
                      label: "Completed",
                      value: 156,
                      color: "bg-green-600",
                      percent: 38,
                    },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">
                          {item.label}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {item.value}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-blue-100 mb-2">Total Users</p>
                <p className="text-4xl font-bold">{stats.totalUsers}</p>
                <p className="text-blue-100 text-sm mt-2">+45 new this month</p>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-400 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-green-100 mb-2">Completed Orders</p>
                <p className="text-4xl font-bold">{stats.completedOrders}</p>
                <p className="text-green-100 text-sm mt-2">+120 this month</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-purple-100 mb-2">Avg. Rental Value</p>
                <p className="text-4xl font-bold">₹4,200</p>
                <p className="text-purple-100 text-sm mt-2">+8% increase</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Product Management
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Monthly Rent
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Available
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-800">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        ₹{product.monthlyRent}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {product.available}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items} items - ₹{order.totalAmount}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === "rentals" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Rentals</h2>
            <div className="space-y-4">
              {rentals.map((rental) => (
                <div
                  key={rental.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <p className="font-semibold text-gray-800">
                    {rental.product}
                  </p>
                  <p className="text-sm text-gray-600">
                    {rental.customer} - ₹{rental.totalAmount}
                  </p>
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded inline-block mt-2">
                    {rental.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === "maintenance" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Maintenance Requests
            </h2>
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border-l-4 p-4 rounded ${request.priority === "Critical" ? "border-l-red-600 bg-red-50" : "border-l-blue-600 bg-blue-50"}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {request.product}
                      </p>
                      <p className="text-sm text-gray-600">{request.issue}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${request.priority === "Critical" ? "bg-red-200 text-red-800" : "bg-blue-200 text-blue-800"}`}
                    >
                      {request.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-800">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          {user.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
