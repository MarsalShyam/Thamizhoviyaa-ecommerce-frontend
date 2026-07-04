// frontend/src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiActivity
} from "react-icons/fi";
import LoadingSpinner from "../../components/LoadingSpinner";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/orders/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div className="p-6 text-center text-gray-500">Failed to load dashboard data.</div>;

  const graphData = stats.revenueAnalytics?.graphData || [];
  const maxRevenue = Math.max(...graphData.map(d => d.revenue), 1000);
  const maxOrders = Math.max(...graphData.map(d => d.orders), 5);

  // SVG Chart parameters
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Calculate coordinates for SVG paths
  const points = graphData.map((d, index) => {
    const x = paddingX + (index * chartWidth) / (graphData.length - 1 || 1);
    // Inverse Y because SVG coordinates start from top-left (0,0)
    const y = svgHeight - paddingY - (d.revenue / maxRevenue) * chartHeight;
    return { x, y, day: d.day, revenue: d.revenue, orders: d.orders };
  });

  // Construct SVG Path string for line chart
  const pathString = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  // Construct SVG Path string for filled area under the line
  const areaString = points.length > 0
    ? `${pathString} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Real-time store statistics, sales analytics, and business insights</p>
      </div>

      {/* Real-time Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="/admin/products" className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block">Total Products</span>
            <span className="text-3xl font-bold text-gray-900 block mt-1">{stats.totalProducts}</span>
          </div>
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <FiPackage className="w-6 h-6" />
          </div>
        </a>

        <a href="/admin/orders" className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block">New Orders</span>
            <span className="text-3xl font-bold text-gray-900 block mt-1">{stats.newOrders}</span>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
            <FiShoppingBag className="w-6 h-6" />
          </div>
        </a>

        <a href="/admin/users" className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block">Total Customers</span>
            <span className="text-3xl font-bold text-gray-900 block mt-1">{stats.totalCustomers}</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <FiUsers className="w-6 h-6" />
          </div>
        </a>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block">Total Sales</span>
            <span className="text-3xl font-bold text-gray-900 block mt-1">₹{stats.totalSales.toLocaleString()}</span>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <p className="text-2xl">₹</p>
          </div>
        </div>
      </div>

      {/* Sales Analytics Overview (Today, This Week, This Month) */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiCalendar className="text-primary-600" />
          <span>Sales Analytics</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="pb-4 md:pb-0 md:pr-6">
            <span className="text-sm font-medium text-gray-500 block">Today's Sales</span>
            <span className="text-2xl font-bold text-gray-900 block mt-2">₹{stats.salesAnalytics?.today?.toLocaleString()}</span>
            <div className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
              <FiTrendingUp /> Real-time active sales
            </div>
          </div>
          <div className="py-4 md:py-0 md:px-6">
            <span className="text-sm font-medium text-gray-500 block">This Week's Sales</span>
            <span className="text-2xl font-bold text-gray-900 block mt-2">₹{stats.salesAnalytics?.thisWeek?.toLocaleString()}</span>
            <span className="text-xs text-gray-400 block mt-1">Last 7 days cumulative</span>
          </div>
          <div className="pt-4 md:pt-0 md:pl-6">
            <span className="text-sm font-medium text-gray-500 block">This Month's Sales</span>
            <span className="text-2xl font-bold text-gray-900 block mt-2">₹{stats.salesAnalytics?.thisMonth?.toLocaleString()}</span>
            <span className="text-xs text-gray-400 block mt-1">Last 30 days cumulative</span>
          </div>
        </div>
      </div>

      {/* Revenue Graph & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue SVG Graph (Left 2 Columns) */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiActivity className="text-primary-600" />
                <span>Revenue Analytics (Last 7 Days)</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Daily sales revenue trends</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block">Total Revenue</span>
              <span className="text-lg font-bold text-primary-600">₹{stats.revenueAnalytics?.totalRevenue?.toLocaleString()}</span>
            </div>
          </div>

          {/* Pure SVG Chart with Linear Gradients */}
          <div className="relative w-full h-[220px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + ratio * chartHeight;
                const value = Math.round(maxRevenue - ratio * maxRevenue);
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94a3b8"
                      fontWeight="600"
                    >
                      ₹{value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                    </text>
                  </g>
                );
              })}

              {/* Chart Filled Area */}
              {areaString && (
                <path d={areaString} fill="url(#chartGradient)" />
              )}

              {/* Chart Line */}
              {pathString && (
                <path
                  d={pathString}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Dots on points with tooltips */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    className="hover:r-7 transition-all duration-150"
                  />
                  {/* Small popup text on hover */}
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#334155"
                    fontWeight="700"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white rounded p-1"
                  >
                    ₹{p.revenue}
                  </text>
                  {/* X Axis labels */}
                  <text
                    x={p.x}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                    fontWeight="600"
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Order Trends (Right Column) */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FiTrendingUp className="text-primary-600" />
              <span>Order Trends</span>
            </h3>
            <p className="text-xs text-gray-500 mb-6">Daily order count variations</p>

            {/* List showing daily order count details */}
            <div className="space-y-4">
              {graphData.slice().reverse().map((d, index) => (
                <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 text-primary-600 text-xs font-bold flex items-center justify-center">
                      {d.day}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">Orders placed</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 block">{d.orders}</span>
                    <span className="text-xs text-gray-400 block">₹{d.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
