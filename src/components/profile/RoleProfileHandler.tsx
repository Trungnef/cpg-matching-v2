import { useUser } from "@/contexts/UserContext";
import ManufacturerProfile from "./ManufacturerProfile";
import BrandProfile from "./BrandProfile";
import RetailerProfile from "./RetailerProfile";

// This component acts as a bridge between the main Profile page and role-specific components
const RoleProfileHandler = () => {
  const { role } = useUser();

  // Render the appropriate profile component based on user role
  switch(role) {
    case "manufacturer":
      return <ManufacturerProfile />;
    case "brand":
      return <BrandProfile />;
    case "retailer":
      return <RetailerProfile />;
    default:
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Please select a valid role to view your profile.</p>
        </div>
      );
  }
};

export default RoleProfileHandler; 