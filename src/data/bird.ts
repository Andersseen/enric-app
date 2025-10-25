export interface BirdItem {
  id: number;
  name: string;
  image: string;
  favorite: boolean;
}
export const BIRDS: BirdItem[] = [
  {
    id: 1,
    name: 'Gorrión común',
    image: 'https://picsum.photos/seed/sparrow/100',
    favorite: false,
  },
  { id: 2, name: 'Paloma', image: 'https://picsum.photos/seed/pigeon/100', favorite: false },
  { id: 3, name: 'Cuervo', image: 'https://picsum.photos/seed/crow/100', favorite: false },
  { id: 4, name: 'Canario', image: 'https://picsum.photos/seed/canary/100', favorite: false },
  { id: 5, name: 'Golondrina', image: 'https://picsum.photos/seed/swallow/100', favorite: false },
  { id: 6, name: 'Petirrojo', image: 'https://picsum.photos/seed/robin/100', favorite: false },
  { id: 7, name: 'Mirlo', image: 'https://picsum.photos/seed/blackbird/100', favorite: false },
  { id: 8, name: 'Vencejo', image: 'https://picsum.photos/seed/swift/100', favorite: false },
  { id: 9, name: 'Halcón', image: 'https://picsum.photos/seed/falcon/100', favorite: false },
  { id: 10, name: 'Águila', image: 'https://picsum.photos/seed/eagle/100', favorite: false },
  { id: 11, name: 'Búho', image: 'https://picsum.photos/seed/owl/100', favorite: false },
  { id: 12, name: 'Lechuza', image: 'https://picsum.photos/seed/barnowl/100', favorite: false },
  { id: 13, name: 'Gaviota', image: 'https://picsum.photos/seed/seagull/100', favorite: false },
  {
    id: 14,
    name: 'Cormorán',
    image: 'https://picsum.photos/seed/cormorant/100',
    favorite: false,
  },
  { id: 15, name: 'Abubilla', image: 'https://picsum.photos/seed/hoopoe/100', favorite: false },
  { id: 16, name: 'Carbonero', image: 'https://picsum.photos/seed/tit/100', favorite: false },
  {
    id: 17,
    name: 'Jilguero',
    image: 'https://picsum.photos/seed/goldfinch/100',
    favorite: false,
  },
  { id: 18, name: 'Cigüeña', image: 'https://picsum.photos/seed/stork/100', favorite: false },
  {
    id: 19,
    name: 'Martín pescador',
    image: 'https://picsum.photos/seed/kingfisher/100',
    favorite: false,
  },
  { id: 20, name: 'Zorzal', image: 'https://picsum.photos/seed/thrush/100', favorite: false },
];
