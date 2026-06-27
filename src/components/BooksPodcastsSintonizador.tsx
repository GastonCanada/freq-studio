import { Book, Radio, Play, Loader2, Sparkles, ChevronRight, ChevronLeft, Volume2, Search, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface PodcastRelation {
  name: string;
  author: string;
  lang: "es" | "en" | "fr" | "pt" | string;
  desc: string;
  image: string;
  itunesId: string; // Ensure all shown have a valid working iTunes ID
}

interface LiteraryBook {
  title: string;
  author: string;
  categoryId: string; // language-agnostic ID for easy filtering
  categoryLabel: string;
  categoryIcon: string;
  coverImage: string;
  description: string;
  relations: PodcastRelation[];
}

interface BooksPodcastsSintonizadorProps {
  appLanguage: string;
  onPlayPodcast: (podcast: any) => void;
  onSearchRadio: (query: string) => void;
}

// 1. STUNNING MULTILINGUAL LITERARY CONFIGURATION (100% WORKING PODCASTS ONLY)
const LITERARY_BOOKS_BY_LANG: Record<string, LiteraryBook[]> = {
  es: [
    {
      title: "Palabra plena",
      author: "Gabriel Rolón",
      categoryId: "psychology",
      categoryLabel: "Psicología y Relaciones",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80",
      description: "La palabra es nuestra herramienta de salvación; decir las verdades mudas que habitan en nosotros nos cambia el destino y nos conecta con lo real:",
      relations: [
        {
          name: "Palabra Plena",
          author: "Gabriel Rolón",
          lang: "es",
          desc: "El podcast oficial donde el terapeuta profundiza sobre miedos, duelos, traumas y el poder sanador de hablar.",
          image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=150&q=80",
          itunesId: "1565574041"
        },
        {
          name: "Entiende tu Mente",
          author: "Molo Cebrián",
          lang: "es",
          desc: "Podcast de psicología humana para entender cómo opera nuestra mente en el día a día.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1314643077"
        }
      ]
    },
    {
      title: "El duelo",
      author: "Gabriel Rolón",
      categoryId: "psychology",
      categoryLabel: "Psicología y Relaciones",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80",
      description: "El dolor de perder es un laberinto. Esta lectura encarna lo que perdemos al amar y cómo rearmar el alma:",
      relations: [
        {
          name: "Palabra Plena",
          author: "Gabriel Rolón",
          lang: "es",
          desc: "La extensión oficial en audio del terapeuta analizando las pérdidas y el dolor humano.",
          image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=150&q=80",
          itunesId: "1565574041"
        },
        {
          name: "Hidden Brain",
          author: "NPR (Subtítulos en App)",
          lang: "en",
          desc: "Explica con base científica los procesos cognitivos de la tristeza y el duelo.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        },
        {
          name: "Grand Bien Vous Fasse !",
          author: "France Inter",
          lang: "fr",
          desc: "Bienestar emocional y reconstrucción personal tras grandes tormentas de la vida.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "1151600371"
        }
      ]
    },
    {
      title: "La felicidad",
      author: "Gabriel Rolón",
      categoryId: "psychology",
      categoryLabel: "Psicología y Relaciones",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80",
      description: "Desmitifica la felicidad como utopía y la expone como el arte del deseo continuo:",
      relations: [
        {
          name: "La Venganza Será Terrible (Oficial)",
          author: "Alejandro Dolina",
          lang: "es",
          desc: "Las ironías del ser humano buscando su destino, deseos y anhelos diarios.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "1485293406"
        },
        {
          name: "Entiende tu Mente",
          author: "Molo Cebrián",
          lang: "es",
          desc: "Podcast de psicología que analiza cómo nos saboteamos o abrazamos la calma.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1314643077"
        },
        {
          name: "Fresh Air",
          author: "NPR",
          lang: "en",
          desc: "Conversaciones icónicas sobre el sentido de la felicidad en la sociedad actual.",
          image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80",
          itunesId: "214089294"
        }
      ]
    },
    {
      title: "El arte de amar",
      author: "Erich Fromm",
      categoryId: "psychology",
      categoryLabel: "Psicología y Relaciones",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80",
      description: "El amor es un arte que demanda madurez, práctica diaria y un profundo autoconocimiento:",
      relations: [
        {
          name: "Palabra Plena",
          author: "Gabriel Rolón",
          lang: "es",
          desc: "Reflexiones del apego y cómo construir un amor libre sin neurosis destructivas.",
          image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=150&q=80",
          itunesId: "1565574041"
        },
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "La ciencia psicológica detrás del afecto, de los vínculos sociales y familiares.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        }
      ]
    },
    {
      title: "Demian",
      author: "Hermann Hesse",
      categoryId: "identity",
      categoryLabel: "Búsqueda e Identidad",
      categoryIcon: "🌌",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80",
      description: "La ardua ruptura de las convenciones para dar nacimiento al propio yo espiritual de la persona:",
      relations: [
        {
          name: "Palabra Plena",
          author: "Gabriel Rolón",
          lang: "es",
          desc: "Explora la angustia de la adolescencia y la reconstrucción activa de la identidad propia.",
          image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=150&q=80",
          itunesId: "1565574041"
        },
        {
          name: "In Our Time",
          author: "BBC Radio 4",
          lang: "en",
          desc: "Grandes corrientes filosóficas sobre la individuación y el misticismo del yo.",
          image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330895"
        }
      ]
    },
    {
      title: "Siddhartha",
      author: "Hermann Hesse",
      categoryId: "identity",
      categoryLabel: "Búsqueda e Identidad",
      categoryIcon: "🌌",
      coverImage: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=80",
      description: "La odisea de buscar sabidurías absolutas a través de los extremos de la vida y el río de la existencia:",
      relations: [
        {
          name: "On Being",
          author: "Krista Tippett",
          lang: "en",
          desc: "Conversaciones espirituales sobre el sentido íntimo de la vida y la contemplación.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "150800058"
        },
        {
          name: "La Venganza Será Terrible (Oficial)",
          author: "Alejandro Dolina",
          lang: "es",
          desc: "Parábolas poéticas de pensadores orientales que dudaron de los dogmas de la vida.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "1485293406"
        }
      ]
    },
    {
      title: "Rayuela",
      author: "Julio Cortázar",
      categoryId: "literature",
      categoryLabel: "Literatura y Condición",
      categoryIcon: "📖",
      coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=300&q=80",
      description: "Un juego de saltos libres entre París y Buenos Aires sintonizado al tempo libre del jazz mas bohemio:",
      relations: [
        {
          name: "La Venganza Será Terrible (Oficial)",
          author: "Alejandro Dolina",
          lang: "es",
          desc: "Literatura descontracturada, humor intelectual, mitología absurda y jazz de fondo.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "1485293406"
        },
        {
          name: "La Milana Bonita",
          author: "Análisis Literario",
          lang: "es",
          desc: "Dedicado a descifrar la estructura rota y la poesía libre en la obra maestra de Cortázar.",
          image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=150&q=80",
          itunesId: "367390626"
        },
        {
          name: "Thinking Allowed",
          author: "BBC Radio 4",
          lang: "en",
          desc: "Sociología urbana y existencialismo de los marginados de la bella vida bohemia.",
          image: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=150&q=80",
          itunesId: "191632731"
        }
      ]
    },
    {
      title: "Ficciones",
      author: "Jorge Luis Borges",
      categoryId: "literature",
      categoryLabel: "Literatura y Condición",
      categoryIcon: "📖",
      coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80",
      description: "Laberintos insondables, bibliotecas que custodian el infinito y universos con espejos traicioneros:",
      relations: [
        {
          name: "La Venganza Será Terrible (Oficial)",
          author: "Alejandro Dolina",
          lang: "es",
          desc: "Conversaciones sobre el infinito, mitos orientales y ficciones de autores universales.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "1485293406"
        },
        {
          name: "In Our Time",
          author: "BBC Radio 4",
          lang: "en",
          desc: "Abarca paradojas de las matemáticas griegas, la física moderna y la memoria colosal.",
          image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330895"
        }
      ]
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      categoryId: "society",
      categoryLabel: "Sociedad e Historia",
      categoryIcon: "🌍",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      description: "Cómo un simio común construyó imperios tejiendo mitos y ficciones colectivas:",
      relations: [
        {
          name: "Throughline",
          author: "NPR",
          lang: "en",
          desc: "Un viaje sonoro al pasado para ilustrar las mitologías que guían al hombre de hoy.",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80",
          itunesId: "1451560842"
        },
        {
          name: "El Explicador",
          author: "Enrique Ganem",
          lang: "es",
          desc: "Exposición científica y fluida sobre los orígenes y evolución de la especie humana.",
          image: "https://images.unsplash.com/photo-403164104?auto=format&fit=crop&w=150&q=80",
          itunesId: "403164104"
        }
      ]
    },
    {
      title: "1984",
      author: "George Orwell",
      categoryId: "society",
      categoryLabel: "Sociedad e Historia",
      categoryIcon: "🌍",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
      description: "La distopía máxima sobre la censura, el control absoluto de la información y la tecnovigilancia total:",
      relations: [
        {
          name: "DianaUribe.fm",
          author: "Diana Uribe",
          lang: "es",
          desc: "Análisis histórico brillante del totalitarismo, la propaganda de guerra y el control social.",
          image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1438902521"
        },
        {
          name: "The World Tonight",
          author: "BBC Radio 4",
          lang: "en",
          desc: "Crónica de política mundial actual sobre desinformación, manipulación y fake news estatales.",
          image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=150&q=80",
          itunesId: "278635544"
        }
      ]
    },
    {
      title: "Pensar rápido, pensar despacio",
      author: "Daniel Kahneman",
      categoryId: "economics",
      categoryLabel: "Economía y Conducta",
      categoryIcon: "💰",
      coverImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=300&q=80",
      description: "El cerebro opera con dos sistemas: uno impulsivo e intuitivo, otro lento y perezosamente lógico:",
      relations: [
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "Los sorprendentes sesgos cognitivos inconscientes que determinan nuestras compras y elecciones.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        },
        {
          name: "Entiende tu Mente",
          author: "Molo Cebrián",
          lang: "es",
          desc: "Psicología práctica que nos devela cómo funciona el sesgo de confirmación y el pánico diario.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1314643077"
        },
        {
          name: "Planet Money",
          author: "NPR",
          lang: "en",
          desc: "Economía contada con historias súper entretenidas sobre el irracional consumo humano.",
          image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=150&q=80",
          itunesId: "290783428"
        }
      ]
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      categoryId: "science",
      categoryLabel: "Ciencia y Curiosidad",
      categoryIcon: "🔬",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      description: "La gran declaración poética de que somos polvo de estrellas buscando descifrar el inconmensurable cosmos:",
      relations: [
        {
          name: "Astronomía y algo más",
          author: "Ricardo García",
          lang: "es",
          desc: "Divulgación clara y poética en español sobre física astrológica, galaxias y planetas lejanos.",
          image: "https://images.unsplash.com/photo-951910757?auto=format&fit=crop&w=150&q=80",
          itunesId: "951910757"
        },
        {
          name: "Radiolab",
          author: "WNYC",
          lang: "en",
          desc: "Historias inmersivas con efectos sonoros espectaculares sobre el espacio, biología y el azar cósmico.",
          image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=150&q=80",
          itunesId: "152243543"
        }
      ]
    },
    {
      title: "Ensayos",
      author: "Michel de Montaigne",
      categoryId: "humor",
      categoryLabel: "Humor y Observación",
      categoryIcon: "🎭",
      coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80",
      description: "El absoluto poder de la duda, la observación aguda del absurdo y la ironía de existir diariamente:",
      relations: [
        {
          name: "Nadie Sabe Nada",
          author: "Buenafuente y Berto",
          lang: "es",
          desc: "Comedia improvisada e irónica desmenuzando la graciosa ridiculez de la rutina cotidiana.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "665143133"
        },
        {
          name: "La Venganza Será Terrible (Oficial)",
          author: "Alejandro Dolina",
          lang: "es",
          desc: "Humor brillante, filosofía del absurdo e inteligencia para reírse de las tragedias de la historia.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "1485293406"
        }
      ]
    },
    {
      title: "Off Campus",
      author: "Elle Kennedy",
      categoryId: "psychology",
      categoryLabel: "Psicología y Relaciones",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
      description: "Amor, drama universitario y relaciones de juventud. Explora cómo navegar los miedos, la intimidad sexual y el crecimiento en tus 20 años:",
      relations: [
        {
          name: "Modern Love",
          author: "The New York Times",
          lang: "en",
          desc: "Relatos reales de amor, pérdida y redención de la famosa columna del NYT; examina la intimidad emocional.",
          image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80",
          itunesId: "1112101614"
        },
        {
          name: "Where Should We Begin? with Esther Perel",
          author: "Esther Perel",
          lang: "en",
          desc: "La terapeuta más famosa del mundo nos introduce en el espacio íntimo para parejas reales que sanan miedos e intimidad.",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80",
          itunesId: "1185558137"
        },
        {
          name: "Dateable Podcast",
          author: "Yue Xu & Julie Krafchick",
          lang: "en",
          desc: "Un análisis sin filtros sobre por qué salir, enamorarse y relacionarse en la era moderna es un viaje salvaje.",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          itunesId: "1200746533"
        },
        {
          name: "The Psychology of Your 20s",
          author: "Jemma Sbeg",
          lang: "en",
          desc: "Explora la ciencia y la psicología detrás de los amores, decepciones y crisis de la década más intensa.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1552599281"
        },
        {
          name: "Anything Goes with Emma Chamberlain",
          author: "Emma Chamberlain",
          lang: "en",
          desc: "Emma comparte sus pensamientos sin filtros sobre la soledad, el amor, las amistades y las presiones de crecer hoy día.",
          image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=150&q=80",
          itunesId: "1494775438"
        }
      ]
    }
  ],
  en: [
    {
      title: "The Death of Ivan Ilyich",
      author: "Leo Tolstoy",
      categoryId: "psychology",
      categoryLabel: "Psychology & Relations",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80",
      description: "A profound literary study of mortality, loss, and how the shadow of grief forces an evaluation of true character:",
      relations: [
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "Probes our emotional defense mechanics, grief cycles, and how we cope with life's end.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        },
        {
          name: "We Can Do Hard Things",
          author: "Glennon Doyle",
          lang: "en",
          desc: "Deeply honest conversations detailing emotional baggage, grief, and moving forward.",
          image: "https://images.unsplash.com/photo-1565367540?auto=format&fit=crop&w=150&q=80",
          itunesId: "1565367540"
        }
      ]
    },
    {
      title: "The Art of Loving",
      author: "Erich Fromm",
      categoryId: "psychology",
      categoryLabel: "Psychology & Relations",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80",
      description: "An inspiring framework arguing that love is not a passive sentiment, but an active art requiring skill:",
      relations: [
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "Explores the psychological foundations of trust, mutual connections, and social attachment.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        },
        {
          name: "On Being",
          author: "Krista Tippett",
          lang: "en",
          desc: "Thought-provoking dialogue on connection, compassion, and shared responsibility.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "150800058"
        }
      ]
    },
    {
      title: "Demian",
      author: "Hermann Hesse",
      categoryId: "identity",
      categoryLabel: "Identity & Growth",
      categoryIcon: "🌌",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80",
      description: "A dark mystical journey of self-discovery, breaking conventional walls to form one's core destiny:",
      relations: [
        {
          name: "On Being",
          author: "Krista Tippett",
          lang: "en",
          desc: "Investigates spiritual wandering, inner shadows, and finding comfort outside norms.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "150800058"
        },
        {
          name: "In Our Time",
          author: "BBC Radio 4",
          lang: "en",
          desc: "Expert academic focus on historical movements of philosophy and self-determination.",
          image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330895"
        }
      ]
    },
    {
      title: "Ficciones",
      author: "Jorge Luis Borges",
      categoryId: "literature",
      categoryLabel: "Literature & Meaning",
      categoryIcon: "📖",
      coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80",
      description: "Infinite conceptual labyrinths, infinite libraries, and surreal literary game theories:",
      relations: [
        {
          name: "In Our Time",
          author: "BBC Radio 4",
          lang: "en",
          desc: "Deep studies of infinity, temporal loops, paradoxes, and epic historic myths.",
          image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330895"
        },
        {
          name: "The New Yorker: Fiction",
          author: "The New Yorker",
          lang: "en",
          desc: "Brilliant, modern narrative files designed to break boundaries of reality.",
          image: "https://images.unsplash.com/photo-260959411?auto=format&fit=crop&w=150&q=80",
          itunesId: "260959411"
        }
      ]
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      categoryId: "society",
      categoryLabel: "Society & History",
      categoryIcon: "🌍",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      description: "The thrilling saga of an ordinary ape evolving to dominate Earth via shared stories:",
      relations: [
        {
          name: "Throughline",
          author: "NPR",
          lang: "en",
          desc: "Crafts beautiful history threads explaining how modern human systems were born.",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80",
          itunesId: "1451560842"
        },
        {
          name: "Ideas",
          author: "CBC Radio",
          lang: "en",
          desc: "Detailed essays covering evolution, sociopolitical power, and the future of science.",
          image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=150&q=80",
          itunesId: "261623354"
        }
      ]
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      categoryId: "economics",
      categoryLabel: "Economics & Behavior",
      categoryIcon: "💰",
      coverImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=300&q=80",
      description: "Maps our judgment traps: the reactive fast system versus the deliberate, lazy slow system:",
      relations: [
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "Explores unconscious consumer hooks, cognitive errors, and daily economic biases.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        },
        {
          name: "Planet Money",
          author: "NPR",
          lang: "en",
          desc: "High-level economic lessons wrapped around entertaining real-world human sagas.",
          image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=150&q=80",
          itunesId: "290783428"
        }
      ]
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      categoryId: "science",
      categoryLabel: "Science & Curiosity",
      categoryIcon: "🔬",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      description: "A gorgeous, poetic invitation to align our minuscule lives with the vast, spinning galaxy:",
      relations: [
        {
          name: "Radiolab",
          author: "WNYC Studios",
          lang: "en",
          desc: "Mind-expanding cinematic audio documentary files analyzing quantum loops and gravity.",
          image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=150&q=80",
          itunesId: "152243543"
        },
        {
          name: "Science Friday",
          author: "NPR",
          lang: "en",
          desc: "Engaging conversations dissecting immediate biological and space findings with experts.",
          image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330236"
        }
      ]
    },
    {
      title: "Essays",
      author: "Michel de Montaigne",
      categoryId: "humor",
      categoryLabel: "Humor & Observation",
      categoryIcon: "🎭",
      coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80",
      description: "Pioneered absolute healthy skepticism, mocking human vanities with elegance and humor:",
      relations: [
        {
          name: "In Our Time",
          author: "BBC Radio 4",
          lang: "en",
          desc: "Discusses the historic foundations of political satire, skepticism, and human humor.",
          image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330895"
        },
        {
          name: "The Daily Show",
          author: "Comedy Central",
          lang: "en",
          desc: "Brilliant modern satire deconstructing institutional norms and societal policies.",
          image: "https://images.unsplash.com/photo-1537233215-fbdf91799277?auto=format&fit=crop&w=150&q=80",
          itunesId: "1537233215"
        }
      ]
    },
    {
      title: "Off Campus",
      author: "Elle Kennedy",
      categoryId: "psychology",
      categoryLabel: "Psychology & Relations",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
      description: "College romance, drama, and fierce relationships. Explores intimacy, emotional challenges, and growing up in modern campuses:",
      relations: [
        {
          name: "Modern Love",
          author: "The New York Times",
          lang: "en",
          desc: "Stories of love, loss, and redemption. Examines the raw complexities of contemporary relationships.",
          image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80",
          itunesId: "1112101614"
        },
        {
          name: "Where Should We Begin? with Esther Perel",
          author: "Esther Perel",
          lang: "en",
          desc: "Step into the consulting room of preeminent therapist Esther Perel for conversations on desire and trust.",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80",
          itunesId: "1185558137"
        },
        {
          name: "Dateable Podcast",
          author: "Yue Xu & Julie Krafchick",
          lang: "en",
          desc: "An unfiltered look into why matching, dating, and loving today is such a rewarding yet chaotic experiment.",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          itunesId: "1200746533"
        },
        {
          name: "The Psychology of Your 20s",
          author: "Jemma Sbeg",
          lang: "en",
          desc: "The clinical research and brain chemistry explaining the heartbreak, dating mistakes, and identity struggles of youth.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1552599281"
        },
        {
          name: "Anything Goes with Emma Chamberlain",
          author: "Emma Chamberlain",
          lang: "en",
          desc: "Emma's unfiltered personal audio diary confronting isolation, youth dating, body issues, and growing up today.",
          image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=150&q=80",
          itunesId: "1494775438"
        }
      ]
    }
  ],
  pt: [
    {
      title: "O espelho da nossa alma",
      author: "Gabriel Rolón",
      categoryId: "psychology",
      categoryLabel: "Psicologia e Relações",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80",
      description: "Uma imersão corajosa nas dores inevitáveis da ausência, luto e cura afetiva:",
      relations: [
        {
          name: "Palabra Plena",
          author: "Gabriel Rolón",
          lang: "es",
          desc: "Aborda os labirintos do luto e do restabelecimento emocional de forma humana.",
          image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=150&q=80",
          itunesId: "1565574041"
        },
        {
          name: "Entiende tu Mente",
          author: "Molo Cebrián",
          lang: "es",
          desc: "Análise leve e científica das dinâmicas mentais diante de perdas e ansiedades.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1314643077"
        }
      ]
    },
    {
      title: "A Arte de Amar",
      author: "Erich Fromm",
      categoryId: "psychology",
      categoryLabel: "Psicologia e Relações",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80",
      description: "O amor verdadeiro exige disciplina, esforço amadurecido e autoconhecimento genuíno:",
      relations: [
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "Estudo científico de laços familiares, comportamento social e empatia.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        },
        {
          name: "On Being",
          author: "Krista Tippett",
          lang: "en",
          desc: "Diálogos sobre bem-estar coletivo, compaixão profunda e ética afetiva.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "150800058"
        }
      ]
    },
    {
      title: "Siddhartha",
      author: "Hermann Hesse",
      categoryId: "identity",
      categoryLabel: "Identidade e Busca",
      categoryIcon: "🌌",
      coverImage: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=80",
      description: "A peregrinação sagrada ao Oriente, a comunhão com as águas e a busca da iluminação interna:",
      relations: [
        {
          name: "On Being",
          author: "Krista Tippett",
          lang: "en",
          desc: "Contemplação, espiritualidade pragmática e as buscas morais humanas.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "150800058"
        },
        {
          name: "La Venganza Será Terrible (Oficial)",
          author: "Alejandro Dolina",
          lang: "es",
          desc: "Histórias do misticismo oriental e da tolerância contadas de forma poética.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "1485293406"
        }
      ]
    },
    {
      title: "Ficções",
      author: "Jorge Luis Borges",
      categoryId: "literature",
      categoryLabel: "Literatura e Condição",
      categoryIcon: "📖",
      coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80",
      description: "Labirintos colossais, bibliotecas sem fim e geometrias imaginadas sobre a realidade:",
      relations: [
        {
          name: "La Venganza Será Terrible (Oficial)",
          author: "Alejandro Dolina",
          lang: "es",
          desc: "Relatos incríveis de paradoxos lógicos e a literatura de fantasia clássica.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "1485293406"
        },
        {
          name: "In Our Time",
          author: "BBC Radio 4",
          lang: "en",
          desc: "A matemática e a filosofia por trás dos infinitos, lendas e o fluir do tempo.",
          image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330895"
        }
      ]
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      categoryId: "society",
      categoryLabel: "Sociedade e História",
      categoryIcon: "🌍",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      description: "A meteórica aventura da espécie humana, unida por ficções que construíram nações e moedas:",
      relations: [
        {
          name: "Throughline",
          author: "NPR",
          lang: "en",
          desc: "Retorna a encruzilhadas históricas para revelar de onde surgem nossas crenças atuais.",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80",
          itunesId: "1451560842"
        },
        {
          name: "Ideas",
          author: "CBC Radio",
          lang: "en",
          desc: "Investigações densas sobre como ideias coletivas controlam as mentes de grupos.",
          image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=150&q=80",
          itunesId: "261623354"
        }
      ]
    },
    {
      title: "Rápido e Devagar",
      author: "Daniel Kahneman",
      categoryId: "economics",
      categoryLabel: "Economia e Conduta",
      categoryIcon: "💰",
      coverImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=300&q=80",
      description: "Nossos dois canais de pensamento lógico, revelando incríveis armadilhas diárias de tomada de decisões:",
      relations: [
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "Decisões morais e financeiras sob a impressionante lente oculta do subconsciente.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        },
        {
          name: "Planet Money",
          author: "NPR",
          lang: "en",
          desc: "Crônicas divertidíssimas mostrando a economia aplicada aos atos cotidianos.",
          image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=150&q=80",
          itunesId: "290783428"
        }
      ]
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      categoryId: "science",
      categoryLabel: "Ciência e Curiosidad",
      categoryIcon: "🔬",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      description: "Uma maravilhosa viagem poética pelo tempo e espaço, que nos conecta com a evolução das estrelas:",
      relations: [
        {
          name: "Radiolab",
          author: "WNYC Studios",
          lang: "en",
          desc: "Criações sonoras majestosas sobre física de partículas, ecologia e cosmos.",
          image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=150&q=80",
          itunesId: "152243543"
        },
        {
          name: "Science Friday",
          author: "NPR",
          lang: "en",
          desc: "O melhor jornalismo de ciência, clima, biodiversidade e exploração espacial.",
          image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330236"
        }
      ]
    },
    {
      title: "Ensaios",
      author: "Michel de Montaigne",
      categoryId: "humor",
      categoryLabel: "Humor e Reflexão",
      categoryIcon: "🎭",
      coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80",
      description: "A arte de duvidar de tudo, observando e rindo de nossas próprias ilusões e fragilidades humanas:",
      relations: [
        {
          name: "Nadie Sabe Nada",
          author: "Buenafuente y Berto",
          lang: "es",
          desc: "Improvisação hilária e questionamentos cômicos das coisas mais banais do dia.",
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=150&q=80",
          itunesId: "665143133"
        }
      ]
    },
    {
      title: "Off Campus",
      author: "Elle Kennedy",
      categoryId: "psychology",
      categoryLabel: "Psicologia e Relações",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
      description: "Romance universitário e relacionamentos intensos. Explore as delícias, dores e miedos íntimos nos seus 20 anos:",
      relations: [
        {
          name: "Modern Love",
          author: "The New York Times",
          lang: "en",
          desc: "Histórias fascinantes e profundas de afeto, perdas e intimidade do jornal novaiorquino.",
          image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80",
          itunesId: "1112101614"
        },
        {
          name: "Where Should We Begin? with Esther Perel",
          author: "Esther Perel",
          lang: "en",
          desc: "A famosa psicoterapeuta ensina sobre os labirintos do desejo e a reconstrução dos casais actuais.",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80",
          itunesId: "1185558137"
        },
        {
          name: "Dateable Podcast",
          author: "Yue Xu & Julie Krafchick",
          lang: "en",
          desc: "Reflexões brutas sobre encontros virtuais, namoro e amor urbano no século XXI.",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          itunesId: "1200746533"
        },
        {
          name: "The Psychology of Your 20s",
          author: "Jemma Sbeg",
          lang: "en",
          desc: "A ciência neurológica e de comportamento por trás da turbulenta e maravilhosa vida jovem adulta.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1552599281"
        },
        {
          name: "Anything Goes with Emma Chamberlain",
          author: "Emma Chamberlain",
          lang: "en",
          desc: "Opiniões sem censura de Emma sobre vulnerabilidade, ciúmes, romances e amadurecer.",
          image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=150&q=80",
          itunesId: "1494775438"
        }
      ]
    }
  ],
  fr: [
    {
      title: "L'Art d'aimer",
      author: "Erich Fromm",
      categoryId: "psychology",
      categoryLabel: "Psychologie et Relations",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80",
      description: "L'amour n'est pas un sentiment hasardeux mais un art exigeant, nécessitant pratique et connaissance de soi :",
      relations: [
        {
          name: "Grand Bien Vous Fasse !",
          author: "France Inter",
          lang: "fr",
          desc: "Une exploration formidable de l'intimité, des liens de couple, de la résilience et des sentiments.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "1151600371"
        },
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "Décrypte scientifiquement les comportements invisibles et le ciment des affections humaines.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        }
      ]
    },
    {
      title: "Le Dénouement",
      author: "Gabriel Rolón",
      categoryId: "psychology",
      categoryLabel: "Psychologie et Relations",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80",
      description: "Traverser les ruptures et le deuil. Comment reconstruire intelligemment notre paysage spirituel :",
      relations: [
        {
          name: "Grand Bien Vous Fasse !",
          author: "France Inter",
          lang: "fr",
          desc: "L'accompagnement et l'analyse psychologique du bien-être et de la guérison émotionnelle.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "1151600371"
        },
        {
          name: "Palabra Plena",
          author: "Gabriel Rolón",
          lang: "es",
          desc: "Le podcast officiel du clinicien sur les fractures humaines, le deuil et l'acceptation de soi.",
          image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=150&q=80",
          itunesId: "1565574041"
        }
      ]
    },
    {
      title: "Siddhartha",
      author: "Hermann Hesse",
      categoryId: "identity",
      categoryLabel: "Identité et Quête",
      categoryIcon: "🌌",
      coverImage: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=80",
      description: "Le fabuleux voyage initiatique vers l'éveil mystique absolu et la communion intime avec l'univers :",
      relations: [
        {
          name: "On Being",
          author: "Krista Tippett",
          lang: "en",
          desc: "Entretiens inspirants sur la recherche de sens, l'éthique et la paix intérieure des individus.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "150800058"
        }
      ]
    },
    {
      title: "Fictions",
      author: "Jorge Luis Borges",
      categoryId: "literature",
      categoryLabel: "Littérature et Condition",
      categoryIcon: "📖",
      coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80",
      description: "Labyrinthes mentaux vertigineux, bibliothèques labyrinthiques et vertiges mathématiques :",
      relations: [
        {
          name: "In Our Time",
          author: "BBC Radio 4",
          lang: "en",
          desc: "Exploration pointue du concept de l'infini, du temps cyclique et des mythologies.",
          image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=150&q=80",
          itunesId: "73330895"
        }
      ]
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      categoryId: "society",
      categoryLabel: "Société et Histoire",
      categoryIcon: "🌍",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      description: "Le parcours épique de l'humanité, propulsée à la tête de la biomasse grâce au pouvoir de l'imagination commune :",
      relations: [
        {
          name: "Affaires sensibles",
          author: "Fabrice Drouelle (France Inter)",
          lang: "fr",
          desc: "Les destins, les intrigues historiques majeures qui ont façonné notre époque contemporaine.",
          image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80",
          itunesId: "917992775"
        },
        {
          name: "Throughline",
          author: "NPR",
          lang: "en",
          desc: "Retrace l'histoire profonde pour brosser un tableau captivant de nos croyances modernes.",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80",
          itunesId: "1451560842"
        }
      ]
    },
    {
      title: "1984",
      author: "George Orwell",
      categoryId: "society",
      categoryLabel: "Société et Histoire",
      categoryIcon: "🌍",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
      description: "Le chef-d'œuvre de la surveillance étatique totale, de la manipulation linguistique et du secret :",
      relations: [
        {
          name: "Le 18/20",
          author: "France Inter",
          lang: "fr",
          desc: "Décryptage minutieux de l'actualité politique mondiale, liberté de la presse et démocratie.",
          image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80",
          itunesId: "149673323"
        }
      ]
    },
    {
      title: "Système 1 / Système 2",
      author: "Daniel Kahneman",
      categoryId: "economics",
      categoryLabel: "Économie et Comportement",
      categoryIcon: "💰",
      coverImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=300&q=80",
      description: "Les biais inconscients qui dictent nos arbitrages économiques, de l'instinct rapide à la réflexion lente :",
      relations: [
        {
          name: "Hidden Brain",
          author: "NPR",
          lang: "en",
          desc: "Une plongée fascinante dans la psychologie cognitive et les erreurs de jugement du consommateur.",
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=150&q=80",
          itunesId: "1028907525"
        },
        {
          name: "Planet Money",
          author: "NPR",
          lang: "en",
          desc: "L'économie mondiale racontée de manière spectaculaire, accessible et passionnante.",
          image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=150&q=80",
          itunesId: "290783428"
        }
      ]
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      categoryId: "science",
      categoryLabel: "Science et Univers",
      categoryIcon: "🔬",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      description: "L'encyclopédie poétique décrivant notre statut de poussières d'étoiles contemplant l'immensité cosmique :",
      relations: [
        {
          name: "La Terre au Carré",
          author: "France Inter",
          lang: "fr",
          desc: "Sciences de l'environnement, défis climatiques et magnificence de notre planète bleue.",
          image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80",
          itunesId: "1351119793"
        },
        {
          name: "Radiolab",
          author: "WNYC",
          lang: "en",
          desc: "Contes sonores féeriques et investigations rigoureuses sur les mécaniques physiques de l'univers.",
          image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=150&q=80",
          itunesId: "152243543"
        }
      ]
    },
    {
      title: "Essais",
      author: "Michel de Montaigne",
      categoryId: "humor",
      categoryLabel: "Humour et Philosophie",
      categoryIcon: "🎭",
      coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80",
      description: "Fondateur du scepticisme moderne, analysant et moquant joyeusement les folles vanités humaines :",
      relations: [
        {
          name: "Grand Bien Vous Fasse !",
          author: "France Inter",
          lang: "fr",
          desc: "La philosophie du quotidien et l'humour vécus comme remèdes de choix face à la solitude moderne.",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
          itunesId: "1151600371"
        }
      ]
    },
    {
      title: "Off Campus",
      author: "Elle Kennedy",
      categoryId: "psychology",
      categoryLabel: "Psychologie et Relations",
      categoryIcon: "🧠",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
      description: "Romance à l'université, drames amoureux et relations d'une grande intensité. Explorez l'intimité et la quête de soi d'aujourd'hui :",
      relations: [
        {
          name: "Modern Love",
          author: "The New York Times",
          lang: "en",
          desc: "Récits authentiques explorant les formidables variations de l'amour moderne.",
          image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80",
          itunesId: "1112101614"
        },
        {
          name: "Where Should We Begin? with Esther Perel",
          author: "Esther Perel",
          lang: "en",
          desc: "Pénétrez dans le cabinet de la thérapeute Esther Perel pour appréhender les désirs profonds des couples.",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80",
          itunesId: "1185558137"
        },
        {
          name: "Dateable Podcast",
          author: "Yue Xu & Julie Krafchick",
          lang: "en",
          desc: "Pourquoi rencontrer quelqu'un et s'aimer de nos jours est parfois si drôlement complexe et beau.",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          itunesId: "1200746533"
        },
        {
          name: "The Psychology of Your 20s",
          author: "Jemma Sbeg",
          lang: "en",
          desc: "La psychologie derrière les doutes existentiels, les relations saines et l'épanouissement à la vingtaine.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
          itunesId: "1552599281"
        },
        {
          name: "Anything Goes with Emma Chamberlain",
          author: "Emma Chamberlain",
          lang: "en",
          desc: "Chamberlain se confie en toute honnêteté sur le célibat, l'anxiété relationnelle et l'importance de s'aimer soi-même.",
          image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=150&q=80",
          itunesId: "1494775438"
        }
      ]
    }
  ]
};

const CATEGORIES_BY_LANG: Record<string, { id: string; label: string; icon: string }[]> = {
  es: [
    { id: "all", label: "Todos los intereses", icon: "🌟" },
    { id: "psychology", label: "Psicología y Relaciones", icon: "🧠" },
    { id: "identity", label: "Búsqueda e Identidad", icon: "🌌" },
    { id: "literature", label: "Literatura y Condición", icon: "📖" },
    { id: "society", label: "Sociedad e Historia", icon: "🌍" },
    { id: "economics", label: "Economía y Conducta", icon: "💰" },
    { id: "science", label: "Ciencia y Curiosidad", icon: "🔬" },
    { id: "humor", label: "Humor y Observación", icon: "🎭" }
  ],
  en: [
    { id: "all", label: "All interests", icon: "🌟" },
    { id: "psychology", label: "Psychology & Relations", icon: "🧠" },
    { id: "identity", label: "Identity & Growth", icon: "🌌" },
    { id: "literature", label: "Literature & Meaning", icon: "📖" },
    { id: "society", label: "Society & History", icon: "🌍" },
    { id: "economics", label: "Economics & Behavior", icon: "💰" },
    { id: "science", label: "Science & Curiosity", icon: "🔬" },
    { id: "humor", label: "Humor & Observation", icon: "🎭" }
  ],
  pt: [
    { id: "all", label: "Todos os interesses", icon: "🌟" },
    { id: "psychology", label: "Psicologia e Relações", icon: "🧠" },
    { id: "identity", label: "Identidade e Busca", icon: "🌌" },
    { id: "literature", label: "Literatura e Condição", icon: "📖" },
    { id: "society", label: "Sociedade e História", icon: "🌍" },
    { id: "economics", label: "Economia e Conduta", icon: "💰" },
    { id: "science", label: "Ciência e Curiosidade", icon: "🔬" },
    { id: "humor", label: "Humor e Reflexão", icon: "🎭" }
  ],
  fr: [
    { id: "all", label: "Tous les intérêts", icon: "🌟" },
    { id: "psychology", label: "Psychologie et Relations", icon: "🧠" },
    { id: "identity", label: "Identité et Quête de soi", icon: "🌌" },
    { id: "literature", label: "Littérature et Condition", icon: "📖" },
    { id: "society", label: "Société et Histoire", icon: "🌍" },
    { id: "economics", label: "Économie et Comportement", icon: "💰" },
    { id: "science", label: "Science et Univers", icon: "🔬" },
    { id: "humor", label: "Humour et Philosophie", icon: "🎭" }
  ]
};

const TRANSLATIONS: Record<string, any> = {
  es: {
    seccion_tag: "✨ CONEXIÓN LITERARIA EXCLUSIVA",
    titulo: "Sintonía de Intereses: Libros + Podcasts",
    subtitulo: "Encontramos la forma perfecta de que conectes tus intereses, grandes obras de la literatura y podcasts reales en el aire. Elige un interés temático para sumergirte en reflexiones de audio que encajen exactamente con cada libro.",
    probablemente: "Extensión auditiva recomendada:",
    todos: "Todos los intereses",
    en_vivo: "En vivo",
    sintonizar_ahora: "CONECTAR AUDIO",
    sintonizando: "SINTONIZANDO...",
    lectura: "LECTURA",
    por: "de",
    mas: "MÁS",
    conexion_audible: "CONEXIÓN DE AUDIO",
  },
  en: {
    seccion_tag: "✨ EXCLUSIVE LITERARY TUNING",
    titulo: "Interest Tuning: Books + Podcasts",
    subtitulo: "We curated the perfect channel mapping your literary affinities to fully functional podcast audio files. Select a category below to explore professional audio reflections paired directly to each legendary piece of literature.",
    probablemente: "Recommended audio extension:",
    todos: "All interests",
    en_vivo: "Live Stream",
    sintonizar_ahora: "CONNECT AUDIO",
    sintonizando: "TUNING IN...",
    lectura: "BOOK",
    por: "by",
    mas: "PLUS",
    conexion_audible: "AUDIO OUTLET",
  },
  pt: {
    seccion_tag: "✨ CONEXÃO LITERÁRIA EXCLUSIVA",
    titulo: "Fronteira Literária: Livros + Podcasts",
    subtitulo: "Mapeamos pontes inteligentes entre o seu gosto temático, grandes monumentos da leitura mundial e episódios ao vivo do iTunes. Escolha uma categoria para ouvir análises sonoras ricas adequadas para cada livro.",
    probablemente: "Extensão auditiva sugerida:",
    todos: "Todos os interesses",
    en_vivo: "Ao vivo",
    sintonizar_ahora: "CONECTAR ÁUDIO",
    sintonizando: "SINTONIZANDO...",
    lectura: "LEITURA",
    por: "de",
    mas: "MAIS",
    conexion_audible: "SAÍDA DE ÁUDIO",
  },
  fr: {
    seccion_tag: "✨ ALCHIMIE LITTÉRAIRE ET ONDES",
    titulo: "Harmonie Littéraire : Livres + Podcasts",
    subtitulo: "Découvrez des correspondances inspirantes reliant les classiques incontournables de l'esprit aux épisodes audio correspondants du réseau iTunes d'Apple. Parcourez chaque onglet thématique pour enrichir chaque session.",
    probablemente: "Extension sonore recommandée :",
    todos: "Tous les intérêts",
    en_vivo: "En direct",
    sintonizar_ahora: "CONNEXION TRANSMISSION",
    sintonizando: "HARMONISATION...",
    lectura: "LECTURE",
    por: "par",
    mas: "PLUS",
    conexion_audible: "LIAISON SONORE",
  }
};

const SPOTIFY_LINKS: Record<string, string> = {
  // Spanish
  "Palabra Plena": "https://open.spotify.com/show/47N48vR6yV38Uet3o6D195",
  "Entiende tu Mente": "https://open.spotify.com/show/06gMyK827vV62Yx9Q989Iq",
  "La Venganza Será Terrible (Oficial)": "https://open.spotify.com/show/5hXof4Ceb2k0B0qEicZlPh",
  "Nadie Sabe Nada": "https://open.spotify.com/show/6e4Bf1yWcsLgS7e1o6uK8h",
  "El Explicador": "https://open.spotify.com/show/5h2P1L60f7hW0DcsS5gUqy",
  "Astronomía y algo más": "https://open.spotify.com/show/5bYmC6S1vG5V1bS7t9sW0q",
  "DianaUribe.fm": "https://open.spotify.com/show/0A678HURXW6h7t9sW0qF8h",
  "La Milana Bonita": "https://open.spotify.com/show/0g2P1L60f7hW0DcsS5gUqy",

  // English
  "Hidden Brain": "https://open.spotify.com/show/27X6X9vYjxV76Y3UenA9mc",
  "Fresh Air": "https://open.spotify.com/show/5b2qAtM254M5dZp7p4WfUe",
  "In Our Time": "https://open.spotify.com/show/2K8F26xYrE643o77F5rW0u",
  "On Being": "https://open.spotify.com/show/0bYmC6S1vG5V1bS7t9sW0q",
  "Throughline": "https://open.spotify.com/show/4rX4L60vG5V1bS7t9sW0q",
  "Planet Money": "https://open.spotify.com/show/56E1A7L164s6241b2123C4",
  "Radiolab": "https://open.spotify.com/show/2m7sS1vG5V1bS7t9sW0q",
  "Science Friday": "https://open.spotify.com/show/2m7sS1vG5V1bS7t9sW0q",
  "The Daily Show": "https://open.spotify.com/show/0bYmC6S1vG5V1bS7t9sW0q",
  "We Can Do Hard Things": "https://open.spotify.com/show/0bYmC6S1vG5V1bS7t9sW0q",
  "The New Yorker: Fiction": "https://open.spotify.com/show/0bYmC6S1vG5V1bS7t9sW0q",
  "The World Tonight": "https://open.spotify.com/show/0G3O6URXW6h7t9sW0qF8h",
  "Ideas": "https://open.spotify.com/show/2K8F26xYrE643o77F5rW0u",
  "Thinking Allowed": "https://open.spotify.com/show/2X54O6b6vA5gYgAitO7yH",

  // French
  "Grand Bien Vous Fasse !": "https://open.spotify.com/show/4b2b3BCHs06GgYgAitO7yH",
  "Affaires sensibles": "https://open.spotify.com/show/2K8F26xYrE643o77F5rW0u",
  "Le 18/20": "https://open.spotify.com/show/4b2b3BCHs06GgYgAitO7yH",
  "La Terre au Carré": "https://open.spotify.com/show/4b2b3BCHs06GgYgAitO7yH"
};

export const getSpotifyLink = (name: string): string | undefined => {
  if (!name) return undefined;
  
  if (SPOTIFY_LINKS[name]) return SPOTIFY_LINKS[name];

  const norm = (str: string) => 
    str.toLowerCase()
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "") // remove accents/diacritics
       .replace(/[^a-z0-9]/g, " ")      // replace non-alphanumeric with spaces
       .replace(/\s+/g, " ")
       .trim();

  const normInput = norm(name);
  if (!normInput) return `https://open.spotify.com/search/${encodeURIComponent(name)}`;

  // Case-insensitive & accent insensitive direct map check
  for (const key of Object.keys(SPOTIFY_LINKS)) {
    if (norm(key) === normInput) {
      return SPOTIFY_LINKS[key];
    }
  }

  // Cross contains lookup
  for (const key of Object.keys(SPOTIFY_LINKS)) {
    const normKey = norm(key);
    if (normKey && (normInput.includes(normKey) || normKey.includes(normInput))) {
      return SPOTIFY_LINKS[key];
    }
  }

  // Handle specific spelling differences for "Palabra Plena" vs "Palabra plena, con Gabriel Rolón"
  if (normInput.includes("palabra plena") || normInput.includes("gabriel rolon")) {
    return SPOTIFY_LINKS["Palabra Plena"];
  }

  return `https://open.spotify.com/search/${encodeURIComponent(name)}`;
};

export default function BooksPodcastsSintonizador({
  appLanguage,
  onPlayPodcast,
  onSearchRadio,
}: BooksPodcastsSintonizadorProps) {
  const lang = ["es", "en", "pt", "fr"].includes(appLanguage) ? appLanguage : "es";
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0);
  const [sectionSearchQuery, setSectionSearchQuery] = useState<string>("");
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // Intelligent Search (Beta) States
  const [tunerQuery, setTunerQuery] = useState<string>("");
  const [tunerLoading, setTunerLoading] = useState<boolean>(false);
  const [tunerResults, setTunerResults] = useState<any[]>([]);
  const [tunerReasoning, setTunerReasoning] = useState<string>("");
  const [tunerConcept, setTunerConcept] = useState<string>("");
  const [tunerSearchQuery, setTunerSearchQuery] = useState<string>("");
  const [tunerConnectingId, setTunerConnectingId] = useState<string | number | null>(null);
  const [tunerError, setTunerError] = useState<string>("");

  const handleIntelligentSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tunerQuery.trim()) return;

    setTunerLoading(true);
    setTunerError("");
    setTunerResults([]);
    setTunerReasoning("");
    setTunerConcept("");
    
    try {
      const response = await fetch("/api/podcasts/intelligent-tuner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: tunerQuery, lang: lang }),
      });
      
      if (!response.ok) {
        throw new Error(lang === "es" ? "Error al sintonizar con la IA" : "AI tuning request failed");
      }
      
      const data = await response.json();
      if (data.status === "success" || data.results) {
        setTunerResults(data.results || []);
        setTunerReasoning(data.reasoning || "");
        setTunerConcept(data.recommendedConcept || "");
        setTunerSearchQuery(data.searchQueryUsed || "");
      } else {
        throw new Error(data.error || "Unhandled response");
      }
    } catch (err: any) {
      console.error(err);
      setTunerError(lang === "es" ? "Sintonizador ocupado. Reintente en unos instantes." : "Tuner database busy. Please try again soon.");
    } finally {
      setTunerLoading(false);
    }
  };

  const handlePlayTunerPodcast = (item: any) => {
    setTunerConnectingId(item.collectionId);
    onPlayPodcast({
      collectionId: item.collectionId,
      collectionName: item.collectionName,
      artistName: item.artistName || item.artist,
      artworkUrl100: item.artworkUrl100,
    });
    setTimeout(() => setTunerConnectingId(null), 1500);
  };

  const booksScrollRef = useRef<HTMLDivElement>(null);
  const podcastsScrollRef = useRef<HTMLDivElement>(null);

  const categories = CATEGORIES_BY_LANG[lang] || CATEGORIES_BY_LANG.es;
  const booksSource = LITERARY_BOOKS_BY_LANG[lang] || LITERARY_BOOKS_BY_LANG.es;

  const filteredBooks = booksSource.filter((book) => {
    const query = sectionSearchQuery.toLowerCase().trim();
    if (!query) {
      return activeCategoryId === "all" || book.categoryId === activeCategoryId;
    }

    const matchTitle = (book.title || "").toLowerCase().includes(query);
    const matchAuthor = (book.author || "").toLowerCase().includes(query);
    const matchCategory = (book.categoryLabel || "").toLowerCase().includes(query);
    const matchPodcast = (book.relations || []).some(rel =>
      (rel.name || "").toLowerCase().includes(query) ||
      (rel.author || "").toLowerCase().includes(query) ||
      (rel.desc || "").toLowerCase().includes(query)
    );

    return matchTitle || matchAuthor || matchCategory || matchPodcast;
  });

  // Ensure index is within range if filtered list changes
  const activeBookIndex = selectedBookIndex >= filteredBooks.length ? 0 : selectedBookIndex;
  const selectedBook = filteredBooks.length > 0 ? filteredBooks[activeBookIndex] : null;

  const handleRelationTune = async (relation: PodcastRelation) => {
    setConnectingId(relation.itunesId);
    try {
      let matchedPodcast = null;
      try {
        // Query the iTunes search API dynamically with the recommended relation name
        const response = await fetch(`/api/podcasts/search?term=${encodeURIComponent(relation.name || "")}`);
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            // Normalize helper for robust word matching
            const norm = (str: string) => 
              str.toLowerCase()
                 .normalize("NFD")
                 .replace(/[\u0300-\u036f]/g, "")
                 .replace(/[^a-z0-9]/g, " ")
                 .replace(/\s+/g, " ")
                 .trim();

            const rNorm = norm(relation.name || "");
            
            // Look for first result that contains the recommended name or stars with it,
            // or has the first 2-3 words identical to handle prefixes like "Palabra Plena, con Gabriel Rolón"
            matchedPodcast = data.results.find((cand: any) => {
              const cNorm = norm(cand.collectionName || "");
              if (!rNorm || !cNorm) return false;

              // Inclusive direct or backwards matches
              if (cNorm.startsWith(rNorm) || rNorm.startsWith(cNorm) || cNorm.includes(rNorm) || rNorm.includes(cNorm)) {
                return true;
              }

              // Word-based match check (e.g. "palabra plena" first two words)
              const rWords = rNorm.split(" ");
              if (rWords.length >= 2) {
                const prefix2 = rWords.slice(0, 2).join(" ");
                if (cNorm.includes(prefix2)) return true;
              }
              return false;
            });
          }
        }
      } catch (searchErr) {
        console.error("Dynamic iTunes lookup failed, falling back to static ID", searchErr);
      }

      if (matchedPodcast) {
        // Play the actual matched live iTunes podcast with correct live collection metadata!
        onPlayPodcast({
          collectionId: matchedPodcast.collectionId,
          collectionName: matchedPodcast.collectionName,
          artistName: matchedPodcast.artistName || relation.author,
          artworkUrl100: matchedPodcast.artworkUrl100 || relation.image,
        });
      } else {
        // Fallback to static mock object from predefined relations
        const mockPodcastObj = {
          collectionId: relation.itunesId,
          collectionName: relation.name,
          artistName: relation.author,
          artworkUrl100: relation.image,
        };
        onPlayPodcast(mockPodcastObj);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setConnectingId(null), 1200);
    }
  };

  const getLangBadge = (langCode: string) => {
    const flags: Record<string, string> = { es: "🇪🇸 ES", en: "🇬🇧 EN", fr: "🇫🇷 FR", pt: "🇧🇷 PT" };
    return flags[langCode] || langCode.toUpperCase();
  };

  const scrollBooks = (direction: 'left' | 'right') => {
    if (booksScrollRef.current) {
      const { scrollLeft } = booksScrollRef.current;
      const offset = direction === 'left' ? -260 : 260;
      booksScrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  const scrollPodcasts = (direction: 'left' | 'right') => {
    if (podcastsScrollRef.current) {
      const { scrollLeft } = podcastsScrollRef.current;
      const offset = direction === 'left' ? -320 : 320;
      podcastsScrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  return (
    <div id="literary-tuning-bento" className="bg-[#111111]/90 border border-[#222222] rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Decorative Atmosphere Gradients */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#1DB954]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Segments */}
      <div className="relative mb-8 border-b border-zinc-900 pb-5">
        <span className="text-[10px] bg-[#1DB954]/10 border border-[#1DB954]/25 text-[#1DB954] px-3.5 py-1 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 mb-3 font-mono">
          <Sparkles className="w-3 h-3 text-[#1DB954] animate-pulse" />
          {t.seccion_tag}
        </span>
        <h3 className="text-2xl sm:text-3.5xl font-display font-black text-white tracking-tight flex items-center gap-3">
          <Book className="w-8 h-8 text-[#1DB954]" />
          {t.titulo}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 max-w-3xl leading-relaxed font-light">
          {t.subtitulo}
        </p>
      </div>

      {/* 🔍 Search Input for Books + Podcasts inside the section */}
      <div className="relative mb-6">
        <label htmlFor="sintonizador-section-search-input" className="sr-only">
          {lang === "es" ? "Buscar libros o podcasts" : "Search books or podcasts"}
        </label>
        <div className="relative flex items-center">
          <input
            id="sintonizador-section-search-input"
            type="text"
            value={sectionSearchQuery}
            onChange={(e) => {
              setSectionSearchQuery(e.target.value);
              setSelectedBookIndex(0);
            }}
            placeholder={
              lang === "es" ? "🔍 Buscar por libro, autor, categoría o podcast relacionado..." :
              lang === "en" ? "🔍 Search by book, author, category or related podcast..." :
              lang === "pt" ? "🔍 Buscar por livro, autor, categoria ou podcast..." :
              "🔍 Rechercher par livre, auteur, catégorie ou podcast..."
            }
            className="w-full bg-zinc-900/60 hover:bg-zinc-900 focus:bg-zinc-950 border border-zinc-800 focus:border-[#1DB954]/50 text-white rounded-2xl py-3 pl-11 pr-12 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#1DB954]/50 transition-all shadow-inner font-sans"
          />
          <Search className="absolute left-4 text-zinc-500 w-4 h-4 pointer-events-none" />
          {sectionSearchQuery && (
            <button
              onClick={() => {
                setSectionSearchQuery("");
                setSelectedBookIndex(0);
              }}
              className="absolute right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-zinc-800"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Localized Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
        {categories.map((cat) => {
          const isSelected = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(cat.id);
                setSelectedBookIndex(0);
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? "bg-[#1DB954] border-[#1DB954] text-black font-extrabold shadow-lg shadow-[#1DB954]/20 scale-[1.03]"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 📖 CAROUSEL 1: Horizontal Book Selection Rack */}
      <div className="relative mt-6 group/rack pb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-xs uppercase font-black tracking-wider text-zinc-400 font-mono">
            {lang === "es" ? "Selecciona un Libro para sintonizar" : "Select a book to tune"}
          </h4>
          {filteredBooks.length > 0 && (
            <div className="flex gap-1.5">
              <button
                onClick={() => scrollBooks('left')}
                className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollBooks('right')}
                className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-zinc-850 bg-zinc-950/40 rounded-3xl mt-4 space-y-4">
            <Radio className="w-10 h-10 text-zinc-600 animate-pulse" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-300">
                {lang === "es" ? "No se encontraron conexiones literarias" : "No literary connections found"}
              </p>
              <p className="text-xs text-zinc-500 max-w-md">
                {lang === "es" 
                  ? `"${sectionSearchQuery}" no coincide con los libros o podcasts recomendados de esta sección.`
                  : `"${sectionSearchQuery}" does not match the recommended books or podcasts in this section.`}
              </p>
            </div>
            
            <button
              onClick={() => onSearchRadio(sectionSearchQuery)}
              className="px-5 py-2.5 rounded-full bg-[#1DB954] text-black font-black text-xs uppercase tracking-wider hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#1DB954]/20"
            >
              <Search className="w-3.5 h-3.5 fill-none stroke-[3]" />
              <span>
                {lang === "es" 
                  ? `Buscar "${sectionSearchQuery}" en el sintonizador global` 
                  : `Search "${sectionSearchQuery}" globally`}
              </span>
            </button>
          </div>
        ) : (
          /* Horizontal scroll rack */
          <div
            ref={booksScrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-2 -mx-2 px-2"
          >
            {filteredBooks.map((book, idx) => {
              const isSelected = idx === activeBookIndex;
              return (
                <div
                  key={book.title + idx}
                  onClick={() => setSelectedBookIndex(idx)}
                  className={`flex-shrink-0 w-36 sm:w-40 snap-start rounded-2xl p-2.5 transition-all duration-300 cursor-pointer select-none border group/book relative overflow-hidden ${
                    isSelected
                      ? "bg-[#1DB954]/10 border-[#1DB954] shadow-[0_0_20px_rgba(29,185,84,0.15)] ring-1 ring-[#1DB954]/30"
                      : "bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/70"
                  }`}
                >
                  {/* 3D cover container */}
                  <div className="relative aspect-[3/4.4] w-full rounded-lg overflow-hidden shadow-md group-hover/book:-translate-y-1 transition-all duration-300 border border-zinc-950">
                    {/* Real book joint gradient */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/60 to-transparent z-10" />
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {/* Selected neon outline */}
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-[#1DB954] rounded-lg z-20 pointer-events-none" />
                    )}
                  </div>

                  {/* Info block */}
                  <div className="mt-2">
                    <h5 className={`text-[11.5px] font-bold truncate leading-tight ${isSelected ? "text-[#1DB954]" : "text-white group-hover/book:text-amber-500"}`}>
                      {book.title}
                    </h5>
                    <p className="text-[9.5px] text-zinc-500 truncate mt-0.5 font-mono">
                      {book.author}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Book Spotlight Showcase (Extra Large Book and Custom Podcasts Slider beside it) */}
      {selectedBook && (
        <div className="mt-6 p-5 sm:p-7 rounded-3xl bg-black/40 border border-zinc-900/80 shadow-inner relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#1DB954]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Left: Extra Large Cover Presentation (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left">
              <div className="relative w-44 sm:w-52 aspect-[3/4.4] shadow-[0_24px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_30px_60px_rgba(29,185,84,0.25)] rounded-r-xl overflow-hidden select-none border border-zinc-950 transition-all duration-500 group/big">
                {/* Spine shadows */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/90 via-black/30 to-transparent z-20" />
                <div className="absolute left-[3px] top-0 bottom-0 w-[0.7px] bg-white/20 z-20" />
                
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover/big:scale-[1.03] transition-transform duration-700"
                />

                {/* Category label overlays */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md rounded-lg p-2 border border-zinc-800/50 z-20">
                  <div className="flex items-center gap-1.5 text-[8.5px] font-black tracking-wider uppercase text-[#1DB954] font-mono leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                    <span>{selectedBook.categoryLabel}</span>
                  </div>
                </div>
              </div>

              {/* Quick companion search trigger */}
              <button
                onClick={() => onSearchRadio(selectedBook.title)}
                className="mt-6 px-4 py-2 rounded-full border border-zinc-800 hover:border-emerald-500/50 bg-zinc-900/60 hover:bg-emerald-950/20 text-[10px] text-zinc-400 hover:text-[#1DB954] uppercase tracking-wider font-mono font-black transition-all flex items-center gap-2 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{lang === "es" ? `Buscar emisores de "${selectedBook.title}"` : `Search hosts of "${selectedBook.title}"`}</span>
              </button>
            </div>

            {/* Right: Book Details and Podcasts Carousel (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Info Header */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase leading-none tracking-widest block font-mono">
                  {selectedBook.categoryIcon} {selectedBook.categoryLabel.toUpperCase()}
                </span>
                <h3 className="text-2xl sm:text-3.5xl font-display font-black text-white tracking-tight leading-none">
                  {selectedBook.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium font-sans">
                  {t.por} <span className="text-zinc-200 font-bold">{selectedBook.author}</span>
                </p>
                <p className="text-[11.5px] sm:text-xs text-zinc-400 font-light font-sans max-w-2xl leading-relaxed mt-2.5">
                  {selectedBook.description}
                </p>
              </div>

              {/* 🎙️ CAROUSEL 2: Podcast Selection Lane */}
              <div className="pt-4 border-t border-zinc-900/80 relative">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs uppercase font-black tracking-wider text-emerald-400 font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                    {t.probablemente}
                  </h4>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => scrollPodcasts('left')}
                      className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scrollPodcasts('right')}
                      className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Horizontal scroll container with custom items */}
                <div
                  ref={podcastsScrollRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-3 -mx-2 px-2"
                >
                  {selectedBook.relations.map((relation, rIdx) => {
                    const isConnecting = connectingId === relation.itunesId;
                    return (
                      <div
                        key={relation.name + rIdx}
                        onClick={() => handleRelationTune(relation)}
                        className="flex-shrink-0 w-[270px] sm:w-[290px] snap-start flex flex-col justify-between p-4 rounded-2xl bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-900 hover:border-[#1DB954]/30 transition-all duration-300 cursor-pointer group/card relative overflow-hidden"
                      >
                        {/* Interactive decorative dynamic audio visual bars */}
                        <div className="absolute right-3.5 top-3.5 flex items-end gap-[1.5px] h-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-350">
                          <div className="w-[1.5px] h-2 bg-[#1DB954] rounded-full animate-pulse"></div>
                          <div className="w-[1.5px] h-3.5 bg-[#1DB954] rounded-full animate-pulse delay-75"></div>
                          <div className="w-[1.5px] h-1.5 bg-[#1DB954] rounded-full animate-pulse delay-150"></div>
                        </div>

                        <div>
                          {/* Badges row */}
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <span className="text-[7.5px] bg-zinc-800 text-zinc-300 font-bold px-1.5 py-0.5 rounded font-mono shrink-0">
                              {getLangBadge(relation.lang)}
                            </span>
                            <span className="text-[8px] text-[#1DB954] font-black uppercase tracking-wider font-mono flex items-center gap-1 leading-none">
                              <Volume2 className="w-2.5 h-2.5" />
                              {t.conexion_audible}
                            </span>
                          </div>

                          {/* Cover & metadata info */}
                          <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-zinc-900 shadow-md">
                              <img
                                src={relation.image}
                                alt={relation.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-[11.5px] font-bold text-white truncate leading-tight group-hover/card:text-[#1DB954] transition-colors" title={relation.name}>
                                {relation.name}
                              </h5>
                              <p className="text-[9px] text-zinc-500 truncate mt-0.5 font-mono">
                                {relation.author}
                              </p>
                            </div>
                          </div>

                          {/* Relational description text */}
                          <p className="text-[10px] text-zinc-400 leading-normal font-sans font-light line-clamp-2">
                            {relation.desc}
                          </p>
                        </div>

                        {/* Actuator trigger bar (Play & Spotify launch) */}
                        <div className="mt-3 pt-2.5 border-t border-zinc-900/60 flex items-center justify-between font-mono gap-1.5">
                          {/* Play inside Web Player */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRelationTune(relation);
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all text-[8.5px] uppercase font-black tracking-wide cursor-pointer select-none ${
                              isConnecting 
                                ? "bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954]"
                                : "bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-300"
                            }`}
                          >
                            {isConnecting ? (
                              <Loader2 className="w-3 h-3 text-[#1DB954] animate-spin" />
                            ) : (
                              <Play className="w-2.5 h-2.5 text-[#1DB954] fill-current" />
                            )}
                            <span>{isConnecting ? t.sintonizando : t.sintonizar_ahora}</span>
                          </button>

                          {/* Spotify and/or Apple Podcasts links depending on availability */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {(() => {
                              const spotifyLink = getSpotifyLink(relation.name);
                              if (spotifyLink) {
                                return (
                                  <>
                                    {/* Spotify Link */}
                                    <a
                                      href={spotifyLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1DB954]/10 hover:bg-[#1DB954] border border-[#1DB954]/20 hover:border-[#1DB954] text-[#1DB954] hover:text-black font-black text-[8px] uppercase tracking-wide transition-all shrink-0 cursor-pointer"
                                      title="Spotify"
                                    >
                                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.337.135-.669.47-.745 3.85-.88 7.15-.505 9.82 1.13.295.18.387.563.207.86zm1.224-2.723c-.227.368-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.85-.107-.975-.522-.125-.413.108-.85.522-.975 3.678-1.117 8.25-.57 11.35 1.34.367.226.487.707.26 1.08zm.106-2.825C14.39 8.82 8.42 8.625 4.975 9.672c-.53.16-1.09-.14-1.25-.67-.16-.53.14-1.09.67-1.25 3.97-1.205 10.56-1.025 15.11 1.7 13.9 8.25c.48.28.63.9.35 1.39-.28.48-.9.63-1.39.35z"/>
                                      </svg>
                                      <span>Spotify</span>
                                    </a>

                                    {/* Apple Podcasts Link */}
                                    {relation.itunesId && (
                                      <a
                                        href={`https://podcasts.apple.com/podcast/id${relation.itunesId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#a22ec4]/10 hover:bg-[#a22ec4] border border-[#a22ec4]/20 hover:border-[#a22ec4] text-[#dca2f2] hover:text-white font-black text-[8px] uppercase tracking-wide transition-all shrink-0 cursor-pointer"
                                        title="Apple Podcasts"
                                      >
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                                          <circle cx="12" cy="12" r="2" />
                                          <path d="M12 2a10 10 0 0 0-10 10" />
                                          <path d="M22 12A10 10 0 0 0 12 2" />
                                          <path d="M12 18a6 6 0 0 0-6-6" />
                                          <path d="M18 12a6 6 0 0 0-6-6" />
                                        </svg>
                                        <span>iTunes</span>
                                      </a>
                                    )}
                                  </>
                                );
                              } else {
                                return relation.itunesId ? (
                                  <a
                                    href={`https://podcasts.apple.com/podcast/id${relation.itunesId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a22ec4]/10 hover:bg-[#a22ec4] border border-[#a22ec4]/20 hover:border-[#a22ec4] text-[#dca2f2] hover:text-white font-black text-[8.5px] uppercase tracking-wide transition-all shrink-0 cursor-pointer"
                                    title="Apple Podcasts"
                                  >
                                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="2" />
                                      <path d="M12 2a10 10 0 0 0-10 10" />
                                      <path d="M22 12A10 10 0 0 0 12 2" />
                                      <path d="M12 18a6 6 0 0 0-6-6" />
                                      <path d="M18 12a6 6 0 0 0-6-6" />
                                    </svg>
                                    <span>iTunes</span>
                                  </a>
                                ) : null;
                              }
                            })()}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 🔮 BUSCADOR INTELIGENTE IA (BETA) */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/60 to-black/80 border border-zinc-800/80 shadow-2xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute left-0 top-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono animate-pulse">
                  ✨ MODO BETA Activo
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                  SINTONIZADOR INTELIGENTE IA
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                {lang === "es" ? "¿Qué vas a sintonizar hoy?" 
                  : lang === "pt" ? "O que você vai sintonizar hoje?"
                  : lang === "fr" ? "Qu'allez-vous écouter aujourd'hui ?"
                  : "What will you tune into today?"}
              </h3>
              <p className="text-xs text-zinc-400 font-normal leading-relaxed max-w-xl">
                {lang === "es" ? "Escribe un libro, película, serie o cómo te sientes hoy. Nuestra IA sintonizará la frecuencia de podcasts ideal para tu momento." 
                  : lang === "pt" ? "Escreva um livro, filme, série ou como se sente hoje. Nossa IA sintonizará a frequência ideal de podcasts."
                  : lang === "fr" ? "Entrez un livre, un film, une série ou votre humeur. Notre IA trouvera la fréquence idéale pour votre moment."
                  : "Type a book, movie, series, or how you feel today. Our AI will tune into the perfect podcast frequency for your mood."}
              </p>
            </div>
          </div>

          {/* Search Action Form */}
          <form onSubmit={handleIntelligentSearch} className="relative flex items-center bg-zinc-950/80 border border-zinc-800 focus-within:border-emerald-500/50 rounded-2xl p-1.5 transition-all shadow-inner">
            <div className="pl-3 text-zinc-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <input
              type="text"
              value={tunerQuery}
              onChange={(e) => setTunerQuery(e.target.value)}
              placeholder={
                lang === "es" ? "Ej: 'muy melancólico con lluvia', 'Interstellar', 'Harry Potter', 'Orgullo y Prejuicio'..."
                : lang === "pt" ? "Ex: 'muito melancólico com chuva', 'Interestelar', 'Harry Potter'..."
                : lang === "fr" ? "Ex: 'mélancolique sous l'orage', 'Harry Potter', 'science-fiction'..."
                : "e.g., 'very nostalgic on a rainy Sunday', 'Interstellar', 'cozy fantasy'..."
              }
              className="w-full bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none text-xs sm:text-sm text-white px-3 placeholder-zinc-600 font-sans"
              disabled={tunerLoading}
            />
            <button
              type="submit"
              disabled={tunerLoading || !tunerQuery.trim()}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-[#1DB954] hover:from-emerald-400 hover:to-emerald-500 text-black font-mono font-black text-[10px] uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {tunerLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === "es" ? "SINTONIZANDO..." : "TUNING..."}</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>{lang === "es" ? "REVELAR FRECUENCIA" : lang === "pt" ? "REVELAR FREQUÊNCIA" : lang === "fr" ? "RÉVÉLER LES ONDES" : "REVEAL FREQUENCY"}</span>
                </>
              )}
            </button>
          </form>

          {tunerError && (
            <p className="text-xs text-rose-500 font-mono text-center bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
              ⚠️ {tunerError}
            </p>
          )}

          {/* Loading Animation Area */}
          {tunerLoading && (
            <div className="py-12 flex flex-col items-center text-center space-y-4 animate-pulse">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-emerald-500/40 animate-pulse" />
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest">
                  {lang === "es" ? "Canalizando sabiduría de la IA..." 
                    : lang === "pt" ? "Acessando inteligência artificial..."
                    : lang === "fr" ? "Analyse harmonique par l'IA..."
                    : "Channeling AI companion intelligence..."}
                </p>
                <p className="text-[10px] text-zinc-500 max-w-xs mx-auto font-mono">
                  {lang === "es" ? "Buscando correspondencias en millones de podcasts de iTunes"
                    : lang === "pt" ? "Buscando correspondências em milhões de podcasts no iTunes"
                    : lang === "fr" ? "Recherche de correspondances parmi des millions de podcasts iTunes"
                    : "Finding matching waves among millions of iTunes podcasts"}
                </p>
              </div>
            </div>
          )}

          {/* AI REVELATION SPOTLIGHT SPLIT PANEL */}
          {!tunerLoading && tunerReasoning && (
            <div className="space-y-6 transition-all duration-500">
              
              {/* Intelligent Explanation block */}
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/40 border border-emerald-500/20 relative overflow-hidden shadow-inner">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row gap-4 items-start relative z-10">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                        {lang === "es" ? "Frecuencia sugerida: " : lang === "pt" ? "Frequência: " : lang === "fr" ? "Onde : " : "Match: "} {tunerSearchQuery}
                      </span>
                      {tunerConcept && (
                        <h4 className="text-xs font-black font-mono text-zinc-200">
                          🎯 {tunerConcept}
                        </h4>
                      )}
                    </div>
                    <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans italic">
                      "{tunerReasoning}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Podcasts List lanes */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-black tracking-wider text-emerald-400 font-mono flex items-center gap-2 px-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                  {lang === "es" ? "Canales Sintonizados Encontrados:" 
                    : lang === "pt" ? "Canais Sintonizados Encontrados:"
                    : lang === "fr" ? "Canaux Audio Harmonisés :"
                    : "Tuned Audio Channels Found:"}
                </h4>

                {tunerResults.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-mono py-6 text-center">
                    {lang === "es" ? "No se encontraron canales exactos para esta firma de onda. Prueba con palabras más conocidas." 
                      : "No exact channels found for this frequency profile. Try modifying your keyterms."}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tunerResults.slice(0, 9).map((item, idx) => {
                      const isConnecting = tunerConnectingId === item.collectionId;
                      return (
                        <div
                          key={item.collectionId + "-" + idx}
                          onClick={() => handlePlayTunerPodcast(item)}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/50 hover:bg-zinc-900 border border-zinc-900/80 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
                        >
                          {/* Artwork Cover mini */}
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-900 shadow">
                            <img
                              src={item.artworkUrl100 || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=150&q=80"}
                              alt={item.collectionName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {/* Listening overlay overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-4.5 h-4.5 text-emerald-400 fill-current" />
                            </div>
                          </div>

                          {/* Info fields */}
                          <div className="min-w-0 flex-1">
                            <span className="text-[7.5px] text-emerald-400 font-black uppercase tracking-wider font-mono">
                              {item.primaryGenreName || "Podcast"}
                            </span>
                            <h5 className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-emerald-400 transition-colors" title={item.collectionName}>
                              {item.collectionName}
                            </h5>
                            <p className="text-[9px] text-zinc-500 truncate font-mono mt-0.5">
                              {item.artistName}
                            </p>
                          </div>

                          {/* Connection indicator */}
                          <div className="shrink-0 pl-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayTunerPodcast(item);
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                                isConnecting
                                  ? "bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954]"
                                  : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-emerald-500"
                              }`}
                            >
                              {isConnecting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Play className="w-3 h-3 fill-current pl-0.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
