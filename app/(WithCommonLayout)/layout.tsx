

const DashboardLayout = ({children}: {children: React.ReactNode}) => { 
    return (
        <div>
            <h1>This is navbar</h1>
            {children}
            <h1>This is footer</h1>
            
        </div>
    );
};

export default DashboardLayout;