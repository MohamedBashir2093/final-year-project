import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ProviderDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Provider Dashboard</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="services"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="mr-3">📋</span>
                  My Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="bookings"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="mr-3">📅</span>
                  Bookings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="profile"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="mr-3">👤</span>
                  Profile
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
