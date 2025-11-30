import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const OrderConfirmation = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrderData();
    }, []);

    const loadOrderData = async () => {
        try {
            setLoading(true);
            
            // Get order numbers from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const orderNumbers = urlParams.get('orders')?.split(',') || [];
            
            if (orderNumbers.length === 0) {
                setError('لم يتم العثور على أرقام الطلبات');
                return;
            }

            // Load all orders
            const orderPromises = orderNumbers.map(orderNumber => 
                apiService.getOrderConfirmation(orderNumber)
            );
            
            const orderResponses = await Promise.all(orderPromises);
            const validOrders = orderResponses
                .filter(response => response.success)
                .map(response => response.order);
            
            setOrders(validOrders);
        } catch (error) {
            console.error('Error loading order data:', error);
            setError('حدث خطأ في تحميل بيانات الطلب');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (orderNumber) => {
        try {
            await apiService.downloadInvoice(orderNumber);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('حدث خطأ في تحميل الفاتورة');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'preparing': 'bg-purple-100 text-purple-800',
            'ready': 'bg-green-100 text-green-800',
            'shipped': 'bg-indigo-100 text-indigo-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">جاري تحميل بيانات الطلب...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">تأكيد الطلب</h1>
            
            {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold">طلب #{order.order_number}</h2>
                            <p className="text-gray-600">تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status_label}
                            </span>
                            <div className="mt-2">
                                <button
                                    onClick={() => handleDownloadInvoice(order.order_number)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    تحميل الفاتورة
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">معلومات العميل</h3>
                            {order.user && (
                                <div className="space-y-2">
                                    <p><span className="font-medium">الاسم:</span> {order.user.name}</p>
                                    <p><span className="font-medium">البريد:</span> {order.user.email}</p>
                                    <p><span className="font-medium">الهاتف:</span> {order.user.phone}</p>
                                    <p><span className="font-medium">مستوى العميل:</span> {order.user.customer_level}</p>
                                </div>
                            )}
                        </div>

                        {/* Vendor Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">معلومات البائع</h3>
                            {order.vendor && (
                                <div className="space-y-2">
                                    <p><span className="font-medium">اسم المتجر:</span> {order.vendor.name}</p>
                                    <p><span className="font-medium">الهاتف:</span> {order.vendor.phone}</p>
                                    <p><span className="font-medium">العنوان:</span> {order.vendor.address}</p>
                                    <p><span className="font-medium">التقييم:</span> {order.vendor.rating}/5</p>
                                </div>
                            )}
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">معلومات التوصيل</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">العنوان:</span> {order.delivery_address}</p>
                                <p><span className="font-medium">المدينة:</span> {order.delivery_city}</p>
                                <p><span className="font-medium">المحافظة:</span> {order.delivery_governorate}</p>
                                <p><span className="font-medium">هاتف التوصيل:</span> {order.delivery_phone}</p>
                                <p><span className="font-medium">نوع التوصيل:</span> {order.delivery_type_label}</p>
                                {order.delivery_notes && (
                                    <p><span className="font-medium">ملاحظات:</span> {order.delivery_notes}</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">معلومات الدفع</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">طريقة الدفع:</span> {order.payment_method}</p>
                                <p><span className="font-medium">حالة الدفع:</span> {order.payment_status_label}</p>
                                {order.payment_reference && (
                                    <p><span className="font-medium">رقم المرجع:</span> {order.payment_reference}</p>
                                )}
                                {order.paid_at && (
                                    <p><span className="font-medium">تاريخ الدفع:</span> {new Date(order.paid_at).toLocaleDateString('ar-SA')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">عناصر الطلب</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-3 text-right">المنتج</th>
                                        <th className="border border-gray-300 p-3 text-center">الكمية</th>
                                        <th className="border border-gray-300 p-3 text-center">السعر</th>
                                        <th className="border border-gray-300 p-3 text-center">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="border border-gray-300 p-3">
                                                <div className="flex items-center">
                                                    {item.product.main_image && (
                                                        <img 
                                                            src={item.product.main_image} 
                                                            alt={item.product.name}
                                                            className="w-12 h-12 object-cover rounded mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{item.product.name}</div>
                                                        {item.notes && (
                                                            <div className="text-sm text-gray-600">{item.notes}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                                            <td className="border border-gray-300 p-3 text-center">{item.price.toFixed(3)} د.ك</td>
                                            <td className="border border-gray-300 p-3 text-center">{item.total.toFixed(3)} د.ك</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">ملخص الطلب</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>المجموع الفرعي:</span>
                                <span>{order.subtotal.toFixed(3)} د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span>رسوم التوصيل:</span>
                                <span>{order.delivery_fee.toFixed(3)} د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span>الضريبة:</span>
                                <span>{order.tax_amount.toFixed(3)} د.ك</span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>الخصم:</span>
                                    <span>-{order.discount_amount.toFixed(3)} د.ك</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold border-t pt-2">
                                <span>المجموع الكلي:</span>
                                <span>{order.total.toFixed(3)} د.ك</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 flex justify-center space-x-4">
                        {order.can_be_cancelled && (
                            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                                إلغاء الطلب
                            </button>
                        )}
                        {order.can_be_rated && (
                            <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700">
                                تقييم الطلب
                            </button>
                        )}
                        <button 
                            onClick={() => handleDownloadInvoice(order.order_number)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            تحميل الفاتورة
                        </button>
                    </div>
                </div>
            ))}

            {/* Continue Shopping */}
            <div className="text-center mt-8">
                <a 
                    href="/categories" 
                    className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700"
                >
                    متابعة التسوق
                </a>
            </div>
        </div>
    );
};

export default OrderConfirmation;

