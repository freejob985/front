import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  
  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.register({ name, email, password, phone });
      toast.success("تم إنشاء الحساب بنجاح!", {
        description: "يرجى تسجيل الدخول الآن",
        duration: 3000,
      });
      nav("/login");
    } catch (error: any) {
      toast.error("فشل إنشاء الحساب", {
        description: error.message || "يرجى التحقق من البيانات المدخلة",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>إنشاء حساب</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <input className="w-full border rounded px-3 py-2" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full border rounded px-3 py-2" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full border rounded px-3 py-2" placeholder="الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="w-full border rounded px-3 py-2" placeholder="كلمة المرور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={loading} className="w-full">{loading ? "جارٍ الإنشاء..." : "إنشاء"}</Button>
            <div className="text-center text-sm text-gray-600">
              لديك حساب؟ <Link to="/login" className="text-primary">تسجيل الدخول</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
