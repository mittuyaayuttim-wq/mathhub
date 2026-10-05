import { Topic, Question } from '../types/index.ts';

export const TOPICS: Topic[] = [
  // ================= 5-SINF =================
  {
    id: 'top-5-1',
    grade: 5,
    category: 'Arifmetika',
    title: 'Natural sonlar va xona birliklari',
    description: "Natural sonlar qatori, xonalar va sinflar, sonlarni taqqoslash va yaxlitlash qoidalari.",
    iconName: 'Hash',
    difficulty: 'Oson',
    estimatedMinutes: 20,
    formulaSummary: 'N = {1, 2, 3, 4, 5, ...}',
    questionCount: 6,
    theoryContent: {
      title: 'Natural sonlar va ularning tuzilishi',
      sections: [
        {
          heading: 'Natural son nima?',
          text: "Sanashda ishlatiladigan sonlar natural sonlar deyiladi. Eng kichik natural son 1 ga teng, eng kattasi esa mavjud emas. Nol (0) natural son hisoblanmaydi.",
          formula: 'N = {1, 2, 3, 4, ...}',
          example: {
            problem: '254 308 sonida nechta yuzlik va minglik bor?',
            solution: '254 308 sonida 4 ta minglik va 3 ta yuzlik mavjud. Butun sonda esa jami 254 ta minglik bor.'
          }
        },
        {
          heading: 'Sonlarni taqqoslash va yaxlitlash',
          text: "Ko'p xonali sonlarni taqqoslashda eng yuqori xona birliklaridan boshlanadi. Yaxlitlashda esa keyingi raqam 5 yoki undan katta bo'lsa, xona birligi 1 taga oshiriladi.",
          formula: 'a > b yoki a < b yoki a = b',
          example: {
            problem: '4 863 sonini yuzliklargacha yaxlitlang.',
            solution: 'Yuzliklar xonasi 8, keyingi raqam 6 (>=5). Demak, natija 4 900 bo\'ladi.'
          }
        }
      ]
    }
  },
  {
    id: 'top-5-2',
    grade: 5,
    category: 'Arifmetika',
    title: 'Arifmetik amallar va qavslar tartibi',
    description: "Qo'shish, ayirish, ko'paytirish va bo'lish amallarining xossalari, qavsli ifodalarni hisoblash.",
    iconName: 'Calculator',
    difficulty: 'Oson',
    estimatedMinutes: 25,
    formulaSummary: 'a + b = b + a | a · (b + c) = a·b + a·c',
    questionCount: 6,
    theoryContent: {
      title: 'Arifmetik amallar ketma-ketligi',
      sections: [
        {
          heading: 'Amallar bajarilish tartibi',
          text: "1) Qavs ichidagi amallar; 2) Ko'paytirish va bo'lish (chapdan o'ngga); 3) Qo'shish va ayirish (chapdan o'ngga).",
          formula: 'A = (a + b) · c - d : e',
          example: {
            problem: '24 + 6 · (15 - 5) : 3 ifodaning qiymatini toping.',
            solution: '1) 15 - 5 = 10; 2) 6 · 10 = 60; 3) 60 : 3 = 20; 4) 24 + 20 = 44.'
          }
        }
      ]
    }
  },
  {
    id: 'top-5-3',
    grade: 5,
    category: 'Kasrlar',
    title: 'Oddiy kasrlar va amallar',
    description: "Kasr tushunchasi, to'g'ri va noto'g'ri kasrlar, aralash sonlar, umumiy maxrajga keltirish.",
    iconName: 'Divide',
    difficulty: "O'rta",
    estimatedMinutes: 30,
    formulaSummary: 'a/b + c/b = (a+c)/b',
    questionCount: 6,
    theoryContent: {
      title: 'Oddiy kasrlar olami',
      sections: [
        {
          heading: "Surat va maxraj",
          text: "Maxraj butun narsa nechta teng bo'lakka bo'linganini, surat esa shulardan nechtasi olinganini bildiradi.",
          formula: 'm/n (n ≠ 0)',
          example: {
            problem: '3/7 + 2/7 amalini bajaring.',
            solution: 'Bir xil maxrajli kasrlar suratlari qo\'shiladi: (3 + 2)/7 = 5/7.'
          }
        }
      ]
    }
  },
  {
    id: 'top-5-4',
    grade: 5,
    category: 'Kasrlar',
    title: "O'nli kasrlar",
    description: "O'nli kasrlarni yozish, qo'shish, ayirish, ko'paytirish va natural songa bo'lish.",
    iconName: 'Percent',
    difficulty: "O'rta",
    estimatedMinutes: 25,
    formulaSummary: '0.5 = 5/10 = 1/2',
    questionCount: 6,
    theoryContent: {
      title: "O'nli kasrlar bilan hisoblash",
      sections: [
        {
          heading: 'Vergulning o\'rni',
          text: "O'nli kasrlarni ustun shaklida qo'shish va ayirishda vergullar bir-birining tagiga to'g'ri kelishi shart.",
          formula: '3.45 + 1.20 = 4.65',
          example: {
            problem: '4.5 · 0.4 ni hisoblang.',
            solution: '45 · 4 = 180. Ikkala ko\'paytuvchida verguldan keyin jami 2 ta raqam bor: 1.80 = 1.8.'
          }
        }
      ]
    }
  },
  {
    id: 'top-5-5',
    grade: 5,
    category: 'Amaliy matematika',
    title: 'Foizlar asoslari',
    description: "Sonning yuzdan bir qismi (1%), sonning foizini topish va foiziga ko'ra sonni topish.",
    iconName: 'PieChart',
    difficulty: "O'rta",
    estimatedMinutes: 25,
    formulaSummary: '1% = 1/100 = 0.01',
    questionCount: 6,
    theoryContent: {
      title: 'Foiz tushunchasi',
      sections: [
        {
          heading: 'Foizni hisoblash',
          text: "Sonning p foizini topish uchun sonni p ga ko'paytirib, 100 ga bo'lish kerak.",
          formula: 'B = (A · p) / 100',
          example: {
            problem: '250 ning 20% ini toping.',
            solution: '250 · 20 / 100 = 50.'
          }
        }
      ]
    }
  },
  {
    id: 'top-5-6',
    grade: 5,
    category: 'Algebra',
    title: 'Oddiy tenglamalar',
    description: "Noma'lum qo'shiluvchi, kamayuvchi, ayriluvchi va ko'paytuvchini topish qoidalari.",
    iconName: 'Variable',
    difficulty: 'Oson',
    estimatedMinutes: 20,
    formulaSummary: 'x + a = b ⇒ x = b - a',
    questionCount: 6,
    theoryContent: {
      title: 'Tenglamalarni yechish',
      sections: [
        {
          heading: 'Tenglama va uning ildizi',
          text: "Harf bilan belgilangan noma'lum son qatnashgan tenglikka tenglama deyiladi.",
          formula: 'a · x = b ⇒ x = b / a',
          example: {
            problem: '3x + 12 = 36 tenglamani yeching.',
            solution: '3x = 36 - 12 => 3x = 24 => x = 8.'
          }
        }
      ]
    }
  },
  {
    id: 'top-5-7',
    grade: 5,
    category: 'Geometriya',
    title: 'Geometrik shakllar, perimetr va yuza',
    description: "To'g'ri to'rtburchak, kvadrat, uchburchak, ularning perimetri (P) va yuzasi (S).",
    iconName: 'Shapes',
    difficulty: "O'rta",
    estimatedMinutes: 30,
    formulaSummary: 'P = 2(a+b), S = a·b | Kvadrat: P=4a, S=a²',
    questionCount: 6,
    theoryContent: {
      title: 'Perimetr va yuza formulalari',
      sections: [
        {
          heading: "To'g'ri to'rtburchak va kvadrat",
          text: "Perimetr — barcha tomonlar uzunliklari yig'indisi. Yuza — shakl egallagan tekislik maydoni.",
          formula: 'S = a · b, P = 2(a + b)',
          example: {
            problem: 'Tomonlari 8 sm va 5 sm bo\'lgan to\'g\'ri to\'rtburchakning yuzasi va perimetrini toping.',
            solution: 'P = 2 · (8 + 5) = 26 sm; S = 8 · 5 = 40 sm².'
          }
        }
      ]
    }
  },
  {
    id: 'top-5-8',
    grade: 5,
    category: 'Mantiq',
    title: 'Koordinatalar nuri va mantiqiy masalalar',
    description: "Sonli nur, nuqtaning koordinatasi, masofani topish va qiziqarli kombinatorika masalalari.",
    iconName: 'Compass',
    difficulty: "O'rta",
    estimatedMinutes: 25,
    formulaSummary: 'AB = |xB - xA|',
    questionCount: 6,
    theoryContent: {
      title: 'Sonli nurda yo\'nalish',
      sections: [
        {
          heading: 'Nuqta koordinatasi',
          text: "Nurda sanoq boshi (0), birlik kesma va yo'nalish tanlangan bo'lsa, u koordinata nuri deyiladi.",
          formula: 'A(x)',
          example: {
            problem: 'A(4) va B(13) nuqtalar orasidagi masofani toping.',
            solution: 'AB = 13 - 4 = 9 birlik.'
          }
        }
      ]
    }
  },

  // ================= 6-SINF =================
  {
    id: 'top-6-1',
    grade: 6,
    category: 'Sonlar nazariyasi',
    title: 'EKUB va EKUK, bo\'linish alomatlari',
    description: "Tub va murakkab sonlar, 2, 3, 5, 9, 10 ga bo'linish alomatlari, EKUB va EKUK topish.",
    iconName: 'Binary',
    difficulty: "O'rta",
    estimatedMinutes: 30,
    formulaSummary: 'EKUB(a,b) · EKUK(a,b) = a · b',
    questionCount: 6,
    theoryContent: {
      title: 'Bo\'linuvchanlik va ko\'paytuvchilarga ajratish',
      sections: [
        {
          heading: 'EKUB va EKUK qoidalari',
          text: "EKUB — eng katta umumiy bo'luvchi; EKUK — eng kichik umumiy karrali.",
          formula: 'a · b = EKUB(a,b) · EKUK(a,b)',
          example: {
            problem: '12 va 18 sonlarining EKUB va EKUK ini toping.',
            solution: '12 = 2² · 3, 18 = 2 · 3². EKUB = 2 · 3 = 6; EKUK = 2² · 3² = 36.'
          }
        }
      ]
    }
  },
  {
    id: 'top-6-2',
    grade: 6,
    category: 'Arifmetika',
    title: 'Nisbat va proporsiya',
    description: "Nisbat tushunchasi, proporsiyaning asosiy xossasi, to'g'ri va teskari proporsional miqdorlar.",
    iconName: 'Scale',
    difficulty: "O'rta",
    estimatedMinutes: 25,
    formulaSummary: 'a : b = c : d ⇒ a · d = b · c',
    questionCount: 6,
    theoryContent: {
      title: 'Proporsiya xossasi',
      sections: [
        {
          heading: 'Chetki va o\'rta hadlar',
          text: "Proporsiyaning chetki hadlari ko'paytmasi uning o'rta hadlari ko'paytmasiga teng.",
          formula: 'a / b = c / d ⇒ a · d = b · c',
          example: {
            problem: 'x : 15 = 4 : 5 proporsiyadan x ni toping.',
            solution: '5 · x = 15 · 4 => 5x = 60 => x = 12.'
          }
        }
      ]
    }
  },
  {
    id: 'top-6-3',
    grade: 6,
    category: 'Ratsional sonlar',
    title: 'Musbat va manfiy sonlar',
    description: "Koordinata to'g'ri chizig'i, qarama-qarshi sonlar, modul tushunchasi, butun sonlar ustida amallar.",
    iconName: 'PlusMinus',
    difficulty: "O'rta",
    estimatedMinutes: 30,
    formulaSummary: '|-a| = |a| = a | (-a) · (-b) = a · b',
    questionCount: 6,
    theoryContent: {
      title: 'Manfiy sonlar bilan amallar',
      sections: [
        {
          heading: 'Qo\'shish va ko\'paytirish qoidalari',
          text: "Ikkita manfiy son qo'shilganda ularning modullari qo'shilib, oldiga minus qo'yiladi. Ikkita manfiy son ko'paytmasi musbat bo'ladi.",
          formula: '(-a) + (-b) = -(a + b)',
          example: {
            problem: '(-15) + (-8) va (-6) · (-7) ni hisoblang.',
            solution: '(-15) + (-8) = -23. (-6) · (-7) = +42.'
          }
        }
      ]
    }
  },
  {
    id: 'top-6-4',
    grade: 6,
    category: 'Algebra',
    title: 'Algebraik ifodalar va qavslarni ochish',
    description: "O'xshash hadlarni ixchamlash, umumiy ko'paytuvchini qavsdan chiqarish.",
    iconName: 'Code',
    difficulty: "O'rta",
    estimatedMinutes: 25,
    formulaSummary: 'k(a + b - c) = ka + kb - kc',
    questionCount: 6,
    theoryContent: {
      title: 'O\'xshash hadlarni ixchamlash',
      sections: [
        {
          heading: 'Qavs oldidagi ishora',
          text: "Qavs oldida minus ishorasi tursa, qavs ichidagi barcha hadlarning ishorasi qarama-qarshisiga o'zgaradi.",
          formula: '-(a - b) = -a + b',
          example: {
            problem: '5(2x - 3) - 3(x + 4) ifodani soddalashtiring.',
            solution: '10x - 15 - 3x - 12 = 7x - 27.'
          }
        }
      ]
    }
  },
  {
    id: 'top-6-5',
    grade: 6,
    category: 'Geometriya',
    title: 'Aylana va doira, doira yuzi',
    description: "Radius (R), diametr (D), aylana uzunligi (C = 2πR), doira yuzi (S = πR²).",
    iconName: 'Circle',
    difficulty: 'Qiyin',
    estimatedMinutes: 30,
    formulaSummary: 'C = 2πR = πD | S = πR² (π ≈ 3.14)',
    questionCount: 6,
    theoryContent: {
      title: 'Aylana va doiraning sirlari',
      sections: [
        {
          heading: 'Pi soni va doira',
          text: "Aylana uzunligining uning diametriga nisbati o'zgarmas son bo'lib, u π (pi) deb ataladi.",
          formula: 'C = 2πR, S = πR²',
          example: {
            problem: 'Radiusi 5 sm bo\'lgan doiraning yuzini toping (π ≈ 3.14).',
            solution: 'S = 3.14 · 5² = 3.14 · 25 = 78.5 sm².'
          }
        }
      ]
    }
  },

  // ================= 7-SINF =================
  {
    id: 'top-7-1',
    grade: 7,
    category: 'Algebra',
    title: 'Darajalar va ularning xossalari',
    description: "Natural va butun ko'rsatkichli darajalar, darajalarni ko'paytirish va bo'lish qoidalari.",
    iconName: 'Superscript',
    difficulty: "O'rta",
    estimatedMinutes: 30,
    formulaSummary: 'aⁿ · aᵐ = aⁿ⁺ᵐ | (aⁿ)ᵐ = aⁿᵐ | a⁰ = 1',
    questionCount: 6,
    theoryContent: {
      title: 'Daraja amallari',
      sections: [
        {
          heading: 'Asoslari bir xil bo\'lgan darajalar',
          text: "Ko'paytirishda ko'rsatkichlar qo'shiladi, bo'lishda ayiriladi, darajani darajaga ko'tarishda ko'paytiriladi.",
          formula: 'aⁿ · aᵐ = aⁿ⁺ᵐ, aⁿ : aᵐ = aⁿ⁻ᵐ',
          example: {
            problem: '(2³ · 2⁴) : 2⁵ ni hisoblang.',
            solution: '2³⁺⁴ : 2⁵ = 2⁷ : 2⁵ = 2⁷⁻⁵ = 2² = 4.'
          }
        }
      ]
    }
  },
  {
    id: 'top-7-2',
    grade: 7,
    category: 'Algebra',
    title: 'Qisqa ko\'paytirish formulalari',
    description: "Kvadratlar ayirmasi, yig'indi va ayirmaning kvadrati, kublar formulalari.",
    iconName: 'Layers',
    difficulty: 'Qiyin',
    estimatedMinutes: 35,
    formulaSummary: '(a±b)² = a² ± 2ab + b² | a² - b² = (a-b)(a+b)',
    questionCount: 6,
    theoryContent: {
      title: 'Asosiy algebraik formulalar',
      sections: [
        {
          heading: 'Ikkihad kvadrati',
          text: "Ikki son yig'indisining kvadrati birinchi son kvadrati, ularning ikkilangan ko'paytmasi va ikkinchi son kvadratining yig'indisiga teng.",
          formula: '(a + b)² = a² + 2ab + b²',
          example: {
            problem: '(2x + 3)² ifodani ko\'phad shaklida yozing.',
            solution: '(2x)² + 2·(2x)·3 + 3² = 4x² + 12x + 9.'
          }
        }
      ]
    }
  },
  {
    id: 'top-7-3',
    grade: 7,
    category: 'Algebra',
    title: 'Chiziqli tenglamalar va tengsizliklar',
    description: "Bir noma'lumli chiziqli tenglamalar, tengsizliklar xossalari, oraliqlar usuli.",
    iconName: 'Equal',
    difficulty: "O'rta",
    estimatedMinutes: 30,
    formulaSummary: 'ax = b ⇒ x = b/a (a ≠ 0)',
    questionCount: 6,
    theoryContent: {
      title: 'Chiziqli tengsizliklar',
      sections: [
        {
          heading: 'Manfiy songa ko\'paytirish',
          text: "Tengsizlikning ikkala qismi manfiy songa ko'paytirilsa yoki bo'linsa, tengsizlik belgisi qarama-qarshisiga o'zgaradi!",
          formula: '-2x < 6 ⇒ x > -3',
          example: {
            problem: '-3x + 5 ≤ 20 tengsizlikni yeching.',
            solution: '-3x ≤ 15 => x ≥ -5. Javob: [-5; +∞).'
          }
        }
      ]
    }
  },
  {
    id: 'top-7-4',
    grade: 7,
    category: 'Funksiyalar',
    title: 'Chiziqli funksiya va uning grafigi',
    description: "y = kx + b funksiyasi, burchak koeffitsiyenti k, koordinata tekisligida to'g'ri chiziq yasash.",
    iconName: 'TrendingUp',
    difficulty: "O'rta",
    estimatedMinutes: 30,
    formulaSummary: 'y = kx + b (k — burchak koeffitsiyenti)',
    questionCount: 6,
    theoryContent: {
      title: 'Funksiya grafigi',
      sections: [
        {
          heading: 'K va B koeffitsiyentlar ma\'nosi',
          text: "k > 0 bo'lsa funksiya o'suvchi, k < 0 bo'lsa kamayuvchi. b esa grafikning Oy o'qini kesib o'tish nuqtasidir.",
          formula: 'k = (y₂ - y₁) / (x₂ - x₁)',
          example: {
            problem: 'y = 2x - 4 funksiyaning nollari va Oy o\'qi bilan kesishish nuqtasini toping.',
            solution: 'y=0 => 2x - 4 = 0 => x = 2. x=0 => y = -4. Nuqtalar: (2; 0) va (0; -4).'
          }
        }
      ]
    }
  },
  {
    id: 'top-7-5',
    grade: 7,
    category: 'Geometriya',
    title: 'Uchburchaklar tengligi alomatlari',
    description: "Uchburchak tushunchasi, burchaklar yig'indisi (180°), uchburchaklar tengligining uchta alomati (TTT, TBT, BTT).",
    iconName: 'Triangle',
    difficulty: 'Qiyin',
    estimatedMinutes: 35,
    formulaSummary: '∠A + ∠B + ∠C = 180°',
    questionCount: 6,
    theoryContent: {
      title: 'Uchburchaklar geometriyasi',
      sections: [
        {
          heading: 'Burchaklar yig\'indisi teoremasi',
          text: "Har qanday uchburchakning ichki burchaklari yig'indisi doimo 180° ga teng.",
          formula: 'α + β + γ = 180°',
          example: {
            problem: 'To\'g\'ri burchakli uchburchakning bir o\'tkir burchagi 35° bo\'lsa, ikkinchisini toping.',
            solution: '90° - 35° = 55°.'
          }
        }
      ]
    }
  },

  // ================= 8-SINF =================
  {
    id: 'top-8-1',
    grade: 8,
    category: 'Algebra',
    title: 'Kvadrat ildizlar va irratsional sonlar',
    description: "Arifmetik kvadrat ildiz, uning xossalari, ko'paytuvchini ildiz ostidan chiqarish va kiritish.",
    iconName: 'SquareRadical',
    difficulty: "O'rta",
    estimatedMinutes: 30,
    formulaSummary: '√(a · b) = √a · √b | √(a²) = |a|',
    questionCount: 6,
    theoryContent: {
      title: 'Ildizlar bilan ishlash',
      sections: [
        {
          heading: 'Arifmetik kvadrat ildiz',
          text: "a ning arifmetik kvadrat ildizi deb kvadrati a ga teng bo'lgan nomanfiy songa aytiladi (a ≥ 0).",
          formula: '√x² = |x|',
          example: {
            problem: '√72 ni ko\'paytuvchiga ajratib soddalashtiring.',
            solution: '√72 = √(36 · 2) = √36 · √2 = 6√2.'
          }
        }
      ]
    }
  },
  {
    id: 'top-8-2',
    grade: 8,
    category: 'Algebra',
    title: 'Kvadrat tenglamalar va Viyet teoremasi',
    description: "To'liq va to'liqsiz kvadrat tenglamalar, diskriminant (D = b² - 4ac), Viyet teoremasi.",
    iconName: 'Atom',
    difficulty: 'Qiyin',
    estimatedMinutes: 40,
    formulaSummary: 'ax² + bx + c = 0 | D = b² - 4ac | x₁,₂ = (-b ± √D)/(2a)',
    questionCount: 6,
    theoryContent: {
      title: 'Kvadrat tenglamalarni yechish sirlari',
      sections: [
        {
          heading: 'Diskriminant qoidalari',
          text: "D > 0 bo'lsa 2 ta haqiqiy ildiz; D = 0 bo'lsa 1 ta (karrali) ildiz; D < 0 bo'lsa haqiqiy ildiz yo'q.",
          formula: 'D = b² - 4ac',
          example: {
            problem: 'x² - 5x + 6 = 0 tenglamaning ildizlarini Viyet teoremasi orqali toping.',
            solution: 'x₁ + x₂ = 5 va x₁ · x₂ = 6. Bu sonlar: x₁ = 2, x₂ = 3.'
          }
        }
      ]
    }
  },
  {
    id: 'top-8-3',
    grade: 8,
    category: 'Algebra',
    title: 'Algebraik kasrlar ustida amallar',
    description: "Kasrlarni qisqartirish, umumiy maxrajga keltirish, ko'paytirish va bo'lish.",
    iconName: 'FileSpreadsheet',
    difficulty: 'Qiyin',
    estimatedMinutes: 35,
    formulaSummary: 'A/B ± C/D = (AD ± BC)/(BD)',
    questionCount: 6,
    theoryContent: {
      title: 'Kasrlarni soddalashtirish',
      sections: [
        {
          heading: 'Ko\'paytuvchilarga ajratish',
          text: "Algebraik kasrni qisqartirish uchun avval surat va maxraj ko'paytuvchilarga ajratiladi.",
          formula: '(x² - 9)/(x + 3) = ((x-3)(x+3))/(x+3) = x - 3',
          example: {
            problem: '(x² - 4) / (2x - 4) kasrni qisqartiring.',
            solution: 'Surat: (x - 2)(x + 2). Maxraj: 2(x - 2). Qisqarsa: (x + 2) / 2.'
          }
        }
      ]
    }
  },
  {
    id: 'top-8-4',
    grade: 8,
    category: 'Algebra',
    title: 'Tenglamalar sistemasi',
    description: "Ikki noma'lumli chiziqli tenglamalar sistemasi: o'rniga qo'yish va algebraik qo'shish usullari.",
    iconName: 'Grid',
    difficulty: "O'rta",
    estimatedMinutes: 35,
    formulaSummary: '{ a₁x + b₁y = c₁ | a₂x + b₂y = c₂ }',
    questionCount: 6,
    theoryContent: {
      title: 'Sistemalarni yechish metodlari',
      sections: [
        {
          heading: 'Algebraik qo\'shish usuli',
          text: "Tenglamalarni hadma-had qo'shish yoki ayirish orqali bir noma'lumni yo'qotish.",
          formula: '{ x + y = A, x - y = B ⇒ 2x = A + B }',
          example: {
            problem: '{ x + y = 10, x - y = 4 } sistemasini yeching.',
            solution: 'Qo\'shsak: 2x = 14 => x = 7. y = 10 - 7 = 3. Javob: (7; 3).'
          }
        }
      ]
    }
  },
  {
    id: 'top-8-5',
    grade: 8,
    category: 'Geometriya',
    title: 'Pifagor teoremasi va to\'rtburchaklar',
    description: "To'g'ri burchakli uchburchakda gipotenuza kvadrati katetlar kvadratlari yig'indisiga teng. Parallelogramm, romb, trapetsiya.",
    iconName: 'Box',
    difficulty: 'Qiyin',
    estimatedMinutes: 40,
    formulaSummary: 'c² = a² + b² | c = √(a² + b²)',
    questionCount: 6,
    theoryContent: {
      title: 'Pifagor teoremasi',
      sections: [
        {
          heading: 'Asosiy teorema',
          text: "To'g'ri burchakli uchburchakda gipotenuzaning kvadrati katetlarning kvadratlari yig'indisiga teng.",
          formula: 'c² = a² + b²',
          example: {
            problem: 'Katetlari 6 sm va 8 sm bo\'lgan to\'g\'ri burchakli uchburchakning gipotenuzasini toping.',
            solution: 'c² = 6² + 8² = 36 + 64 = 100. c = √100 = 10 sm.'
          }
        }
      ]
    }
  }
];

export const QUESTIONS_BANK: Question[] = [
  // ================= 5-SINF SAVOLLARI =================
  {
    id: 'q-5-1-1',
    topicId: 'top-5-1',
    grade: 5,
    type: 'single_choice',
    questionText: "548 290 sonida nechta yuzliklar xonasi bor?",
    options: ['2', '8', '4', '9'],
    correctAnswer: '2',
    explanation: "548 290 sonida: 0 - birliklar, 9 - o'nliklar, 2 - yuzliklar, 8 - mingliklar xonasidir. Demak, yuzliklar xonasi raqami 2.",
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-5-1-2',
    topicId: 'top-5-1',
    grade: 5,
    type: 'number_input',
    questionText: "7 846 sonini yuzliklargacha yaxlitlaganda qanday son hosil bo'ladi?",
    correctAnswer: 7800,
    explanation: "Yuzliklar xonasida 8 turibdi. Undan keyingi o'nliklar raqami 4 (<5) bo'lgani sababli, 8 o'zgarmaydi va keyingi raqamlar 0 ga aylanadi: 7800.",
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-5-2-1',
    topicId: 'top-5-2',
    grade: 5,
    type: 'single_choice',
    formula: '48 + 12 · (20 - 5) : 3',
    questionText: "Ushbu arifmetik ifodaning qiymatini toping:",
    options: ['108', '60', '84', '300'],
    correctAnswer: '108',
    explanation: "1) Qavs ichi: 20 - 5 = 15; 2) Ko'paytirish: 12 · 15 = 180; 3) Bo'lish: 180 : 3 = 60; 4) Qo'shish: 48 + 60 = 108.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-5-2-2',
    topicId: 'top-5-2',
    grade: 5,
    type: 'equation_solve',
    formula: '4x - 17 = 43',
    questionText: "Tenglamaning ildizini toping:",
    options: ['15', '12', '10', '16'],
    correctAnswer: '15',
    explanation: "4x = 43 + 17 => 4x = 60 => x = 60 : 4 => x = 15.",
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-5-3-1',
    topicId: 'top-5-3',
    grade: 5,
    type: 'single_choice',
    formula: '3/8 + 1/4',
    questionText: "Kasrlar yig'indisini hisoblang:",
    options: ['5/8', '4/12', '1/2', '7/8'],
    correctAnswer: '5/8',
    explanation: "Umumiy maxraj 8. 1/4 = 2/8. Demak: 3/8 + 2/8 = 5/8.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-5-5-1',
    topicId: 'top-5-5',
    grade: 5,
    type: 'number_input',
    questionText: "400 sonining 35% ini toping:",
    correctAnswer: 140,
    explanation: "400 · 35 / 100 = 4 · 35 = 140.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-5-7-1',
    topicId: 'top-5-7',
    grade: 5,
    type: 'geometry',
    questionText: "To'g'ri to'rtburchakning bo'yi 12 sm, eni 7 sm. Uning perimetrini (P) sm da hisoblang:",
    diagramSvg: `<svg viewBox="0 0 200 120" class="w-48 h-28 mx-auto text-indigo-400">
      <rect x="20" y="20" width="160" height="80" fill="none" stroke="currentColor" stroke-width="3" rx="4"/>
      <text x="90" y="15" fill="#94a3b8" font-size="12">12 sm</text>
      <text x="185" y="65" fill="#94a3b8" font-size="12">7 sm</text>
    </svg>`,
    options: ['38', '42', '84', '26'],
    correctAnswer: '38',
    explanation: "P = 2 · (a + b) = 2 · (12 + 7) = 2 · 19 = 38 sm.",
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-5-8-1',
    topicId: 'top-5-8',
    grade: 5,
    type: 'logic_puzzle',
    questionText: "Daraxtda 7 ta qush qo'ngan edi. Ovchi o'q uzib bittasini urib tushirdi. Daraxtda nechta qush qoldi?",
    options: ['0 ta (qolganlari uchib ketdi)', '6 ta', '1 ta', '7 ta'],
    correctAnswer: '0 ta (qolganlari uchib ketdi)',
    explanation: "Bu mantiqiy savol: o'q ovozidan cho'chib, qolgan qushlarning barchasi daraxtdan uchib ketadi.",
    points: 10,
    difficulty: 'easy'
  },

  // ================= 6-SINF SAVOLLARI =================
  {
    id: 'q-6-1-1',
    topicId: 'top-6-1',
    grade: 6,
    type: 'single_choice',
    questionText: "24 va 36 sonlarining eng katta umumiy bo'luvchisini (EKUB) toping:",
    options: ['12', '6', '18', '72'],
    correctAnswer: '12',
    explanation: "24 = 2³ · 3, 36 = 2² · 3². EKUB(24, 36) = 2² · 3 = 12.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-6-2-1',
    topicId: 'top-6-2',
    grade: 6,
    type: 'equation_solve',
    formula: 'x : 18 = 5 : 6',
    questionText: "Proporsiyadan noma'lum had x ni toping:",
    options: ['15', '12', '20', '25'],
    correctAnswer: '15',
    explanation: "Proporsiyaning asosiy xossasiga ko'ra: 6 · x = 18 · 5 => 6x = 90 => x = 15.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-6-3-1',
    topicId: 'top-6-3',
    grade: 6,
    type: 'single_choice',
    formula: '(-18) + 25 - (-7)',
    questionText: "Ifodaning qiymatini hisoblang:",
    options: ['14', '0', '-14', '32'],
    correctAnswer: '14',
    explanation: "(-18) + 25 = 7. Keyin: 7 - (-7) = 7 + 7 = 14.",
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-6-3-2',
    topicId: 'top-6-3',
    grade: 6,
    type: 'number_input',
    formula: '(-8) · (-6) : (-4)',
    questionText: "Ifodaning natijasini kiriting:",
    correctAnswer: -12,
    explanation: "(-8) · (-6) = +48. Keyin: 48 : (-4) = -12.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-6-4-1',
    topicId: 'top-6-4',
    grade: 6,
    type: 'single_choice',
    formula: '4(3x - 2) - 2(5x + 3)',
    questionText: "Ifodani soddalashtiring:",
    options: ['2x - 14', '2x - 2', '22x - 14', '2x + 14'],
    correctAnswer: '2x - 14',
    explanation: "4(3x - 2) = 12x - 8. -2(5x + 3) = -10x - 6. Barchasi: 12x - 8 - 10x - 6 = 2x - 14.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-6-5-1',
    topicId: 'top-6-5',
    grade: 6,
    type: 'geometry',
    questionText: "Doiraning radiusi R = 7 sm bo'lsa, uning yuzini toping (π = 22/7 deb oling):",
    diagramSvg: `<svg viewBox="0 0 160 160" class="w-36 h-36 mx-auto text-emerald-400">
      <circle cx="80" cy="80" r="60" fill="rgba(16, 185, 129, 0.1)" stroke="currentColor" stroke-width="2.5"/>
      <line x1="80" y1="80" x2="140" y2="80" stroke="currentColor" stroke-width="2" stroke-dasharray="4"/>
      <circle cx="80" cy="80" r="3" fill="currentColor"/>
      <text x="100" y="72" fill="#94a3b8" font-size="12">R = 7</text>
    </svg>`,
    options: ['154 sm²', '44 sm²', '88 sm²', '196 sm²'],
    correctAnswer: '154 sm²',
    explanation: "S = π · R² = (22/7) · 7² = (22/7) · 49 = 22 · 7 = 154 sm².",
    points: 10,
    difficulty: 'hard'
  },

  // ================= 7-SINF SAVOLLARI =================
  {
    id: 'q-7-1-1',
    topicId: 'top-7-1',
    grade: 7,
    type: 'single_choice',
    formula: '(3⁴ · 3⁶) : 3⁷',
    questionText: "Darajaning qiymatini hisoblang:",
    options: ['27', '9', '81', '3'],
    correctAnswer: '27',
    explanation: "3⁴⁺⁶ : 3⁷ = 3¹⁰ : 3⁷ = 3¹⁰⁻⁷ = 3³ = 27.",
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-7-2-1',
    topicId: 'top-7-2',
    grade: 7,
    type: 'single_choice',
    formula: '(2a - 5b)²',
    questionText: "Qisqa ko'paytirish formulasi yordamida oching:",
    options: ['4a² - 20ab + 25b²', '4a² - 25b²', '4a² + 20ab + 25b²', '2a² - 10ab + 5b²'],
    correctAnswer: '4a² - 20ab + 25b²',
    explanation: "(2a)² - 2·(2a)·(5b) + (5b)² = 4a² - 20ab + 25b².",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-7-2-2',
    topicId: 'top-7-2',
    grade: 7,
    type: 'number_input',
    formula: '87² - 13²',
    questionText: "Kvadratlar ayirmasi formulasi yordamida tezkor hisoblang:",
    correctAnswer: 7400,
    explanation: "(87 - 13)(87 + 13) = 74 · 100 = 7400.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-7-3-1',
    topicId: 'top-7-3',
    grade: 7,
    type: 'single_choice',
    formula: '5x - 7 > 3x + 9',
    questionText: "Tengsizlikning eng kichik butun yechimini toping:",
    options: ['9', '8', '7', '10'],
    correctAnswer: '9',
    explanation: "5x - 3x > 9 + 7 => 2x > 16 => x > 8. 8 dan katta eng kichik butun son 9 ga teng.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-7-4-1',
    topicId: 'top-7-4',
    grade: 7,
    type: 'single_choice',
    formula: 'y = -3x + 12',
    questionText: "Funksiyaning grafigi Ox o'qini qaysi nuqtada kesib o'tadi?",
    options: ['(4; 0)', '(0; 12)', '(-4; 0)', '(3; 0)'],
    correctAnswer: '(4; 0)',
    explanation: "Ox o'qida y = 0 bo'ladi: -3x + 12 = 0 => 3x = 12 => x = 4. Nuqta: (4; 0).",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-7-5-1',
    topicId: 'top-7-5',
    grade: 7,
    type: 'geometry',
    questionText: "Uchburchakning ikki burchagi 45° va 65° bo'lsa, uchinchi burchagini toping:",
    diagramSvg: `<svg viewBox="0 0 180 120" class="w-44 h-28 mx-auto text-amber-400">
      <polygon points="20,100 160,100 90,20" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <text x="35" y="95" fill="#94a3b8" font-size="11">45°</text>
      <text x="125" y="95" fill="#94a3b8" font-size="11">65°</text>
      <text x="85" y="45" fill="#fbbf24" font-size="12" font-weight="bold">?</text>
    </svg>`,
    options: ['70°', '80°', '60°', '75°'],
    correctAnswer: '70°',
    explanation: "Uchburchak ichki burchaklari yig'indisi 180°: 180° - (45° + 65°) = 180° - 110° = 70°.",
    points: 10,
    difficulty: 'easy'
  },

  // ================= 8-SINF SAVOLLARI =================
  {
    id: 'q-8-1-1',
    topicId: 'top-8-1',
    grade: 8,
    type: 'single_choice',
    formula: '√18 + √50 - √8',
    questionText: "Ildizli ifodani soddalashtiring:",
    options: ['6√2', '7√2', '5√2', '4√2'],
    correctAnswer: '6√2',
    explanation: "√18 = 3√2; √50 = 5√2; √8 = 2√2. Hammasi: 3√2 + 5√2 - 2√2 = 6√2.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-8-2-1',
    topicId: 'top-8-2',
    grade: 8,
    type: 'single_choice',
    formula: 'x² - 7x + 12 = 0',
    questionText: "Kvadrat tenglamaning ildizlarini toping:",
    options: ['3 va 4', '-3 va -4', '2 va 6', '1 va 12'],
    correctAnswer: '3 va 4',
    explanation: "Viyet teoremasiga ko'ra: x₁ + x₂ = 7 va x₁ · x₂ = 12. Demak, ildizlar 3 va 4.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-8-2-2',
    topicId: 'top-8-2',
    grade: 8,
    type: 'number_input',
    formula: '2x² - 5x + 2 = 0',
    questionText: "Tenglamaning diskriminanti (D) nechaga teng?",
    correctAnswer: 9,
    explanation: "D = b² - 4ac = (-5)² - 4·2·2 = 25 - 16 = 9.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-8-3-1',
    topicId: 'top-8-3',
    grade: 8,
    type: 'single_choice',
    formula: '(a² - 16) / (a² - 4a)',
    questionText: "Kasrni qisqartiring:",
    options: ['(a + 4) / a', '(a - 4) / a', '(a + 4) / 4', 'a / (a - 4)'],
    correctAnswer: '(a + 4) / a',
    explanation: "Surat: (a - 4)(a + 4). Maxraj: a(a - 4). (a - 4) qisqaradi: (a + 4)/a.",
    points: 10,
    difficulty: 'hard'
  },
  {
    id: 'q-8-4-1',
    topicId: 'top-8-4',
    grade: 8,
    type: 'single_choice',
    formula: '{ 2x + y = 11, x - y = 1 }',
    questionText: "Tenglamalar sistemasidan x va y ning ko'paytmasi x · y ni toping:",
    options: ['12', '15', '8', '16'],
    correctAnswer: '12',
    explanation: "Tenglamalarni qo'shsak: 3x = 12 => x = 4. y = x - 1 = 3. x · y = 4 · 3 = 12.",
    points: 10,
    difficulty: 'medium'
  },
  {
    id: 'q-8-5-1',
    topicId: 'top-8-5',
    grade: 8,
    type: 'geometry',
    questionText: "To'g'ri burchakli uchburchakning katetlari 9 sm va 12 sm. Uning gipotenuzasini (sm da) toping:",
    diagramSvg: `<svg viewBox="0 0 160 140" class="w-40 h-32 mx-auto text-cyan-400">
      <polygon points="30,110 130,110 30,20" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <rect x="30" y="98" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <text x="15" y="70" fill="#94a3b8" font-size="11">9 sm</text>
      <text x="75" y="125" fill="#94a3b8" font-size="11">12 sm</text>
      <text x="90" y="60" fill="#38bdf8" font-size="12" font-weight="bold">c = ?</text>
    </svg>`,
    options: ['15', '14', '18', '21'],
    correctAnswer: '15',
    explanation: "Pifagor teoremasi: c² = a² + b² = 9² + 12² = 81 + 144 = 225. c = √225 = 15 sm.",
    points: 10,
    difficulty: 'medium'
  }
];
