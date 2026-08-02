export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesGrowthPercentage: number;
  ordersGrowthPercentage: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  salesByMonth: Array<{
    month: string;
    amount: number;
  }>;
}
