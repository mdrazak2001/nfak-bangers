export type Track = {
  id: string
  title: string
  artist: string
  youtubeId: string
}

const NFAK = 'Nusrat Fateh Ali Khan'

/**
 * Curated NFAK playlist — mostly OSA Official live recordings.
 * Swap / reorder freely; playback only reads this array.
 * Dead embeds are auto-skipped at runtime.
 */
export const tracks: Track[] = [
  { id: 'mustt-mustt', title: 'Mustt Mustt', artist: NFAK, youtubeId: 'SDfELfpumEE' },
  { id: 'sanu-ek-pal', title: 'Sanu Ek Pal Chain', artist: NFAK, youtubeId: '5-vbDkmwymY' },
  { id: 'mere-rashke-qamar', title: 'Mere Rashke Qamar', artist: NFAK, youtubeId: 'gY01irEl8Eo' },
  { id: 'tumhe-dillagi', title: 'Tumhe Dillagi', artist: NFAK, youtubeId: 'X0aWquXGXXU' },
  { id: 'halka-halka', title: 'Yeh Jo Halka Halka Suroor Hai', artist: NFAK, youtubeId: '8sZqb13NCFg' },
  { id: 'akhiyan-udeek', title: 'Akhiyan Udeek Dian', artist: NFAK, youtubeId: 'YSMIDIt2Ku4' },
  { id: 'sochta-hoon', title: 'Sochta Hoon Ke Woh Kitne Masoom', artist: NFAK, youtubeId: 'QuNyMxLlVig' },
  { id: 'aankh-uthi', title: 'Aankh Uthi Mohabbat Ne Angrai Li', artist: NFAK, youtubeId: 'BIOgR38G2Zs' },
  { id: 'kinna-sohna', title: 'Kinna Sohna Tenu Rab Ne Banaya', artist: NFAK, youtubeId: 'L5bD5pGhk6E' },
  { id: 'mast-nazron', title: 'Mast Nazron Se Allah Bachaye', artist: NFAK, youtubeId: 'GkejOgSZ8qw' },
  { id: 'shahbaz-qalandar', title: 'Shahbaz Qalandar (Lal Meri Pat)', artist: NFAK, youtubeId: 'xxjKw7HZQEI' },
  { id: 'dam-mast-qalandar', title: 'Dam Mast Qalandar', artist: NFAK, youtubeId: '1YgBXSVTInM' },
  { id: 'nit-khair', title: 'Nit Khair Mangan Sohnia Mein Teri', artist: NFAK, youtubeId: 'f-s4mM9ls8o' },
  { id: 'sanson-ki-mala', title: 'Sanson Ki Mala Pe', artist: NFAK, youtubeId: 'eYSaHXXFIBU' },
  { id: 'allah-hoo', title: 'Allah Hoo', artist: NFAK, youtubeId: 'eeB8pJUxjkY' },
  { id: 'tum-ek-gorakh', title: 'Tum Ek Goorakh Dhanda Ho', artist: NFAK, youtubeId: 'mXY5-TK2sJ0' },
  { id: 'chaap-tilak', title: 'Chaap Tilak Sab Cheen', artist: NFAK, youtubeId: 'f3dnF-GmscM' },
  { id: 'kali-kali-zulfon', title: 'Kali Kali Zulfon Ke Phande Na Dalo', artist: NFAK, youtubeId: 'QPA0HToz3oU' },
  { id: 'mein-jana-jogi', title: 'Mein Jana Jogi De Naal', artist: NFAK, youtubeId: 'TUmFyODAIOs' },
  { id: 'kehna-ghalat', title: 'Kehna Ghalat Ghalat To Chupaana Sehi Sehi', artist: NFAK, youtubeId: 'q89NdfH-P8Q' },
  { id: 'hai-kahan-irada', title: 'Hai Kahan Ka Irada Sanam', artist: NFAK, youtubeId: 'PEP_d2aZOng' },
  { id: 'yadan-vichre', title: 'Yadan Vichre Sajan Diyan Aayan', artist: NFAK, youtubeId: 'Br812W5vA5M' },
  { id: 'husan-walo', title: 'Husan Walo Se Allah Bachaye', artist: NFAK, youtubeId: 'zXdk8uoSFMI' },
  { id: 'dard-rukta', title: 'Dard Rukta Nahin Ek Pal Bhi', artist: NFAK, youtubeId: 'JMiHmSCcUCI' },
  { id: 'aap-baithey', title: 'Aap Baithey Hain Palaki Pe Meri', artist: NFAK, youtubeId: 'YdLr2md26Qs' },
  { id: 'naseeb-mera', title: 'Naseeb Mera Jaga Diya', artist: NFAK, youtubeId: 'Cwy5eO1lhY0' },
  { id: 'pyala-rakh', title: 'Pyala Rakh De Ek Paasey', artist: NFAK, youtubeId: 'kBgl81yuZPs' },
  { id: 'je-toon-akhiyan', title: 'Je Toon Akhiyan De Samne', artist: NFAK, youtubeId: 'mYbQLd0lFww' },
  { id: 'sare-nabian', title: 'Sare Nabian Da Nabi Tu Imam', artist: NFAK, youtubeId: 'q8fsY0EWinw' },
  { id: 'ainwen-bol', title: 'Ainwen Bol Na Banere Utte Kanwan', artist: NFAK, youtubeId: 'bWo7Ue4mCOM' },
  { id: 'kamli-wale', title: 'Kamli Wale Muhammad', artist: NFAK, youtubeId: '6z16WVMnPFM' },
  { id: 'phiroon-dhoondta', title: 'Phiroon Dhoondta Maikadah', artist: NFAK, youtubeId: '_4L6619YdPk' },
  { id: 'ali-maula', title: 'Ali Maula Ali Dam Dam', artist: NFAK, youtubeId: 'lq7f_dpbZdE' },
  { id: 'ali-da-malang', title: 'Ali Da Malang', artist: NFAK, youtubeId: 'yrOMcYczih8' },
  { id: 'diyar-e-ishq', title: 'Diyar-e-Ishq Mein Apna Maqam', artist: NFAK, youtubeId: 'YAYyXicfqxg' },
  { id: 'aj-nazran', title: 'Aj Nazran Naal Pila Saqi', artist: NFAK, youtubeId: 'waLKUdWWy30' },
  { id: 'mere-man-ka-raja', title: 'Mere Man Ka Raja', artist: NFAK, youtubeId: 'GdnmsdB1VK0' },
  { id: 'kiven-mukhre', title: 'Kiven Mukhre Toon Nazran Hatawan', artist: NFAK, youtubeId: 'itQpNDcF5yU' },
  { id: 'saja-maikhana', title: 'Saja Hai Maikhana', artist: NFAK, youtubeId: 'NjfL73JTNmM' },
  { id: 'dulhe-ka-sehra', title: 'Dulhe Ka Sehra', artist: NFAK, youtubeId: '8uUhxTs3UUQ' },
]
