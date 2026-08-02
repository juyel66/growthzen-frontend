

import React from 'react';
import Navbar from '@/components/navbar/Navbar';

const DashboardLayout = ({children}: {children: React.ReactNode}) => { 
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <footer className="w-full py-6 border-t text-center text-xs text-slate-400 bg-white">
                <p>&copy; {new Date().getFullYear()} GrowthZen Trends. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;