export type Prompt = {
  id: number;
  type: 'text' | 'image';
  english: string;
  otherLanguage: string;
};

export const prompts: Prompt[] = [
  {
    id: 1,
    type: 'text',
    english: 'The sun rises early over the savanna.',
    otherLanguage: 'Owia no pue ntɛm wɔ savanna no so.',
  },
  {
    id: 2,
    type: 'text',
    english: 'She sells fresh fruit at the local market.',
    otherLanguage: 'Ɔtɔn nnuaba foforo wɔ gua so.',
  },
  {
    id: 3,
    type: 'text',
    english: 'What is your favorite traditional food?',
    otherLanguage: 'Aduane bɛn na wopɛ pa ara?',
  },
  {
    id: 4,
    type: 'text',
    english: 'My friend, charlie, how far?',
    otherLanguage: 'Me nipa, charlie, yɛ sɛn?',
  },
  {
    id: 5,
    type: 'image',
    english: 'Describe everything you see happening in this picture.',
    otherLanguage: 'Kyerɛkyerɛ biribiara a wuhu a ɛrekɔ so wɔ mfonini yi mu mu.',
  },
  {
    id: 6,
    type: 'text',
    english: 'I am going to the market, please. Do you need anything?',
    otherLanguage: 'Merekɔ dwa so, mepa wo kyɛw. Wohia biribi anaa?',
  },
  {
    id: 7,
    type: 'text',
    english: 'The children are playing football in the field.',
    otherLanguage: 'Mmofra no redi bɔɔl wɔ agoropram so.',
  },
  {
    id: 8,
    type: 'text',
    english: 'This fufu is very delicious.',
    otherLanguage: 'Saa fufuo yi yɛ dɛ paa.',
  },
];
