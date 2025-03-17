import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
}

const DashboardHeader = ({
  title = "Dashboard Penjualan",
  userName,
  userAvatar,
  userRole,
}: DashboardHeaderProps) => {
  const { user, profile, userRole: authRole, setUserRole, signOut } = useAuth();
  const navigate = useNavigate();

  // Use props if provided, otherwise use auth context
  const displayName = userName || profile?.full_name || user?.email || "User";
  const displayAvatar =
    userAvatar ||
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
  const displayRole = userRole || authRole || "Tamu";

  // Remove the local state and directly use displayRole
  // const [selectedRole, setSelectedRole] = useState(displayRole);

  // Update auth context when role changes
  const handleRoleChange = (role: string) => {
    // setSelectedRole(role);
    setUserRole(role);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  return (
    <header className="w-full h-20 px-6 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari..."
            className="pl-10 h-9 w-full rounded-md"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifikasi</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bantuan</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pengaturan</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-2 py-1 text-sm bg-gray-50 hover:bg-gray-100 flex items-center gap-1"
              >
                <span>Peran: {displayRole}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleRoleChange("Admin")}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("Manajer")}>
                Manajer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("Staf")}>
                Staf
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("Tamu")}>
                Tamu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src={displayAvatar} alt={displayName} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{displayName}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
