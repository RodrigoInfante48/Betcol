export interface TeamData {
  name: string
  flag: string
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  form: string[]
  ranking: number
  group: string
}

export interface WCMatch {
  id: string
  group: string
  phase: 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'tpp' | 'final'
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  matchday: 1 | 2 | 3
}

export interface Player {
  name: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  number: number
  club: string
}

export interface TeamProfile {
  coach: string
  formation: string
  flagImageUrl: string
  crestImageUrl: string
  players: Player[]
}

export const TEAM_PROFILES: Record<string, TeamProfile> = {

  // ── GRUPO A ────────────────────────────────────────────────────────────────

  'México': {
    coach: 'Javier Aguirre',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Mexico.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Federaci%C3%B3n_Mexicana_de_F%C3%BAtbol_logo_(2025).svg',
    players: [
      // Porteros
      { number: 1,  name: 'Raúl Rangel',        position: 'GK', club: 'Guadalajara' },
      { number: 12, name: 'Carlos Acevedo',      position: 'GK', club: 'Santos Laguna' },
      { number: 13, name: 'Guillermo Ochoa',     position: 'GK', club: 'Salernitana' },
      // Defensas
      { number: 2,  name: 'Jorge Sánchez',       position: 'DF', club: 'Mallorca' },
      { number: 3,  name: 'César Montes',        position: 'DF', club: 'Almería' },
      { number: 5,  name: 'Johan Vásquez',       position: 'DF', club: 'Genoa' },
      { number: 6,  name: 'Erik Lira',           position: 'DF', club: 'Cruz Azul' },
      { number: 15, name: 'Israel Reyes',        position: 'DF', club: 'Puebla' },
      { number: 23, name: 'Jesús Gallardo',      position: 'DF', club: 'Pumas UNAM' },
      // Mediocampistas
      { number: 4,  name: 'Edson Álvarez',       position: 'MF', club: 'West Ham United' },
      { number: 7,  name: 'Luis Romo',           position: 'MF', club: 'Cruz Azul' },
      { number: 8,  name: 'Álvaro Fidalgo',      position: 'MF', club: 'Real Betis' },
      { number: 17, name: 'Rodrigo Huescas',     position: 'MF', club: 'Cruz Azul' },
      { number: 18, name: 'Obed Vargas',         position: 'MF', club: 'Atlético de Madrid' },
      { number: 20, name: 'Mateo Chávez',        position: 'MF', club: 'Guadalajara' },
      { number: 24, name: 'Luis Chávez',         position: 'MF', club: 'Pachuca' },
      { number: 26, name: 'Brian Gutiérrez',     position: 'MF', club: 'Chicago Fire' },
      // Delanteros
      { number: 9,  name: 'Raúl Jiménez',        position: 'FW', club: 'Fulham' },
      { number: 10, name: 'Alexis Vega',         position: 'FW', club: 'Guadalajara' },
      { number: 11, name: 'Santiago Giménez',    position: 'FW', club: 'AC Milan' },
      { number: 14, name: 'Armando González',    position: 'FW', club: 'Guadalajara' },
      { number: 16, name: 'Julián Quiñones',     position: 'FW', club: 'Club América' },
      { number: 19, name: 'Gilberto Mora',       position: 'FW', club: 'Club Tijuana' },
      { number: 21, name: 'César Huerta',        position: 'FW', club: 'Pumas UNAM' },
      { number: 22, name: 'Guillermo Martínez',  position: 'FW', club: 'Puebla' },
      { number: 25, name: 'Roberto Alvarado',    position: 'FW', club: 'Guadalajara' },
    ],
  },

  'Sudáfrica': {
    coach: 'Hugo Broos',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Africa.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/South_African_Football_Association_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Ronwen Williams',     position: 'GK', club: 'Mamelodi Sundowns' },
      { number: 13, name: 'Ricardo Goss',        position: 'GK', club: 'TS Galaxy' },
      { number: 16, name: 'Sipho Chaine',        position: 'GK', club: 'Orlando Pirates' },
      // Defensas
      { number: 2,  name: 'Thabang Matuludi',    position: 'DF', club: 'Polokwane City' },
      { number: 3,  name: 'Khulumani Ndamane',   position: 'DF', club: 'Mamelodi Sundowns' },
      { number: 6,  name: 'Aubrey Modiba',       position: 'DF', club: 'Mamelodi Sundowns' },
      { number: 14, name: 'Mbekezeli Mbokazi',   position: 'DF', club: 'Chicago Fire' },
      { number: 18, name: 'Samukele Kabini',     position: 'DF', club: 'Molde FK' },
      { number: 19, name: 'Nkosinathi Sibisi',   position: 'DF', club: 'Orlando Pirates' },
      { number: 20, name: 'Khuliso Mudau',       position: 'DF', club: 'Mamelodi Sundowns' },
      { number: 21, name: 'Ime Okon',            position: 'DF', club: 'Hannover 96' },
      { number: 24, name: 'Olwethu Makhanya',    position: 'DF', club: 'Philadelphia Union' },
      { number: 26, name: 'Bradley Cross',       position: 'DF', club: 'Kaizer Chiefs' },
      // Mediocampistas
      { number: 4,  name: 'Teboho Mokoena',      position: 'MF', club: 'Mamelodi Sundowns' },
      { number: 5,  name: 'Thalente Mbatha',     position: 'MF', club: 'Orlando Pirates' },
      { number: 12, name: 'Thapelo Maseko',      position: 'MF', club: 'AEL Limassol' },
      { number: 22, name: 'Jayden Adams',        position: 'MF', club: 'Mamelodi Sundowns' },
      { number: 23, name: 'Sphephelo Sithole',   position: 'MF', club: 'Tondela' },
      { number: 25, name: 'Kamogelo Sebelebele', position: 'MF', club: 'Orlando Pirates' },
      // Delanteros
      { number: 7,  name: 'Oswin Appollis',      position: 'FW', club: 'Orlando Pirates' },
      { number: 8,  name: 'Tshepang Moremi',     position: 'FW', club: 'Orlando Pirates' },
      { number: 9,  name: 'Lyle Foster',         position: 'FW', club: 'Burnley' },
      { number: 10, name: 'Relebohile Mofokeng', position: 'FW', club: 'Orlando Pirates' },
      { number: 11, name: 'Themba Zwane',        position: 'FW', club: 'Mamelodi Sundowns' },
      { number: 15, name: 'Iqraam Rayners',      position: 'FW', club: 'Mamelodi Sundowns' },
      { number: 17, name: 'Evidence Makgopa',    position: 'FW', club: 'Orlando Pirates' },
    ],
  },

  'Corea del Sur': {
    coach: 'Hong Myung-bo',
    formation: '4-2-3-1',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_South_Korea.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Korea_Football_Association.svg',
    players: [
      // Porteros
      { number: 12, name: 'Song Bum-keun',    position: 'GK', club: 'Jeonbuk Hyundai Motors' },
      { number: 21, name: 'Jo Hyeon-woo',     position: 'GK', club: 'Ulsan HD' },
      { number: 30, name: 'Kim Seung-gyu',    position: 'GK', club: 'FC Tokyo' },
      // Defensas
      { number: 2,  name: 'Lee Han-beom',     position: 'DF', club: 'FC Midtjylland' },
      { number: 4,  name: 'Kim Min-jae',      position: 'DF', club: 'Bayern Munich' },
      { number: 5,  name: 'Kim Tae-hyeon',    position: 'DF', club: 'Kashima Antlers' },
      { number: 13, name: 'Lee Tae-seok',     position: 'DF', club: 'Austria Wien' },
      { number: 14, name: 'Cho Wi-je',        position: 'DF', club: 'Jeonbuk Hyundai Motors' },
      { number: 15, name: 'Kim Moon-hwan',    position: 'DF', club: 'Daejeon Citizen' },
      { number: 16, name: 'Park Jin-seop',    position: 'DF', club: 'Zhejiang FC' },
      { number: 22, name: 'Seol Young-woo',   position: 'DF', club: 'Red Star Belgrade' },
      { number: 23, name: 'Jens Castrop',     position: 'DF', club: 'Borussia Mönchengladbach' },
      // Mediocampistas
      { number: 3,  name: 'Lee Ki-hyeok',     position: 'MF', club: 'Gangwon FC' },
      { number: 6,  name: 'Hwang In-beom',    position: 'MF', club: 'Feyenoord' },
      { number: 8,  name: 'Paik Seung-ho',    position: 'MF', club: 'Birmingham City' },
      { number: 10, name: 'Lee Jae-sung',     position: 'MF', club: 'Mainz 05' },
      { number: 17, name: 'Bae Jun-ho',       position: 'MF', club: 'Stoke City' },
      { number: 19, name: 'Lee Kang-in',      position: 'MF', club: 'Paris Saint-Germain' },
      { number: 24, name: 'Kim Jin-kyu',      position: 'MF', club: 'Jeonbuk Hyundai Motors' },
      { number: 25, name: 'Eom Ji-sung',      position: 'MF', club: 'Swansea City' },
      // Delanteros
      { number: 7,  name: 'Son Heung-min',    position: 'FW', club: 'LAFC' },
      { number: 9,  name: 'Cho Gue-sung',     position: 'FW', club: 'FC Midtjylland' },
      { number: 11, name: 'Hwang Hee-chan',    position: 'FW', club: 'Wolverhampton Wanderers' },
      { number: 18, name: 'Oh Hyeon-gyu',     position: 'FW', club: 'Besiktas' },
      { number: 20, name: 'Yang Hyun-jun',    position: 'FW', club: 'Celtic' },
      { number: 26, name: 'Lee Dong-gyeong',  position: 'FW', club: 'Ulsan HD' },
    ],
  },

  'Chequia': {
    coach: 'Miroslav Koubek',
    formation: '3-4-2-1',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Czech_Republic.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Football_Association_of_Czech_Republic.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Matěj Kovář',       position: 'GK', club: 'PSV Eindhoven' },
      { number: 12, name: 'Ondřej Štanc',      position: 'GK', club: 'Slavia Prague' },
      { number: 23, name: 'Lukáš Horníček',    position: 'GK', club: 'SC Braga' },
      // Defensas
      { number: 2,  name: 'Vladimír Coufal',   position: 'DF', club: 'Hoffenheim' },
      { number: 3,  name: 'Ladislav Krejčí',   position: 'DF', club: 'Wolverhampton Wanderers' },
      { number: 4,  name: 'Robin Hranáč',      position: 'DF', club: 'Hoffenheim' },
      { number: 5,  name: 'Tomáš Holeš',       position: 'DF', club: 'Slavia Prague' },
      { number: 6,  name: 'Štěpán Halovský',   position: 'DF', club: 'Slavia Prague' },
      { number: 13, name: 'David Doudera',      position: 'DF', club: 'Slavia Prague' },
      { number: 14, name: 'David Jurásek',      position: 'DF', club: 'Slavia Prague' },
      { number: 15, name: 'David Zima',         position: 'DF', club: 'Slavia Prague' },
      { number: 16, name: 'Jaroslav Zelený',    position: 'DF', club: 'Sparta Prague' },
      // Mediocampistas
      { number: 7,  name: 'Vladimír Darida',   position: 'MF', club: 'Hradec Králové' },
      { number: 8,  name: 'Tomáš Souček',      position: 'MF', club: 'West Ham United' },
      { number: 10, name: 'Pavel Šulc',        position: 'MF', club: 'Olympique Lyon' },
      { number: 17, name: 'Lukáš Provod',      position: 'MF', club: 'Slavia Prague' },
      { number: 18, name: 'Michal Sadílek',    position: 'MF', club: 'Slavia Prague' },
      { number: 19, name: 'Lukáš Červ',        position: 'MF', club: 'Viktoria Plzeň' },
      { number: 20, name: 'Alexander Sojka',   position: 'MF', club: 'Viktoria Plzeň' },
      { number: 21, name: 'Denis Vácha',       position: 'MF', club: 'Viktoria Plzeň' },
      { number: 22, name: 'Hugo Souček',       position: 'MF', club: 'Sparta Prague' },
      // Delanteros
      { number: 9,  name: 'Patrik Schick',     position: 'FW', club: 'Bayer Leverkusen' },
      { number: 11, name: 'Adam Hložek',       position: 'FW', club: 'Hoffenheim' },
      { number: 24, name: 'Tomáš Horák',       position: 'FW', club: 'Slavia Prague' },
      { number: 25, name: 'Mojmír Chytil',     position: 'FW', club: 'Slavia Prague' },
      { number: 26, name: 'Jan Kuchta',        position: 'FW', club: 'Sparta Prague' },
    ],
  },

  // ── GRUPO B ────────────────────────────────────────────────────────────────

  'Canadá': {
    coach: 'Jesse Marsch',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canada_%28Pantone%29.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Canada_Soccer_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Dayne St. Clair',        position: 'GK', club: 'Inter Miami' },
      { number: 16, name: 'Maxime Crépeau',          position: 'GK', club: 'Orlando City' },
      { number: 18, name: 'Owen Goodman',            position: 'GK', club: 'Barnsley' },
      // Defensas
      { number: 2,  name: 'Alistair Johnston',       position: 'DF', club: 'Celtic' },
      { number: 3,  name: 'Alfie Jones',             position: 'DF', club: 'Middlesbrough' },
      { number: 4,  name: 'Luc de Fougerolles',      position: 'DF', club: 'Dender EH' },
      { number: 5,  name: 'Joel Waterman',           position: 'DF', club: 'Chicago Fire' },
      { number: 13, name: 'Derek Cornelius',         position: 'DF', club: 'Rangers' },
      { number: 15, name: 'Moïse Bombito',           position: 'DF', club: 'Nice' },
      { number: 19, name: 'Alphonso Davies',         position: 'DF', club: 'Bayern Munich' },
      { number: 22, name: 'Richie Laryea',           position: 'DF', club: 'Toronto FC' },
      { number: 23, name: 'Niko Sigur',              position: 'DF', club: 'Hajduk Split' },
      // Mediocampistas
      { number: 6,  name: 'Mathieu Choinière',       position: 'MF', club: 'Los Angeles FC' },
      { number: 7,  name: 'Stephen Eustáquio',       position: 'MF', club: 'Los Angeles FC' },
      { number: 8,  name: 'Ismaël Koné',             position: 'MF', club: 'Sassuolo' },
      { number: 11, name: 'Liam Millar',             position: 'MF', club: 'Hull City' },
      { number: 14, name: 'Jacob Shaffelburg',       position: 'MF', club: 'Los Angeles FC' },
      { number: 17, name: 'Tajon Buchanan',          position: 'MF', club: 'Villarreal' },
      { number: 20, name: 'Ali Ahmed',               position: 'MF', club: 'Norwich City' },
      { number: 21, name: 'Jonathan Osorio',         position: 'MF', club: 'Toronto FC' },
      { number: 25, name: 'Nathan-Dylan Saliba',     position: 'MF', club: 'Anderlecht' },
      { number: 26, name: 'Marcelo Flores',          position: 'MF', club: 'Tigres UANL' },
      // Delanteros
      { number: 9,  name: 'Cyle Larin',             position: 'FW', club: 'Southampton' },
      { number: 10, name: 'Jonathan David',          position: 'FW', club: 'Juventus' },
      { number: 12, name: 'Tani Oluwaseyi',          position: 'FW', club: 'Villarreal' },
      { number: 24, name: 'Promise David',           position: 'FW', club: 'Union Saint-Gilloise' },
    ],
  },

  'Bosnia y Herzegovina': {
    coach: 'Sergej Barbarez',
    formation: '4-2-3-1',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Bosnia_and_Herzegovina.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Football_Association_of_Bosnia_and_Herzegovina_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Nikola Vasilj',           position: 'GK', club: 'FC St. Pauli' },
      { number: 12, name: 'Mladen Jurkas',           position: 'GK', club: 'Borac Banja Luka' },
      { number: 22, name: 'Martin Zlomislić',        position: 'GK', club: 'HNK Rijeka' },
      // Defensas
      { number: 2,  name: 'Nihad Mujakić',           position: 'DF', club: 'Gaziantep FK' },
      { number: 3,  name: 'Dennis Hadžikadunić',     position: 'DF', club: 'UC Sampdoria' },
      { number: 4,  name: 'Tarik Muharemović',       position: 'DF', club: 'US Sassuolo' },
      { number: 5,  name: 'Sead Kolašinac',          position: 'DF', club: 'Atalanta BC' },
      { number: 7,  name: 'Amar Dedić',              position: 'DF', club: 'SL Benfica' },
      { number: 18, name: 'Nikola Katić',            position: 'DF', club: 'Schalke 04' },
      { number: 21, name: 'Stjepan Radeljić',        position: 'DF', club: 'HNK Rijeka' },
      { number: 24, name: 'Nidal Čelić',             position: 'DF', club: 'RC Lens' },
      // Mediocampistas
      { number: 6,  name: 'Benjamin Tahirović',      position: 'MF', club: 'Brøndby IF' },
      { number: 8,  name: 'Armin Gigović',           position: 'MF', club: 'BSC Young Boys' },
      { number: 13, name: 'Ivan Bašić',              position: 'MF', club: 'FC Astana' },
      { number: 14, name: 'Ivan Šunjić',             position: 'MF', club: 'Pafos FC' },
      { number: 15, name: 'Amar Memić',              position: 'MF', club: 'FC Viktoria Plzeň' },
      { number: 16, name: 'Amir Hadžiahmetović',     position: 'MF', club: 'Hull City' },
      { number: 17, name: 'Dženis Burnić',           position: 'MF', club: 'Karlsruher SC' },
      { number: 26, name: 'Ermin Mahmić',            position: 'MF', club: 'FC Slovan Liberec' },
      // Delanteros
      { number: 9,  name: 'Samed Baždar',            position: 'FW', club: 'Jagiellonia Białystok' },
      { number: 10, name: 'Ermedin Demirović',       position: 'FW', club: 'VfB Stuttgart' },
      { number: 11, name: 'Edin Džeko',              position: 'FW', club: 'Schalke 04' },
      { number: 19, name: 'Kerim Alajbegović',       position: 'FW', club: 'RB Salzburg' },
      { number: 20, name: 'Esmir Bajraktarević',     position: 'FW', club: 'PSV Eindhoven' },
      { number: 23, name: 'Haris Tabaković',         position: 'FW', club: 'Borussia Mönchengladbach' },
      { number: 25, name: 'Jovo Lukić',              position: 'FW', club: 'FC Universitatea Cluj' },
    ],
  },

  'Catar': {
    coach: 'Julen Lopetegui',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Qatar.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Qatar_Football_Association.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Mahmoud Abunada',         position: 'GK', club: 'Al-Rayyan SC' },
      { number: 21, name: 'Salah Zakaria',           position: 'GK', club: 'Al-Duhail SC' },
      { number: 22, name: 'Meshaal Barsham',         position: 'GK', club: 'Al-Sadd SC' },
      // Defensas
      { number: 2,  name: 'Pedro Miguel',            position: 'DF', club: 'Al-Sadd SC' },
      { number: 3,  name: 'Lucas Mendes',            position: 'DF', club: 'Al-Wakrah SC' },
      { number: 4,  name: 'Issa Laye',               position: 'DF', club: 'Al-Arabi SC' },
      { number: 13, name: 'Ayoub Al-Alawi',          position: 'DF', club: 'Al-Gharafa SC' },
      { number: 14, name: 'Homam Ahmed',             position: 'DF', club: 'Cultural Leonesa' },
      { number: 16, name: 'Boualem Khoukhi',         position: 'DF', club: 'Al-Sadd SC' },
      { number: 18, name: 'Sultan Al-Brake',         position: 'DF', club: 'Al-Duhail SC' },
      { number: 25, name: 'Al-Hashmi Al-Hussain',    position: 'DF', club: 'Al-Arabi SC' },
      // Mediocampistas
      { number: 5,  name: 'Jassem Gaber',            position: 'MF', club: 'Al-Rayyan SC' },
      { number: 6,  name: 'Abdulaziz Hatem',         position: 'MF', club: 'Al-Rayyan SC' },
      { number: 8,  name: 'Edmilson Junior',         position: 'MF', club: 'Al-Duhail SC' },
      { number: 12, name: 'Karim Boudiaf',           position: 'MF', club: 'Al-Duhail SC' },
      { number: 20, name: 'Ahmed Fathi',             position: 'MF', club: 'Al-Arabi SC' },
      { number: 23, name: 'Assim Madibo',            position: 'MF', club: 'Al-Wakrah SC' },
      { number: 26, name: 'Mohamed Al-Mannai',       position: 'MF', club: 'Al-Shamal SC' },
      // Delanteros
      { number: 7,  name: 'Ahmed Alaa',              position: 'FW', club: 'Al-Rayyan SC' },
      { number: 9,  name: 'Mohammed Muntari',        position: 'FW', club: 'Al-Gharafa SC' },
      { number: 10, name: 'Hassan Al-Haydos',        position: 'FW', club: 'Al-Sadd SC' },
      { number: 11, name: 'Akram Afif',              position: 'FW', club: 'Al-Sadd SC' },
      { number: 15, name: 'Yusuf Abdurisag',         position: 'FW', club: 'Al-Wakrah SC' },
      { number: 17, name: 'Ahmed Al-Ganehi',         position: 'FW', club: 'Al-Gharafa SC' },
      { number: 19, name: 'Almoez Ali',              position: 'FW', club: 'Al-Duhail SC' },
      { number: 24, name: 'Tahsin Mohammed',         position: 'FW', club: 'Al-Duhail SC' },
    ],
  },

  'Suiza': {
    coach: 'Murat Yakin',
    formation: '4-4-2',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Switzerland.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Swiss_Football_Association.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Gregor Kobel',            position: 'GK', club: 'Borussia Dortmund' },
      { number: 12, name: 'Yvon Mvogo',              position: 'GK', club: 'Lorient' },
      { number: 21, name: 'Marvin Keller',           position: 'GK', club: 'BSC Young Boys' },
      // Defensas
      { number: 2,  name: 'Silvan Widmer',           position: 'DF', club: 'Mainz 05' },
      { number: 3,  name: 'Nico Elvedi',             position: 'DF', club: 'Borussia Mönchengladbach' },
      { number: 4,  name: 'Manuel Akanji',           position: 'DF', club: 'Inter Milan' },
      { number: 5,  name: 'Miro Muheim',             position: 'DF', club: 'Hamburger SV' },
      { number: 13, name: 'Ricardo Rodríguez',       position: 'DF', club: 'Real Betis' },
      { number: 18, name: 'Eray Cömert',             position: 'DF', club: 'Valencia CF' },
      { number: 24, name: 'Aurèle Amenda',           position: 'DF', club: 'Eintracht Frankfurt' },
      { number: 25, name: 'Luca Jaquez',             position: 'DF', club: 'VfB Stuttgart' },
      // Mediocampistas
      { number: 6,  name: 'Denis Zakaria',           position: 'MF', club: 'AS Monaco' },
      { number: 8,  name: 'Remo Freuler',            position: 'MF', club: 'Bologna FC' },
      { number: 10, name: 'Granit Xhaka',            position: 'MF', club: 'Sunderland AFC' },
      { number: 14, name: 'Ardon Jashari',           position: 'MF', club: 'AC Milan' },
      { number: 15, name: 'Djibril Sow',             position: 'MF', club: 'FC Sevilla' },
      { number: 17, name: 'Rubén Vargas',            position: 'MF', club: 'FC Sevilla' },
      { number: 20, name: 'Michel Aebischer',        position: 'MF', club: 'AC Pisa' },
      { number: 22, name: 'Fabian Rieder',           position: 'MF', club: 'FC Augsburg' },
      // Delanteros
      { number: 7,  name: 'Breel Embolo',            position: 'FW', club: 'Stade Rennais' },
      { number: 9,  name: 'Johan Manzambi',          position: 'FW', club: 'SC Freiburg' },
      { number: 11, name: 'Dan Ndoye',               position: 'FW', club: 'Nottingham Forest' },
      { number: 16, name: 'Christian Fassnacht',     position: 'FW', club: 'BSC Young Boys' },
      { number: 19, name: 'Noah Okafor',             position: 'FW', club: 'Leeds United' },
      { number: 23, name: 'Zeki Amdouni',            position: 'FW', club: 'Burnley FC' },
      { number: 26, name: 'Cédric Itten',            position: 'FW', club: 'Fortuna Düsseldorf' },
    ],
  },
}

export const TEAMS: Record<string, TeamData> = {
  // ── GRUPO A ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-A.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'México': {
    name: 'México', flag: '🇲🇽',
    // CNL 2023-24 (QF+SF+Final) · Copa América 2024 · CNL 2024-25 (QF+SF+Final)
    wins: 6, draws: 1, losses: 3, goalsFor: 14, goalsAgainst: 6,
    form: ['W','W','L','W','L','D','L','W','W','W'],
    ranking: 15, group: 'A',
  },
  'Sudáfrica': {
    name: 'Sudáfrica', flag: '🇿🇦',
    // CAF WCQ 2026 Grupo C (últimos 6) · AFCON 2025 (grupo+R16) — 2 partidos estimados
    wins: 5, draws: 2, losses: 3, goalsFor: 15, goalsAgainst: 12,
    form: ['D','W','L','D','W','W','W','W','L','L'],
    ranking: 60, group: 'A',
  },
  'Corea del Sur': {
    name: 'Corea del Sur', flag: '🇰🇷',
    // AFC WCQ 2026 Tercera Ronda Grupo B — 10 partidos, invictos (único equipo de Asia)
    wins: 6, draws: 4, losses: 0, goalsFor: 20, goalsAgainst: 7,
    form: ['W','W','W','D','W','D','D','D','W','W'],
    ranking: 25, group: 'A',
  },
  'Chequia': {
    name: 'Chequia', flag: '🇨🇿',
    // UEFA WCQ 2026 Grupo C (8 partidos) · Playoffs vs Irlanda + Dinamarca (penales)
    wins: 7, draws: 1, losses: 2, goalsFor: 22, goalsAgainst: 12,
    form: ['W','W','W','L','W','D','L','W','W','W'],
    ranking: 41, group: 'A',
  },

  // ── GRUPO B ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-B.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'Canadá': {
    name: 'Canadá', flag: '🇨🇦',
    // Copa América 2024 (SF+3er puesto) · CNL 2024-25 (QF+Final Four) · Gold Cup 2025 (GS+QF)
    wins: 5, draws: 1, losses: 4, goalsFor: 18, goalsAgainst: 9,
    form: ['L','L','W','W','L','W','W','D','W','L'],
    ranking: 30, group: 'B',
  },
  'Bosnia y Herzegovina': {
    name: 'Bosnia y Herzegovina', flag: '🇧🇦',
    // WC 2026 Qual UEFA (8 partidos de grupo) · Playoffs vs Gales (4-2 pens) y vs Italia (4-1 pens)
    wins: 6, draws: 2, losses: 2, goalsFor: 21, goalsAgainst: 11,
    form: ['W','L','W','L','D','W','W','D','W','W'],
    ranking: 65, group: 'B',
  },
  'Catar': {
    name: 'Catar', flag: '🇶🇦',
    // AFC WC Qual 3rd Round (últimos 5) · 4th Round (clasificación vs EAU) · FIFA Arab Cup 2025 (GS)
    wins: 4, draws: 2, losses: 4, goalsFor: 13, goalsAgainst: 15,
    form: ['W','W','L','W','L','D','W','L','D','L'],
    ranking: 55, group: 'B',
  },
  'Suiza': {
    name: 'Suiza', flag: '🇨🇭',
    // UEFA Nations League A4 2024-25 (últimos 4 partidos) · WC 2026 Qual UEFA (6 partidos, clasificados directos)
    wins: 4, draws: 4, losses: 2, goalsFor: 19, goalsAgainst: 10,
    form: ['L','D','D','L','W','W','W','D','W','D'],
    ranking: 19, group: 'B',
  },

  // ── GRUPO C ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-C.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'Brasil': {
    name: 'Brasil', flag: '🇧🇷',
    // CONMEBOL WCQ 2026 MD9-18 (Oct 2024 – Sep 2025)
    wins: 5, draws: 3, losses: 2, goalsFor: 15, goalsAgainst: 9,
    form: ['W','W','D','D','W','L','D','W','W','L'],
    ranking: 6, group: 'C',
  },
  'Marruecos': {
    name: 'Marruecos', flag: '🇲🇦',
    // CAF WCQ 2026 Grupo E (últimos 3, ganó 6/6) · AFCON 2025 (7 partidos, campeón)
    wins: 9, draws: 1, losses: 0, goalsFor: 25, goalsAgainst: 1,
    form: ['W','W','W','W','D','W','W','W','W','W'],
    ranking: 8, group: 'C',
  },
  'Escocia': {
    name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    // UEFA NL 2024-25 Liga A Grupo 1 (4 partidos) · UEFA WCQ 2026 Grupo C (6 partidos)
    wins: 6, draws: 2, losses: 2, goalsFor: 17, goalsAgainst: 10,
    form: ['L','D','W','W','D','W','W','W','L','W'],
    ranking: 43, group: 'C',
  },
  'Haití': {
    name: 'Haití', flag: '🇭🇹',
    // CNL 2024-25 Liga B (4 partidos) · CONCACAF WCQ 2026 3ra Ronda Grupo C (6 partidos)
    wins: 7, draws: 2, losses: 1, goalsFor: 28, goalsAgainst: 10,
    form: ['W','W','W','W','W','D','D','L','W','W'],
    ranking: 83, group: 'C',
  },

  // ── GRUPO D ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-D.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'Estados Unidos': {
    name: 'Estados Unidos', flag: '🇺🇸',
    // Gold Cup 2025 Final · Amistosos Sep-Nov 2025 · Amistosos Mar-May 2026 · Co-anfitrión sin clasificatoria
    wins: 5, draws: 1, losses: 4, goalsFor: 17, goalsAgainst: 15,
    form: ['L','L','W','D','W','W','W','L','L','W'],
    ranking: 16, group: 'D',
  },
  'Paraguay': {
    name: 'Paraguay', flag: '🇵🇾',
    // CONMEBOL WCQ 2026 F12-F18 (Nov 2024 – Sep 2025) · Amistosos Nov 2025 – Mar 2026
    wins: 4, draws: 3, losses: 3, goalsFor: 11, goalsAgainst: 9,
    form: ['D','W','D','W','L','D','W','L','L','W'],
    ranking: 40, group: 'D',
  },
  'Australia': {
    name: 'Australia', flag: '🇦🇺',
    // AFC WCQ 3ª Ronda Grupo C (Nov 2024 – Jun 2025) · Amistosos Sep-Oct 2025 · FIFA Series 2026 (Mar 2026)
    wins: 8, draws: 1, losses: 1, goalsFor: 20, goalsAgainst: 5,
    form: ['D','W','W','W','W','W','W','L','W','W'],
    ranking: 27, group: 'D',
  },
  'Turquía': {
    name: 'Turquía', flag: '🇹🇷',
    // UEFA WCQ 2026 Grupo (Sep-Nov 2025) · Playoffs Path C: Rumanía + Kosovo (Mar 2026) · Amistoso Jun 2026
    wins: 8, draws: 1, losses: 1, goalsFor: 25, goalsAgainst: 13,
    form: ['W','W','L','W','W','W','D','W','W','W'],
    ranking: 22, group: 'D',
  },

  // ── GRUPO E ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-E.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'Alemania': {
    name: 'Alemania', flag: '🇩🇪',
    // UEFA Nations League 2024-25 (QF 2 legs + SF + 3P) · UEFA WCQ 2026 Grupo A (6 partidos sep-nov 2025)
    // Partido más reciente: Alemania 6-0 Eslovaquia (17 nov 2025, WCQ)
    wins: 6, draws: 1, losses: 3, goalsFor: 22, goalsAgainst: 11,
    form: ['W','D','L','L','L','W','W','W','W','W'],
    ranking: 10, group: 'E',
  },
  'Curazao': {
    name: 'Curazao', flag: '🇨🇼',
    // CONCACAF WCQ 2026 2a Ronda Grupo C (4 partidos, jun 2025) · Final Round Grupo B (6 partidos, sep-nov 2025)
    // Invicto en clasificatoria · Partido más reciente: Jamaica 0-0 Curaçao (nov 2025)
    wins: 7, draws: 3, losses: 0, goalsFor: 28, goalsAgainst: 5,
    form: ['W','W','W','W','D','W','W','D','W','D'],
    ranking: 82, group: 'E',
  },
  'Costa de Marfil': {
    name: 'Costa de Marfil', flag: '🇨🇮',
    // CAF WCQ 2026 Grupo F MD6-MD10 (jun 2024 – oct 2025, 0 goles en contra) · AFCON 2025 (dic 2025 – ene 2026, eliminada QF)
    // Partido más reciente: Egipto 3-2 Costa de Marfil (10 ene 2026, AFCON QF)
    wins: 8, draws: 1, losses: 1, goalsFor: 20, goalsAgainst: 6,
    form: ['W','W','W','W','W','W','D','W','W','L'],
    ranking: 34, group: 'E',
  },
  'Ecuador': {
    name: 'Ecuador', flag: '🇪🇨',
    // CONMEBOL WCQ 2026 MD9-MD18 (oct 2024 – sep 2025) · Clasificó 2do con 29 pts
    // Partido más reciente: Ecuador 1-0 Argentina (14 sep 2025, WCQ MD18)
    wins: 4, draws: 6, losses: 0, goalsFor: 8, goalsAgainst: 1,
    form: ['D','D','W','W','W','D','D','D','D','W'],
    ranking: 23, group: 'E',
  },

  // Grupo F
  // Países Bajos: Clasificó 1º Grupo G UEFA (6V 2E 0D, 27GF 4GC). Friendly reciente: 0-1 vs Argelia (Jun 3)
  // Partido más reciente: 0-1 vs Argelia (Jun 3, 2026). Fuentes: ESPN, UEFA.com, FIFA.com
  'Países Bajos': { name: 'Países Bajos', flag: '🇳🇱', wins: 6, draws: 3, losses: 1, goalsFor: 28, goalsAgainst: 7, form: ['W','D','W','W','W','D','W','W','D','L'], ranking: 7, group: 'F' },
  // Japón: Clasificó 1º Grupo C AFC (30GF en 10 partidos). Amistosos: venció a Brasil, Escocia, Inglaterra, Islandia
  // Partido más reciente: 1-0 vs Islandia (May 31, 2026). Fuentes: ESPN, Al Jazeera, Japan Times
  'Japón': { name: 'Japón', flag: '🇯🇵', wins: 7, draws: 1, losses: 2, goalsFor: 19, goalsAgainst: 7, form: ['L','W','L','D','W','W','W','W','W','W'], ranking: 18, group: 'F' },
  // Suecia: Calificó vía Playoff Senda B UEFA (3-1 vs Ucrania, 3-2 vs Polonia). Grupo malo: 2E 4D en fase regular
  // Partido más reciente: 3-2 vs Polonia (Mar 31, 2026). Fuentes: ESPN, UEFA.com, Sofascore
  'Suecia': { name: 'Suecia', flag: '🇸🇪', wins: 4, draws: 2, losses: 4, goalsFor: 16, goalsAgainst: 18, form: ['W','W','D','L','L','L','L','D','W','W'], ranking: 38, group: 'F' },
  // Túnez: Copa Árabe 2025 + AFCON 2025 (eliminado en octavos por Malí en penales). Ranking FIFA 44
  // Partido más reciente: 0-1 vs Austria (Jun 1, 2026). Fuentes: ESPN, CAFonline, Al Jazeera
  'Túnez': { name: 'Túnez', flag: '🇹🇳', wins: 3, draws: 3, losses: 4, goalsFor: 13, goalsAgainst: 10, form: ['L','D','W','W','L','D','L','W','D','L'], ranking: 44, group: 'F' },

  // Grupo G
  // Bélgica: NL 2024/25 (QF vs Ucrania) + Clasificación WC UEFA Grupo J (ganador). Ranking FIFA abr-2026.
  // Partidos Jun/Sep 2025 estimados; 5 confirmados (Oct-Nov 2025 + NL playoff). Fuente: UEFA.com, ESPN
  'Bélgica': { name: 'Bélgica', flag: '🇧🇪', wins: 7, draws: 2, losses: 1, goalsFor: 29, goalsAgainst: 9, form: ['L','W','W','W','W','W','D','W','D','W'], ranking: 9, group: 'G' },
  // Irán: AFC 3ª ronda Grupo A (7V-2E-1D, ganador, 23 pts). Taremi 10 goles en clasificatoria. Ranking FIFA abr-2026.
  // 3 partidos confirmados (mar/jun 2025); 7 estimados basados en récord oficial 7V-2E-1D. Fuente: ESPN, FIFA.com
  'Irán': { name: 'Irán', flag: '🇮🇷', wins: 7, draws: 2, losses: 1, goalsFor: 22, goalsAgainst: 4, form: ['W','W','W','W','W','D','W','D','L','W'], ranking: 21, group: 'G' },
  // Nueva Zelanda: OFC clasificación invicta (19 GF / 1 GC en 6 partidos oficiales). Amistosos Mar 2026 confirmados.
  // Rondas 1-2 OFC scores estimados; Ronda 3 SF+Final confirmados. Fuente: FIFA.com, NZFootball.co.nz
  'Nueva Zelanda': { name: 'Nueva Zelanda', flag: '🇳🇿', wins: 7, draws: 0, losses: 3, goalsFor: 25, goalsAgainst: 9, form: ['W','W','W','W','W','W','L','L','L','W'], ranking: 85, group: 'G' },
  // Egipto: 4º AFCON 2025 + Copa Árabe 2025 + Clasif. AFCON 2027 (jun-2026). Ranking FIFA abr-2026.
  // 8 partidos confirmados (AFCON + Copa Árabe); 2 jun-2026 con scores estimados. Fuente: olympics.com, ESPN
  'Egipto': { name: 'Egipto', flag: '🇪🇬', wins: 5, draws: 2, losses: 3, goalsFor: 12, goalsAgainst: 9, form: ['L','W','W','D','W','W','L','L','W','D'], ranking: 37, group: 'G' },

  // Grupo H — investigado 2026-06-04
  'España': {
    name: 'España',
    flag: '🇪🇸',
    // Competiciones: NL 2024-25 (QF vs Países Bajos, SF España 5-4 Francia, Final L pens vs Portugal) + WC Qualifiers UEFA Sep-Nov 2025
    // Partido más reciente: 17/11/2025 España 4-0 Georgia (WC Qual confirmado)
    // Fuente: UEFA.com, ESPN
    wins: 6,
    draws: 3,
    losses: 1,
    goalsFor: 25,
    goalsAgainst: 14,
    form: ['D','W','W','L','W','W','W','D','D','W'],
    ranking: 2,
    group: 'H',
  },
  'Cabo Verde': {
    name: 'Cabo Verde',
    flag: '🇨🇻',
    // Competiciones: WC Qualifiers CAF Ronda 3 Grupo D (Camerún W 1-0, Libia D 3-3, Esuatini W 3-0) + amistosos (Serbia W 3-0, Chile L 2-4, Finlandia D, Irán D, Egipto D, etc.)
    // Partido más reciente: 31/05/2026 Cabo Verde 3-0 Serbia (amistoso)
    // Fuente: beIN Sports, Al Jazeera, FIFA.com, Outlook India
    wins: 4,
    draws: 5,
    losses: 1,
    goalsFor: 17,
    goalsAgainst: 10,
    form: ['D','W','W','D','W','D','D','L','D','W'],
    ranking: 69,
    group: 'H',
  },
  'Arabia Saudita': {
    name: 'Arabia Saudita',
    flag: '🇸🇦',
    // Competiciones: AFC WC Qualifiers 3ª Ronda Grupo C (Indonesia D, China W×2, Japón D, Baréin W, Australia L) + 4ª Ronda Grupo B (Indonesia W 3-2, Irak D 0-0)
    // Partido más reciente: 14/10/2025 Arabia Saudita 0-0 Irak (AFC 4ª Ronda, clasificó por dif. goles)
    // Fuente: Al Jazeera, beIN Sports, NBC Sports, FIFA.com
    wins: 4,
    draws: 2,
    losses: 4,
    goalsFor: 10,
    goalsAgainst: 12,
    form: ['D','W','W','L','W','D','L','L','W','D'],
    ranking: 61,
    group: 'H',
  },
  'Uruguay': {
    name: 'Uruguay',
    flag: '🇺🇾',
    // Competiciones: CONMEBOL WC Qualifiers MD15-18 (Paraguay L 0-2, Venezuela W 2-0, Perú W 3-0, Chile D 0-0) + amistosos Oct 2025-Mar 2026
    // Partido más reciente: 31/03/2026 Argelia 0-0 Uruguay (amistoso)
    // Fuente: NBC Sports, SoccerPunter, ESPN
    wins: 4,
    draws: 4,
    losses: 2,
    goalsFor: 10,
    goalsAgainst: 9,
    form: ['L','W','W','D','W','W','D','L','D','D'],
    ranking: 17,
    group: 'H',
  },

  // Grupo I
  // Competiciones: UEFA NL 2024/25 SF+3er + WCQ UEFA (Francia); AFCON 2025 + amistosos (Senegal);
  //                AFC WCQ R3/R5 + Copa Árabe 2025 + playoff FIFA vs Bolivia (Irak);
  //                UEFA WCQ Grupo I (ganador 24pts) + amistosos (Noruega)
  // Partido más reciente: Francia 3-1 Colombia (29/03/26); USA 3-2 Senegal (31/05/26);
  //                       Irak 2-1 Bolivia (01/04/26); Noruega 3-1 Suecia (01/06/26)
  // Fuente: UEFA.com, CAF, FIFA.com, ESPN, Goal.com — ranking FIFA abril 2026
  'Francia': {
    name: 'Francia',
    flag: '🇫🇷',
    wins: 8,
    draws: 1,
    losses: 1,
    goalsFor: 27,
    goalsAgainst: 11,
    form: ['L','W','W','W','W','D','W','W','W','W'],
    ranking: 1,
    group: 'I',
  },
  'Senegal': {
    name: 'Senegal',
    flag: '🇸🇳',
    wins: 7,
    draws: 1,
    losses: 2,
    goalsFor: 19,
    goalsAgainst: 9,
    form: ['W','D','W','W','W','W','L','W','W','L'],
    ranking: 15,
    group: 'I',
  },
  'Irak': {
    name: 'Irak',
    flag: '🇮🇶',
    wins: 5,
    draws: 2,
    losses: 3,
    goalsFor: 10,
    goalsAgainst: 9,
    form: ['L','W','D','D','W','W','W','L','L','W'],
    ranking: 57,
    group: 'I',
  },
  'Noruega': {
    name: 'Noruega',
    flag: '🇳🇴',
    wins: 8,
    draws: 1,
    losses: 1,
    goalsFor: 36,
    goalsAgainst: 8,
    form: ['W','W','W','W','W','W','W','L','D','W'],
    ranking: 32,
    group: 'I',
  },

  // Grupo J
  // Argentina: CONMEBOL WC qualifiers MD9-17 (2024-2025). Ranking FIFA abr-2026: #3
  'Argentina': { name: 'Argentina', flag: '🇦🇷', wins: 7, draws: 2, losses: 1, goalsFor: 21, goalsAgainst: 3, form: ['D','W','W','W','D','W','W','L','W','W'], ranking: 3, group: 'J' },
  // Argelia: Copa Árabe (eliminado QF pens vs EAU) + AFCON 2025 (eliminado QF vs Nigeria) + 2 amistosos. Ranking FIFA abr-2026: #28
  'Argelia': { name: 'Argelia', flag: '🇩🇿', wins: 7, draws: 1, losses: 2, goalsFor: 23, goalsAgainst: 5, form: ['W','W','L','W','W','W','W','L','W','D'], ranking: 28, group: 'J' },
  // Austria: UEFA NL 2024-25 (5 fase grupos + 2 playoff) + WC qualifier Grupo H (ganó el grupo 6V-1E-1D). Ranking FIFA abr-2026: #24
  'Austria': { name: 'Austria', flag: '🇦🇹', wins: 6, draws: 3, losses: 1, goalsFor: 27, goalsAgainst: 8, form: ['L','W','W','D','D','L','W','W','W','D'], ranking: 24, group: 'J' },
  // Jordania: 1ª clasificación mundialista. Finalista Copa Árabe FIFA 2025. Últimas 10: 1 clf AFC + 6 Copa Árabe + 3 amistosos. Ranking FIFA abr-2026: #63
  'Jordania': { name: 'Jordania', flag: '🇯🇴', wins: 6, draws: 2, losses: 2, goalsFor: 20, goalsAgainst: 11, form: ['W','W','W','W','W','W','L','D','D','L'], ranking: 63, group: 'J' },

  // Grupo K
  // Competiciones: UEFA NL 2024/25 (QF+SF+Final) + WCQ UEFA Grupo F (Sep-Nov 2025)
  // Partido más reciente: 16/11/2025 Portugal 9-1 Armenia (WCQ)
  // Fuente: UEFA.com, ESPN, Wikipedia
  'Portugal': { name: 'Portugal', flag: '🇵🇹', wins: 7, draws: 1, losses: 2, goalsFor: 29, goalsAgainst: 13, form: ['L','W','W','W','W','W','W','D','L','W'], ranking: 5, group: 'K' },
  // Competiciones: Copa Asia 2023 (QF), AFC WCQ Ronda 2, CAFA Nations Cup 2025
  // Partido más reciente: 08/09/2025 Uzbekistán 1-0 Irán (CAFA Final)
  // Fuente: ESPN, VAVEL, Wikipedia
  'Uzbekistán': { name: 'Uzbekistán', flag: '🇺🇿', wins: 6, draws: 3, losses: 1, goalsFor: 16, goalsAgainst: 5, form: ['D','W','L','W','D','W','D','W','W','W'], ranking: 50, group: 'K' },
  // Competiciones: Copa América 2024 (Final) + CONMEBOL Eliminatorias WC26 J9-J18
  // Partido más reciente: 09/09/2025 Venezuela 3-6 Colombia (Eliminatorias)
  // Fuente: ESPN, CONMEBOL, Wikipedia
  'Colombia': { name: 'Colombia', flag: '🇨🇴', wins: 4, draws: 3, losses: 3, goalsFor: 19, goalsAgainst: 11, form: ['L','W','W','L','L','D','D','D','W','W'], ranking: 13, group: 'K' },
  // Competiciones: CAF WCQ Repesca (vs Camerún, Nigeria) + AFCON 2025 + Inter-Conf Playoff WC26
  // Partido más reciente: 31/03/2026 RD Congo 1-0 Jamaica aet (Inter-Conf Playoff Final)
  // Fuente: CAFonline, FIFA.com, France24, Al Jazeera
  'RD Congo': { name: 'RD Congo', flag: '🇨🇩', wins: 7, draws: 2, losses: 1, goalsFor: 11, goalsAgainst: 3, form: ['W','W','W','W','D','W','L','W','W','D'], ranking: 46, group: 'K' },

  // Grupo L
  // Investigado: 2026-06-04 | Fuentes: ESPN, UEFA.com, CONCACAF.com, FIFA.com, ghanafa.org
  'Inglaterra': {
    name: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    // Competiciones: WC 2026 Qualifier UEFA Group K (8 partidos, 8V-0E-0D, 0 goles en contra), Friendlies
    // Partido más reciente: 2026-06-01 vs Japan 0-1 (Friendly)
    // Fuente: ESPN, Goal.com, englandfootball.com
    wins: 8,
    draws: 1,
    losses: 1,
    goalsFor: 21,
    goalsAgainst: 1,
    form: ['W','W','W','W','W','W','W','W','D','L'],
    ranking: 4,
    group: 'L',
  },
  'Croacia': {
    name: 'Croacia',
    flag: '🇭🇷',
    // Competiciones: WC 2026 Qualifier UEFA Group L (8 partidos, 7V-1E-0D, 26 GF 4 GA), Friendlies
    // Partido más reciente: 2026-03-31 vs Brazil 1-3 (Friendly)
    // Fuente: UEFA.com, ESPN, FlashScore
    wins: 8,
    draws: 1,
    losses: 1,
    goalsFor: 29,
    goalsAgainst: 9,
    form: ['W','W','W','W','D','W','W','W','W','L'],
    ranking: 11,
    group: 'L',
  },
  'Panamá': {
    name: 'Panamá',
    flag: '🇵🇦',
    // Competiciones: CONCACAF Nations League 2024-25 (Final — runner-up), WC 2026 Qualifier CONCACAF Group A (3V-3E-0D, 1er lugar)
    // Partido más reciente: 2025-11-18 vs El Salvador 3-0 (WC Qualifier)
    // Fuente: CONCACAF.com, ESPN, Wikipedia
    wins: 6,
    draws: 3,
    losses: 1,
    goalsFor: 17,
    goalsAgainst: 7,
    form: ['W','D','W','L','W','D','W','D','W','W'],
    ranking: 33,
    group: 'L',
  },
  'Ghana': {
    name: 'Ghana',
    flag: '🇬🇭',
    // Competiciones: WC 2026 Qualifier CAF Group I (10 partidos, 8V-1E-1D, 23 GF 6 GA, 25 pts — 1er lugar)
    // Partido más reciente: 2025-10-13 vs Comoros 1-0 (WC Qualifier — clinched qualification)
    // Fuente: FIFA.com, ghanafa.org, ESPN, Wikipedia
    wins: 8,
    draws: 1,
    losses: 1,
    goalsFor: 23,
    goalsAgainst: 6,
    form: ['W','W','W','L','W','W','D','W','W','W'],
    ranking: 74,
    group: 'L',
  },
}

export const GROUPS: Record<string, string[]> = {
  A: ['México', 'Sudáfrica', 'Corea del Sur', 'Chequia'],
  B: ['Canadá', 'Bosnia y Herzegovina', 'Catar', 'Suiza'],
  C: ['Brasil', 'Marruecos', 'Escocia', 'Haití'],
  D: ['Estados Unidos', 'Paraguay', 'Australia', 'Turquía'],
  E: ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'],
  F: ['Países Bajos', 'Japón', 'Suecia', 'Túnez'],
  G: ['Bélgica', 'Irán', 'Nueva Zelanda', 'Egipto'],
  H: ['España', 'Cabo Verde', 'Arabia Saudita', 'Uruguay'],
  I: ['Francia', 'Senegal', 'Irak', 'Noruega'],
  J: ['Argentina', 'Argelia', 'Austria', 'Jordania'],
  K: ['Portugal', 'Uzbekistán', 'Colombia', 'RD Congo'],
  L: ['Inglaterra', 'Croacia', 'Panamá', 'Ghana'],
}

export const GROUP_STAGE_MATCHES: WCMatch[] = [
  // GRUPO A
  { id: 'A1', group: 'A', phase: 'group', homeTeam: 'México', awayTeam: 'Sudáfrica', date: '2026-06-11', time: '14:00', matchday: 1 },
  { id: 'A2', group: 'A', phase: 'group', homeTeam: 'Corea del Sur', awayTeam: 'Chequia', date: '2026-06-11', time: '21:00', matchday: 1 },
  { id: 'A3', group: 'A', phase: 'group', homeTeam: 'Chequia', awayTeam: 'Sudáfrica', date: '2026-06-18', time: '11:00', matchday: 2 },
  { id: 'A4', group: 'A', phase: 'group', homeTeam: 'México', awayTeam: 'Corea del Sur', date: '2026-06-18', time: '20:00', matchday: 2 },
  { id: 'A5', group: 'A', phase: 'group', homeTeam: 'Sudáfrica', awayTeam: 'Corea del Sur', date: '2026-06-24', time: '20:00', matchday: 3 },
  { id: 'A6', group: 'A', phase: 'group', homeTeam: 'Chequia', awayTeam: 'México', date: '2026-06-24', time: '20:00', matchday: 3 },

  // GRUPO B
  { id: 'B1', group: 'B', phase: 'group', homeTeam: 'Canadá', awayTeam: 'Bosnia y Herzegovina', date: '2026-06-12', time: '14:00', matchday: 1 },
  { id: 'B2', group: 'B', phase: 'group', homeTeam: 'Catar', awayTeam: 'Suiza', date: '2026-06-13', time: '14:00', matchday: 1 },
  { id: 'B3', group: 'B', phase: 'group', homeTeam: 'Suiza', awayTeam: 'Bosnia y Herzegovina', date: '2026-06-18', time: '14:00', matchday: 2 },
  { id: 'B4', group: 'B', phase: 'group', homeTeam: 'Canadá', awayTeam: 'Catar', date: '2026-06-18', time: '17:00', matchday: 2 },
  { id: 'B5', group: 'B', phase: 'group', homeTeam: 'Suiza', awayTeam: 'Canadá', date: '2026-06-24', time: '14:00', matchday: 3 },
  { id: 'B6', group: 'B', phase: 'group', homeTeam: 'Bosnia y Herzegovina', awayTeam: 'Catar', date: '2026-06-24', time: '14:00', matchday: 3 },

  // GRUPO C
  { id: 'C1', group: 'C', phase: 'group', homeTeam: 'Brasil', awayTeam: 'Marruecos', date: '2026-06-13', time: '17:00', matchday: 1 },
  { id: 'C2', group: 'C', phase: 'group', homeTeam: 'Haití', awayTeam: 'Escocia', date: '2026-06-13', time: '20:00', matchday: 1 },
  { id: 'C3', group: 'C', phase: 'group', homeTeam: 'Escocia', awayTeam: 'Marruecos', date: '2026-06-19', time: '17:00', matchday: 2 },
  { id: 'C4', group: 'C', phase: 'group', homeTeam: 'Brasil', awayTeam: 'Haití', date: '2026-06-19', time: '19:30', matchday: 2 },
  { id: 'C5', group: 'C', phase: 'group', homeTeam: 'Marruecos', awayTeam: 'Haití', date: '2026-06-24', time: '17:00', matchday: 3 },
  { id: 'C6', group: 'C', phase: 'group', homeTeam: 'Escocia', awayTeam: 'Brasil', date: '2026-06-24', time: '17:00', matchday: 3 },

  // GRUPO D
  { id: 'D1', group: 'D', phase: 'group', homeTeam: 'Estados Unidos', awayTeam: 'Paraguay', date: '2026-06-12', time: '20:00', matchday: 1 },
  { id: 'D2', group: 'D', phase: 'group', homeTeam: 'Australia', awayTeam: 'Turquía', date: '2026-06-13', time: '23:00', matchday: 1 },
  { id: 'D3', group: 'D', phase: 'group', homeTeam: 'Estados Unidos', awayTeam: 'Australia', date: '2026-06-19', time: '14:00', matchday: 2 },
  { id: 'D4', group: 'D', phase: 'group', homeTeam: 'Turquía', awayTeam: 'Paraguay', date: '2026-06-19', time: '22:00', matchday: 2 },
  { id: 'D5', group: 'D', phase: 'group', homeTeam: 'Turquía', awayTeam: 'Estados Unidos', date: '2026-06-25', time: '21:00', matchday: 3 },
  { id: 'D6', group: 'D', phase: 'group', homeTeam: 'Paraguay', awayTeam: 'Australia', date: '2026-06-25', time: '21:00', matchday: 3 },

  // GRUPO E
  { id: 'E1', group: 'E', phase: 'group', homeTeam: 'Alemania', awayTeam: 'Curazao', date: '2026-06-14', time: '12:00', matchday: 1 },
  { id: 'E2', group: 'E', phase: 'group', homeTeam: 'Costa de Marfil', awayTeam: 'Ecuador', date: '2026-06-14', time: '18:00', matchday: 1 },
  { id: 'E3', group: 'E', phase: 'group', homeTeam: 'Alemania', awayTeam: 'Costa de Marfil', date: '2026-06-20', time: '15:00', matchday: 2 },
  { id: 'E4', group: 'E', phase: 'group', homeTeam: 'Ecuador', awayTeam: 'Curazao', date: '2026-06-20', time: '19:00', matchday: 2 },
  { id: 'E5', group: 'E', phase: 'group', homeTeam: 'Curazao', awayTeam: 'Costa de Marfil', date: '2026-06-25', time: '15:00', matchday: 3 },
  { id: 'E6', group: 'E', phase: 'group', homeTeam: 'Ecuador', awayTeam: 'Alemania', date: '2026-06-25', time: '15:00', matchday: 3 },

  // GRUPO F
  { id: 'F1', group: 'F', phase: 'group', homeTeam: 'Países Bajos', awayTeam: 'Japón', date: '2026-06-14', time: '15:00', matchday: 1 },
  { id: 'F2', group: 'F', phase: 'group', homeTeam: 'Suecia', awayTeam: 'Túnez', date: '2026-06-14', time: '21:00', matchday: 1 },
  { id: 'F3', group: 'F', phase: 'group', homeTeam: 'Países Bajos', awayTeam: 'Suecia', date: '2026-06-20', time: '12:00', matchday: 2 },
  { id: 'F4', group: 'F', phase: 'group', homeTeam: 'Túnez', awayTeam: 'Japón', date: '2026-06-20', time: '23:00', matchday: 2 },
  { id: 'F5', group: 'F', phase: 'group', homeTeam: 'Túnez', awayTeam: 'Países Bajos', date: '2026-06-25', time: '18:00', matchday: 3 },
  { id: 'F6', group: 'F', phase: 'group', homeTeam: 'Japón', awayTeam: 'Suecia', date: '2026-06-25', time: '18:00', matchday: 3 },

  // GRUPO G
  { id: 'G1', group: 'G', phase: 'group', homeTeam: 'Bélgica', awayTeam: 'Egipto', date: '2026-06-15', time: '14:00', matchday: 1 },
  { id: 'G2', group: 'G', phase: 'group', homeTeam: 'Irán', awayTeam: 'Nueva Zelanda', date: '2026-06-15', time: '20:00', matchday: 1 },
  { id: 'G3', group: 'G', phase: 'group', homeTeam: 'Bélgica', awayTeam: 'Irán', date: '2026-06-21', time: '14:00', matchday: 2 },
  { id: 'G4', group: 'G', phase: 'group', homeTeam: 'Nueva Zelanda', awayTeam: 'Egipto', date: '2026-06-21', time: '20:00', matchday: 2 },
  { id: 'G5', group: 'G', phase: 'group', homeTeam: 'Nueva Zelanda', awayTeam: 'Bélgica', date: '2026-06-26', time: '22:00', matchday: 3 },
  { id: 'G6', group: 'G', phase: 'group', homeTeam: 'Egipto', awayTeam: 'Irán', date: '2026-06-26', time: '22:00', matchday: 3 },

  // GRUPO H
  { id: 'H1', group: 'H', phase: 'group', homeTeam: 'España', awayTeam: 'Cabo Verde', date: '2026-06-15', time: '11:00', matchday: 1 },
  { id: 'H2', group: 'H', phase: 'group', homeTeam: 'Arabia Saudita', awayTeam: 'Uruguay', date: '2026-06-15', time: '17:00', matchday: 1 },
  { id: 'H3', group: 'H', phase: 'group', homeTeam: 'España', awayTeam: 'Arabia Saudita', date: '2026-06-21', time: '11:00', matchday: 2 },
  { id: 'H4', group: 'H', phase: 'group', homeTeam: 'Uruguay', awayTeam: 'Cabo Verde', date: '2026-06-21', time: '17:00', matchday: 2 },
  { id: 'H5', group: 'H', phase: 'group', homeTeam: 'Cabo Verde', awayTeam: 'Arabia Saudita', date: '2026-06-26', time: '19:00', matchday: 3 },
  { id: 'H6', group: 'H', phase: 'group', homeTeam: 'Uruguay', awayTeam: 'España', date: '2026-06-26', time: '19:00', matchday: 3 },

  // GRUPO I
  { id: 'I1', group: 'I', phase: 'group', homeTeam: 'Francia', awayTeam: 'Senegal', date: '2026-06-16', time: '14:00', matchday: 1 },
  { id: 'I2', group: 'I', phase: 'group', homeTeam: 'Irak', awayTeam: 'Noruega', date: '2026-06-16', time: '17:00', matchday: 1 },
  { id: 'I3', group: 'I', phase: 'group', homeTeam: 'Francia', awayTeam: 'Irak', date: '2026-06-22', time: '16:00', matchday: 2 },
  { id: 'I4', group: 'I', phase: 'group', homeTeam: 'Noruega', awayTeam: 'Senegal', date: '2026-06-22', time: '19:00', matchday: 2 },
  { id: 'I5', group: 'I', phase: 'group', homeTeam: 'Noruega', awayTeam: 'Francia', date: '2026-06-26', time: '14:00', matchday: 3 },
  { id: 'I6', group: 'I', phase: 'group', homeTeam: 'Senegal', awayTeam: 'Irak', date: '2026-06-26', time: '14:00', matchday: 3 },

  // GRUPO J
  { id: 'J1', group: 'J', phase: 'group', homeTeam: 'Argentina', awayTeam: 'Argelia', date: '2026-06-16', time: '20:00', matchday: 1 },
  { id: 'J2', group: 'J', phase: 'group', homeTeam: 'Austria', awayTeam: 'Jordania', date: '2026-06-16', time: '23:00', matchday: 1 },
  { id: 'J3', group: 'J', phase: 'group', homeTeam: 'Argentina', awayTeam: 'Austria', date: '2026-06-22', time: '12:00', matchday: 2 },
  { id: 'J4', group: 'J', phase: 'group', homeTeam: 'Jordania', awayTeam: 'Argelia', date: '2026-06-22', time: '22:00', matchday: 2 },
  { id: 'J5', group: 'J', phase: 'group', homeTeam: 'Argelia', awayTeam: 'Austria', date: '2026-06-27', time: '21:00', matchday: 3 },
  { id: 'J6', group: 'J', phase: 'group', homeTeam: 'Jordania', awayTeam: 'Argentina', date: '2026-06-27', time: '21:00', matchday: 3 },

  // GRUPO K
  { id: 'K1', group: 'K', phase: 'group', homeTeam: 'Portugal', awayTeam: 'RD Congo', date: '2026-06-17', time: '12:00', matchday: 1 },
  { id: 'K2', group: 'K', phase: 'group', homeTeam: 'Uzbekistán', awayTeam: 'Colombia', date: '2026-06-17', time: '21:00', matchday: 1 },
  { id: 'K3', group: 'K', phase: 'group', homeTeam: 'Portugal', awayTeam: 'Uzbekistán', date: '2026-06-23', time: '12:00', matchday: 2 },
  { id: 'K4', group: 'K', phase: 'group', homeTeam: 'Colombia', awayTeam: 'RD Congo', date: '2026-06-23', time: '21:00', matchday: 2 },
  { id: 'K5', group: 'K', phase: 'group', homeTeam: 'Colombia', awayTeam: 'Portugal', date: '2026-06-27', time: '18:30', matchday: 3 },
  { id: 'K6', group: 'K', phase: 'group', homeTeam: 'RD Congo', awayTeam: 'Uzbekistán', date: '2026-06-27', time: '18:30', matchday: 3 },

  // GRUPO L
  { id: 'L1', group: 'L', phase: 'group', homeTeam: 'Inglaterra', awayTeam: 'Croacia', date: '2026-06-17', time: '15:00', matchday: 1 },
  { id: 'L2', group: 'L', phase: 'group', homeTeam: 'Ghana', awayTeam: 'Panamá', date: '2026-06-17', time: '18:00', matchday: 1 },
  { id: 'L3', group: 'L', phase: 'group', homeTeam: 'Inglaterra', awayTeam: 'Ghana', date: '2026-06-23', time: '15:00', matchday: 2 },
  { id: 'L4', group: 'L', phase: 'group', homeTeam: 'Panamá', awayTeam: 'Croacia', date: '2026-06-23', time: '18:00', matchday: 2 },
  { id: 'L5', group: 'L', phase: 'group', homeTeam: 'Panamá', awayTeam: 'Inglaterra', date: '2026-06-27', time: '16:00', matchday: 3 },
  { id: 'L6', group: 'L', phase: 'group', homeTeam: 'Croacia', awayTeam: 'Ghana', date: '2026-06-27', time: '16:00', matchday: 3 },
]

export function getMatchById(id: string): WCMatch | undefined {
  return GROUP_STAGE_MATCHES.find(m => m.id === id)
}

export function getTeam(name: string): TeamData | undefined {
  return TEAMS[name]
}

export function formatMatchDate(dateStr: string, time: string): string {
  const date = new Date(dateStr + 'T' + time + ':00-05:00')
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function getMatchesByDate(): Map<string, WCMatch[]> {
  const map = new Map<string, WCMatch[]>()
  for (const match of GROUP_STAGE_MATCHES) {
    const existing = map.get(match.date) ?? []
    existing.push(match)
    map.set(match.date, existing)
  }
  return map
}

export function getMatchesByGroup(group: string): WCMatch[] {
  return GROUP_STAGE_MATCHES.filter(m => m.group === group)
}
