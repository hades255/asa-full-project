import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Sidenav } from "./components/Sidenav";
import { Header } from "./components/Header";
import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import { useGetProfile } from "./api/profilesApis";

const ProtectedRoute = ({ children }) => {
  const { user, loading, setProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { data: profile, isPending } = useGetProfile();

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile]);
  
  if (loading || isPending) {
    return <Loader fullScreen={true} color={"#000"} />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (profile && !profile.isProfileCompleted) {
    return <Navigate to="/new-profile" replace />;
  }

  return (
    <div className="flex flex-1 w-screen h-screen bg-semantic-background-backgroundSecondary overflow-hidden">
      <Sidenav
        open={sidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setOpen={setSidebarOpen}
      />
      <div className="flex flex-col flex-1 w-full h-full">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          setCollapsed={setCollapsed}
        />
        <main className="flex flex-1 w-full h-full p-6 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
