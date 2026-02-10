import React from 'react';
import type { ServiceList as ServiceListType } from '@/sanity/types';
import ServiceItem from './ServiceItem';

interface ServiceListProps extends Omit<ServiceListType, '_type'> {
  _key?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const ServiceList = ({
  services,
  documentId,
  documentType,
  fieldPathPrefix = '',
}: ServiceListProps) => {
  if (!services || services.length === 0) return null;

  return (
    <div className='flex flex-col gap-20 lg:gap-30'>
      {services.map((service, index) => (
        <ServiceItem
          key={service._key}
          title={service.title}
          description={service.description}
          price={service.price}
          disclaimer={service.disclaimer}
          images={service.images}
          index={index}
          documentId={documentId}
          documentType={documentType}
          fieldPathPrefix={`${fieldPathPrefix}.services[${index}]`}
        />
      ))}
    </div>
  );
};

export default ServiceList;
