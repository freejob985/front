import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import logger from '@/lib/logger';

const LoggerTest: React.FC = () => {
  const [logs, setLogs] = React.useState<string>('');

  const testErrorLogging = () => {
    try {
      // Simulate an error
      throw new Error('هذا خطأ تجريبي لاختبار نظام التسجيل');
    } catch (error) {
      logger.error('خطأ تجريبي', { testData: 'بيانات تجريبية' }, error as Error);
    }
  };

  const testInfoLogging = () => {
    logger.info('رسالة معلومات تجريبية', { 
      timestamp: new Date().toISOString(),
      testType: 'info'
    });
  };

  const testWarningLogging = () => {
    logger.warn('تحذير تجريبي', { 
      warningType: 'test',
      severity: 'medium'
    });
  };

  const testDebugLogging = () => {
    logger.debug('رسالة تصحيح تجريبية', { 
      debugInfo: 'معلومات تصحيح',
      step: 1
    });
  };

  const loadLogs = () => {
    const currentLogs = logger.getLogs();
    setLogs(currentLogs);
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs('');
  };

  const downloadLogs = () => {
    logger.downloadLogs();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>اختبار نظام تسجيل الأخطاء</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={testErrorLogging} variant="destructive">
              اختبار خطأ
            </Button>
            <Button onClick={testInfoLogging} variant="default">
              اختبار معلومات
            </Button>
            <Button onClick={testWarningLogging} variant="outline">
              اختبار تحذير
            </Button>
            <Button onClick={testDebugLogging} variant="secondary">
              اختبار تصحيح
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={loadLogs} variant="outline">
              تحميل السجلات
            </Button>
            <Button onClick={clearLogs} variant="destructive">
              مسح السجلات
            </Button>
            <Button onClick={downloadLogs} variant="default">
              تحميل كملف
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">السجلات الحالية:</label>
            <Textarea
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              placeholder="السجلات ستظهر هنا..."
              className="min-h-[300px] font-mono text-xs"
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoggerTest;
