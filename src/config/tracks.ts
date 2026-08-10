export type Track = {
  id: string
  title: string
  artist: string
  youtubeId: string
}

const NFAK = 'Nusrat Fateh Ali Khan'

/**
 * Embed-verified playlist only.
 * Almost all OSA Official uploads return YouTube error 150 (embedding disabled).
 * These IDs were confirmed playable via the IFrame API on localhost.
 */
export const tracks: Track[] = [
  { id: 'tumhe-dillagi', title: 'Tumhe Dillagi Bhul Jani Padegi', artist: NFAK, youtubeId: 'AA-pXqosFf4' },
  { id: 'mustt-mustt-live', title: 'Mustt Mustt (Live WOMAD Yokohama 1992)', artist: NFAK, youtubeId: 'SDfELfpumEE' },
  { id: 'sanu-ek-pal', title: 'Sanu Ek Pal Chain', artist: NFAK, youtubeId: '5-vbDkmwymY' },
  { id: 'halka-halka', title: 'Yeh Jo Halka Saroor Hae', artist: NFAK, youtubeId: 'xnuBc2Z7D5M' },
  { id: 'allah-hoo-live', title: 'Allah Hoo (Live 1993)', artist: NFAK, youtubeId: 'cj7roem9NRc' },
  { id: 'haq-ali-womad', title: 'Haq Ali Ali Haq (Live WOMAD Yokohama 1992)', artist: NFAK, youtubeId: '-KhGnR5C-N4' },
  { id: 'shamas-ud-doha', title: 'Shamas-Ud-Doha, Badar-Ud-Doja', artist: NFAK, youtubeId: 'AuModP-b3Gk' },
  { id: 'shahbaaz-qalandar', title: 'Shahbaaz Qalandar', artist: NFAK, youtubeId: '0DG42-OzEW4' },
  { id: 'barsoon-intizar', title: 'Barsoon Kay Intizar Ka', artist: NFAK, youtubeId: 'JV0z73bvCic' },
  { id: 'namy-da-namchey', title: 'Namy Da Namchey (Live WOMAD Yokohama 1992)', artist: NFAK, youtubeId: '2loSUyO93L4' },
  { id: 'mast-nazron-nairobi', title: 'Mast-e-Nazron Se Allah Bachaye (Nairobi 1993)', artist: NFAK, youtubeId: 'U214bbYe42Q' },
  { id: 'kiven-mukhre', title: 'Kiven Mukhre Toon Nazran Hatawan', artist: NFAK, youtubeId: 'itQpNDcF5yU' },
  { id: 'rabb-nu-manava', title: 'Rabb Nu Manava Kis Wailay', artist: NFAK, youtubeId: 'S1Quvwa1dJk' },
  { id: 'tum-ager-yuhin', title: 'Tum Ager Yuhin Nazern Milate Rahe', artist: NFAK, youtubeId: 'gNFueXr7Jaw' },
  { id: 'dam-mast-coke', title: 'Dam Mast Qalandar (Coke Studio)', artist: 'Umair Jaswal & Jabar Abbas', youtubeId: 'Gar-Vw9UzVs' },
  { id: 'mustt-mustt-audio', title: 'Mustt Mustt (Audio)', artist: NFAK, youtubeId: '4RlvDlI0EXo' },
  { id: 'mustt-massive-attack', title: 'Mustt Mustt (Massive Attack Remix)', artist: NFAK, youtubeId: 'i1gEjfBrdf8' },
  { id: 'my-heart-my-life', title: 'My Heart, My Life', artist: `${NFAK} & Michael Brook`, youtubeId: 'ou_KeozfhgQ' },
  { id: 'my-heart-talvin', title: 'My Heart, My Life (Talvin Singh Remix)', artist: `${NFAK} & Michael Brook`, youtubeId: '77ulwIxS83E' },
  { id: 'nothing-without-you', title: 'Nothing Without You', artist: NFAK, youtubeId: 'TaPGOuAmuQk' },
  { id: 'longing', title: 'Longing', artist: `${NFAK} & Michael Brook`, youtubeId: 'qSKb5kD3awM' },
  { id: 'womad-1985', title: 'Live at WOMAD 1985', artist: NFAK, youtubeId: 'AS0uAi2RF6I' },
  { id: 'the-game', title: 'The Game', artist: NFAK, youtubeId: 'VUSSAH5JMl8' },
  { id: 'tracery', title: 'Tracery', artist: NFAK, youtubeId: 'rKj8g-YFtvA' },
  { id: 'fault-lines', title: 'Fault Lines', artist: NFAK, youtubeId: 'IHtq078c0DE' },
  { id: 'tana-dery-na', title: 'Tana Dery Na', artist: NFAK, youtubeId: 'lIU5Cl1dnP4' },
  { id: 'avenue', title: 'Avenue', artist: NFAK, youtubeId: 'ulXQXVZSVu4' },
  { id: 'taa-deem', title: 'Taa Deem', artist: NFAK, youtubeId: 'dYr3GQgIIE8' },
  { id: 'sea-of-vapours', title: 'Sea of Vapours', artist: NFAK, youtubeId: 'XbSdqEni8aM' },
]
