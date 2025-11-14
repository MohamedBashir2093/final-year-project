import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ProviderDashboard = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <nav>
          <ul>
            <li>
              <NavLink to="services" className={({ isActive }) => isActive ? 'text-blue-500' : ''}>
                My Services
              </NavLink>
            </li>
            <li>
              <NavLink to="bookings" className={({ isActive }) => isActive ? 'text-blue-500' : ''}>
                Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="profile" className={({ isActive }) => isActive ? 'text-blue-500' : ''}>
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default ProviderDashboard;
