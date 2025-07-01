import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaTshirt, FaPaintBrush, FaFolder, FaImages, FaShoppingBag, FaChartLine } from 'react-icons/fa';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-lg`}>
    <div className="flex items-center">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <div className="text-4xl font-bold">{value}</div>
        <div className="text-lg">{label}</div>
      </div>
    </div>
  </div>
);

const NavLink = ({ to, icon, title, subtitle, color }) => (
  <Link to={to} className={`block bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl shadow-lg p-6`}>
    <div className="flex items-center">
      <div className={`text-3xl p-4 rounded-full mr-5 ${color} text-white`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-xl text-gray-800">{title}</h3>
        <p className="text-gray-500">{subtitle}</p>
      </div>
    </div>
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-10">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>
        <p className="text-xl text-gray-500 mt-2">Welcome back, <span className="font-semibold text-pink-500">{user.name}</span>!</p>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<FaShoppingBag />} label="Total Orders" value="1,234" color="from-blue-400 to-blue-600" />
        <StatCard icon={<FaTshirt />} label="T-shirts" value="56" color="from-green-400 to-green-600" />
        <StatCard icon={<FaPaintBrush />} label="Designs" value="128" color="from-purple-400 to-purple-600" />
        <StatCard icon={<FaChartLine />} label="Revenue" value="₹12,345" color="from-pink-400 to-pink-600" />
      </section>

      {/* Navigation Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Management Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NavLink
            to="/admin/tshirt-upload"
            icon={<FaTshirt />}
            title="Add New T-shirt"
            subtitle="Upload and configure new T-shirt products"
            color="bg-blue-500"
          />
          <NavLink
            to="/admin/design-upload"
            icon={<FaPaintBrush />}
            title="Add New Design"
            subtitle="Upload new designs for customization"
            color="bg-purple-500"
          />
          <NavLink
            to="/admin/manage-tshirts"
            icon={<FaFolder />}
            title="Manage T-shirts"
            subtitle="Edit, view, or delete existing T-shirts"
            color="bg-green-500"
          />
          <NavLink
            to="/admin/manage-designs"
            icon={<FaImages />}
            title="Manage Designs"
            subtitle="Edit, view, or delete existing designs"
            color="bg-yellow-500"
          />
          <NavLink
            to="/admin/manage-designed-tshirts"
            icon={<FaShoppingBag />}
            title="Manage Designed T-shirts"
            subtitle="View and manage community-designed T-shirts"
            color="bg-pink-500"
          />
           <NavLink
            to="/orders"
            icon={<FaShoppingBag />}
            title="View All Orders"
            subtitle="Browse and manage all customer orders"
            color="bg-red-500"
          />
      </div>
      </section>
    </div>
  );
} 