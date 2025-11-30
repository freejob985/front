import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  // Log 404 errors for debugging
  console.log('404 Error: User attempted to access non-existent route:', window.location.pathname);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              الصفحة غير موجودة
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600">
                عذراً، الصفحة التي تبحث عنها غير موجودة
              </p>
              <p className="text-sm text-gray-500">
                تحقق من الرابط أو عد إلى الصفحة الرئيسية
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  الصفحة الرئيسية
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للخلف
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-400">
                كود الخطأ: 404
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;