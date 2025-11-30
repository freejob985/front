import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Store, User, LogOut, ShoppingCart, LayoutGrid, Package, ClipboardList, MapPin, Heart, PlusSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function HeaderMenus() {
  const { data } = useQuery({ queryKey: ["auth", "me"], queryFn: api.auth.me, retry: false });
  const user = (data as any)?.user;

  return (
    <div className="flex items-center gap-2">
      <VendorMenu />
      <CustomerMenu user={user} />
    </div>
  );
}

function VendorMenu() {
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
        <DropdownMenuItem asChild>
          <Link to="/vendor/login"><User className="h-4 w-4 ml-2" /> تسجيل دخول المورد</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/vendor/signup"><Store className="h-4 w-4 ml-2" /> انضم كمورد</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CustomerMenu({ user }: { user?: any }) {
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
}
