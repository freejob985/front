import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search,
  Menu,
  ShoppingCart,
  User,
  Store,
  LogOut,
  LayoutGrid,
  Package,
  ClipboardList,
  MapPin,
  Heart,
  PlusSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CartIcon } from "@/components/CartIcon";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import MobileSearchModal from "@/components/MobileSearchModal";


const Header = () => {
  const { data } = useQuery({ queryKey: ["auth", "me"], queryFn: api.auth.me, retry: false });
  const user = (data as any)?.user;
  const navigate = useNavigate();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // جلب الإعدادات العامة للموقع
  const { data: settingsData } = useQuery({
    queryKey: ['settings', 'general'],
    queryFn: api.settings.general,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const settings = settingsData?.data;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src={settings?.site_logo_url || "/images/logo.png"} 
                alt={settings?.site_name || "إنجب Logo"} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/logo.png";
                }}
              />
            </Link>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-primary font-medium hover:text-primary/80 transition-colors">
                الرئيسية
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
                من نحن
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-primary transition-colors">
                جميع الأقسام
              </Link>
              <Link to="/vendors" className="text-gray-700 hover:text-primary transition-colors">
                الموردون
              </Link>
              <Link to="/offers" className="text-gray-700 hover:text-primary transition-colors">
                العروض اليومية
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">
                اتصل بنا
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar with Autocomplete */}
            <div className="hidden lg:block">
              <SearchAutocomplete 
                placeholder="ابحث عن المنتجات الغذائية..."
                className="min-w-[400px]"
                onSearch={(query) => {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                }}
              />
            </div>
            
            
            {/* Cart Icon with live count */}
            <CartIcon />
            
            {/* User Menu */}
            <UserMenu user={user} />
            
            {/* Mobile Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Modal */}
      <MobileSearchModal 
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </header>
  );
};

const UserMenu = ({ user }: { user?: any }) => {
  try {
    return (
      <div className="flex items-center gap-2">
        <VendorMenu />
        <CustomerMenu user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error in UserMenu:', error);
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <User className="h-4 w-4 ml-2" /> المستخدم
        </Button>
      </div>
    );
  }
};

const VendorMenu = () => {
  const [, setVendor] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if vendor is logged in
    const checkVendorLogin = () => {
      try {
        const vendorProfile = localStorage.getItem('vendor_profile');
        if (vendorProfile) {
          const parsedVendor = JSON.parse(vendorProfile);
          setVendor(parsedVendor);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking vendor login:', error);
        setIsLoggedIn(false);
        setHasError(true);
      }
    };

    checkVendorLogin();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('vendor_profile');
      localStorage.removeItem('vendor_token');
      setIsLoggedIn(false);
      setVendor(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out vendor:', error);
    }
  };

  // If there's an error, return a simple fallback
  if (hasError) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Store className="h-4 w-4 ml-2" /> المورد
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Store className="h-4 w-4 ml-2" /> المورد
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 text-right">
        <DropdownMenuLabel>بوابة المورد</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoggedIn ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/vendor/dashboard"><LayoutGrid className="h-4 w-4 ml-2" /> لوحة التحكم</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/vendor/add-product"><PlusSquare className="h-4 w-4 ml-2" /> إضافة منتج</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/vendor/products"><Package className="h-4 w-4 ml-2" /> منتجاتي</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/vendor/orders"><ClipboardList className="h-4 w-4 ml-2" /> طلبات المورد</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/vendor/reports"><Package className="h-4 w-4 ml-2" /> التقارير</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/vendor/settings"><User className="h-4 w-4 ml-2" /> الإعدادات</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 ml-2" /> تسجيل الخروج
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/vendor/login"><User className="h-4 w-4 ml-2" /> تسجيل دخول المورد</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/vendor/signup"><Store className="h-4 w-4 ml-2" /> انضم كمورد</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CustomerMenu = ({ user }: { user?: any }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm">
          <User className="h-4 w-4 ml-2" /> {user?.name ? user.name : "العميل"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 text-right">
        <DropdownMenuLabel>{user?.name ? `مرحباً، ${user.name}` : "مرحبا بالعميل"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/account"><User className="h-4 w-4 ml-2" /> الملف الشخصي</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account"><ClipboardList className="h-4 w-4 ml-2" /> الطلبات</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account"><MapPin className="h-4 w-4 ml-2" /> العناوين</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account"><Heart className="h-4 w-4 ml-2" /> قائمة الأمنيات</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cart"><ShoppingCart className="h-4 w-4 ml-2" /> السلة</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async (e) => {
                e.preventDefault();
                try { await api.auth.logout(); } finally { window.location.href = "/"; }
              }}
            >
              <LogOut className="h-4 w-4 ml-2" /> تسجيل الخروج
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/login"><User className="h-4 w-4 ml-2" /> تسجيل الدخول</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/register"><User className="h-4 w-4 ml-2" /> إنشاء حساب</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/cart"><ShoppingCart className="h-4 w-4 ml-2" /> السلة</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Header;
