import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { userService } from "@/lib/api";

export type UserRole = "manufacturer" | "brand" | "retailer" | "admin";

// Role-specific settings interfaces
interface ManufacturerSettings {
  productionCapacity: number;
  certifications: string[];
  preferredCategories: string[];
  minimumOrderValue: number;
}

interface BrandSettings {
  marketSegments: string[];
  brandValues: string[];
  targetDemographics: string[];
  productCategories: string[];
}

interface RetailerSettings {
  storeLocations: number;
  averageOrderValue: number;
  customerBase: string[];
  preferredCategories: string[];
}

// User profile interface
interface UserData {
  id: string;
  name: string;
  email: string;
  companyName: string;
  phone?: string;
  website?: string;
  address?: string;
  companyDescription?: string;
  role: UserRole;
  profileComplete: boolean;
  createdAt: string;
  lastLogin: string;
  notifications: number;
  avatar?: string; // URL to avatar image
  status: "online" | "away" | "busy"; // User's online status
  // Role-specific settings based on user role
  manufacturerSettings?: ManufacturerSettings;
  brandSettings?: BrandSettings;
  retailerSettings?: RetailerSettings;
  token?: string; // JWT token
}

interface UserContextType {
  role: UserRole;
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: Omit<UserData, "id" | "profileComplete" | "createdAt" | "lastLogin" | "notifications"> & { password: string }) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateUserProfile: (updatedData: Partial<UserData>) => void;
  updateRoleSettings: <T extends ManufacturerSettings | BrandSettings | RetailerSettings>(settings: Partial<T>) => void;
  updateUserStatus: (status: "online" | "away" | "busy") => void;
  updateUserAvatar: (avatarUrl: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [role, setRole] = useState<UserRole>("manufacturer");

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      setUser({...userData, token});
      setRole(userData.role);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, selectedRole: UserRole): Promise<void> => {
    try {
      // Kết nối API thực tế
      const response = await userService.login(email, password);
      
      // Lấy thông tin user và token từ response
      const { token, ...userData } = response;
      
      // Tạo đối tượng user với các thông tin cần thiết
      const user: UserData = {
        ...userData,
        role: userData.role || selectedRole,
        profileComplete: !!userData.companyName,
        createdAt: userData.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        notifications: Math.floor(Math.random() * 10),
        avatar: userData.avatar || "",
        status: "online",
        token
      };
      
      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      // Cập nhật state
      setUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData: Omit<UserData, "id" | "profileComplete" | "createdAt" | "lastLogin" | "notifications"> & { password: string }): Promise<void> => {
    try {
      // Kết nối API thực tế
      const response = await userService.register(userData);
      
      // Lấy thông tin user và token từ response
      const { token, ...registeredUserData } = response;
      
      // Tạo đối tượng user với các thông tin cần thiết
      const user: UserData = {
        ...registeredUserData,
        profileComplete: false,
        createdAt: registeredUserData.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        notifications: 0,
        avatar: registeredUserData.avatar || "",
        status: "online",
        token
      };
      
      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      // Cập nhật state
      setUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = (): void => {
    // Xóa thông tin từ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (newRole: UserRole): void => {
    if (user) {
      // Cập nhật user với role mới
      const updatedUser = {
        ...user,
        role: newRole
      };
      
      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Cập nhật state
      setUser(updatedUser);
      setRole(newRole);
    }
  };

  const updateUserProfile = async (updatedData: Partial<UserData>): Promise<void> => {
    if (user) {
      try {
        // Kết nối API thực tế
        const response = await userService.updateUserProfile(updatedData);
        
        // Cập nhật user với dữ liệu mới
        const updatedUser = {
          ...user,
          ...response,
          lastLogin: new Date().toISOString()
        };
        
        // Lưu vào localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Cập nhật state
        setUser(updatedUser);
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    }
  };

  const updateRoleSettings = <T extends ManufacturerSettings | BrandSettings | RetailerSettings>(settings: Partial<T>): void => {
    if (user) {
      let settingsKey: string;
      
      // Determine which settings key to update based on user role
      if (user.role === "manufacturer") {
        settingsKey = "manufacturerSettings";
      } else if (user.role === "brand") {
        settingsKey = "brandSettings";
      } else if (user.role === "retailer") {
        settingsKey = "retailerSettings";
      } else {
        return; // No valid role
      }
      
      // Update user with new settings
      const updatedUser = {
        ...user,
        [settingsKey]: {
          ...user[settingsKey as keyof UserData],
          ...settings
        }
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    }
  };

  const updateUserStatus = (status: "online" | "away" | "busy"): void => {
    if (user) {
      // Update user with new status
      const updatedUser = {
        ...user,
        status
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    }
  };

  const updateUserAvatar = (avatarUrl: string): void => {
    if (user) {
      // Update user with new avatar
      const updatedUser = {
        ...user,
        avatar: avatarUrl
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        role,
        isAuthenticated,
        user,
        login,
        register,
        logout,
        switchRole,
        updateUserProfile,
        updateRoleSettings,
        updateUserStatus,
        updateUserAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
