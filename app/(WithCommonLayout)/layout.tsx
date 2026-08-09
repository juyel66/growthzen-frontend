

import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import StorefrontFooter from '@/components/footer/StorefrontFooter';

const DashboardLayout = ({children}: {children: React.ReactNode}) => { 
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <StorefrontFooter />
        </div>
    );
};

export default DashboardLayout;
