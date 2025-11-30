import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { staticPagesService, StaticPage } from '@/services/staticPagesService';

const Privacy = () => {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPage = async () => {
      try {
        setLoading(true);
        const response = await staticPagesService.getPrivacyPage();
        
        if (response.success && response.data) {
          setPage(response.data);
        } else {
          setError(response.message || 'حدث خطأ في تحميل الصفحة');
        }
      } catch (err) {
        setError('حدث خطأ في تحميل الصفحة');
        console.error('Error fetching privacy page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="mr-2 text-gray-600">جاري تحميل المحتوى...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <Button asChild className="mt-4">
              <Link to="/">العودة للرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              {page?.title || 'سياسة الخصوصية'}
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              آخر تحديث: {page ? new Date(page.updated_at).toLocaleDateString('ar-KW') : new Date().toLocaleDateString('ar-KW')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            {page?.content ? (
              <div 
                className="space-y-6 text-gray-700"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">لا يوجد محتوى متاح</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
