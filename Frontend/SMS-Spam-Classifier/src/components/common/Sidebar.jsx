import React from 'react';
// Assuming you have an icon library like lucide-react or react-icons
import { LayoutGrid, BarChart, Settings, LogOut, History } from 'lucide-react'; 
import { NavLink } from 'react-router-dom';

// Simple data structure for the sidebar links
const SidebarLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "History", href: "/dashboard/history", icon: History },
];

const Sidebar = () => {
    // Tailwind classes for active and inactive links
    const linkClasses = "flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow-md";
    const inactiveClasses = "text-gray-700 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700";

    return (
        // Key Fix: w-64 is set here. top-0 and left-0 ensure it sticks to the corner.
        <div className='w-64 h-full bg-gray-100 dark:bg-gray-800 fixed top-0 left-0 flex flex-col p-4 shadow-xl'>
            
            {/* Logo/Title */}
            <div className="text-2xl font-bold text-blue-600 mb-8 p-3">
                My App
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-2">
                {SidebarLinks.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => 
                            `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;
