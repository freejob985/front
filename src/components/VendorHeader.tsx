import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Settings,
  LogOut
} from "lucide-react";

interface VendorHeaderProps {
  onLogout: () => void;
  title?: string;
  subtitle?: string;
}

export default function VendorHeader({ 
  onLogout, 
  title = "لوحة تحكم المورد",
  subtitle = "مزارع الطيبات"
}: VendorHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Ffed240d3cc2b421da3511c77b247579c%2F117059de60a149a98d347c3289677bd1?format=webp&width=800" 
                alt="Elite1 Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{subtitle}</h1>
              <p className="text-sm text-gray-600">{title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/vendor/settings">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
