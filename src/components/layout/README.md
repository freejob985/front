# Layout System Documentation

## Overview
This layout system provides a unified design structure for all pages in the Front application, ensuring consistency across the entire application.

## Components

### Layout Component
The main layout wrapper that provides the overall page structure.

**Location:** `Front/src/components/layout/Layout.tsx`

**Props:**
- `children`: ReactNode - The page content
- `showHeader`: boolean (default: true) - Whether to show the header
- `showFooter`: boolean (default: true) - Whether to show the footer
- `className`: string - Additional CSS classes

**Usage:**
```tsx
import { Layout } from '@/components/layout';

function MyPage() {
  return (
    <Layout>
      <div>Page content here</div>
    </Layout>
  );
}
```

### Header Component
The main navigation header with logo, menu, search, and user actions.

**Location:** `Front/src/components/layout/Header.tsx`

**Features:**
- Responsive navigation menu
- Search bar
- Shopping cart icon with live count
- User authentication menu
- Vendor portal access
- Mobile-friendly design

### Footer Component
The main footer with company information, links, and contact details.

**Location:** `Front/src/components/layout/Footer.tsx`

**Features:**
- Company information and logo
- Category links
- Quick navigation links
- Contact information
- Social media links
- Legal links (privacy, terms, etc.)

## Shared Components

### PageHeader
A reusable header component for page titles and descriptions.

**Location:** `Front/src/components/shared/PageHeader.tsx`

**Props:**
- `title`: string - Main page title
- `subtitle`: string (optional) - Subtitle text
- `description`: string (optional) - Description text
- `action`: object (optional) - Call-to-action button
- `className`: string (optional) - Additional CSS classes

### Container
A responsive container component with different size options.

**Location:** `Front/src/components/shared/Container.tsx`

**Props:**
- `children`: ReactNode - Content to wrap
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'lg')
- `className`: string (optional) - Additional CSS classes

### Section
A section wrapper with background and padding options.

**Location:** `Front/src/components/shared/Section.tsx`

**Props:**
- `children`: ReactNode - Section content
- `background`: 'white' | 'gray' | 'primary' | 'transparent' (default: 'white')
- `padding`: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
- `containerSize`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'lg')
- `className`: string (optional) - Additional CSS classes

### LoadingSpinner
A loading indicator component.

**Location:** `Front/src/components/shared/LoadingSpinner.tsx`

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `text`: string (optional) - Loading text
- `className`: string (optional) - Additional CSS classes

### EmptyState
A component for displaying empty states.

**Location:** `Front/src/components/shared/EmptyState.tsx`

**Props:**
- `icon`: ReactNode (optional) - Icon to display
- `title`: string - Main title
- `description`: string (optional) - Description text
- `action`: object (optional) - Action button
- `className`: string (optional) - Additional CSS classes

## Usage Examples

### Basic Page Structure
```tsx
import { Layout } from '@/components/layout';
import { PageHeader, Section } from '@/components/shared';

function MyPage() {
  return (
    <Layout>
      <PageHeader 
        title="Page Title"
        subtitle="Page Subtitle"
        description="Page description here"
      />
      <Section>
        <div>Page content</div>
      </Section>
    </Layout>
  );
}
```

### Custom Layout Options
```tsx
import { Layout } from '@/components/layout';

function LoginPage() {
  return (
    <Layout showHeader={false} showFooter={false}>
      <div>Login form content</div>
    </Layout>
  );
}
```

### Using Shared Components
```tsx
import { Container, Section, LoadingSpinner, EmptyState } from '@/components/shared';
import { ShoppingCart } from 'lucide-react';

function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  if (loading) {
    return (
      <Section>
        <LoadingSpinner text="Loading products..." />
      </Section>
    );
  }

  if (products.length === 0) {
    return (
      <Section>
        <EmptyState
          icon={<ShoppingCart className="h-12 w-12" />}
          title="No products found"
          description="Try adjusting your search criteria"
          action={{
            label: "Browse all products",
            onClick: () => navigate('/products')
          }}
        />
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div>Products list here</div>
      </Container>
    </Section>
  );
}
```

## Design Principles

1. **Consistency**: All pages use the same header and footer
2. **Responsiveness**: All components are mobile-first and responsive
3. **Accessibility**: Proper semantic HTML and ARIA attributes
4. **Performance**: Optimized components with minimal re-renders
5. **Maintainability**: Clean, well-documented code structure

## File Structure
```
Front/src/components/
├── layout/
│   ├── Layout.tsx          # Main layout wrapper
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Page footer
│   └── index.ts            # Exports
├── shared/
│   ├── PageHeader.tsx      # Page header component
│   ├── Container.tsx       # Responsive container
│   ├── Section.tsx         # Section wrapper
│   ├── LoadingSpinner.tsx  # Loading indicator
│   ├── EmptyState.tsx      # Empty state component
│   └── index.ts            # Exports
└── ui/                     # Base UI components (existing)
```

## Migration Guide

When updating existing pages to use the new layout system:

1. **Remove embedded headers and footers** from individual pages
2. **Wrap page content** with the Layout component in App.tsx
3. **Use shared components** for consistent styling
4. **Update imports** to use the new component structure

### Before (Old Structure)
```tsx
function MyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div>Page content</div>
      <Footer />
    </div>
  );
}
```

### After (New Structure)
```tsx
// In App.tsx
<Layout>
  <Routes>
    <Route path="/my-page" element={<MyPage />} />
  </Routes>
</Layout>

// In MyPage.tsx
function MyPage() {
  return (
    <div>Page content</div>
  );
}
```

This layout system ensures a consistent, maintainable, and scalable design across the entire Front application.
