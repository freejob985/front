import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const CheckoutForm = () => {
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [checkoutData, setCheckoutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        delivery_address: '',
        delivery_city: '',
        delivery_governorate: '',
        delivery_phone: '',
        delivery_notes: '',
        delivery_type: 'free',
        payment_method: 'cash',
        notes: ''
    });

    useEffect(() => {
        loadCheckoutData();
    }, []);

    const loadCheckoutData = async () => {
        try {
            setLoading(true);
            setUserLoading(true);
            
            console.log('🔄 Loading checkout data...');
            console.log('🌐 API Base URL:', apiService.baseURL);
            
            // Load user info and addresses
            const [userResponse, checkoutResponse] = await Promise.all([
                apiService.getCurrentUser(),
                apiService.getCheckoutData()
            ]);
            
            console.log('📡 API Responses:', { userResponse, checkoutResponse });

            if (userResponse.user) {
                setUser(userResponse.user);
                setAddresses(userResponse.user.addresses || []);
                
                // Auto-fill form with user data
                setFormData(prev => ({
                    ...prev,
                    name: userResponse.user.name || '',
                    email: userResponse.user.email || '',
                    phone: userResponse.user.phone || '',
                }));

                // Set default address if available
                const defaultAddress = userResponse.user.addresses?.find(addr => addr.is_default);
                if (defaultAddress) {
                    setFormData(prev => ({
                        ...prev,
                        delivery_address: defaultAddress.address,
                        delivery_city: defaultAddress.city,
                        delivery_governorate: defaultAddress.governorate,
                        delivery_phone: defaultAddress.phone,
                    }));
                }
                
                console.log('✅ Customer information loaded and auto-filled:', {
                    name: userResponse.user.name,
                    email: userResponse.user.email,
                    phone: userResponse.user.phone,
                    addressesCount: userResponse.user.addresses?.length || 0
                });
            } else {
                console.log('ℹ️ No user logged in, showing empty form');
            }

            setCheckoutData(checkoutResponse);
        } catch (error) {
            console.error('❌ Error loading checkout data:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // Demo mode - load sample data when backend is not available
            console.log('🔄 Loading demo data...');
            const demoUser = {
                id: 1,
                name: 'أحمد محمد',
                email: 'ahmed@example.com',
                phone: '+96512345678',
                addresses: [
                    {
                        id: 1,
                        title: 'المنزل',
                        address: 'شارع الخليج العربي، قطعة 1، مبنى 15',
                        city: 'مدينة الكويت',
                        governorate: 'الكويت',
                        phone: '+96512345678',
                        is_default: true
                    },
                    {
                        id: 2,
                        title: 'العمل',
                        address: 'شارع أحمد الجابر، برج الكويت',
                        city: 'مدينة الكويت',
                        governorate: 'الكويت',
                        phone: '+96587654321',
                        is_default: false
                    }
                ]
            };
            
            const demoCheckoutData = {
                success: true,
                cart: {
                    items: [
                        {
                            id: 1,
                            name: 'تفاح أحمر',
                            price: 2.500,
                            quantity: 2,
                            total: 5.000,
                            image: '/placeholder.svg',
                            vendor: { id: 1, name: 'متجر الخضار الطازجة' }
                        }
                    ],
                    subtotal: 5.000,
                    delivery_fee: 1.000,
                    tax_amount: 0.750,
                    total: 6.750
                },
                delivery_types: [
                    { value: 'free', label: 'توصيل مجاني', description: 'للطلبات أكثر من 10 د.ك', fee: 0 },
                    { value: 'immediate', label: 'توصيل فوري', description: 'خلال 30 دقيقة', fee: 2 },
                    { value: 'fast', label: 'توصيل سريع', description: 'خلال ساعة', fee: 1 },
                    { value: 'scheduled', label: 'توصيل مجدول', description: 'في الوقت المحدد', fee: 0 }
                ],
                payment_methods: [
                    { value: 'cash', label: 'الدفع عند الاستلام', description: 'ادفع نقداً عند وصول الطلب' },
                    { value: 'card', label: 'بطاقة ائتمان', description: 'ادفع بالبطاقة' },
                    { value: 'knet', label: 'كي نت', description: 'ادفع عبر كي نت' },
                    { value: 'wallet', label: 'المحفظة الإلكترونية', description: 'ادفع من رصيدك' }
                ]
            };
            
            // Auto-fill with demo data
            setUser(demoUser);
            setAddresses(demoUser.addresses);
            setCheckoutData(demoCheckoutData);
            
            setFormData(prev => ({
                ...prev,
                name: demoUser.name,
                email: demoUser.email,
                phone: demoUser.phone,
                delivery_address: demoUser.addresses[0].address,
                delivery_city: demoUser.addresses[0].city,
                delivery_governorate: demoUser.addresses[0].governorate,
                delivery_phone: demoUser.addresses[0].phone,
            }));
            
            console.log('✅ Demo data loaded successfully');
            console.log('📊 Demo user:', demoUser);
            console.log('📊 Demo checkout data:', demoCheckoutData);
            
            // Show demo mode notification
            alert('تم تحميل البيانات التجريبية\n\nملاحظة: تأكد من تشغيل الخادم للبيانات الحقيقية');
        } finally {
            setLoading(false);
            setUserLoading(false);
        }
    };

    const handleAddressSelect = (address) => {
        setFormData(prev => ({
            ...prev,
            delivery_address: address.address,
            delivery_city: address.city,
            delivery_governorate: address.governorate,
            delivery_phone: address.phone,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            console.log('🛒 Submitting checkout with data:', formData);
            const response = await apiService.submitCheckout(formData);
            console.log('📦 Checkout response:', response);
            
            if (response.success) {
                console.log('✅ Checkout successful, orders:', response.orders);
                const orderNumbers = response.orders.map(o => o.order_number).join(',');
                console.log('🔗 Redirecting to order confirmation with orders:', orderNumbers);
                window.location.href = `/order-confirmation?orders=${orderNumbers}`;
            } else {
                console.error('❌ Checkout failed:', response.message);
                alert('فشل في إتمام الطلب: ' + (response.message || 'خطأ غير معروف'));
            }
        } catch (error) {
            console.error('❌ Checkout error:', error);
            
            // Handle 422 error specifically
            if (error.message.includes('422') || error.message.includes('السلة فارغة')) {
                alert('السلة فارغة! يرجى إضافة منتجات للسلة قبل الدفع.\n\nيمكنك:\n1. الذهاب إلى صفحة المنتجات\n2. إضافة منتجات للسلة\n3. العودة لإتمام الدفع');
            } else {
                alert('حدث خطأ في إتمام الطلب: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">جاري تحميل البيانات...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">إتمام الطلب</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">معلومات العميل</h2>
                        {userLoading ? (
                            <div className="flex items-center text-sm text-blue-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                جاري تحميل البيانات...
                            </div>
                        ) : user ? (
                            <div className="flex items-center text-sm text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {user.id === 1 ? 'تم تحميل البيانات التجريبية' : 'تم تحميل البيانات تلقائياً'}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">
                                <a href="/login" className="text-blue-600 hover:underline">تسجيل الدخول</a> لتحميل البيانات تلقائياً
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">الاسم</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">عنوان التوصيل</h2>
                        {addresses.length > 0 && (
                            <div className="flex items-center text-sm text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {addresses.length} عنوان محفوظ
                            </div>
                        )}
                    </div>
                    
                    {/* Saved Addresses */}
                    {addresses.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">العناوين المحفوظة</label>
                            <div className="space-y-2">
                                {addresses.map((address) => (
                                    <button
                                        key={address.id}
                                        type="button"
                                        onClick={() => handleAddressSelect(address)}
                                        className="w-full p-3 text-right border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <div className="font-medium">{address.title}</div>
                                        <div className="text-sm text-gray-600">
                                            {address.address}, {address.city}, {address.governorate}
                                        </div>
                                        {address.is_default && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">افتراضي</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Manual Address Entry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">العنوان التفصيلي</label>
                            <textarea
                                name="delivery_address"
                                value={formData.delivery_address}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">المدينة</label>
                            <input
                                type="text"
                                name="delivery_city"
                                value={formData.delivery_city}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">المحافظة</label>
                            <input
                                type="text"
                                name="delivery_governorate"
                                value={formData.delivery_governorate}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">هاتف التوصيل</label>
                            <input
                                type="tel"
                                name="delivery_phone"
                                value={formData.delivery_phone}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">ملاحظات التوصيل</label>
                            <input
                                type="text"
                                name="delivery_notes"
                                value={formData.delivery_notes}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Type */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">نوع التوصيل</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {checkoutData?.delivery_types?.map((type) => (
                            <label key={type.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="delivery_type"
                                    value={type.value}
                                    checked={formData.delivery_type === type.value}
                                    onChange={handleInputChange}
                                    className="mr-3"
                                />
                                <div>
                                    <div className="font-medium">{type.label}</div>
                                    <div className="text-sm text-gray-600">{type.description}</div>
                                    <div className="text-sm font-medium text-blue-600">
                                        {type.fee > 0 ? `${type.fee} د.ك` : 'مجاني'}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">طريقة الدفع</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {checkoutData?.payment_methods?.map((method) => (
                            <label key={method.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value={method.value}
                                    checked={formData.payment_method === method.value}
                                    onChange={handleInputChange}
                                    className="mr-3"
                                />
                                <div>
                                    <div className="font-medium">{method.label}</div>
                                    <div className="text-sm text-gray-600">{method.description}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                {checkoutData?.cart && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>المجموع الفرعي:</span>
                                <span>{checkoutData.cart.subtotal.toFixed(3)} د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span>رسوم التوصيل:</span>
                                <span>{checkoutData.cart.delivery_fee.toFixed(3)} د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span>الضريبة:</span>
                                <span>{checkoutData.cart.tax_amount.toFixed(3)} د.ك</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>المجموع الكلي:</span>
                                <span>{checkoutData.cart.total.toFixed(3)} د.ك</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'جاري إتمام الطلب...' : 'إتمام الطلب'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;
