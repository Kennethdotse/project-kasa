export type Prompt = {
  id: number;
  type: 'text' | 'image';
  english: string;
  swahili: string;
};

export const prompts: Prompt[] = [
  {
    id: 1,
    type: 'text',
    english: 'The sun rises early over the savanna.',
    swahili: 'Jua linachomoza mapema juu ya savanna.',
  },
  {
    id: 2,
    type: 'text',
    english: 'She sells fresh fruit at the local market.',
    swahili: 'Anauza matunda mabichi sokoni.',
  },
  {
    id: 3,
    type: 'text',
    english: 'What is your favorite traditional food?',
    swahili: 'Chakula chako cha jadi unachopenda ni kipi?',
  },
  {
    id: 4,
    type: 'text',
    english: 'Technology is changing our lives every day.',
    swahili: 'Teknolojia inabadilisha maisha yetu kila siku.',
  },
  {
    id: 5,
    type: 'image',
    english: 'Describe everything you see happening in this picture.',
    swahili: 'Eleza kila kitu unachoona kinachotokea kwenye picha hii.',
  },
  {
    id: 6,
    type: 'text',
    english: 'Learning a new language opens up a new world.',
    swahili: 'Kujifunza lugha mpya hufungua ulimwengu mpya.',
  },
  {
    id: 7,
    type: 'text',
    english: 'The children are playing football in the field.',
    swahili: 'Watoto wanacheza mpira wa miguu uwanjani.',
  },
];
