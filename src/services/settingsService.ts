// Settings Service - Dynamic API URL Configuration
import { SECURE_API_CONFIG, getEnvironmentConfig } from '../config/security';

class SettingsService {
  private static instance: SettingsService;
  private settings: any = null;
  private initialized = false;

  private constructor() {
    this.initializeSettings();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private async initializeSettings() {
    try {
      // Initialize with environment config
      const envConfig = getEnvironmentConfig();
      this.settings = {
        apiUrl: envConfig.apiUrl,
        adminUrl: envConfig.adminUrl,
        siteUrl: envConfig.frontendUrl
      };
      
      // Mark as initialized
      this.initialized = true;
      console.log('✅ Settings initialized with environment config');
    } catch (error) {
      console.error('❌ Error initializing settings:', error);
      // Use fallback values from SECURE_API_CONFIG
      this.settings = {
        apiUrl: SECURE_API_CONFIG.API_URL,
        adminUrl: SECURE_API_CONFIG.ADMIN_URL,
        siteUrl: SECURE_API_CONFIG.BASE_URL
      };
    }
  }

  /**
   * Initialize settings (public method)
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.initializeSettings();
  }

  /**
   * Get the site URL
   */
  public getSiteUrl(): string {
    if (!this.initialized) {
      console.warn('⚠️ Settings not initialized, using environment config');
      return SECURE_API_CONFIG.BASE_URL;
    }
    return this.settings.siteUrl;
  }

  /**
   * Get the API URL
   */
  public getApiUrl(): string {
    if (!this.initialized) {
      console.warn('⚠️ Settings not initialized, using environment config');
      return SECURE_API_CONFIG.API_URL;
    }
    const currentUrl = this.settings.apiUrl;
    console.log('🌐 Current API URL:', currentUrl);
    return currentUrl;
  }

  /**
   * Get the admin URL
   */
  public getAdminUrl(): string {
    if (!this.initialized) {
      console.warn('⚠️ Settings not initialized, using environment config');
      return SECURE_API_CONFIG.ADMIN_URL;
    }
    return this.settings.adminUrl;
  }

  /**
   * Reset settings to environment defaults
   */
  public resetToDefaults(): void {
    const envConfig = getEnvironmentConfig();
    this.settings = {
      apiUrl: envConfig.apiUrl,
      adminUrl: envConfig.adminUrl,
      siteUrl: envConfig.frontendUrl
    };
    console.log('🔄 Settings reset to environment defaults');
  }

  /**
   * Check if settings are initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}

export default SettingsService;
