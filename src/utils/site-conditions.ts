import type { SiteCondition } from '@app-types/formats'

export const calculateSiteCondition = (
  leachates: SiteCondition['leachates'],
  odors: SiteCondition['odors'],
  obstruction: SiteCondition['obstruction'],
  fauna: boolean,
  wasteState: SiteCondition['wasteState']
): 'Adecuada' | 'Regular' | 'Crítica' => {
  // Critical Conditions
  if (leachates === 'Abundante' || odors === 'Fuerte' || fauna === true || obstruction === 'Total' || wasteState === 'Acumulación/Mezcla Grave') {
    return 'Crítica'
  }

  // Regular Conditions
  if (leachates === 'Mínimo' || odors === 'Perceptible' || obstruction === 'Parcial' || wasteState === 'Derrames/Mezcla Ligera') {
    return 'Regular'
  }

  // If none of the above, it's Adequate
  return 'Adecuada'
}
