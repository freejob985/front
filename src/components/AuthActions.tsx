import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AuthActions() {
  const { data } = useQuery({ queryKey: ["auth", "me"], queryFn: api.auth.me, retry: false });
  const user = (data as any)?.user;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/account">
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 ml-2" />
            حسابي
          </Button>
        </Link>
        <Button
          size="sm"
          onClick={async () => {
            try { await api.auth.logout(); } finally { window.location.href = "/"; }
          }}
        >
          تسجيل الخروج
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 ml-2" />
          تسجيل الدخول
        </Button>
      </Link>
      <Link to="/register">
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          إنشاء حساب
        </Button>
      </Link>
    </div>
  );
}
