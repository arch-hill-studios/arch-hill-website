import React from 'react';
import Image from 'next/image';

const ImgPlaceHolder = () => {
  return (
    <Image
      src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'><rect width='100%' height='100%' fill='%23ddd'/><g stroke='%23999' stroke-width='6' fill='none'><rect x='320' y='180' width='1280' height='720' rx='24' ry='24'/><line x1='400' y1='900' x2='800' y2='300'/><line x1='800' y1='300' x2='1520' y2='900'/><circle cx='1400' cy='300' r='72'/></g></svg>`}
      alt='No image available'
      width={1920}
      height={1080}
      className='mx-auto rounded-lg'
      unoptimized
      priority
    />
  );
};

export default ImgPlaceHolder;
