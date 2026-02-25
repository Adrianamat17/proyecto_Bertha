const mongoose = require('mongoose');
const Game = require('./models/Game');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gamevault';

const sampleGames = [
  {
    titulo: 'The Legend of Zelda: Breath of the Wild',
    descripcion: 'Aventura épica en un Hyrule devastado, con libertad total para explorar.',
    horasJugadas: 85,
    fechaLanzamiento: new Date('2017-03-03'),
    completado: true,
    porcentajeCompletado: 100,
    imagen: 'https://gaming-cdn.com/images/products/2616/orig/the-legend-of-zelda-b...'
  },
  {
    titulo: 'God of War Ragnarök',
    descripcion: 'Mitos y Atreus enfrentan el fin del mundo en la mitología nórdica, con combates intensos.',
    horasJugadas: 45,
    fechaLanzamiento: new Date('2022-11-09'),
    completado: false,
    porcentajeCompletado: 75,
    imagen: 'https://cdni.epicgames.com/spt-assets/edaff839f0734d16bc89d2ddb1dc9339_...'
  },
  {
    titulo: 'Elden Ring',
    descripcion: 'Un souls-like en un mundo abierto misterioso. Fuerte en dificultad y exploración.',
    horasJugadas: 120,
    fechaLanzamiento: new Date('2022-02-25'),
    completado: true,
    porcentajeCompletado: 100,
    imagen: ''
  },
  {
    titulo: 'Cyberpunk 2077',
    descripcion: 'RPG de acción en un futuro distópico. Empieza con bugs pero con gran potencial.',
    horasJugadas: 60,
    fechaLanzamiento: new Date('2020-12-10'),
    completado: false,
    porcentajeCompletado: 45,
    imagen: ''
  },
  {
    titulo: 'Hogwarts Legacy',
    descripcion: 'Explora el universo mágico de Harry Potter. Un juego de magia y aventura.',
    horasJugadas: 70,
    fechaLanzamiento: new Date('2023-02-10'),
    completado: false,
    porcentajeCompletado: 88,
    imagen: ''
  },
  {
    titulo: 'Final Fantasy VII Remake',
    descripcion: 'Recuento del clásico JRPG remasterizado con gráficos modernos.',
    horasJugadas: 45,
    fechaLanzamiento: new Date('2020-04-10'),
    completado: true,
    porcentajeCompletado: 100,
    imagen: ''
  },
  {
    titulo: 'Monster Hunter: World',
    descripcion: 'Caza monstruos épicos en entornos hermosos. Jugabilidad adictiva y cooperativa.',
    horasJugadas: 200,
    fechaLanzamiento: new Date('2018-01-26'),
    completado: false,
    porcentajeCompletado: 60,
    imagen: ''
  },
  {
    titulo: 'Baldurs Gate 3',
    descripcion: 'RPG épico basado en D&D con múltiples caminos y decisiones significativas.',
    horasJugadas: 150,
    fechaLanzamiento: new Date('2023-08-03'),
    completado: false,
    porcentajeCompletado: 70,
    imagen: ''
  },
  {
    titulo: 'Stardew Valley',
    descripcion: 'Simulador de granja relajante. Cultiva, pesca, genera relaciones y explora minas.',
    horasJugadas: 300,
    fechaLanzamiento: new Date('2016-02-28'),
    completado: false,
    porcentajeCompletado: 50,
    imagen: ''
  },
  {
    titulo: 'Hades',
    descripcion: 'Roguelike con mecánicas adictivas. Descendiente del dios Hades intenta escapar.',
    horasJugadas: 80,
    fechaLanzamiento: new Date('2020-09-17'),
    completado: true,
    porcentajeCompletado: 100,
    imagen: ''
  },
  {
    titulo: 'Hollow Knight',
    descripcion: 'Metroidvania desafiante en un reino subterráneo lleno de secretos.',
    horasJugadas: 40,
    fechaLanzamiento: new Date('2017-02-24'),
    completado: true,
    porcentajeCompletado: 95,
    imagen: ''
  },
  {
    titulo: 'Dark Souls III',
    descripcion: 'Souls-like clásico. Difícil, oscuro y profundamente recompensante.',
    horasJugadas: 90,
    fechaLanzamiento: new Date('2016-03-24'),
    completado: true,
    porcentajeCompletado: 100,
    imagen: ''
  },
  {
    titulo: 'The Witcher 3: Wild Hunt',
    descripcion: 'RPG de mundo abierto siguiendo aventuras del brujo Geralt de Rivia.',
    horasJugadas: 130,
    fechaLanzamiento: new Date('2015-05-19'),
    completado: true,
    porcentajeCompletado: 100,
    imagen: ''
  },
  {
    titulo: 'Red Dead Redemption 2',
    descripcion: 'Epopeya del Oeste en línea violenta. Detallado, hermoso e inmersivo.',
    horasJugadas: 100,
    fechaLanzamiento: new Date('2018-10-26'),
    completado: false,
    porcentajeCompletado: 65,
    imagen: ''
  },
  {
    titulo: 'Minecraft',
    descripcion: 'Sandbox creativo sin fin. Construye, explora y sobrevive en bloques.',
    horasJugadas: 500,
    fechaLanzamiento: new Date('2011-11-18'),
    completado: false,
    porcentajeCompletado: 30,
    imagen: ''
  },
  {
    titulo: 'Fortnite',
    descripcion: 'Battle royale cooperativo. 100 jugadores en una isla para ser el último.',
    horasJugadas: 200,
    fechaLanzamiento: new Date('2018-07-21'),
    completado: false,
    porcentajeCompletado: 0,
    imagen: ''
  },
  {
    titulo: 'Valorant',
    descripcion: 'Shooter táctico competitivo. Habilidades estratégicas y disparos precisos.',
    horasJugadas: 180,
    fechaLanzamiento: new Date('2020-06-02'),
    completado: false,
    porcentajeCompletado: 0,
    imagen: ''
  },
  {
    titulo: 'League of Legends',
    descripcion: 'MOBA estratégico. Juego 5v5 que requiere comunicación y coordinación.',
    horasJugadas: 1200,
    fechaLanzamiento: new Date('2009-10-27'),
    completado: false,
    porcentajeCompletado: 0,
    imagen: ''
  },
  {
    titulo: 'Persona 5 Royal',
    descripcion: 'JRPG con sistema de calendario único. Alto escolar y ladrón de corazones.',
    horasJugadas: 110,
    fechaLanzamiento: new Date('2019-03-31'),
    completado: true,
    porcentajeCompletado: 100,
    imagen: ''
  },
  {
    titulo: 'Subnautica',
    descripcion: 'Exploración submarina en un planeta oceánico alienígena. Misterio y aventura.',
    horasJugadas: 55,
    fechaLanzamiento: new Date('2018-12-04'),
    completado: false,
    porcentajeCompletado: 80,
    imagen: ''
  }
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a la BD para sembrar datos');
    await Game.deleteMany({});
    await Game.insertMany(sampleGames);
    console.log('Datos de siembra insertados exitosamente');
    process.exit();
  } catch (err) {
    console.error('Error al sembrar datos', err);
    process.exit(1);
  }
})();