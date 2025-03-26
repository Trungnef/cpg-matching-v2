import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "manufacturer" | "brand" | "retailer";

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
  role: UserRole;
  profileComplete: boolean;
  createdAt: string;
  lastLogin: string;
  notifications: number;
  avatar?: string; // URL to avatar image
  image?: string; // Alternative URL to user image
  profilePic?: string; // URL to profile picture
  status: "online" | "away" | "busy"; // User's online status
  // Additional profile information
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  // Role-specific settings based on user role
  manufacturerSettings?: ManufacturerSettings;
  brandSettings?: BrandSettings;
  retailerSettings?: RetailerSettings;
}

interface UserContextType {
  role: UserRole;
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (userData: Omit<UserData, "id" | "profileComplete" | "createdAt" | "lastLogin" | "notifications"> & { password: string }) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateUserProfile: (updatedData: Partial<UserData>) => void;
  updateRoleSettings: <T extends ManufacturerSettings | BrandSettings | RetailerSettings>(settings: Partial<T>) => void;
  updateUserStatus: (status: "online" | "away" | "busy") => void;
  updateUserAvatar: (avatarUrl: string) => void;
  verifyEmail: (email: string, verificationCode: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [role, setRole] = useState<UserRole>("manufacturer");

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setRole(userData.role);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, selectedRole?: UserRole): Promise<void> => {
    // In a real app, this would make an API call to authenticate
    // For now, we'll simulate a successful login
    
    // Use the provided role or default to manufacturer
    const roleToUse = selectedRole || "manufacturer";
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock role-specific settings based on the role
    let roleSpecificSettings = {};
    
    if (roleToUse === "manufacturer") {
      roleSpecificSettings = {
        manufacturerSettings: {
          productionCapacity: 50000,
          certifications: ["ISO 9001", "Organic", "Fair Trade"],
          preferredCategories: ["Food", "Beverage", "Personal Care"],
          minimumOrderValue: 10000
        }
      };
    } else if (roleToUse === "brand") {
      roleSpecificSettings = {
        brandSettings: {
          marketSegments: ["Health-conscious", "Eco-friendly", "Premium"],
          brandValues: ["Sustainability", "Quality", "Innovation"],
          targetDemographics: ["Millennials", "Gen Z", "Health enthusiasts"],
          productCategories: ["Organic Foods", "Wellness", "Eco-friendly products"]
        }
      };
    } else if (roleToUse === "retailer") {
      roleSpecificSettings = {
        retailerSettings: {
          storeLocations: 12,
          averageOrderValue: 75,
          customerBase: ["Urban professionals", "Health-conscious families", "Millennials"],
          preferredCategories: ["Organic", "Local", "Sustainable", "Health food"]
        }
      };
    }
    
    // Create mock user data
    const userData: UserData = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Demo User", // In a real app, this would come from the API
      email,
      companyName: "Demo Company", // In a real app, this would come from the API
      role: roleToUse,
      profileComplete: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      notifications: Math.floor(Math.random() * 10),
      avatar: "", // In a real app, this would come from the API
      status: "online", // In a real app, this would come from the API
      ...roleSpecificSettings
    };
    
    // Save to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Update state
    setUser(userData);
    setRole(roleToUse);
    setIsAuthenticated(true);
  };

  const register = async (userData: Omit<UserData, "id" | "profileComplete" | "createdAt" | "lastLogin" | "notifications"> & { password: string }): Promise<void> => {
    // In a real app, this would make an API call to register the user
    // For now, we'll simulate a successful registration
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create role-specific settings based on the role
    let roleSpecificSettings = {};
    
    if (userData.role === "manufacturer") {
      roleSpecificSettings = {
        manufacturerSettings: {
          productionCapacity: 0,
          certifications: [],
          preferredCategories: [],
          minimumOrderValue: 0
        }
      };
    } else if (userData.role === "brand") {
      roleSpecificSettings = {
        brandSettings: {
          marketSegments: [],
          brandValues: [],
          targetDemographics: [],
          productCategories: []
        }
      };
    } else if (userData.role === "retailer") {
      roleSpecificSettings = {
        retailerSettings: {
          storeLocations: 0,
          averageOrderValue: 0,
          customerBase: [],
          preferredCategories: []
        }
      };
    }
    
    // Create user with random ID and default values
    const newUser: UserData = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      profileComplete: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      notifications: 0,
      avatar: "", // In a real app, this would come from the API
      status: "online", // In a real app, this would come from the API
      ...roleSpecificSettings
    };
    
    // Omit password before storing in state
    const { password, ...userWithoutPassword } = userData;
    
    // Save to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(newUser));
    
    // Update state
    setUser(newUser);
    setRole(newUser.role);
    setIsAuthenticated(true);
  };

  const logout = (): void => {
    // Clear local storage
    localStorage.removeItem("user");
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (newRole: UserRole): void => {
    if (user) {
      // Update user with new role
      const updatedUser = {
        ...user,
        role: newRole
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      setRole(newRole);
    }
  };

  const updateUserProfile = (updatedData: Partial<UserData>): void => {
    if (user) {
      // Update user with new profile data
      const updatedUser = {
        ...user,
        ...updatedData,
        lastLogin: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    }
  };

  const updateRoleSettings = <T extends ManufacturerSettings | BrandSettings | RetailerSettings>(settings: Partial<T>): void => {
    if (user) {
      let updatedUser;
      
      // Update appropriate settings based on role
      if (role === "manufacturer" && user.manufacturerSettings) {
        updatedUser = {
          ...user,
          manufacturerSettings: {
            ...user.manufacturerSettings,
            ...settings
          }
        };
      } else if (role === "brand" && user.brandSettings) {
        updatedUser = {
          ...user,
          brandSettings: {
            ...user.brandSettings,
            ...settings
          }
        };
      } else if (role === "retailer" && user.retailerSettings) {
        updatedUser = {
          ...user,
          retailerSettings: {
            ...user.retailerSettings,
            ...settings
          }
        };
      } else {
        // If settings don't exist yet, create them
        const settingsKey = `${role}Settings` as keyof UserData;
        updatedUser = {
          ...user,
          [settingsKey]: settings
        };
      }
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    }
  };

  const updateUserStatus = (status: "online" | "away" | "busy"): void => {
    if (user) {
      // Update user status
      const updatedUser = {
        ...user,
        status: status
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    }
  };

  const updateUserAvatar = (avatarUrl: string): void => {
    if (user) {
      // Update user avatar
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

  const verifyEmail = async (email: string, verificationCode: string): Promise<void> => {
    // In a real app, this would make an API call to verify the email
    // For now, we'll simulate successful verification
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify hard-coded verification code for demo purposes
    if (verificationCode !== "123456") {
      throw new Error("Invalid verification code");
    }
    
    // If we got here, verification was successful
    // In a real app, we would update the user's email verification status in the backend
    
    if (user) {
      // Update user to mark email as verified
      const updatedUser = {
        ...user,
        emailVerified: true,
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<void> => {
    // In a real app, this would make an API call to resend the verification email
    // For now, we'll simulate a successful resend
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, we would trigger an email sending from the backend
    console.log(`Verification email resent to ${email}`);
    
    // Nothing to update in the state for this operation
  };

  const updateProfile = async (profileData: any): Promise<void> => {
    // In a real app, this would make an API call to update the user's profile
    // For now, we'll simulate a successful profile update
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      // Update user with the new profile data
      const updatedUser = {
        ...user,
        ...profileData,
        profileComplete: true,
        lastUpdated: new Date().toISOString(),
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      // If role was updated, update the role state as well
      if (profileData.role && profileData.role !== user.role) {
        setRole(profileData.role);
      }
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
        verifyEmail,
        resendVerificationEmail,
        updateProfile
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
