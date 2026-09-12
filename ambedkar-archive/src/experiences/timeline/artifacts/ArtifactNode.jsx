import React from 'react';
import ConstitutionFolio from './ConstitutionFolio';
import MahadBasaltStele from './MahadBasaltStele';
import ScholarlyTomePen from './ScholarlyTomePen';
import BronzeMedallion from './BronzeMedallion';
import DhammaWheelLotus from './DhammaWheelLotus';

export default function ArtifactNode({ event, isActive, isHovered }) {
  const year = parseInt(event.year, 10);
  const title = (event.title || '').toLowerCase();
  const category = (event.category || '').toLowerCase();

  // Historical artifact routing based on epoch & significance
  if (year >= 1956 || title.includes('dhamma') || title.includes('nagpur') || title.includes('buddhis')) {
    return <DhammaWheelLotus isActive={isActive} isHovered={isHovered} />;
  }

  if (year >= 1947 || category === 'constitution' || title.includes('constitution') || title.includes('drafting')) {
    return <ConstitutionFolio isActive={isActive} isHovered={isHovered} />;
  }

  if (title.includes('round table') || title.includes('poona') || title.includes('pact') || (year >= 1930 && year <= 1935)) {
    return <BronzeMedallion isActive={isActive} isHovered={isHovered} />;
  }

  if (title.includes('mahad') || title.includes('satyagraha') || title.includes('water') || year === 1927) {
    return <MahadBasaltStele isActive={isActive} isHovered={isHovered} />;
  }

  // Early Scholastic, Columbia, LSE, Matriculation Era (Default for 1891-1926)
  return <ScholarlyTomePen isActive={isActive} isHovered={isHovered} />;
}
