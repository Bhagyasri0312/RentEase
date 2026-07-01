import { createContext, useState, useCallback } from "react";

// Create Admin Context
export const AdminContext = createContext();

// Admin Provider Component
export const AdminProvider = ({ children }) => {
  // Dashboard Statistics
  const [stats, setStats] = useState({
    activeRentals: 2453,
    totalRevenue: 4856000,
    inventoryCount: 892,
    pendingMaintenance: 45,
    totalUsers: 1250,
    completedOrders: 3421,
  });

  // Products
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Modern L-Shaped Sofa",
      category: "Furniture",
      monthlyRent: 4999,
      quantity: 12,
      available: 8,
      status: "Active",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    },
    {
      id: "2",
      name: "Smart Refrigerator",
      category: "Electronics",
      monthlyRent: 3999,
      quantity: 5,
      available: 2,
      status: "Active",
      image: "https://images.unsplash.com/photo-1584622281813-8f808d564311",
    },
    {
      id: "3",
      name: "Wooden Dining Table",
      category: "Furniture",
      monthlyRent: 2999,
      quantity: 15,
      available: 10,
      status: "Active",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    },
  ]);

  // Orders
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Doe",
      items: 2,
      totalAmount: 20100,
      status: "Active",
      startDate: "2026-05-01",
      endDate: "2026-08-01",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      items: 1,
      totalAmount: 9999,
      status: "Completed",
      startDate: "2026-04-15",
      endDate: "2026-05-15",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      items: 3,
      totalAmount: 15500,
      status: "Active",
      startDate: "2026-05-10",
      endDate: "2026-08-10",
      paymentStatus: "Pending",
    },
  ]);

  // Rentals
  const [rentals, setRentals] = useState([
    {
      id: "RNT-001",
      product: "Modern Sofa",
      customer: "John Doe",
      rentedDate: "2026-05-01",
      returnDate: "2026-08-01",
      status: "Active",
      dailyRate: 166.67,
      totalAmount: 15000,
    },
    {
      id: "RNT-002",
      product: "Smart Refrigerator",
      customer: "John Doe",
      rentedDate: "2026-05-01",
      returnDate: "2026-08-01",
      status: "Active",
      dailyRate: 133.33,
      totalAmount: 12000,
    },
    {
      id: "RNT-003",
      product: "Wooden Dining Table",
      customer: "Jane Smith",
      rentedDate: "2026-04-15",
      returnDate: "2026-05-15",
      status: "Completed",
      dailyRate: 99.97,
      totalAmount: 2999,
    },
  ]);

  // Maintenance Requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([
    {
      id: "MNT-001",
      product: "Modern Sofa",
      issue: "Loose arm support",
      priority: "High",
      status: "In Progress",
      reportedDate: "2026-05-20",
      assignedTo: "Mike Wilson",
    },
    {
      id: "MNT-002",
      product: "Smart Refrigerator",
      issue: "Temperature fluctuation",
      priority: "Critical",
      status: "Pending",
      reportedDate: "2026-05-21",
      assignedTo: "Unassigned",
    },
    {
      id: "MNT-003",
      product: "Wooden Dining Table",
      issue: "Scratch on surface",
      priority: "Low",
      status: "Completed",
      reportedDate: "2026-05-15",
      assignedTo: "Sarah Davis",
    },
  ]);

  // Users
  const [users, setUsers] = useState([
    {
      id: "USR-001",
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      joinDate: "2026-01-15",
      totalRentals: 5,
      status: "Active",
      tier: "Gold",
    },
    {
      id: "USR-002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "9876543211",
      joinDate: "2026-02-20",
      totalRentals: 3,
      status: "Active",
      tier: "Silver",
    },
    {
      id: "USR-003",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "9876543212",
      joinDate: "2026-03-10",
      totalRentals: 8,
      status: "Active",
      tier: "Gold",
    },
  ]);

  // Product Management
  const addProduct = useCallback((product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now().toString() }]);
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Order Management
  const updateOrderStatus = useCallback((id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  // Maintenance Management
  const updateMaintenanceStatus = useCallback((id, status, assignedTo) => {
    setMaintenanceRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status, assignedTo } : m)),
    );
  }, []);

  // Update Stats
  const updateStats = useCallback((newStats) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  }, []);

  const value = {
    stats,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    rentals,
    maintenanceRequests,
    updateMaintenanceStatus,
    users,
    updateStats,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
