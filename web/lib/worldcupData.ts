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

  // ── GRUPO C ────────────────────────────────────────────────────────────────

  'Brasil': {
    coach: 'Carlo Ancelotti',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Brazil.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/CBF_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Alisson Becker',       position: 'GK', club: 'Liverpool' },
      { number: 12, name: 'Weverton',              position: 'GK', club: 'Grêmio' },
      { number: 23, name: 'Ederson',               position: 'GK', club: 'Fenerbahçe' },
      // Defensas
      { number: 3,  name: 'Gabriel Magalhães',     position: 'DF', club: 'Arsenal' },
      { number: 4,  name: 'Marquinhos',            position: 'DF', club: 'Paris Saint-Germain' },
      { number: 6,  name: 'Alex Sandro',           position: 'DF', club: 'Flamengo' },
      { number: 13, name: 'Danilo',                position: 'DF', club: 'Flamengo' },
      { number: 14, name: 'Bremer',                position: 'DF', club: 'Juventus' },
      { number: 15, name: 'Léo Pereira',           position: 'DF', club: 'Flamengo' },
      { number: 16, name: 'Douglas Santos',        position: 'DF', club: 'Zenit St. Petersburg' },
      { number: 24, name: 'Roger Ibañez',          position: 'DF', club: 'Al-Ahli' },
      // Mediocampistas
      { number: 2,  name: 'Éderson',               position: 'MF', club: 'Atalanta' },
      { number: 5,  name: 'Casemiro',              position: 'MF', club: 'Manchester United' },
      { number: 8,  name: 'Bruno Guimarães',       position: 'MF', club: 'Newcastle United' },
      { number: 17, name: 'Fabinho',               position: 'MF', club: 'Al-Ittihad' },
      { number: 18, name: 'Danilo Barbosa',        position: 'MF', club: 'Botafogo' },
      { number: 20, name: 'Lucas Paquetá',         position: 'MF', club: 'Flamengo' },
      // Delanteros
      { number: 7,  name: 'Vinícius Júnior',       position: 'FW', club: 'Real Madrid' },
      { number: 9,  name: 'Matheus Cunha',         position: 'FW', club: 'Manchester United' },
      { number: 10, name: 'Neymar',                position: 'FW', club: 'Santos' },
      { number: 11, name: 'Raphinha',              position: 'FW', club: 'Barcelona' },
      { number: 19, name: 'Endrick',               position: 'FW', club: 'Lyon' },
      { number: 21, name: 'Luiz Henrique',         position: 'FW', club: 'Zenit St. Petersburg' },
      { number: 22, name: 'Gabriel Martinelli',    position: 'FW', club: 'Arsenal' },
      { number: 25, name: 'Igor Thiago',           position: 'FW', club: 'Brentford' },
      { number: 26, name: 'Rayan',                 position: 'FW', club: 'Bournemouth' },
    ],
  },

  'Marruecos': {
    coach: 'Mohamed Ouahbi',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Morocco.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Logo_Fédération_Royale_Marocaine_de_Football.png',
    players: [
      // Porteros
      { number: 1,  name: 'Yassine Bounou',        position: 'GK', club: 'Al-Hilal' },
      { number: 12, name: 'Ahmed Reda Tagnaouti',  position: 'GK', club: 'AS FAR' },
      { number: 23, name: 'Munir El Kajoui',       position: 'GK', club: 'RS Berkane' },
      // Defensas
      { number: 2,  name: 'Achraf Hakimi',         position: 'DF', club: 'Paris Saint-Germain' },
      { number: 3,  name: 'Noussair Mazraoui',     position: 'DF', club: 'Manchester United' },
      { number: 5,  name: 'Issa Diop',             position: 'DF', club: 'Fulham' },
      { number: 6,  name: 'Redouane Halhal',       position: 'DF', club: 'KV Mechelen' },
      { number: 13, name: 'Nayef Aguerd',          position: 'DF', club: 'Marseille' },
      { number: 14, name: 'Chadi Riad',            position: 'DF', club: 'Crystal Palace' },
      { number: 15, name: 'Anass Salah-Eddine',    position: 'DF', club: 'PSV Eindhoven' },
      { number: 16, name: 'Zakaria El Ouahdi',     position: 'DF', club: 'Racing Genk' },
      { number: 21, name: 'Youssef Belammari',     position: 'DF', club: 'Al Ahly' },
      // Mediocampistas
      { number: 4,  name: 'Sofyan Amrabat',        position: 'MF', club: 'Real Betis' },
      { number: 7,  name: 'Azzedine Ounahi',       position: 'MF', club: 'Girona' },
      { number: 8,  name: 'Neil El Aynaoui',       position: 'MF', club: 'AS Roma' },
      { number: 11, name: 'Ismael Saibari',        position: 'MF', club: 'PSV Eindhoven' },
      { number: 18, name: 'Samir El Mourabet',     position: 'MF', club: 'Strasbourg' },
      { number: 20, name: 'Bilal El Khannouss',    position: 'MF', club: 'VfB Stuttgart' },
      { number: 24, name: 'Ayyoub Bouaddi',        position: 'MF', club: 'Lille' },
      // Delanteros
      { number: 9,  name: 'Soufiane Rahimi',       position: 'FW', club: 'Al Ain' },
      { number: 10, name: 'Brahim Díaz',           position: 'FW', club: 'Real Madrid' },
      { number: 17, name: 'Abde Ezzalzouli',       position: 'FW', club: 'Real Betis' },
      { number: 19, name: 'Ayoub El Kaabi',        position: 'FW', club: 'Olympiacos' },
      { number: 22, name: 'Chemsdine Talbi',       position: 'FW', club: 'Sunderland' },
      { number: 25, name: 'Gessime Yassine',       position: 'FW', club: 'Strasbourg' },
      { number: 26, name: 'Ayoube Amaimouni',      position: 'FW', club: 'Eintracht Frankfurt' },
    ],
  },

  'Escocia': {
    coach: 'Steve Clarke',
    formation: '3-4-2-1',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Scotland.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Scotland_national_football_team_badge.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Angus Gunn',            position: 'GK', club: 'Nottingham Forest' },
      { number: 12, name: 'Liam Kelly',            position: 'GK', club: 'Rangers' },
      { number: 21, name: 'Craig Gordon',          position: 'GK', club: 'Hearts' },
      // Defensas
      { number: 2,  name: 'Aaron Hickey',          position: 'DF', club: 'Brentford' },
      { number: 3,  name: 'Andy Robertson',        position: 'DF', club: 'Liverpool' },
      { number: 5,  name: 'Grant Hanley',          position: 'DF', club: 'Hibernian' },
      { number: 6,  name: 'Kieran Tierney',        position: 'DF', club: 'Celtic' },
      { number: 13, name: 'Jack Hendry',           position: 'DF', club: 'Al-Ettifaq' },
      { number: 15, name: 'John Souttar',          position: 'DF', club: 'Rangers' },
      { number: 16, name: 'Dominic Hyam',          position: 'DF', club: 'Wrexham' },
      { number: 22, name: 'Nathan Patterson',      position: 'DF', club: 'Everton' },
      { number: 24, name: 'Anthony Ralston',       position: 'DF', club: 'Celtic' },
      { number: 26, name: 'Scott McKenna',         position: 'DF', club: 'Dinamo Zagreb' },
      // Mediocampistas
      { number: 4,  name: 'Scott McTominay',       position: 'MF', club: 'Napoli' },
      { number: 7,  name: 'John McGinn',           position: 'MF', club: 'Aston Villa' },
      { number: 8,  name: 'Tyler Fletcher',        position: 'MF', club: 'Manchester United' },
      { number: 11, name: 'Ryan Christie',         position: 'MF', club: 'Bournemouth' },
      { number: 17, name: 'Ben Gannon-Doak',       position: 'MF', club: 'Bournemouth' },
      { number: 19, name: 'Lewis Ferguson',        position: 'MF', club: 'Bologna' },
      { number: 23, name: 'Kenny McLean',          position: 'MF', club: 'Norwich City' },
      { number: 25, name: 'Findlay Curtis',        position: 'MF', club: 'Kilmarnock' },
      // Delanteros
      { number: 9,  name: 'Lyndon Dykes',          position: 'FW', club: 'Charlton Athletic' },
      { number: 10, name: 'Ché Adams',             position: 'FW', club: 'Torino' },
      { number: 14, name: 'Ross Stewart',          position: 'FW', club: 'Southampton' },
      { number: 18, name: 'George Hirst',          position: 'FW', club: 'Ipswich Town' },
      { number: 20, name: 'Lawrence Shankland',    position: 'FW', club: 'Hearts' },
    ],
  },

  'Haití': {
    coach: 'Sébastien Migné',
    formation: '4-4-2',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Haiti.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Haiti_national_football_team_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Johny Placide',         position: 'GK', club: 'SC Bastia' },
      { number: 12, name: 'Alexandre Pierre',      position: 'GK', club: 'FC Sochaux' },
      { number: 23, name: 'Josué Duverger',        position: 'GK', club: 'FC Cosmos Koblenz' },
      // Defensas
      { number: 2,  name: 'Carlens Arcus',         position: 'DF', club: 'Angers SCO' },
      { number: 3,  name: 'Jean-Kevin Duverne',    position: 'DF', club: 'KAA Gent' },
      { number: 4,  name: 'Hannes Delcroix',       position: 'DF', club: 'Burnley' },
      { number: 5,  name: 'Ricardo Adé',           position: 'DF', club: 'LDU Quito' },
      { number: 6,  name: 'Duke Lacroix',          position: 'DF', club: 'Colorado Springs Switchbacks' },
      { number: 13, name: 'Wilguens Paugain',      position: 'DF', club: 'SV Zulte Waregem' },
      { number: 14, name: 'Martin Experience',     position: 'DF', club: 'AS Nancy-Lorraine' },
      { number: 15, name: 'Keeto Thermoncy',       position: 'DF', club: 'BSC Young Boys II' },
      // Mediocampistas
      { number: 7,  name: 'Leverton Pierre',       position: 'MF', club: 'FC Vizela' },
      { number: 8,  name: 'Jean-Ricner Bellegarde',position: 'MF', club: 'Wolverhampton Wanderers' },
      { number: 16, name: 'Jean-Jacques Danley',   position: 'MF', club: 'Philadelphia Union' },
      { number: 17, name: 'Carl-Fred Sainthe',     position: 'MF', club: 'El Paso Locomotive FC' },
      { number: 18, name: 'Dominique Simon',       position: 'MF', club: 'FC Tatran Prešov' },
      { number: 19, name: 'Pierre Woodenski',      position: 'MF', club: 'Violette AC' },
      // Delanteros
      { number: 9,  name: 'Wilson Isidor',         position: 'FW', club: 'Sunderland' },
      { number: 10, name: 'Duckens Nazon',         position: 'FW', club: 'Esteghlal FC' },
      { number: 11, name: 'Derrick Etienne Jr.',   position: 'FW', club: 'Toronto FC' },
      { number: 20, name: 'Josué Casimir',         position: 'FW', club: 'AJ Auxerre' },
      { number: 21, name: 'Frantzdy Pierrot',      position: 'FW', club: 'Çaykur Rizespor' },
      { number: 22, name: 'Ruben Providence',      position: 'FW', club: 'Almere City FC' },
      { number: 24, name: 'Lenny Joseph',          position: 'FW', club: 'Ferencváros TC' },
      { number: 25, name: 'Yassin Fortune',        position: 'FW', club: 'FC Vizela' },
      { number: 26, name: 'Louicius Deedson',      position: 'FW', club: 'FC Dallas' },
    ],
  },

  // ── GRUPO D ────────────────────────────────────────────────────────────────

  'Estados Unidos': {
    coach: 'Mauricio Pochettino',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_States.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/US_Soccer_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Matt Turner',            position: 'GK', club: 'Nottingham Forest' },
      { number: 12, name: 'Patrick Schulte',         position: 'GK', club: 'Columbus Crew' },
      { number: 13, name: 'Ethan Horvath',           position: 'GK', club: 'Cardiff City' },
      // Defensas
      { number: 2,  name: 'Sergiño Dest',            position: 'DF', club: 'PSV Eindhoven' },
      { number: 3,  name: 'Tim Ream',                position: 'DF', club: 'Charlotte FC' },
      { number: 4,  name: 'Mark McKenzie',           position: 'DF', club: 'Toulouse FC' },
      { number: 5,  name: 'Walker Zimmermann',       position: 'DF', club: 'Nashville SC' },
      { number: 6,  name: 'Antonee Robinson',        position: 'DF', club: 'Fulham' },
      { number: 22, name: 'Joe Scally',              position: 'DF', club: 'Borussia Mönchengladbach' },
      { number: 14, name: 'Cameron Carter-Vickers',  position: 'DF', club: 'Celtic' },
      // Mediocampistas
      { number: 8,  name: 'Weston McKennie',         position: 'MF', club: 'Juventus' },
      { number: 15, name: 'Tyler Adams',             position: 'MF', club: 'Bournemouth' },
      { number: 23, name: 'Yunus Musah',             position: 'MF', club: 'AC Milan' },
      { number: 17, name: 'Johnny Cardoso',          position: 'MF', club: 'Real Betis' },
      { number: 18, name: 'Luca de la Torre',        position: 'MF', club: 'Celta Vigo' },
      { number: 20, name: 'Brenden Aaronson',        position: 'MF', club: 'Leeds United' },
      { number: 7,  name: 'Giovanni Reyna',          position: 'MF', club: 'Nottingham Forest' },
      // Delanteros
      { number: 10, name: 'Christian Pulisic',       position: 'FW', club: 'AC Milan' },
      { number: 11, name: 'Tim Weah',                position: 'FW', club: 'Juventus' },
      { number: 9,  name: 'Folarin Balogun',         position: 'FW', club: 'Crystal Palace' },
      { number: 16, name: 'Ricardo Pepi',            position: 'FW', club: 'Club Brugge' },
      { number: 19, name: 'Josh Sargent',            position: 'FW', club: 'Norwich City' },
      { number: 21, name: 'Caden Clark',             position: 'FW', club: 'RB Leipzig' },
    ],
  },

  'Paraguay': {
    coach: 'Gustavo Alfaro',
    formation: '4-2-3-1',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Paraguay.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Asociaci%C3%B3n_Paraguaya_de_F%C3%BAtbol_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Antony Silva',            position: 'GK', club: 'Cerro Porteño' },
      { number: 12, name: 'Gatito Fernández',        position: 'GK', club: 'Botafogo' },
      { number: 23, name: 'Rodrigo Muñoz',           position: 'GK', club: 'Club América' },
      // Defensas
      { number: 2,  name: 'Robert Rojas',            position: 'DF', club: 'River Plate' },
      { number: 3,  name: 'Fabián Balbuena',         position: 'DF', club: 'Nacional (PAR)' },
      { number: 5,  name: 'Gustavo Gómez',           position: 'DF', club: 'Palmeiras' },
      { number: 6,  name: 'Junior Alonso',           position: 'DF', club: 'Athletico Paranaense' },
      { number: 15, name: 'Jorge Morel',             position: 'DF', club: 'Olimpia' },
      { number: 16, name: 'Santiago Arzamendia',     position: 'DF', club: 'Cerro Porteño' },
      { number: 22, name: 'Omar Alderete',           position: 'DF', club: 'Getafe CF' },
      // Mediocampistas
      { number: 4,  name: 'Mathías Villasanti',      position: 'MF', club: 'Grêmio' },
      { number: 7,  name: 'Andrés Cubas',            position: 'MF', club: 'Getafe CF' },
      { number: 8,  name: 'Richard Sánchez',         position: 'MF', club: 'Club América' },
      { number: 13, name: 'Gabriel Ávalos',          position: 'MF', club: 'San Lorenzo' },
      { number: 14, name: 'Matías Rojas',            position: 'MF', club: 'Racing Club' },
      { number: 18, name: 'Alejandro Romero Gamarra',position: 'MF', club: 'New York Red Bulls' },
      { number: 21, name: 'Ángel Cardozo Lucena',   position: 'MF', club: 'Cerro Porteño' },
      // Delanteros
      { number: 9,  name: 'Julio Enciso',            position: 'FW', club: 'Brighton & Hove Albion' },
      { number: 10, name: 'Miguel Almirón',          position: 'FW', club: 'Newcastle United' },
      { number: 11, name: 'Carlos González',         position: 'FW', club: 'Olimpia' },
      { number: 17, name: 'Ramón Sosa',              position: 'FW', club: 'Nottingham Forest' },
      { number: 19, name: 'Rodrigo Aguirre',         position: 'FW', club: 'Club Nacional' },
      { number: 20, name: 'Alejandro Frutos',        position: 'FW', club: 'Olimpia' },
    ],
  },

  'Australia': {
    coach: 'Tony Popovic',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Australia.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Football_Australia_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Mathew Ryan',             position: 'GK', club: 'AZ Alkmaar' },
      { number: 12, name: 'Joe Gauci',               position: 'GK', club: 'Adelaide United' },
      { number: 23, name: 'Danny Vukovic',           position: 'GK', club: 'Central Coast Mariners' },
      // Defensas
      { number: 2,  name: 'Nathaniel Atkinson',      position: 'DF', club: 'St. Mirren' },
      { number: 3,  name: 'Aziz Behich',             position: 'DF', club: 'Dundee United' },
      { number: 4,  name: 'Harry Souttar',           position: 'DF', club: 'Leicester City' },
      { number: 5,  name: 'Milos Degenek',           position: 'DF', club: 'Columbus Crew' },
      { number: 6,  name: 'Bailey Wright',           position: 'DF', club: 'Sunderland' },
      { number: 13, name: 'Lewis Miller',            position: 'DF', club: 'Hibernian' },
      { number: 21, name: 'Kye Rowles',              position: 'DF', club: 'Heart of Midlothian' },
      // Mediocampistas
      { number: 7,  name: 'Aaron Mooy',              position: 'MF', club: 'Celtic' },
      { number: 8,  name: 'Jackson Irvine',          position: 'MF', club: 'FC St. Pauli' },
      { number: 10, name: 'Riley McGree',            position: 'MF', club: 'Middlesbrough' },
      { number: 14, name: 'Keanu Baccus',            position: 'MF', club: 'St. Mirren' },
      { number: 15, name: 'Aiden O\'Neill',          position: 'MF', club: 'Luton Town' },
      { number: 16, name: 'Cameron Devlin',          position: 'MF', club: 'Heart of Midlothian' },
      { number: 20, name: 'Marco Tilio',             position: 'MF', club: 'Celtic' },
      // Delanteros
      { number: 9,  name: 'Mitchell Duke',           position: 'FW', club: 'Macarthur FC' },
      { number: 11, name: 'Mat Leckie',              position: 'FW', club: 'Melbourne City' },
      { number: 17, name: 'Craig Goodwin',           position: 'FW', club: 'Adelaide United' },
      { number: 18, name: 'Martin Boyle',            position: 'FW', club: 'Al-Faisaly' },
      { number: 19, name: 'Awer Mabil',              position: 'FW', club: 'Cadiz CF' },
      { number: 22, name: 'Jamie Maclaren',          position: 'FW', club: 'Melbourne City' },
    ],
  },

  'Turquía': {
    coach: 'Vincenzo Montella',
    formation: '4-2-3-1',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Turkey.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Turkey_Football_Federation_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Mert Günok',              position: 'GK', club: 'Beşiktaş' },
      { number: 12, name: 'Uğurcan Çakır',           position: 'GK', club: 'Trabzonspor' },
      { number: 23, name: 'Altay Bayındır',          position: 'GK', club: 'Manchester United' },
      // Defensas
      { number: 2,  name: 'Zeki Çelik',             position: 'DF', club: 'AS Roma' },
      { number: 3,  name: 'Ferdi Kadıoğlu',         position: 'DF', club: 'Brighton & Hove Albion' },
      { number: 4,  name: 'Çağlar Söyüncü',         position: 'DF', club: 'Atlético de Madrid' },
      { number: 5,  name: 'Merih Demiral',           position: 'DF', club: 'Al-Qadsiah' },
      { number: 13, name: 'Abdülkerim Bardakçı',    position: 'DF', club: 'Galatasaray' },
      { number: 15, name: 'Samet Akaydın',          position: 'DF', club: 'Fenerbahçe' },
      { number: 22, name: 'Mert Müldür',             position: 'DF', club: 'Sassuolo' },
      // Mediocampistas
      { number: 6,  name: 'Salih Özcan',             position: 'MF', club: 'Borussia Dortmund' },
      { number: 8,  name: 'Hakan Çalhanoğlu',        position: 'MF', club: 'Inter Milan' },
      { number: 14, name: 'Kaan Ayhan',              position: 'MF', club: 'Galatasaray' },
      { number: 16, name: 'İsmail Yüksek',           position: 'MF', club: 'Fenerbahçe' },
      { number: 17, name: 'Orkun Kökçü',             position: 'MF', club: 'Benfica' },
      { number: 18, name: 'Berkan Kutlu',            position: 'MF', club: 'Galatasaray' },
      // Delanteros
      { number: 7,  name: 'Kerem Aktürkoğlu',        position: 'FW', club: 'Benfica' },
      { number: 9,  name: 'Cenk Tosun',              position: 'FW', club: 'Beşiktaş' },
      { number: 10, name: 'Arda Güler',              position: 'FW', club: 'Real Madrid' },
      { number: 11, name: 'Baris Alper Yilmaz',     position: 'FW', club: 'Galatasaray' },
      { number: 19, name: 'Semih Kılıçsoy',         position: 'FW', club: 'Beşiktaş' },
      { number: 20, name: 'Yusuf Yazıcı',            position: 'FW', club: 'LOSC Lille' },
      { number: 21, name: 'Muhammed Şengezer',       position: 'FW', club: 'Trabzonspor' },
    ],
  },

  // ── GRUPO E ────────────────────────────────────────────────────────────────

  'Alemania': {
    coach: 'Julian Nagelsmann',
    formation: '4-2-3-1',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Germany.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Deutscher_Fussball-Bund_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Manuel Neuer',          position: 'GK', club: 'Bayern Munich' },
      { number: 12, name: 'Oliver Baumann',         position: 'GK', club: 'TSG Hoffenheim' },
      { number: 21, name: 'Alexander Nübel',        position: 'GK', club: 'VfB Stuttgart' },
      // Defensas
      { number: 2,  name: 'Antonio Rüdiger',        position: 'DF', club: 'Real Madrid' },
      { number: 3,  name: 'Waldemar Anton',         position: 'DF', club: 'Borussia Dortmund' },
      { number: 4,  name: 'Jonathan Tah',           position: 'DF', club: 'Bayern Munich' },
      { number: 6,  name: 'Joshua Kimmich',         position: 'DF', club: 'Bayern Munich' },
      { number: 15, name: 'Nico Schlotterbeck',     position: 'DF', club: 'Borussia Dortmund' },
      { number: 18, name: 'Nathaniel Brown',        position: 'DF', club: 'Eintracht Frankfurt' },
      { number: 22, name: 'David Raum',             position: 'DF', club: 'RB Leipzig' },
      { number: 24, name: 'Malick Thiaw',           position: 'DF', club: 'Newcastle United' },
      // Mediocampistas
      { number: 5,  name: 'Aleksandar Pavlović',    position: 'MF', club: 'Bayern Munich' },
      { number: 8,  name: 'Leon Goretzka',          position: 'MF', club: 'Bayern Munich' },
      { number: 13, name: 'Pascal Groß',            position: 'MF', club: 'Brighton & Hove Albion' },
      { number: 16, name: 'Angelo Stiller',         position: 'MF', club: 'VfB Stuttgart' },
      { number: 17, name: 'Florian Wirtz',          position: 'MF', club: 'Liverpool' },
      { number: 20, name: 'Nadiem Amiri',           position: 'MF', club: 'FSV Mainz 05' },
      { number: 23, name: 'Felix Nmecha',           position: 'MF', club: 'Borussia Dortmund' },
      { number: 25, name: 'Assan Ouédraogo',        position: 'MF', club: 'RB Leipzig' },
      // Delanteros
      { number: 7,  name: 'Kai Havertz',            position: 'FW', club: 'Arsenal' },
      { number: 9,  name: 'Jamie Leweling',         position: 'FW', club: 'VfB Stuttgart' },
      { number: 10, name: 'Jamal Musiala',          position: 'FW', club: 'Bayern Munich' },
      { number: 11, name: 'Nick Woltemade',         position: 'FW', club: 'VfB Stuttgart' },
      { number: 14, name: 'Maximilian Beier',       position: 'FW', club: 'Borussia Dortmund' },
      { number: 19, name: 'Leroy Sané',             position: 'FW', club: 'Galatasaray' },
      { number: 26, name: 'Deniz Undav',            position: 'FW', club: 'VfB Stuttgart' },
    ],
  },

  'Curazao': {
    coach: 'Dick Advocaat',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Cura%C3%A7ao.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cura%C3%A7ao_Football_Federation.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Eloy Room',              position: 'GK', club: 'Miami FC' },
      { number: 12, name: 'Tyrick Bodak',           position: 'GK', club: 'Telstar' },
      { number: 22, name: 'Trevor Doornbusch',      position: 'GK', club: 'VVV-Venlo' },
      // Defensas
      { number: 2,  name: 'Deveron Fonville',       position: 'DF', club: 'NEC Nijmegen' },
      { number: 3,  name: 'Shurandy Sambo',         position: 'DF', club: 'Sparta Rotterdam' },
      { number: 4,  name: 'Armando Obispo',         position: 'DF', club: 'PSV Eindhoven' },
      { number: 5,  name: 'Riechedly Bazoer',       position: 'DF', club: 'Konyaspor' },
      { number: 6,  name: 'Jurien Gaari',           position: 'DF', club: 'Abha' },
      { number: 13, name: 'Joshua Brenet',          position: 'DF', club: 'Kayserispor' },
      { number: 14, name: 'Roshon van Eijma',       position: 'DF', club: 'RKC Waalwijk' },
      { number: 23, name: 'Sherel Floranus',        position: 'DF', club: 'PEC Zwolle' },
      // Mediocampistas
      { number: 7,  name: 'Leandro Bacuna',         position: 'MF', club: 'Igdir FK' },
      { number: 8,  name: 'Livano Comenencia',      position: 'MF', club: 'FC Zürich' },
      { number: 15, name: 'Juninho Bacuna',         position: 'MF', club: 'Volendam' },
      { number: 16, name: 'Kevin Felida',           position: 'MF', club: 'FC Den Bosch' },
      { number: 17, name: "Ar'jany Martha",         position: 'MF', club: 'Rotherham United' },
      { number: 18, name: 'Tyrese Noslin',          position: 'MF', club: 'Telstar' },
      { number: 24, name: 'Godfried Roemeratoe',    position: 'MF', club: 'RKC Waalwijk' },
      // Delanteros
      { number: 9,  name: 'Jurgen Locadia',         position: 'FW', club: 'Miami FC' },
      { number: 10, name: 'Tahith Chong',           position: 'FW', club: 'Sheffield United' },
      { number: 11, name: 'Sontje Hansen',          position: 'FW', club: 'Middlesbrough' },
      { number: 19, name: 'Brandley Kuwas',         position: 'FW', club: 'Volendam' },
      { number: 20, name: 'Kenji Gorre',            position: 'FW', club: 'Maccabi Haifa' },
      { number: 21, name: 'Jearl Margaritha',       position: 'FW', club: 'Beveren' },
      { number: 25, name: 'Jeremy Antonisse',       position: 'FW', club: 'Kifisia' },
      { number: 26, name: 'Gervane Kastaneer',      position: 'FW', club: 'Terengganu FC' },
    ],
  },

  'Costa de Marfil': {
    coach: 'Emerse Faé',
    formation: '4-3-3',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_C%C3%B4te_d%27Ivoire.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Federation_Ivoirienne_de_Football.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Alban Lafont',           position: 'GK', club: 'Panathinaikos' },
      { number: 16, name: 'Yahia Fofana',           position: 'GK', club: 'Çaykur Rizespor' },
      { number: 23, name: 'Mohamed Koné',           position: 'GK', club: 'Sporting Charleroi' },
      // Defensas
      { number: 2,  name: 'Wilfried Singo',         position: 'DF', club: 'Galatasaray' },
      { number: 3,  name: 'Ghislain Konan',         position: 'DF', club: 'Gil Vicente' },
      { number: 4,  name: 'Odilon Kossounou',       position: 'DF', club: 'Atalanta' },
      { number: 5,  name: 'Ousmane Diomandé',       position: 'DF', club: 'Sporting CP' },
      { number: 6,  name: 'Evan Ndicka',            position: 'DF', club: 'AS Roma' },
      { number: 13, name: 'Guéla Doué',             position: 'DF', club: 'RC Strasbourg' },
      { number: 20, name: 'Emmanuel Agbadou',       position: 'DF', club: 'Beşiktaş' },
      { number: 24, name: 'Clément Akpa',           position: 'DF', club: 'AJ Auxerre' },
      // Mediocampistas
      { number: 8,  name: 'Franck Kessié',          position: 'MF', club: 'Al-Ahli' },
      { number: 12, name: 'Ibrahim Sangaré',        position: 'MF', club: 'Nottingham Forest' },
      { number: 14, name: 'Seko Fofana',            position: 'MF', club: 'FC Porto' },
      { number: 15, name: 'Jean-Mickaël Seri',      position: 'MF', club: 'NK Maribor' },
      { number: 17, name: 'Parfait Guiagon',        position: 'MF', club: 'Sporting Charleroi' },
      { number: 18, name: 'Christ Inao Oulaï',      position: 'MF', club: 'Trabzonspor' },
      // Delanteros
      { number: 7,  name: 'Nicolas Pépé',           position: 'FW', club: 'Villarreal' },
      { number: 9,  name: 'Elye Wahi',              position: 'FW', club: 'OGC Nice' },
      { number: 10, name: 'Amad Diallo',            position: 'FW', club: 'Manchester United' },
      { number: 11, name: 'Simon Adingra',          position: 'FW', club: 'AS Monaco' },
      { number: 19, name: 'Yan Diomandé',           position: 'FW', club: 'RB Leipzig' },
      { number: 21, name: 'Bazoumana Touré',        position: 'FW', club: 'TSG Hoffenheim' },
      { number: 22, name: 'Evann Guessand',         position: 'FW', club: 'Crystal Palace' },
      { number: 25, name: 'Oumar Diakité',          position: 'FW', club: 'Cercle Brugge' },
      { number: 26, name: 'Ange-Yoan Bonny',        position: 'FW', club: 'Inter Milan' },
    ],
  },

  'Ecuador': {
    coach: 'Sebastián Beccacece',
    formation: '4-4-2',
    flagImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Ecuador.svg',
    crestImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Federaci%C3%B3n_Ecuatoriana_de_F%C3%BAtbol_logo.svg',
    players: [
      // Porteros
      { number: 1,  name: 'Hernán Galíndez',        position: 'GK', club: 'Huracán' },
      { number: 12, name: 'Moisés Ramírez',         position: 'GK', club: 'AE Kifisias' },
      { number: 13, name: 'Gonzalo Valle',          position: 'GK', club: 'LDU Quito' },
      // Defensas
      { number: 2,  name: 'Ángelo Preciado',        position: 'DF', club: 'Atlético Mineiro' },
      { number: 3,  name: 'Piero Hincapié',         position: 'DF', club: 'Arsenal' },
      { number: 4,  name: 'Félix Torres',           position: 'DF', club: 'Internacional' },
      { number: 5,  name: 'Willian Pacho',          position: 'DF', club: 'Paris Saint-Germain' },
      { number: 6,  name: 'Pervis Estupiñán',       position: 'DF', club: 'AC Milan' },
      { number: 14, name: 'Joel Ordóñez',           position: 'DF', club: 'Club Brugge' },
      { number: 22, name: 'Jackson Porozo',         position: 'DF', club: 'Club Tijuana' },
      // Mediocampistas
      { number: 7,  name: 'Pedro Vite',             position: 'MF', club: 'Pumas UNAM' },
      { number: 8,  name: 'Moisés Caicedo',         position: 'MF', club: 'Chelsea' },
      { number: 15, name: 'Jordy Alcívar',          position: 'MF', club: 'Independiente del Valle' },
      { number: 16, name: 'Denil Castillo',         position: 'MF', club: 'FC Midtjylland' },
      { number: 17, name: 'Alan Franco',            position: 'MF', club: 'Atlético Mineiro' },
      { number: 19, name: 'Kendry Páez',            position: 'MF', club: 'River Plate' },
      { number: 23, name: 'Yaimar Medina',          position: 'MF', club: 'KRC Genk' },
      // Delanteros
      { number: 9,  name: 'Enner Valencia',         position: 'FW', club: 'Pachuca' },
      { number: 10, name: 'Gonzalo Plata',          position: 'FW', club: 'Flamengo' },
      { number: 11, name: 'Kevin Rodríguez',         position: 'FW', club: 'Union Saint-Gilloise' },
      { number: 18, name: 'Anthony Valencia',       position: 'FW', club: 'Royal Antwerp' },
      { number: 20, name: 'Jeremy Arévalo',         position: 'FW', club: 'VfB Stuttgart' },
      { number: 21, name: 'Nilson Angulo',          position: 'FW', club: 'Sunderland' },
      { number: 24, name: 'John Yeboah',            position: 'FW', club: 'Venezia' },
      { number: 25, name: 'Jordy Caicedo',          position: 'FW', club: 'Huracán' },
      { number: 26, name: 'Alan Minda',             position: 'FW', club: 'Atlético Mineiro' },
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
