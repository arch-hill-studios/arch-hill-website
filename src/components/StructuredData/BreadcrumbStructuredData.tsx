import { generateBreadcrumbSchema, generateStructuredDataScript } from '@/lib/structuredData';

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export default function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const breadcrumbSchema = generateBreadcrumbSchema(items);

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={generateStructuredDataScript(breadcrumbSchema)}
    />
  );
}