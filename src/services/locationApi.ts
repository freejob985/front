import ApiService from './api';

export interface Governorate {
  id: number;
  name_ar: string;
  name_en: string;
  name?: string; // للتوافق مع الكود القديم
}

export interface City {
  id: number;
  name_ar: string;
  name_en: string;
  name?: string; // للتوافق مع الكود القديم
  governorate_id: number;
}

export interface BusinessCategory {
  id: number;
  name_ar: string;
  name_en: string;
  name?: string; // للتوافق مع الكود القديم
}

class LocationApiService {
  // الحصول على جميع المحافظات
  async getGovernorates(): Promise<Governorate[]> {
    try {
      const response = await ApiService.request({
        url: '/locations/governorates',
        method: 'GET',
      });
      
      // إضافة حقل name للتوافق مع الكود القديم
      const governorates = response.data.map((gov: any) => ({
        ...gov,
        name: gov.name_ar // إضافة حقل name يساوي name_ar للتوافق مع الكود القديم
      }));
      
      return governorates;
    } catch (error) {
      console.error('Error fetching governorates:', error);
      // إرجاع بيانات وهمية في حالة فشل API
      return this.getMockGovernorates();
    }
  }

  // بيانات وهمية للمحافظات
  private getMockGovernorates(): Governorate[] {
    return [
      { id: 1, name_ar: 'محافظة الكويت', name_en: 'Kuwait', name: 'محافظة الكويت' },
      { id: 2, name_ar: 'محافظة الأحمدي', name_en: 'Ahmadi', name: 'محافظة الأحمدي' },
      { id: 3, name_ar: 'محافظة الجهراء', name_en: 'Jahra', name: 'محافظة الجهراء' },
      { id: 4, name_ar: 'محافظة الفروانية', name_en: 'Farwaniya', name: 'محافظة الفروانية' },
      { id: 5, name_ar: 'محافظة حولي', name_en: 'Hawalli', name: 'محافظة حولي' },
      { id: 6, name_ar: 'محافظة مبارك الكبير', name_en: 'Mubarak Al-Kabeer', name: 'محافظة مبارك الكبير' }
    ];
  }

  // الحصول على المدن بناءً على المحافظة
  async getCitiesByGovernorate(governorateId: number): Promise<City[]> {
    try {
      const response = await ApiService.request({
        url: `/locations/cities?governorate_id=${governorateId}`,
        method: 'GET',
      });
      
      // إضافة حقل name للتوافق مع الكود القديم
      const cities = response.data.map((city: any) => ({
        ...city,
        name: city.name_ar // إضافة حقل name يساوي name_ar للتوافق مع الكود القديم
      }));
      
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      // إرجاع بيانات وهمية بناءً على المحافظة
      return this.getMockCitiesByGovernorate(governorateId);
    }
  }

  // بيانات وهمية للمدن بناءً على المحافظة
  private getMockCitiesByGovernorate(governorateId: number): City[] {
    const citiesData: { [key: number]: City[] } = {
      1: [
        { id: 1, name_ar: 'مدينة الكويت', name_en: 'Kuwait City', name: 'مدينة الكويت', governorate_id: 1 },
        { id: 2, name_ar: 'الدسمة', name_en: 'Dasma', name: 'الدسمة', governorate_id: 1 },
        { id: 3, name_ar: 'المنصورية', name_en: 'Mansouriya', name: 'المنصورية', governorate_id: 1 },
        { id: 4, name_ar: 'الشرق', name_en: 'Sharq', name: 'الشرق', governorate_id: 1 },
        { id: 5, name_ar: 'الجابرية', name_en: 'Jabriya', name: 'الجابرية', governorate_id: 1 }
      ],
      2: [
        { id: 6, name_ar: 'الأحمدي', name_en: 'Ahmadi', name: 'الأحمدي', governorate_id: 2 },
        { id: 7, name_ar: 'الوفرة', name_en: 'Al Wafra', name: 'الوفرة', governorate_id: 2 },
        { id: 8, name_ar: 'الزور', name_en: 'Al Zour', name: 'الزور', governorate_id: 2 },
        { id: 9, name_ar: 'المنقف', name_en: 'Mangaf', name: 'المنقف', governorate_id: 2 },
        { id: 10, name_ar: 'الفحيحيل', name_en: 'Fahaheel', name: 'الفحيحيل', governorate_id: 2 }
      ],
      3: [
        { id: 11, name_ar: 'الجهراء', name_en: 'Jahra', name: 'الجهراء', governorate_id: 3 },
        { id: 12, name_ar: 'القصر', name_en: 'Al Qasr', name: 'القصر', governorate_id: 3 },
        { id: 13, name_ar: 'السالمي', name_en: 'Al Salmi', name: 'السالمي', governorate_id: 3 },
        { id: 14, name_ar: 'الواحات', name_en: 'Al Waha', name: 'الواحات', governorate_id: 3 },
        { id: 15, name_ar: 'العديلية', name_en: 'Al Adailiya', name: 'العديلية', governorate_id: 3 }
      ],
      4: [
        { id: 16, name_ar: 'الفروانية', name_en: 'Farwaniya', name: 'الفروانية', governorate_id: 4 },
        { id: 17, name_ar: 'الرابية', name_en: 'Al Rabiya', name: 'الرابية', governorate_id: 4 },
        { id: 18, name_ar: 'العديلية', name_en: 'Al Adailiya', name: 'العديلية', governorate_id: 4 },
        { id: 19, name_ar: 'الخالدية', name_en: 'Khaldiya', name: 'الخالدية', governorate_id: 4 },
        { id: 20, name_ar: 'الرقة', name_en: 'Raqqa', name: 'الرقة', governorate_id: 4 }
      ],
      5: [
        { id: 21, name_ar: 'حولي', name_en: 'Hawalli', name: 'حولي', governorate_id: 5 },
        { id: 22, name_ar: 'الرميثية', name_en: 'Al Rumaythiya', name: 'الرميثية', governorate_id: 5 },
        { id: 23, name_ar: 'البيان', name_en: 'Al Bayan', name: 'البيان', governorate_id: 5 },
        { id: 24, name_ar: 'السالمية', name_en: 'Salmiya', name: 'السالمية', governorate_id: 5 },
        { id: 25, name_ar: 'المنقف', name_en: 'Mangaf', name: 'المنقف', governorate_id: 5 }
      ],
      6: [
        { id: 26, name_ar: 'مبارك الكبير', name_en: 'Mubarak Al-Kabeer', name: 'مبارك الكبير', governorate_id: 6 },
        { id: 27, name_ar: 'القصور', name_en: 'Al Qusour', name: 'القصور', governorate_id: 6 },
        { id: 28, name_ar: 'العدان', name_en: 'Al Adan', name: 'العدان', governorate_id: 6 },
        { id: 29, name_ar: 'المنقف', name_en: 'Mangaf', name: 'المنقف', governorate_id: 6 },
        { id: 30, name_ar: 'الوفرة', name_en: 'Al Wafra', name: 'الوفرة', governorate_id: 6 }
      ]
    };
    return citiesData[governorateId] || [];
  }

  // الحصول على جميع المدن
  async getAllCities(): Promise<City[]> {
    try {
      const response = await ApiService.request({
        url: '/locations/cities',
        method: 'GET',
      });
      
      // إضافة حقل name للتوافق مع الكود القديم
      const cities = response.data.map((city: any) => ({
        ...city,
        name: city.name_ar // إضافة حقل name يساوي name_ar للتوافق مع الكود القديم
      }));
      
      return cities;
    } catch (error) {
      console.error('Error fetching all cities:', error);
      throw error;
    }
  }

  // الحصول على فئات الأعمال
  async getBusinessCategories(): Promise<BusinessCategory[]> {
    try {
      const response = await ApiService.request({
        url: '/business-categories',
        method: 'GET',
      });
      
      // التحقق من وجود البيانات والأسماء
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // إضافة حقل name للتوافق مع الكود القديم
        const categories = response.data.map((category: any) => ({
          ...category,
          name: category.name_ar || category.name // إضافة حقل name يساوي name_ar للتوافق مع الكود القديم
        }));
        
        console.log('API Business categories loaded:', categories);
        return categories;
      } else {
        console.warn('API returned empty business categories, using mock data');
        return this.getMockBusinessCategories();
      }
    } catch (error) {
      console.error('Error fetching business categories:', error);
      console.log('Using mock business categories due to API error');
      // إرجاع بيانات وهمية في حالة فشل API
      return this.getMockBusinessCategories();
    }
  }

  // بيانات وهمية لفئات الأعمال
  private getMockBusinessCategories(): BusinessCategory[] {
    const mockCategories = [
      { id: 1, name_ar: 'الخضروات والفواكه', name_en: 'Vegetables & Fruits', name: 'الخضروات والفواكه' },
      { id: 2, name_ar: 'اللحوم والدواجن', name_en: 'Meat & Poultry', name: 'اللحوم والدواجن' },
      { id: 3, name_ar: 'الأسماك والمأكولات البحرية', name_en: 'Fish & Seafood', name: 'الأسماك والمأكولات البحرية' },
      { id: 4, name_ar: 'الألبان ومنتجاتها', name_en: 'Dairy Products', name: 'الألبان ومنتجاتها' },
      { id: 5, name_ar: 'الحبوب والبقوليات', name_en: 'Grains & Legumes', name: 'الحبوب والبقوليات' },
      { id: 6, name_ar: 'التوابل والأعشاب', name_en: 'Spices & Herbs', name: 'التوابل والأعشاب' },
      { id: 7, name_ar: 'المكسرات والبذور', name_en: 'Nuts & Seeds', name: 'المكسرات والبذور' },
      { id: 8, name_ar: 'المشروبات الطبيعية', name_en: 'Natural Beverages', name: 'المشروبات الطبيعية' },
      { id: 9, name_ar: 'المنتجات العضوية', name_en: 'Organic Products', name: 'المنتجات العضوية' },
      { id: 10, name_ar: 'المنتجات المحلية', name_en: 'Local Products', name: 'المنتجات المحلية' },
      { id: 11, name_ar: 'المنتجات المجمدة', name_en: 'Frozen Products', name: 'المنتجات المجمدة' },
      { id: 12, name_ar: 'المنتجات الطازجة', name_en: 'Fresh Products', name: 'المنتجات الطازجة' }
    ];
    
    console.log('Mock business categories loaded:', mockCategories);
    return mockCategories;
  }
}

export default new LocationApiService();
