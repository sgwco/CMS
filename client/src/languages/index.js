import en from './en.json';
import vi from './vi.json';

export default function lang(letter, lang) {
  const data = { en, vi };
  return data[lang][letter] || letter;
}