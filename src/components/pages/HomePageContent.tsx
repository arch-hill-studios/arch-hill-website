import React from 'react';
import Hero from '@/components/HomeHero/Hero';
import PageBuilder from '@/components/PageBuilder';
import type { PAGE_QUERY_RESULT } from '@/sanity/types';
import type {
  HOME_PAGE_HERO_QUERY_RESULT,
  HOME_PAGE_SECTIONS_QUERY_RESULT,
  PageBuilderData,
} from '@/actions';

interface HomePageContentProps {
  hero: HOME_PAGE_HERO_QUERY_RESULT | null;
  sections: HOME_PAGE_SECTIONS_QUERY_RESULT | null;
  pageBuilderData: PageBuilderData;
}

const HomePageContent = ({ hero, sections, pageBuilderData }: HomePageContentProps) => {
  if (!hero) {
    return null;
  }

  return (
    <>
      {/* Hero Section */}
      <Hero
        heroStyle={hero.heroStyle}
        heroImages={hero.heroImages}
        heroVideo={hero.heroVideo}
        heroImageTransitionDuration={hero.heroImageTransitionDuration}
        h1Title={hero.h1Title}
        mainTitle={hero.mainTitle}
        subTitle={hero.subTitle}
        heroCallToActionList={hero.heroCallToActionList}
        hideScrollIndicator={hero.hideScrollIndicator}
        heroDefaultContentPosition={hero.heroDefaultContentPosition}
        heroContentPosition={hero.heroContentPosition}
        documentId={hero._id}
        documentType={hero._type}
      />

      {/* Additional Page Builder Content */}
      {sections?.content && (
        <PageBuilder
          content={sections.content as NonNullable<PAGE_QUERY_RESULT>['content']}
          documentId={sections._id}
          documentType={sections._type}
          pageBuilderData={pageBuilderData}
          alignment='center'
        />
      )}
    </>
  );
};

export default HomePageContent;
