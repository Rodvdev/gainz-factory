"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import jsPDF from "jspdf";

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  category: string;
  time: string;
  portions: string;
  ingredients: string[];
  instructions: string[];
  macros: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
  tips?: string[];
  image?: string;
}

const recipes: Recipe[] = [
  {
    id: "mousse-chocolate-fit",
    name: "Mousse de Chocolate FIT y PROTEICO",
    emoji: "🍫",
    category: "dulces",
    time: "10 min",
    portions: "2 porciones",
    ingredients: [
      "3 huevos 🥚",
      "2 scoops (1/2 taza aprox) cacao 🍫",
      "1 cucharada mantequilla de maní 🥜",
      "Canela",
      "Vainilla",
      "Stevia",
      "Almendras, nueces o avellanas (si gustas como topping)"
    ],
    instructions: [
      "Separar las claras de las yemas",
      "Batir las claras hasta punto de nieve",
      "En otro bowl, mezclar las yemas con el cacao, mantequilla de maní, canela, vainilla y stevia",
      "Integrar suavemente las claras batidas a la mezcla",
      "Refrigerar por 2 horas mínimo",
      "Servir con frutos secos como topping"
    ],
    macros: {
      protein: "15g",
      carbs: "8g",
      fats: "12g",
      calories: "180 kcal"
    },
    tips: [
      "Puedes usar cacao sin azúcar para menos calorías",
      "Agregar proteína en polvo para más proteína",
      "Usar mantequilla de almendras como alternativa"
    ]
  },
  {
    id: "torta-avena-anabolica",
    name: "Torta de Avena Anabólica",
    emoji: "💪🏻",
    category: "dulces",
    time: "15 min",
    portions: "1 porción",
    ingredients: [
      "1 plátano 🍌",
      "60g avena 🥣",
      "5 🥚's 2 enteros 3 claras (puedes hacerlo con menos si deseas *mínimo 2)",
      "Canela al FALLO 🤤",
      "Coca en polvo 🍫 (sin azúcar)",
      "Stevia",
      "15g mantequilla de maní 🥜",
      "2 🥄's yogur griego",
      "Fresas 🍓"
    ],
    instructions: [
      "Mash el plátano en un bowl",
      "Agregar la avena, huevos, canela, cacao y stevia",
      "Mezclar hasta integrar todo",
      "Cocinar en sartén antiadherente a fuego medio",
      "Voltear cuando se vean burbujas",
      "Servir con mantequilla de maní, yogur griego y fresas"
    ],
    macros: {
      protein: "25g",
      carbs: "45g",
      fats: "18g",
      calories: "420 kcal"
    },
    tips: [
      "Fácil, práctica y recontra PROTEICA, ideal para librarte de ese antojito dulce 😋",
      "Puedes usar menos huevos si prefieres",
      "Agregar más canela para más sabor"
    ]
  },
  {
    id: "chaufa-quinua-anabolico",
    name: "Chaufa de Quinua Anabólico",
    emoji: "🤤💪🏻",
    category: "saladas",
    time: "25 min",
    portions: "2 porciones",
    ingredients: [
      "1 taza / 200g de quinua cocida 😋 (enjuágala 3 veces para que no quede amarga y al primer hervor cambia el agua) ✍🏻",
      "100-150g pechuga de pollo 🍗",
      "1 huevo 🥚 (tortilla)",
      "Ajo 🧄",
      "Cebolla blanca 🧅",
      "Cebolla china",
      "Kion",
      "Pimentón rojo",
      "Champiñones 🍄",
      "Ají amarillo",
      "Brócoli 🥦",
      "Sillao",
      "Aceite de ajonjolí",
      "Ajinomoto (opcional)",
      "Sazonador completo 🌿",
      "Sal 🧂",
      "Pimienta",
      "Ajonjolí (opcional)"
    ],
    instructions: [
      "Cocinar la quinua: enjuagar 3 veces, hervir y cambiar agua al primer hervor",
      "Cortar el pollo en cubos y sazonar",
      "Cocinar el pollo en sartén hasta dorar",
      "Hacer una tortilla con el huevo y cortar en tiras",
      "Sofreír ajo, cebolla, kion y pimentón",
      "Agregar champiñones, ají amarillo y brócoli",
      "Incorporar la quinua cocida y el pollo",
      "Agregar sillao, aceite de ajonjolí y sazonadores",
      "Finalizar con la tortilla de huevo y ajonjolí"
    ],
    macros: {
      protein: "35g",
      carbs: "55g",
      fats: "15g",
      calories: "480 kcal"
    },
    tips: [
      "Enjuagar bien la quinua para quitar el sabor amargo",
      "Puedes usar tofu en lugar de pollo para versión vegana",
      "Agregar más vegetales según preferencia"
    ]
  },
  {
    id: "carrot-cake-fit",
    name: "Carrot Cake FIT (en 2 minutos)",
    emoji: "🥕🤩",
    category: "dulces",
    time: "2 min",
    portions: "1 porción",
    ingredients: [
      "1 huevo 🥚",
      "2 🥄's harina de avena",
      "1 chorrito de leche 🥛 (de preferencia de almendras)",
      "1/2 zanahoria rayada 🥕",
      "Frutos secos 🥜 (a tu elección)",
      "Vainilla",
      "Stevia"
    ],
    instructions: [
      "Mezclar el huevo con la harina de avena",
      "Agregar la leche y mezclar hasta formar una masa",
      "Incorporar la zanahoria rayada y los frutos secos",
      "Agregar vainilla y stevia al gusto",
      "Cocinar en microondas por 2 minutos o en sartén hasta dorar",
      "Preparar el frosting mezclando yogur griego, vainilla y stevia",
      "Decorar con más zanahoria rayada y frutos secos"
    ],
    macros: {
      protein: "18g",
      carbs: "25g",
      fats: "12g",
      calories: "280 kcal"
    },
    tips: [
      "Para decorar agrega más zanahoria encima junto con un puñado de frutos secos ✅",
      "Puedes usar leche de almendras para menos calorías",
      "Agregar canela para más sabor",
      "El frosting de yogur griego es más saludable que crema"
    ]
  },
  {
    id: "delicia-blueberries-cheesecake",
    name: "DELICIA de Blueberries (sabor cheesecake)",
    emoji: "🫐🤤",
    category: "dulces",
    time: "15 min",
    portions: "4 porciones",
    ingredients: [
      "2 tazas yogurt griego",
      "4 huevos 🥚",
      "1 taza tapioca o maicena ✅",
      "Vainilla",
      "Stevia",
      "Arándanos 🫐"
    ],
    instructions: [
      "Precalentar el horno a 180°C",
      "Mezclar el yogurt griego con los huevos hasta integrar",
      "Agregar la tapioca o maicena y mezclar bien",
      "Incorporar vainilla y stevia al gusto",
      "Agregar los arándanos y mezclar suavemente",
      "Verter en un molde antiadherente",
      "Hornear por 15-20 minutos hasta que esté firme",
      "Dejar enfriar antes de servir"
    ],
    macros: {
      protein: "22g",
      carbs: "18g",
      fats: "8g",
      calories: "240 kcal"
    },
    tips: [
      "Excelente opción si estás antojado/a de un postresito, te da la sensación que estás comiendo un cheesecake super saludable 🤩",
      "DISFRUTA SIN CULPA ‼️ VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Puedes usar frambuesas o fresas en lugar de arándanos",
      "Agregar un poco de canela para más sabor",
      "Servir frío para mejor textura"
    ]
  },
  {
    id: "pizza-protein-huevos",
    name: "PIZZA +30G PROTE (masa de huevos)",
    emoji: "🍕🤤",
    category: "saladas",
    time: "20 min",
    portions: "2 porciones",
    ingredients: [
      "5 panes de molde 🍞",
      "4 huevos 🥚",
      "Salsa de tomate 🍅",
      "Queso mozzarella 🧀 (de preferencia si es light)",
      "Pepperoni o el jamón de tu preferencia (si es bajo en grasas mejor) ✅",
      "Orégano 🌿"
    ],
    instructions: [
      "Precalentar el horno a 200°C",
      "En un bowl, batir los huevos hasta que estén espumosos",
      "Agregar los panes de molde cortados en cuadritos y mezclar bien",
      "Formar la masa en una bandeja antiadherente",
      "Hornear la masa por 8-10 minutos hasta que esté dorada",
      "Sacar del horno y agregar la salsa de tomate",
      "Espolvorear el queso mozzarella",
      "Agregar el pepperoni o jamón",
      "Espolvorear orégano al gusto",
      "Hornear por 5-7 minutos más hasta que el queso se derrita"
    ],
    macros: {
      protein: "32g",
      carbs: "28g",
      fats: "16g",
      calories: "380 kcal"
    },
    tips: [
      "Excelente opción casera, fácil y rápidita de hacer 🤩 para librarte de ese antojito de una Pizza con una versión igual de rica y RECONTRA SALUDABLE 😍",
      "🚨 GUÁRDALA y PRÉBALA 🫵🏻 No te arrepentirás, ya me cuentas qué tal 😃",
      "DISFRUTA SIN CULPA ‼️ VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Puedes agregar vegetales como pimientos, champiñones o espinacas",
      "Usar queso cottage en lugar de mozzarella para más proteína",
      "La masa de huevos es más nutritiva que la masa tradicional"
    ]
  },
  {
    id: "cookie-dough-fit",
    name: "Masa de Galleta Fit (Cookie Dough)",
    emoji: "🍪🤤",
    category: "dulces",
    time: "5 min",
    portions: "1 porción",
    ingredients: [
      "50g almendra molida (harina de almendra)",
      "1 cucharada mantequilla de maní 🥜",
      "1 scoop de proteína (yo utilice sabor vainilla) @ivernprotein.pe 🤩",
      "Chips de chocolate 🍫"
    ],
    instructions: [
      "En un bowl, mezclar la harina de almendra con la mantequilla de maní",
      "Agregar el scoop de proteína y mezclar bien",
      "Incorporar los chips de chocolate",
      "Amasar con las manos hasta formar una masa consistente",
      "Formar bolitas o comer directamente como cookie dough"
    ],
    macros: {
      protein: "32g",
      carbs: "15g",
      fats: "18g",
      calories: "320 kcal"
    },
    tips: [
      "Amante de las 🍪's ⁉️ 2 recetas +30g prote ⬇️",
      "Puedes agregar stevia si quieres más dulce",
      "Usar mantequilla de almendras como alternativa",
      "Agregar canela para más sabor",
      "Conservar en refrigerador para mejor textura"
    ]
  },
  {
    id: "galletas-anabolicas",
    name: "Galletas al horno / air fryer ANABÓLICAS",
    emoji: "🍪😮‍💨",
    category: "dulces",
    time: "20 min",
    portions: "4 porciones",
    ingredients: [
      "50g almendra molida (harina de almendra)",
      "1 cucharada mantequilla de maní 🥜",
      "1 scoop de proteína (yo utilice sabor vainilla) @ivernprotein.pe 🤩",
      "Chips de chocolate 🍫",
      "Polvo de hornear o bicarbonato de sodio ✅"
    ],
    instructions: [
      "Precalentar el horno a 180°C (o air fryer)",
      "En un bowl, mezclar la harina de almendra con la mantequilla de maní",
      "Agregar el scoop de proteína y mezclar bien",
      "Incorporar los chips de chocolate",
      "Agregar polvo de hornear o bicarbonato de sodio",
      "Amasar bien con las manos 🙄",
      "Formar galletas pequeñas",
      "Hornear por 20 minutos a 180°C (si es air fryer prueba con 15 min ✍🏻)",
      "Dejar enfriar antes de servir"
    ],
    macros: {
      protein: "30g",
      carbs: "16g",
      fats: "17g",
      calories: "310 kcal"
    },
    tips: [
      "Exactamente lo mismo de arriba 👆🏻 solo que agregando polvo de hornear o bicarbonato de sodio ✅",
      "Amasas (con la mano 🙄) bien y llevas al horno por 20 minutos a 180° (si es al air fryer prueba con 15 min ✍🏻)",
      "WALAAAAA MANJAR DE DIOS DRIEGO!!! 😍",
      "Puedes agregar nueces picadas para más crunch",
      "Usar proteína de chocolate para más sabor",
      "Las galletas quedan mejor si las dejas reposar 10 minutos antes de hornear"
    ]
  },
  {
    id: "salsa-mango-picante",
    name: "Salsa de MANGO PICANTE",
    emoji: "🌶️🥵🥭",
    category: "salsas",
    time: "15 min",
    portions: "4 porciones",
    ingredients: [
      "1-2 mangos 🥭",
      "Ajo 🧄",
      "Kion 🫚 (una buena porción picada/aprox 2 🥄's)",
      "3 ají limos 🌶️",
      "1-2 cucharadas de miel 🍯 @goxa_pe 🔝",
      "1 limón grande 🍋",
      "2-3 🥄's de maicena diluida en agua 💧",
      "1 chorrito aceite de ajonjolí"
    ],
    instructions: [
      "Pelar y cortar los mangos en trozos pequeños",
      "Picar finamente el ajo y el kion",
      "Cortar los ajíes limos (quitar semillas si quieres menos picante)",
      "En una sartén, calentar un poco de aceite de ajonjolí",
      "Sofreír el ajo y kion hasta que estén dorados",
      "Agregar los mangos y cocinar por 2-3 minutos",
      "Incorporar los ajíes limos y cocinar 1 minuto más",
      "Agregar la miel y el jugo del limón",
      "Diluir la maicena en agua y agregar para espesar",
      "Cocinar hasta que la salsa tenga la consistencia deseada",
      "Dejar enfriar antes de servir"
    ],
    macros: {
      protein: "2g",
      carbs: "25g",
      fats: "3g",
      calories: "130 kcal"
    },
    tips: [
      "✍🏻 IDEAL para acompañar y darle un toque agridulce a tus comidas 🤤",
      "🚨 COMENTA la palabra ATÚN 🍣 y te envío la receta al privado de las Bolitas Crispys (facilitas de hacer y ESPECTACULARES) 🤩",
      "DISFRUTA SIN CULPA ‼️ VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Puedes ajustar el picante agregando más o menos ajíes",
      "Agregar cilantro picado para más sabor",
      "Conservar en refrigerador hasta por 1 semana"
    ]
  },
  {
    id: "crema-aji-amarillo-huancaina",
    name: "Crema de AJÍ AMARILLO FIT y PROTEICA (salsa a la huancaína)",
    emoji: "🤤",
    category: "salsas",
    time: "20 min",
    portions: "6 porciones",
    ingredients: [
      "Cebolla roja",
      "3-4 ajíes amarillos (con venas si la quieres picante) 🌶️",
      "Ajo 🧄",
      "Sal",
      "Pimienta",
      "Leche de almendras (aprox 150ml) 🥛",
      "Quinua cocida (2 cucharadas)",
      "Queso fresco light (150g)",
      "2 huevos 🥚"
    ],
    instructions: [
      "Cocinar los huevos hasta que estén duros",
      "En una sartén, sofreír la cebolla roja picada hasta que esté transparente",
      "Agregar el ajo picado y cocinar por 1 minuto",
      "Incorporar los ajíes amarillos picados (con o sin venas según el picante deseado)",
      "Cocinar los ajíes hasta que estén suaves",
      "En una licuadora, agregar todos los ingredientes: cebolla, ajo, ajíes, huevos, quinua",
      "Agregar la leche de almendras gradualmente mientras licúas",
      "Incorporar el queso fresco light y licuar hasta obtener una crema suave",
      "Sazonar con sal y pimienta al gusto",
      "Si está muy espesa, agregar más leche de almendras",
      "Servir fría o a temperatura ambiente"
    ],
    macros: {
      protein: "12g",
      carbs: "8g",
      fats: "6g",
      calories: "140 kcal"
    },
    tips: [
      "DISFRUTA SIN CULPA, VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Puedes ajustar el picante quitando las venas de los ajíes",
      "Agregar más quinua para más proteína",
      "Usar queso cottage en lugar de queso fresco para menos calorías",
      "Perfecta para acompañar papas, arroz o como dip",
      "Conservar en refrigerador hasta por 5 días"
    ]
  },
  {
    id: "crema-aji-huacatay-ocopa",
    name: "Crema de AJÍ con HUACATAY FIT y PROTEICA (ocopa)",
    emoji: "🌿🤤",
    category: "salsas",
    time: "25 min",
    portions: "6 porciones",
    ingredients: [
      "Aceite en spray pam",
      "Cebolla Roja",
      "3-4 ajíes amarillos (con venas si la quieres picante) 🌶️",
      "Ajo 🧄",
      "Sal",
      "Pimienta",
      "Leche de almendras | o la que gustes (150ml) 🥛",
      "Quinua cocida 2-3 cucharadas",
      "Queso fresco light (150g)",
      "2 huevos 🥚",
      "1 BUENA cucharada de mantequilla de maní @poderfitmonster (vienen con prote y tienen 4 sabores)🤤 cod CHEPA 👉🏻 10% dcto"
    ],
    instructions: [
      "Cocinar los huevos hasta que estén duros",
      "En una sartén con aceite en spray, sofreír la cebolla roja picada hasta que esté transparente",
      "Agregar el ajo picado y cocinar por 1 minuto",
      "Incorporar los ajíes amarillos picados (con o sin venas según el picante deseado)",
      "Cocinar los ajíes hasta que estén suaves",
      "En una licuadora, agregar todos los ingredientes: cebolla, ajo, ajíes, huevos, quinua",
      "Agregar la leche de almendras gradualmente mientras licúas",
      "Incorporar el queso fresco light y la mantequilla de maní",
      "Licuar hasta obtener una crema suave y homogénea",
      "Sazonar con sal y pimienta al gusto",
      "Si está muy espesa, agregar más leche de almendras",
      "Servir fría o a temperatura ambiente"
    ],
    macros: {
      protein: "15g",
      carbs: "10g",
      fats: "8g",
      calories: "160 kcal"
    },
    tips: [
      "DISFRUTA SIN CULPA, VAMOS POR ESOS GAINZ ❤️‍🔥",
      "La mantequilla de maní @poderfitmonster le da un sabor único y más proteína",
      "Puedes ajustar el picante quitando las venas de los ajíes",
      "Agregar más quinua para más proteína",
      "Usar queso cottage en lugar de queso fresco para menos calorías",
      "Perfecta para acompañar papas, arroz o como dip",
      "Conservar en refrigerador hasta por 5 días"
    ]
  },
  {
    id: "brownie-avocado",
    name: "BROWNIE DE AVOCADO",
    emoji: "🥑",
    category: "dulces",
    time: "35 min",
    portions: "6 porciones",
    ingredients: [
      "1 plátano 🍌",
      "1 PALTA 🥑",
      "2 cucharadas de miel (o lo que gustes) 🍯",
      "3 huevos 🥚",
      "1/2 taza de cacao 🍫",
      "1/2 taza de avena 🥣",
      "Vainilla",
      "Canela",
      "1 cucharada bicarbonato de sodio",
      "Sal",
      "Aceite en spray pam (para el pirex)",
      "Pecanas"
    ],
    instructions: [
      "Precalentar el horno a 180°C",
      "En un bowl, mash el plátano y la palta hasta obtener una pasta suave",
      "Agregar la miel y mezclar bien",
      "Incorporar los huevos uno por uno, batiendo después de cada uno",
      "Agregar el cacao, avena, vainilla, canela, bicarbonato y sal",
      "Mezclar hasta integrar todos los ingredientes",
      "Agregar las pecanas picadas y mezclar suavemente",
      "Engrasar un molde pirex con aceite en spray",
      "Verter la mezcla en el molde",
      "Hornear por 25-30 minutos hasta que esté firme al tacto",
      "Dejar enfriar antes de cortar"
    ],
    macros: {
      protein: "8g",
      carbs: "22g",
      fats: "12g",
      calories: "220 kcal"
    },
    tips: [
      "Toppings: Fresas 🍓 y Manjar de PURA PROTEÍNA de @poderfitmonster 🤤 cod CHEPA 10% de dcto",
      "La palta le da una textura cremosa y grasas saludables",
      "Puedes usar stevia en lugar de miel para menos calorías",
      "Agregar más cacao si quieres más sabor a chocolate",
      "Servir con fresas y el manjar de proteína para un postre completo",
      "Conservar en refrigerador hasta por 3 días"
    ]
  },
  {
    id: "salsa-bbq-fit",
    name: "Salsa BBQ FIT",
    emoji: "🤤",
    category: "salsas",
    time: "20 min",
    portions: "4 porciones",
    ingredients: [
      "1 cebolla 🧅",
      "Ajo 🧄",
      "Sal",
      "Pimienta",
      "2 tomates licuados 🍅",
      "Paprika 🌶️",
      "Mostaza",
      "Sillao",
      "Miel 🍯",
      "Aceite en spray pam"
    ],
    instructions: [
      "En una sartén con aceite en spray, sofreír la cebolla picada hasta que esté transparente",
      "Agregar el ajo picado y cocinar por 1 minuto",
      "Incorporar los tomates licuados y cocinar por 5 minutos",
      "Agregar paprika, mostaza, sillao y miel",
      "Sazonar con sal y pimienta al gusto",
      "Cocinar a fuego medio-bajo por 10-15 minutos hasta que espese",
      "Revolver ocasionalmente para evitar que se pegue",
      "Dejar enfriar antes de servir",
      "Licuar si quieres una textura más suave"
    ],
    macros: {
      protein: "2g",
      carbs: "18g",
      fats: "1g",
      calories: "85 kcal"
    },
    tips: [
      "DISFRUTA SIN CULPA, VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Puedes ajustar el dulzor agregando más o menos miel",
      "Agregar más paprika para más sabor ahumado",
      "Usar stevia en lugar de miel para menos calorías",
      "Perfecta para acompañar pollo, pescado o hamburguesas",
      "Conservar en refrigerador hasta por 1 semana",
      "Agregar un poco de vinagre de manzana para más acidez"
    ]
  },
  {
    id: "nuggets-fit",
    name: "NUGGETS FIT (mejores que los de mcdonalds)",
    emoji: "🤤👀",
    category: "saladas",
    time: "25 min",
    portions: "2 porciones",
    ingredients: [
      "1 pechuga de pollo 🍗",
      "2 cucharadas yogur griego",
      "1 huevo 🥚",
      "Almendras",
      "3 galletas de arroz",
      "Mostaza",
      "Sal 🧂",
      "Ajo 🧄",
      "Páprika 🌶️",
      "Pimienta",
      "Sasonador de tu elección",
      "Aceite de oliva 🫒"
    ],
    instructions: [
      "Cortar la pechuga de pollo en trozos pequeños (nuggets)",
      "En un bowl, mezclar el yogur griego, huevo, mostaza y especias",
      "Agregar los trozos de pollo y marinar por 10 minutos",
      "En otro bowl, triturar las galletas de arroz y almendras hasta obtener migas",
      "Agregar paprika, sal, pimienta y sazonador a las migas",
      "Precalentar el horno a 200°C",
      "Pasar cada nugget por la mezcla de migas, presionando para que se adhiera",
      "Colocar en una bandeja engrasada con aceite de oliva",
      "Hornear por 15-20 minutos hasta que estén dorados y crujientes",
      "Voltear a la mitad del tiempo para que se doren por ambos lados"
    ],
    macros: {
      protein: "35g",
      carbs: "12g",
      fats: "8g",
      calories: "280 kcal"
    },
    tips: [
      "DISFRUTA SIN CULPA, VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Puedes usar air fryer en lugar de horno para más crujiente",
      "Agregar más especias según tu preferencia",
      "Usar avena en lugar de galletas de arroz para más fibra",
      "Servir con la salsa BBQ FIT que ya tienes en el ebook",
      "Conservar en refrigerador hasta por 3 días",
      "Perfectos para meal prep"
    ]
  },
  {
    id: "cuchareable-mini-pie-limon",
    name: "CUCHAREABLE MINI sabor PIE de LIMÓN",
    emoji: "🍋‍🟩🤤",
    category: "dulces",
    time: "10 min",
    portions: "1 porción",
    ingredients: [
      "2 cucharadas avena",
      "1 clara 🥚",
      "1 cucharada yogur griego",
      "1 limón 🍋 (zumo y rayadura)",
      "1 cucharada mantequilla de maní @poderfitmonster 🤩 cod CHEPA 👉🏻 10% dcto",
      "Stevia"
    ],
    instructions: [
      "En un bowl pequeño, mezclar la avena con la clara de huevo",
      "Agregar el yogur griego y mezclar bien",
      "Incorporar el zumo y rayadura del limón",
      "Agregar la mantequilla de maní y stevia al gusto",
      "Mezclar hasta obtener una masa consistente",
      "Formar una pequeña base en un recipiente",
      "Refrigerar por 5 minutos para que se asiente",
      "Preparar el frosting mezclando yogur griego, stevia y rayadura de limón",
      "Servir el frosting sobre la base y disfrutar"
    ],
    macros: {
      protein: "12g",
      carbs: "18g",
      fats: "8g",
      calories: "180 kcal"
    },
    tips: [
      "DISFRUTA SIN CULPA, VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Frosting: 1 cucharada yogur griego, Stevia, Rayadura de un limón 🍋‍🟩",
      "Puedes agregar más rayadura de limón para más sabor",
      "Usar mantequilla de almendras como alternativa",
      "Agregar un poco de canela para más sabor",
      "Perfecto para un postre rápido y saludable",
      "Conservar en refrigerador hasta por 1 día"
    ]
  },
  {
    id: "maki-cuchareable-economico",
    name: "Maki Cuchareable (versión económica)",
    emoji: "🤤💵",
    category: "saladas",
    time: "20 min",
    portions: "2 porciones",
    ingredients: [
      "Salsa Acevichada Fit:",
      "2 huevos 🥚",
      "200g yogur griego",
      "1 cucharadita mostaza",
      "1 limón 🍋 (sumo)",
      "Sal 🧂",
      "Pimienta",
      "Tapita aceite de oliva 🫒",
      "Para volverla acevichada:",
      "Doña gusta sabor pescado 🐟 (diluido en 40ml de agua)",
      "Sillao al gusto",
      "1 cucharadita aceite de ajonjolí",
      "3 limones 🍋 (sumo)",
      "Maki cuchareable:",
      "Arroz 🍚 (entre 150-250g)",
      "Yuyo al gusto",
      "Atún 🍣",
      "Palta 🥑",
      "Salsa acevichada",
      "Ajonjolí"
    ],
    instructions: [
      "Preparar la Salsa Acevichada Fit:",
      "Cocinar los huevos hasta que estén duros",
      "En un bowl, mezclar el yogur griego con la mostaza",
      "Agregar el zumo del limón, sal y pimienta",
      "Picar los huevos duros y agregar a la mezcla",
      "Agregar una tapita de aceite de oliva y mezclar",
      "Para volverla acevichada:",
      "Diluir Doña gusta sabor pescado en 40ml de agua",
      "Agregar sillao, aceite de ajonjolí y zumo de 3 limones",
      "Mezclar todo con la salsa base",
      "Preparar el Maki cuchareable:",
      "Cocinar el arroz según las instrucciones del paquete",
      "En un bowl, mezclar el arroz con yuyo al gusto",
      "Agregar el atún desmenuzado y la palta cortada",
      "Incorporar la salsa acevichada y mezclar bien",
      "Espolvorear ajonjolí por encima",
      "Servir y disfrutar"
    ],
    macros: {
      protein: "28g",
      carbs: "45g",
      fats: "12g",
      calories: "380 kcal"
    },
    tips: [
      "Versión económica y fácil de hacer en casa",
      "Puedes usar arroz integral para más fibra",
      "Agregar más vegetales como pepino o zanahoria",
      "Usar salmón en lugar de atún si prefieres",
      "La salsa acevichada es perfecta para otros platos también",
      "Conservar en refrigerador hasta por 2 días",
      "Perfecto para meal prep"
    ]
  },
  {
    id: "huevos-anabolicos",
    name: "Huevos Anabólicos",
    emoji: "🥚💪🏻🤤",
    category: "desayunos",
    time: "10 min",
    portions: "1 porción",
    ingredients: [
      "5 huevos (2 enteros 3 claras) 🥚",
      "15g de mostaza",
      "1 cucharada SKYR (o el yogur griego de tu preferencia) ✅",
      "Perejil 🌿",
      "Sal 🧂",
      "Pimienta"
    ],
    instructions: [
      "En un bowl, batir los huevos hasta que estén espumosos",
      "Agregar la mostaza y mezclar bien",
      "Incorporar el SKYR o yogur griego",
      "Picar finamente el perejil y agregar",
      "Sazonar con sal y pimienta al gusto",
      "En una sartén antiadherente, verter la mezcla",
      "Cocinar a fuego medio-bajo, revolviendo constantemente",
      "Cocinar hasta que estén cremosos pero no secos",
      "Servir inmediatamente"
    ],
    macros: {
      protein: "32g",
      carbs: "4g",
      fats: "18g",
      calories: "280 kcal"
    },
    tips: [
      "Perfecto para el desayuno con mucha proteína",
      "Puedes agregar más claras para más proteína y menos calorías",
      "Agregar queso rallado para más sabor",
      "Usar diferentes hierbas como albahaca o cilantro",
      "Servir con tostadas integrales o avena",
      "Conservar en refrigerador hasta por 1 día",
      "Ideal para post-entreno"
    ]
  },
  {
    id: "vinagreta-fit-honey-mustard",
    name: "Vinagreta FIT (Honey Mustard)",
    emoji: "🤤",
    category: "salsas",
    time: "5 min",
    portions: "4 porciones",
    ingredients: [
      "2 cucharadas yogur griego",
      "1 cucharada mostaza",
      "1 naranja 🍊 (zumo)",
      "1 cdta vinagre de manzana 🍎",
      "Stevia",
      "Sal",
      "Pimienta",
      "Especias (eneldo de preferencia) 🌿",
      "Goma de xantan (opcional si la deseas mas espesa)"
    ],
    instructions: [
      "En un bowl pequeño, mezclar el yogur griego con la mostaza",
      "Agregar el zumo de naranja y mezclar bien",
      "Incorporar el vinagre de manzana",
      "Agregar stevia al gusto para endulzar",
      "Sazonar con sal y pimienta",
      "Picar finamente el eneldo y agregar",
      "Si deseas una textura más espesa, agregar goma de xantan",
      "Mezclar todo hasta obtener una vinagreta homogénea",
      "Refrigerar por 10 minutos antes de servir"
    ],
    macros: {
      protein: "2g",
      carbs: "8g",
      fats: "1g",
      calories: "45 kcal"
    },
    tips: [
      "Perfecta para ensaladas y como dip",
      "Puedes ajustar el dulzor agregando más o menos stevia",
      "Usar diferentes hierbas como albahaca o cilantro",
      "Agregar más mostaza si quieres más sabor",
      "Conservar en refrigerador hasta por 1 semana",
      "Ideal para acompañar pollo o pescado",
      "Puedes usar limón en lugar de naranja para variar el sabor"
    ]
  },
  {
    id: "chips-saludables",
    name: "CHIPS SALUDABLES",
    emoji: "🍠🤤",
    category: "snacks",
    time: "30 min",
    portions: "4 porciones",
    ingredients: [
      "1 papa 🥔",
      "1 beterraga 🍆",
      "1 zanahoria 🥕",
      "1 camote 🍠",
      "Aceite de oliva 🫒",
      "Especias de tu elección (yo utilicé sal, ajo y paprika)"
    ],
    instructions: [
      "Lavar y pelar todos los vegetales",
      "Cortar en rodajas muy finas (aproximadamente 2-3mm)",
      "En un bowl, mezclar las rodajas con aceite de oliva",
      "Agregar las especias de tu elección (sal, ajo, paprika)",
      "Mezclar bien para que todas las rodajas estén cubiertas",
      "Precalentar el air fryer a 180°C o el horno a 200°C",
      "Colocar las rodajas en una sola capa en la bandeja",
      "Cocinar en air fryer por 25-30 min (mover cada 10 minutos)",
      "O en horno por 35-40 min hasta que estén crujientes",
      "Dejar enfriar antes de servir"
    ],
    macros: {
      protein: "3g",
      carbs: "25g",
      fats: "4g",
      calories: "140 kcal"
    },
    tips: [
      "Ideales para comer viendo una película sin salirte de la dieta 😋",
      "DISFRUTA SIN CULPA, VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Puedes usar diferentes vegetales como berenjena o calabacín",
      "Agregar más especias según tu preferencia",
      "Usar air fryer para menos aceite y más crujiente",
      "Conservar en un recipiente hermético hasta por 3 días",
      "Perfectas para acompañar con las salsas del ebook"
    ]
  },
  {
    id: "pastel-manzana-fit-proteico",
    name: "Pastel de MANZANA FIT y PROTEICO",
    emoji: "🍎🤤",
    category: "dulces",
    time: "45 min",
    portions: "6 porciones",
    ingredients: [
      "3 manzanas (peladas y cortadas finamente) 🍎",
      "1 limón 🍋‍🟩",
      "4 huevos 🥚",
      "3 cucharadas yogurt griego",
      "1/2 taza de avena 🥣",
      "Stevia",
      "Canela",
      "Vainilla"
    ],
    instructions: [
      "Precalentar el horno a 180°C",
      "Pelar y cortar finamente las manzanas",
      "En un bowl, batir los huevos hasta que estén espumosos",
      "Agregar el yogurt griego y mezclar bien",
      "Incorporar la avena y mezclar",
      "Agregar el zumo y rayadura del limón",
      "Sazonar con stevia, canela y vainilla al gusto",
      "Agregar las manzanas cortadas y mezclar suavemente",
      "Verter en un molde engrasado",
      "Hornear por aproximadamente 40 minutos hasta que esté dorado",
      "Dejar enfriar antes de cortar"
    ],
    macros: {
      protein: "8g",
      carbs: "20g",
      fats: "6g",
      calories: "160 kcal"
    },
    tips: [
      "DISFRUTA SIN CULPA, VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Puedes agregar más canela para más sabor",
      "Usar diferentes tipos de manzanas para variar el sabor",
      "Agregar nueces picadas para más crunch",
      "Servir con yogur griego por encima",
      "Conservar en refrigerador hasta por 3 días",
      "Perfecto para el desayuno o como postre"
    ]
  },
  {
    id: "tiramisu-quinua-olla",
    name: "TIRAMISÚ de QUINUA a la OLLA",
    emoji: "🤤",
    category: "dulces",
    time: "25 min",
    portions: "2 porciones",
    ingredients: [
      "1 taza de quinua (para que no te salga amarga cambia el agua del hervor unas 3 veces) ✍🏻",
      "Canela",
      "Clavo",
      "1 cucharada cacao en polvo (o lo que gustes) 🍫",
      "Stevia",
      "1 cucharada café (o lo que gustes) ☕️",
      "2 chorritos de leche de almendras (o la de tu preferencia) 🥛"
    ],
    instructions: [
      "Enjuagar la quinua 3 veces para quitar el sabor amargo",
      "En una olla, hervir agua y agregar la quinua",
      "Al primer hervor, cambiar el agua y volver a hervir",
      "Repetir el proceso 3 veces en total",
      "En la última vez, agregar canela, clavo y stevia",
      "Cocinar hasta que la quinua esté suave",
      "Agregar el cacao en polvo y mezclar bien",
      "Incorporar el café y mezclar",
      "Agregar la leche de almendras gradualmente",
      "Cocinar hasta obtener una consistencia cremosa",
      "Dejar enfriar antes de servir"
    ],
    macros: {
      protein: "12g",
      carbs: "35g",
      fats: "4g",
      calories: "220 kcal"
    },
    tips: [
      "Toppings: Fresas 🍓, Ajonjolí, Manjar PROTEICO cero azúcar @poderfitmonster 🤤 cod CHEPA 👉🏻 10% de dcto",
      "Cambiar el agua del hervor 3 veces para que no salga amarga ✍🏻",
      "Puedes usar diferentes tipos de leche vegetal",
      "Agregar más cacao si quieres más sabor a chocolate",
      "Usar café descafeinado si prefieres",
      "Conservar en refrigerador hasta por 2 días",
      "Perfecto para el desayuno o como postre"
    ]
  },
  {
    id: "batido-proteina-definicion",
    name: "Batido Proteína (definición)",
    emoji: "🍌🍓",
    category: "snacks",
    time: "5 min",
    portions: "1 porción",
    ingredients: [
      "1/2 plátano 🍌",
      "100g fresas 🍓",
      "1 scoop Iso Xp @muscleshopperu 🤤",
      "100g yogur griego",
      "Canela",
      "Agua"
    ],
    instructions: [
      "En una licuadora, agregar el plátano cortado",
      "Agregar las fresas lavadas",
      "Incorporar el scoop de proteína Iso Xp",
      "Agregar el yogur griego",
      "Espolvorear canela al gusto",
      "Agregar agua según la consistencia deseada",
      "Licuar hasta obtener una mezcla suave",
      "Servir inmediatamente"
    ],
    macros: {
      protein: "32g",
      carbs: "33g",
      fats: "1g",
      calories: "252 kcal"
    },
    tips: [
      "🚨Macros: 252 cals (p:32 ch:33 g:1)",
      "Perfecto para definición muscular",
      "Puedes usar leche de almendras en lugar de agua",
      "Agregar hielo para un batido más refrescante",
      "Usar diferentes frutas según tu preferencia",
      "Ideal para post-entreno",
      "Consumir inmediatamente para mejor sabor"
    ]
  },
  {
    id: "batido-proteina-volumen",
    name: "Batido Proteína (volumen)",
    emoji: "🍌🫐",
    category: "snacks",
    time: "5 min",
    portions: "1 porción",
    ingredients: [
      "1 plátano 🍌",
      "100g arándanos 🫐",
      "60g avena",
      "1 scoop Levro Iso Whey @muscleshopperu 💪🏻",
      "20g mantequilla de maní @poderfitmonster 🤩",
      "Agua"
    ],
    instructions: [
      "En una licuadora, agregar el plátano cortado",
      "Agregar los arándanos lavados",
      "Incorporar la avena",
      "Agregar el scoop de proteína Levro Iso Whey",
      "Incorporar la mantequilla de maní",
      "Agregar agua según la consistencia deseada",
      "Licuar hasta obtener una mezcla suave",
      "Servir inmediatamente"
    ],
    macros: {
      protein: "38g",
      carbs: "87g",
      fats: "16g",
      calories: "607 kcal"
    },
    tips: [
      "🚨Macros: 607 cals (p:38 ch:87 g:16)",
      "Perfecto para ganar volumen muscular",
      "Puedes usar leche en lugar de agua para más calorías",
      "Agregar más avena si quieres más carbohidratos",
      "Usar diferentes frutas según tu preferencia",
      "Ideal para post-entreno o como reemplazo de comida",
      "Consumir inmediatamente para mejor sabor"
    ]
  },
  {
    id: "mayonesa-palta",
    name: "Mayonesa de Palta",
    emoji: "🥑",
    category: "salsas",
    time: "10 min",
    portions: "4 porciones",
    ingredients: [
      "1 palta 🥑",
      "2 🥚's",
      "1 cucharada yogurt griego",
      "Aceite de oliva",
      "Sal y pimienta",
      "1/2 limón"
    ],
    instructions: [
      "Cocinar los huevos hasta que estén duros",
      "En un bowl, mash la palta hasta obtener una pasta suave",
      "Picar finamente los huevos duros",
      "Agregar los huevos picados a la palta",
      "Incorporar el yogurt griego y mezclar bien",
      "Agregar aceite de oliva gradualmente mientras mezclas",
      "Sazonar con sal y pimienta al gusto",
      "Agregar el zumo del medio limón",
      "Mezclar hasta obtener una consistencia cremosa",
      "Refrigerar por 10 minutos antes de servir"
    ],
    macros: {
      protein: "6g",
      carbs: "8g",
      fats: "15g",
      calories: "180 kcal"
    },
    tips: [
      "DISFRUTA SIN CULPA VAMOS POR ESOS GAINZ ❤️‍🔥",
      "Perfecta para sándwiches y wraps",
      "Puedes agregar más limón si quieres más acidez",
      "Usar más o menos aceite según la consistencia deseada",
      "Agregar ajo picado para más sabor",
      "Conservar en refrigerador hasta por 3 días",
      "Ideal para acompañar carnes o pescados"
    ]
  },
  {
    id: "cookie-dough-30g-proteina",
    name: "Cookie Dough +30g de proteína",
    emoji: "🤤",
    category: "dulces",
    time: "10 min",
    portions: "1 porción",
    ingredients: [
      "80g avena (recomiendo hacerla harina)",
      "1 scoop de proteína @muscleshopperu 💪🏻",
      "1 cucharada mantequilla de maní @poderfitmonster 🤩",
      "Chorrito leche de almendras 🥛",
      "Vainilla",
      "Canela",
      "Chips de chocolate 🍫 (de preferencia dark 0 azúcar)",
      "Una galleta oreo o max 25g (opcional)"
    ],
    instructions: [
      "En un procesador, triturar la avena hasta obtener harina fina",
      "En un bowl, mezclar la harina de avena con el scoop de proteína",
      "Agregar la mantequilla de maní y mezclar bien",
      "Incorporar la leche de almendras gradualmente",
      "Agregar vainilla y canela al gusto",
      "Mezclar hasta obtener una masa consistente",
      "Agregar los chips de chocolate y mezclar suavemente",
      "Si usas galleta oreo, picarla y agregar",
      "Formar bolitas o comer directamente como cookie dough",
      "Refrigerar por 10 minutos para mejor textura"
    ],
    macros: {
      protein: "32g",
      carbs: "45g",
      fats: "12g",
      calories: "420 kcal"
    },
    tips: [
      "Perfecto para satisfacer el antojo de cookie dough de manera saludable",
      "Puedes agregar más proteína si quieres más",
      "Usar diferentes sabores de proteína para variar",
      "Agregar más chips de chocolate si prefieres",
      "Conservar en refrigerador hasta por 2 días",
      "Ideal para post-entreno o como snack",
      "Puedes formar galletas y hornear si prefieres"
    ]
  },
  {
    id: "poke-anabolico",
    name: "POKE ANABÓLICO",
    emoji: "🤤🦍",
    category: "saladas",
    time: "20 min",
    portions: "1 porción",
    ingredients: [
      "200g arroz 🍚 (pueden usar la porción que deseen)",
      "100g pollo 🍗 (pueden usar pescado como trucha o salmón y la porción que deseen)",
      "Lechuga 🥬",
      "Tomate 🍅",
      "Pepino 🥒",
      "Pimentón rojo",
      "Cebolla blanca 🧅",
      "Zanahoria 🥕",
      "50g palta 🥑",
      "Sillao",
      "Stevia",
      "Ajonjolí"
    ],
    instructions: [
      "Cocinar el arroz según las instrucciones del paquete",
      "Cocinar el pollo (o pescado) hasta que esté bien cocido",
      "Cortar el pollo en cubos pequeños",
      "Lavar y cortar todos los vegetales en trozos pequeños",
      "En un bowl grande, agregar el arroz cocido",
      "Agregar el pollo cortado",
      "Incorporar todos los vegetales: lechuga, tomate, pepino, pimentón, cebolla, zanahoria",
      "Agregar la palta cortada en cubos",
      "Sazonar con sillao y stevia al gusto",
      "Mezclar todo suavemente",
      "Espolvorear ajonjolí por encima",
      "Servir y disfrutar"
    ],
    macros: {
      protein: "35g",
      carbs: "55g",
      fats: "12g",
      calories: "480 kcal"
    },
    tips: [
      "Puedes ajustar las porciones según tus necesidades",
      "Usar pescado crudo (salmón, atún) si prefieres poke tradicional",
      "Agregar más vegetales según tu preferencia",
      "Usar arroz integral para más fibra",
      "Agregar más proteína si necesitas más",
      "Conservar en refrigerador hasta por 1 día",
      "Perfecto para meal prep"
    ]
  },
  {
    id: "helado-50g-proteina",
    name: "HELADO CON +50G DE PROTEÍNA",
    emoji: "🍦🤩",
    category: "dulces",
    time: "15 min + congelado",
    portions: "2 porciones",
    ingredients: [
      "Yogurt Griego 250g",
      "Queso Crema 150g",
      "Proteína-Iso Xp 2 scoops @muscleshopperu 💪🏻",
      "Stevia",
      "Vainilla",
      "Canela",
      "1 cucharada mantequilla de maní @poderfitmonster | @fitmonsterfactory 🤤",
      "Leche de almendras"
    ],
    instructions: [
      "En un bowl grande, mezclar el yogurt griego con el queso crema",
      "Agregar los 2 scoops de proteína Iso Xp",
      "Incorporar stevia al gusto",
      "Agregar vainilla y canela",
      "Mezclar la mantequilla de maní con un poco de leche de almendras",
      "Incorporar la mezcla de mantequilla de maní al bowl principal",
      "Agregar leche de almendras gradualmente hasta obtener la consistencia deseada",
      "Mezclar todo hasta que esté homogéneo",
      "Verter en un recipiente apto para congelador",
      "Congelar por al menos 4 horas",
      "Remover cada hora para evitar cristales grandes",
      "Servir y disfrutar"
    ],
    macros: {
      protein: "52g",
      carbs: "18g",
      fats: "22g",
      calories: "420 kcal"
    },
    tips: [
      "Puedes agregar más proteína si necesitas más",
      "Usar diferentes sabores de proteína para variar",
      "Agregar frutas congeladas para más sabor",
      "Remover frecuentemente durante el congelado para textura cremosa",
      "Puedes agregar chips de chocolate sin azúcar",
      "Conservar en congelador hasta por 1 semana",
      "Perfecto para post-entreno o como postre saludable",
      "Agregar más mantequilla de maní si prefieres más sabor"
    ]
  },
  {
    id: "chaufa-anabolico",
    name: "CHAUFA ANABÓLICO",
    emoji: "🦍",
    category: "saladas",
    time: "25 min",
    portions: "1 porción",
    ingredients: [
      "Pimentón rojo",
      "Kion",
      "Espinaca",
      "Cebolla blanca 🧅",
      "Brócoli 🥦",
      "Ajo 🧄",
      "Ají amarillo",
      "Espárragos",
      "2 🥚's",
      "Pollo 150g 🍗",
      "Arroz (150-200g) 🍚",
      "Sillao",
      "Aceite de ajonjolí"
    ],
    instructions: [
      "Cocinar el arroz según las instrucciones del paquete",
      "Cortar el pollo en trozos pequeños",
      "Cocinar el pollo en una sartén con aceite de ajonjolí hasta que esté dorado",
      "Retirar el pollo y reservar",
      "En la misma sartén, agregar ajo picado y kion",
      "Agregar la cebolla blanca picada y saltear",
      "Incorporar el pimentón rojo y ají amarillo picados",
      "Agregar el brócoli y espárragos cortados",
      "Saltear los vegetales hasta que estén tiernos",
      "Agregar las espinacas y saltear brevemente",
      "Hacer espacio en la sartén y agregar los huevos",
      "Revolver los huevos hasta que estén cocidos",
      "Agregar el arroz cocido y el pollo reservado",
      "Sazonar con sillao al gusto",
      "Mezclar todo y saltear por 2-3 minutos",
      "Servir caliente"
    ],
    macros: {
      protein: "45g",
      carbs: "65g",
      fats: "15g",
      calories: "580 kcal"
    },
    tips: [
      "Usar arroz integral para más fibra y nutrientes",
      "Puedes agregar más vegetales según tu preferencia",
      "Agregar más proteína si necesitas más",
      "Usar diferentes tipos de carne (res, cerdo, pescado)",
      "Agregar más huevos para más proteína",
      "Conservar en refrigerador hasta por 2 días",
      "Perfecto para meal prep",
      "Agregar más sillao si prefieres más sabor"
    ]
  },
  {
    id: "panqueques-protein",
    name: "Panqueques Proteicos",
    emoji: "🥞",
    category: "desayunos",
    time: "15 min",
    portions: "2 porciones",
    ingredients: [
      "5 🥚's (2 enteros 3 claras)",
      "70g Avena Protein Frutos Rojos @nutrico.io 🤤",
      "1 🍌",
      "10g chía",
      "Café ☕️",
      "Canela",
      "Stevia",
      "Toppings:",
      "Mantequilla de maní 🥜",
      "Yogurt griego",
      "Fresas 🍓"
    ],
    instructions: [
      "En un bowl, mezclar los huevos (2 enteros y 3 claras)",
      "Agregar la avena protein de frutos rojos",
      "Triturar la banana y agregar al bowl",
      "Incorporar las semillas de chía",
      "Agregar café al gusto",
      "Sazonar con canela y stevia",
      "Mezclar todo hasta obtener una masa homogénea",
      "Dejar reposar por 5 minutos para que la chía se hidrate",
      "Calentar una sartén antiadherente a fuego medio",
      "Verter pequeñas porciones de la masa para formar panqueques",
      "Cocinar por 2-3 minutos por lado hasta que estén dorados",
      "Servir con los toppings:",
      "Mantequilla de maní",
      "Yogurt griego",
      "Fresas frescas"
    ],
    macros: {
      protein: "38g",
      carbs: "42g",
      fats: "18g",
      calories: "480 kcal"
    },
    tips: [
      "Puedes agregar más proteína si necesitas más",
      "Usar diferentes sabores de avena protein",
      "Agregar más frutas como topping",
      "Puedes hacer la masa la noche anterior",
      "Conservar en refrigerador hasta por 2 días",
      "Perfecto para desayuno o post-entreno",
      "Agregar más chía para más fibra",
      "Usar diferentes tipos de mantequilla de frutos secos"
    ]
  },
  {
    id: "tostadas-francesas-roca",
    name: "TOSTADAS FRANCESAS DE LA ROCA",
    emoji: "🦍",
    category: "desayunos",
    time: "20 min",
    portions: "2 porciones",
    ingredients: [
      "2 huevos",
      "Leche de tu preferencia",
      "Canela",
      "4 slides de pan integral o el que prefieras",
      "1 plátano",
      "Mantequilla de maní",
      "1 scoop de proteína (de preferencia ISO TECH de @energynutritionperu)"
    ],
    instructions: [
      "En un bowl, batir los 2 huevos",
      "Agregar la leche de tu preferencia",
      "Incorporar canela al gusto",
      "Agregar el scoop de proteína ISO TECH y mezclar bien",
      "Cortar el plátano en rodajas",
      "Calentar una sartén antiadherente a fuego medio",
      "Sumergir cada slide de pan en la mezcla de huevos",
      "Cocinar las tostadas por 2-3 minutos por lado hasta que estén doradas",
      "Untar mantequilla de maní en cada tostada",
      "Agregar las rodajas de plátano",
      "Servir caliente"
    ],
    macros: {
      protein: "32g",
      carbs: "48g",
      fats: "16g",
      calories: "460 kcal"
    },
    tips: [
      "Puedes agregar más proteína si necesitas más",
      "Usar diferentes tipos de pan (integral, de avena, sin gluten)",
      "Agregar más frutas como topping",
      "Puedes agregar miel o stevia para más dulzor",
      "Conservar en refrigerador hasta por 1 día",
      "Perfecto para desayuno o brunch",
      "Agregar más canela para más sabor",
      "Usar diferentes tipos de mantequilla de frutos secos"
    ]
  },
  {
    id: "panqueques-espinaca",
    name: "Panqueques de Espinaca",
    emoji: "🥬",
    category: "saladas",
    time: "20 min",
    portions: "2 porciones",
    ingredients: [
      "120g avena",
      "3 huevos",
      "1 lata atún",
      "Cebolla blanca",
      "Tomate",
      "Limón"
    ],
    instructions: [
      "En un bowl, mezclar la avena con los 3 huevos",
      "Agregar la lata de atún escurrida",
      "Picar finamente la cebolla blanca y agregar",
      "Picar el tomate y agregar al bowl",
      "Exprimir limón al gusto",
      "Mezclar todo hasta obtener una masa homogénea",
      "Calentar una sartén antiadherente a fuego medio",
      "Verter pequeñas porciones de la masa para formar panqueques",
      "Cocinar por 3-4 minutos por lado hasta que estén dorados",
      "Servir caliente"
    ],
    macros: {
      protein: "42g",
      carbs: "35g",
      fats: "18g",
      calories: "480 kcal"
    },
    tips: [
      "Puedes agregar más proteína si necesitas más",
      "Usar atún en agua para menos grasa",
      "Agregar más vegetales según tu preferencia",
      "Puedes agregar especias como orégano o albahaca",
      "Conservar en refrigerador hasta por 2 días",
      "Perfecto para desayuno o almuerzo",
      "Agregar más limón para más sabor",
      "Usar diferentes tipos de pescado enlatado"
    ]
  },
  {
    id: "mousse-2-ingredientes",
    name: "Mousse con SOLO 2 ingredientes",
    emoji: "🍫🤩",
    category: "dulces",
    time: "10 min",
    portions: "2 porciones",
    ingredients: [
      "3 manzanas 🍎's",
      "Chocolate Bitter (de preferencia sin azúcar) ✅"
    ],
    instructions: [
      "Pelar y cortar las 3 manzanas en trozos pequeños",
      "Derretir el chocolate bitter en baño maría o microondas",
      "En un procesador o licuadora, triturar las manzanas hasta obtener un puré",
      "Agregar el chocolate derretido al puré de manzanas",
      "Procesar todo hasta obtener una mezcla homogénea y cremosa",
      "Verter en copas o recipientes individuales",
      "Refrigerar por al menos 2 horas",
      "Servir frío y disfrutar"
    ],
    macros: {
      protein: "4g",
      carbs: "28g",
      fats: "12g",
      calories: "220 kcal"
    },
    tips: [
      "Usar chocolate bitter sin azúcar para menos calorías",
      "Puedes agregar más manzanas si prefieres más dulzor natural",
      "Agregar canela para más sabor",
      "Puedes agregar frutos secos como topping",
      "Conservar en refrigerador hasta por 3 días",
      "Perfecto para postre saludable",
      "La textura es increíblemente suave y cremosa",
      "Ideal para satisfacer el antojo de chocolate de manera saludable"
    ]
  },
  {
    id: "arepa-3-ingredientes",
    name: "AREPA SOLO 3 INGREDIENTES",
    emoji: "🥟🤤",
    category: "desayunos",
    time: "10 min",
    portions: "1 porción",
    ingredients: [
      "3 láminas de queso 🧀 (el que gustes, de preferencia si es bajo en grasas)",
      "Zanahoria rayada 🥕",
      "2 huevos 🥚"
    ],
    instructions: [
      "En un bowl, mezclar las 3 láminas de queso picadas",
      "Agregar la zanahoria rayada",
      "Incorporar los 2 huevos",
      "Mezclar todo hasta obtener una masa homogénea",
      "Calentar una sartén antiadherente a fuego medio",
      "Formar una arepa con la masa",
      "Cocinar por 3-4 minutos por lado hasta que esté dorada",
      "Servir caliente"
    ],
    macros: {
      protein: "28g",
      carbs: "8g",
      fats: "22g",
      calories: "320 kcal"
    },
    tips: [
      "Usar queso bajo en grasas para menos calorías",
      "Puedes agregar más vegetales según tu preferencia",
      "Agregar más huevos para más proteína",
      "Puedes agregar especias como orégano o albahaca",
      "Conservar en refrigerador hasta por 1 día",
      "Perfecto para desayuno o snack",
      "IDEAL como desayuno o snack FACILITA de hacer",
      "Ya no tienes excusa de saltarte tu primera comida del día"
    ]
  },
  {
    id: "cheesecake-chocolate-3-ingredientes",
    name: "Cheesecake de Chocolate FIT y PROTEICO",
    emoji: "🍫🤤",
    category: "dulces",
    time: "20 min",
    portions: "2 porciones",
    ingredients: [
      "200g yogurt griego (yo utilicé skyr) 😋",
      "2 huevos 🥚",
      "Chocolate Bitter (de preferencia sin azúcar) ✅"
    ],
    instructions: [
      "Derretir el chocolate bitter en baño maría",
      "Para el baño maría: hervir agua en una olla y cuando esté burbujeando colocar encima una más pequeña donde colocarás el chocolate",
      "Mover constantemente hasta tener la textura deseada",
      "En un bowl, mezclar el yogurt griego con los 2 huevos",
      "Agregar el chocolate derretido al bowl",
      "Mezclar todo hasta obtener una mezcla homogénea",
      "Verter en un molde pequeño (recomendado para mejor forma)",
      "Refrigerar por al menos 4 horas",
      "Servir frío y disfrutar"
    ],
    macros: {
      protein: "24g",
      carbs: "16g",
      fats: "18g",
      calories: "320 kcal"
    },
    tips: [
      "Usar chocolate bitter sin azúcar para menos calorías",
      "Utilizar un molde más pequeño para darle mejor forma",
      "Puedes agregar más chocolate si prefieres más sabor",
      "Agregar frutos secos como topping",
      "Conservar en refrigerador hasta por 3 días",
      "Perfecto como snack, postre o cuando estés antojado de algo dulce",
      "La textura y sabor es ESPECTACULAR",
      "IDEAL para DISFRUTAR SIN CULPA"
    ]
  },
  {
    id: "tostadas-atun-mayonesa-fit",
    name: "Tostadas de Atún con mayonesa FIT y PROTEICA",
    emoji: "🤤",
    category: "saladas",
    time: "15 min",
    portions: "1 porción",
    ingredients: [
      "1 lata de atún 🍣",
      "1/2 palta 🥑",
      "1 🥄da yogur griego",
      "Tomate 🍅",
      "Cebolla 🧅",
      "Sal y pimienta",
      "2 panes de molde 🍞"
    ],
    instructions: [
      "En un bowl, mezclar el atún escurrido con la palta triturada",
      "Agregar el yogur griego y mezclar bien",
      "Picar finamente el tomate y la cebolla",
      "Incorporar el tomate y cebolla picados al bowl",
      "Sazonar con sal y pimienta al gusto",
      "Mezclar todo hasta obtener una pasta homogénea",
      "Tostar los 2 panes de molde",
      "Untar la mezcla de atún en cada tostada",
      "Servir y disfrutar"
    ],
    macros: {
      protein: "32g",
      carbs: "28g",
      fats: "16g",
      calories: "380 kcal"
    },
    tips: [
      "Usar atún en agua para menos grasa",
      "Puedes agregar más vegetales según tu preferencia",
      "Agregar más yogur griego si prefieres más cremosidad",
      "Puedes agregar especias como orégano o albahaca",
      "Conservar en refrigerador hasta por 1 día",
      "Perfecto para desayuno, almuerzo o snack",
      "Agregar más palta si prefieres más sabor",
      "Usar pan integral para más fibra"
    ]
  },
  {
    id: "bombon-helado-proteico",
    name: "Bombón helado PROTEICO cuchareable",
    emoji: "🍫🤤🍓",
    category: "dulces",
    time: "15 min + congelado",
    portions: "1 porción",
    ingredients: [
      "2 buenas 🥄's de yogurt griego",
      "1 scoop de proteína sabor vainilla @ivernprotein.pe 🤩",
      "Fresas 🍓",
      "Chocolate bitter (de preferencia sin azúcar) 🍫"
    ],
    instructions: [
      "En un bowl, mezclar el yogurt griego con el scoop de proteína",
      "Mezclar hasta obtener una mezcla homogénea",
      "Derretir el chocolate bitter en baño maría",
      "Para el baño maría: hervir agua en una olla y colocar encima una pequeña donde pondrás el chocolate",
      "Mover constantemente hasta que el chocolate esté derretido",
      "Cortar las fresas en trozos pequeños",
      "Agregar las fresas a la mezcla de yogurt y proteína",
      "Mezclar suavemente",
      "Verter en un recipiente apto para congelador",
      "Congelar por al menos 4 horas",
      "Servir frío y disfrutar"
    ],
    macros: {
      protein: "26g",
      carbs: "12g",
      fats: "8g",
      calories: "220 kcal"
    },
    tips: [
      "Usar chocolate bitter sin azúcar para menos calorías",
      "Puedes agregar más fresas si prefieres más sabor",
      "Agregar más proteína si necesitas más",
      "Puedes agregar otros frutos rojos como arándanos",
      "Conservar en congelador hasta por 1 semana",
      "Perfecto como snack saludable",
      "Ideal cuando estés antojado de algo dulce",
      "No te saldrás de la dieta con esta opción"
    ]
  },
  {
    id: "bolitas-crispy-atun",
    name: "Bolitas CRISPY de ATÚN",
    emoji: "🍣🤤",
    category: "saladas",
    time: "20 min",
    portions: "2 porciones",
    ingredients: [
      "2 latas de atún 🍣",
      "2 huevos 🥚",
      "40g corn flakes sin azúcar ✅",
      "Sal 🧂",
      "Tongarashi o paprika 🌶️"
    ],
    instructions: [
      "En un bowl, mezclar las 2 latas de atún escurridas",
      "Agregar los 2 huevos y mezclar bien",
      "Incorporar los 40g de corn flakes sin azúcar",
      "Sazonar con sal al gusto",
      "Agregar tongarashi o paprika según tu preferencia",
      "Mezclar todo hasta obtener una masa homogénea",
      "Formar bolitas del tamaño deseado",
      "Calentar una sartén antiadherente a fuego medio",
      "Cocinar las bolitas por 3-4 minutos por lado hasta que estén doradas",
      "Servir caliente"
    ],
    macros: {
      protein: "38g",
      carbs: "16g",
      fats: "12g",
      calories: "320 kcal"
    },
    tips: [
      "Usar atún en agua para menos grasa",
      "Puedes agregar más especias según tu preferencia",
      "Agregar más huevos si necesitas más proteína",
      "Puedes agregar vegetales picados como cebolla",
      "Conservar en refrigerador hasta por 2 días",
      "Perfecto para snack o almuerzo",
      "Agregar más corn flakes si prefieres más crujiente",
      "Usar diferentes tipos de especias para variar el sabor"
    ]
  },
  {
    id: "arroz-arabe",
    name: "ARROZ ÁRABE",
    emoji: "🇦🇪🤤",
    category: "saladas",
    time: "35 min",
    portions: "4 porciones",
    ingredients: [
      "Cebolla 🧅",
      "Ají amarillo",
      "Ajo 🧄",
      "Sal 🧂",
      "2 tazas de arroz 🍚",
      "Tocino 🥓 (el que gustes, de preferencia bajo en grasas)",
      "2 🥄's crema de aceituna 🫒",
      "Pasas (si gustas)",
      "Agüita de aceituna",
      "1 cubito caldo de carne 🥩",
      "Coca cola (al gusto, de preferencia sin azúcar)",
      "Fideos 🍜",
      "Almendras o pecanas (si gustas) 🥜"
    ],
    instructions: [
      "Picar finamente la cebolla, ají amarillo y ajo",
      "En una olla grande, cocinar el tocino hasta que esté dorado",
      "Agregar la cebolla, ají y ajo picados",
      "Saltear hasta que estén transparentes",
      "Agregar las 2 tazas de arroz y saltear por 2 minutos",
      "Incorporar la crema de aceituna y mezclar",
      "Agregar el cubito de caldo de carne disuelto en agua",
      "Incorporar la agüita de aceituna",
      "Agregar coca cola al gusto",
      "Cocinar el arroz según las instrucciones del paquete",
      "Agregar los fideos y cocinar hasta que estén listos",
      "Incorporar las pasas y almendras/pecanas si las usas",
      "Servir caliente"
    ],
    macros: {
      protein: "18g",
      carbs: "75g",
      fats: "22g",
      calories: "520 kcal"
    },
    tips: [
      "Usar tocino bajo en grasas para menos calorías",
      "Puedes agregar más vegetales según tu preferencia",
      "Usar coca cola sin azúcar para menos calorías",
      "Puedes agregar más proteína como pollo o res",
      "Conservar en refrigerador hasta por 3 días",
      "Perfecto para ocasiones especiales",
      "Una recetita que había grabado para Navidad",
      "Ideal para compartir en familia"
    ]
  },
  {
    id: "tostadas-francesas-40g-proteina",
    name: "Tostadas Francesas +40g proteína",
    emoji: "🤤💪🏻",
    category: "desayunos",
    time: "15 min",
    portions: "2 porciones",
    ingredients: [
      "2 🥚's",
      "1 chorrito de leche 🥛 (la de tu preferencia)",
      "Canela",
      "Stevia",
      "2-4 panes de molde 🍞",
      "1 scoop proteína 🍫 @ivernprotein.pe"
    ],
    instructions: [
      "En un bowl, batir los 2 huevos",
      "Agregar el chorrito de leche de tu preferencia",
      "Incorporar canela al gusto",
      "Agregar stevia al gusto",
      "Incorporar el scoop de proteína y mezclar bien",
      "Calentar una sartén antiadherente a fuego medio",
      "Sumergir cada pan de molde en la mezcla de huevos",
      "Cocinar las tostadas por 2-3 minutos por lado hasta que estén doradas",
      "Servir caliente"
    ],
    macros: {
      protein: "42g",
      carbs: "32g",
      fats: "14g",
      calories: "420 kcal"
    },
    tips: [
      "Puedes agregar más proteína si necesitas más",
      "Usar diferentes tipos de pan (integral, de avena, sin gluten)",
      "Agregar más canela para más sabor",
      "Puedes agregar miel o stevia para más dulzor",
      "Conservar en refrigerador hasta por 1 día",
      "Perfecto para desayuno o post-entreno",
      "Saben a Donuts y son ideales para cualquier momento",
      "Ideal cuando estés antojado de algo dulce y no quieres pecar"
    ]
  },
  {
    id: "bombones-fit",
    name: "Bombones Fit",
    emoji: "🍨🍫🫐🍓",
    category: "dulces",
    time: "20 min + congelado",
    portions: "4 porciones",
    ingredients: [
      "100g arándanos 🫐's",
      "100g fresas 🍓's",
      "3 buenas 🥄's de yogur griego 🍨",
      "20g mantequilla de maní sabor chocolate blanco 🤤 de @poderfitmonster 🤩 código CHEPA 👉🏻 10% de dcto",
      "3 barras de cobertura de 🍫 (sin azúcar de preferencia / igual puedes usar el de tu elección 🤝🏻)"
    ],
    instructions: [
      "En un bowl, mezclar el yogur griego con la mantequilla de maní",
      "Agregar los arándanos y fresas picados",
      "Mezclar todo hasta obtener una mezcla homogénea",
      "Derretir las 3 barras de chocolate en baño maría",
      "Para el baño maría: hervir agua en una olla y colocar encima una más pequeña donde pondrás el chocolate",
      "Mover constantemente hasta que el chocolate esté derretido",
      "Formar pequeñas bolitas con la mezcla de frutas y yogur",
      "Sumergir cada bolita en el chocolate derretido",
      "Colocar en una bandeja con papel encerado",
      "Refrigerar por al menos 2 horas",
      "Servir frío y disfrutar"
    ],
    macros: {
      protein: "8g",
      carbs: "18g",
      fats: "12g",
      calories: "200 kcal"
    },
    tips: [
      "Usar chocolate sin azúcar para menos calorías",
      "Puedes agregar más frutas según tu preferencia",
      "Agregar más yogur griego si prefieres más cremosidad",
      "Puedes agregar frutos secos como topping",
      "Conservar en refrigerador hasta por 1 semana",
      "Perfecto como snack saludable",
      "Ideal cuando estés antojado de algo dulce",
      "Usar diferentes tipos de chocolate para variar"
    ]
  },
  {
    id: "flan-cafe-fit-2-minutos",
    name: "Flan de Café Fit (en 2 minutos)",
    emoji: "☕️🤤",
    category: "dulces",
    time: "2 min",
    portions: "1 porción",
    ingredients: [
      "1 huevo 🥚",
      "40 ml leche 🥛",
      "Vainilla",
      "3 cucharaditas de café ☕️",
      "Bicarbonato de sodio",
      "Stevia",
      "Manjar Blanco de PURA PROTEÍNA @poderfitmonster 🤩 cod CHEPA 👉🏻 10% dcto"
    ],
    instructions: [
      "En un bowl, batir el huevo",
      "Agregar la leche y mezclar",
      "Incorporar la vainilla al gusto",
      "Agregar las 3 cucharaditas de café",
      "Incorporar una pizca de bicarbonato de sodio",
      "Agregar stevia al gusto",
      "Mezclar todo hasta obtener una mezcla homogénea",
      "Verter en un recipiente apto para microondas",
      "Cocinar en microondas por 2 minutos",
      "Servir con manjar blanco de pura proteína",
      "Disfrutar caliente"
    ],
    macros: {
      protein: "12g",
      carbs: "8g",
      fats: "8g",
      calories: "160 kcal"
    },
    tips: [
      "Puedes agregar más café si prefieres más sabor",
      "Usar leche de almendras para menos calorías",
      "Agregar más stevia si prefieres más dulzor",
      "Puedes agregar canela para más sabor",
      "Conservar en refrigerador hasta por 1 día",
      "Perfecto como postre rápido",
      "Ideal cuando estés antojado de algo dulce",
      "Súper rápido de preparar en solo 2 minutos"
    ]
  }
];

const categories = [
  { id: "dulces", name: "Dulces", emoji: "🍰" },
  { id: "saladas", name: "Saladas", emoji: "🍽️" },
  { id: "salsas", name: "Salsas", emoji: "🥘" },
  { id: "desayunos", name: "Desayunos", emoji: "🌅" },
  { id: "snacks", name: "Snacks", emoji: "🥨" }
];

export default function EbookPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const filteredRecipes = selectedCategory === "all" 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Configurar fuentes
      pdf.setFontSize(24);
      pdf.setTextColor(139, 0, 0); // #8B0000
      pdf.setFont('helvetica', 'bold');
      
      // Título principal
      pdf.text('Ebook de Recetas FIT', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Subtítulo
      pdf.setFontSize(16);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Recetas nutritivas para cuerpo y mente', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Descripción
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      const description = 'Descubre recetas deliciosas y nutritivas diseñadas para potenciar tu transformación física. Desde desayunos energéticos hasta postres proteicos, todo pensado para tu estilo de vida fitness.';
      const descriptionLines = pdf.splitTextToSize(description, contentWidth);
      pdf.text(descriptionLines, margin, yPosition);
      yPosition += (descriptionLines.length * 7) + 20;

      // Generar contenido para cada receta
      recipes.forEach((recipe, index) => {
        // Verificar si necesitamos nueva página
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        // Título de la receta
        pdf.setFontSize(18);
        pdf.setTextColor(139, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${recipe.emoji} ${recipe.name}`, margin, yPosition);
        yPosition += 12;

        // Información básica
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`⏱️ Tiempo: ${recipe.time} | 👥 Porciones: ${recipe.portions}`, margin, yPosition);
        yPosition += 8;

        // Macros nutricionales
        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        pdf.setFont('helvetica', 'bold');
        pdf.text('📊 Información Nutricional:', margin, yPosition);
        yPosition += 6;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Proteína: ${recipe.macros.protein} | Carbos: ${recipe.macros.carbs} | Grasas: ${recipe.macros.fats} | Calorías: ${recipe.macros.calories}`, margin, yPosition);
        yPosition += 10;

        // Ingredientes
        pdf.setFontSize(12);
        pdf.setTextColor(139, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text('🥘 Ingredientes:', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        pdf.setFont('helvetica', 'normal');
        recipe.ingredients.forEach(ingredient => {
          const ingredientText = `• ${ingredient}`;
          const ingredientLines = pdf.splitTextToSize(ingredientText, contentWidth - 10);
          pdf.text(ingredientLines, margin + 5, yPosition);
          yPosition += ingredientLines.length * 5;
        });
        yPosition += 5;

        // Instrucciones
        pdf.setFontSize(12);
        pdf.setTextColor(139, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text('👨‍🍳 Instrucciones:', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        pdf.setFont('helvetica', 'normal');
        recipe.instructions.forEach((instruction, instIndex) => {
          const instructionText = `${instIndex + 1}. ${instruction}`;
          const instructionLines = pdf.splitTextToSize(instructionText, contentWidth - 10);
          pdf.text(instructionLines, margin + 5, yPosition);
          yPosition += instructionLines.length * 5;
        });
        yPosition += 5;

        // Tips
        if (recipe.tips && recipe.tips.length > 0) {
          pdf.setFontSize(12);
          pdf.setTextColor(139, 0, 0);
          pdf.setFont('helvetica', 'bold');
          pdf.text('💡 Tips:', margin, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);
          pdf.setFont('helvetica', 'normal');
          recipe.tips.forEach(tip => {
            const tipText = `💡 ${tip}`;
            const tipLines = pdf.splitTextToSize(tipText, contentWidth - 10);
            pdf.text(tipLines, margin + 5, yPosition);
            yPosition += tipLines.length * 5;
          });
          yPosition += 5;
        }

        // Separador entre recetas
        if (index < recipes.length - 1) {
          yPosition += 10;
          pdf.setDrawColor(200, 200, 200);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 15;
        }
      });

      // Página final con información de contacto
      pdf.addPage();
      yPosition = margin;

      pdf.setFontSize(20);
      pdf.setTextColor(139, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('¿Te gustó lo que viste?', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.setFont('helvetica', 'normal');
      const contactText = 'Para más recetas, tips de nutrición y contenido exclusivo, sígueme en:';
      pdf.text(contactText, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(14);
      pdf.setTextColor(139, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Instagram: @elchepaaa', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      pdf.text('WhatsApp: +51 978 381 334', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text('© 2024 Gainz Factory - Todos los derechos reservados', pageWidth / 2, pageHeight - 20, { align: 'center' });

      pdf.save('Gainz-Factory-Ebook-Recetas.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Intenta nuevamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory Logo"
              width={120}
              height={120}
              className="rounded-full border-4 border-[#8B0000] mx-auto mb-6"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Ebook de Recetas FIT
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-100 mb-6 drop-shadow-md">
              Recetas nutritivas para cuerpo y mente
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Descubre recetas deliciosas y nutritivas diseñadas para potenciar tu transformación física. 
              Desde desayunos energéticos hasta postres proteicos, todo pensado para tu estilo de vida fitness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="bg-[#8B0000] hover:bg-[#6B0000] disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generando PDF...
                  </>
                ) : (
                  <>
                    📥 Descargar PDF
                  </>
                )}
              </button>
              <button className="border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                👁️ Ver Online
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 py-12">
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">
          📚 Índice
        </h2>
        
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-[#8B0000] text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            📖 Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-[#8B0000] text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-[#8B0000]"
            >
              <div className="text-4xl mb-4">{recipe.emoji}</div>
              <h3 className="text-xl font-bold mb-2 text-white drop-shadow-md">{recipe.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span>⏱️ {recipe.time}</span>
                <span>👥 {recipe.portions}</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-2">
                  <span className="font-semibold">Proteína:</span> {recipe.macros.protein}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Carbos:</span> {recipe.macros.carbs}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Grasas:</span> {recipe.macros.fats}
                </div>
                <div>
                  <span className="font-semibold">Calorías:</span> {recipe.macros.calories}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-4xl mb-2">{selectedRecipe.emoji}</div>
                  <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{selectedRecipe.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>⏱️ {selectedRecipe.time}</span>
                    <span>👥 {selectedRecipe.portions}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Macros */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-3 text-white">📊 Información Nutricional</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{selectedRecipe.macros.protein}</div>
                    <div className="text-sm text-gray-400">Proteína</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{selectedRecipe.macros.carbs}</div>
                    <div className="text-sm text-gray-400">Carbos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{selectedRecipe.macros.fats}</div>
                    <div className="text-sm text-gray-400">Grasas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{selectedRecipe.macros.calories}</div>
                    <div className="text-sm text-gray-400">Calorías</div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-white">🥘 Ingredientes</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#8B0000] mt-1">•</span>
                      <span className="text-gray-300">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-white">👨‍🍳 Instrucciones</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-[#8B0000] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-300">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-white">💡 Tips</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">💡</span>
                        <span className="text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ← Volver al índice
                </button>
                <button
                  onClick={() => {
                    // WhatsApp share functionality
                    const message = `¡Mira esta receta del Ebook de Gainz Factory!\n\n${selectedRecipe.name}\n\n${selectedRecipe.ingredients.join('\n')}\n\n¡Descarga el ebook completo!`;
                    window.open(`https://wa.me/51978381334?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  📱 Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
            ¿Te gustó lo que viste?
          </h3>
          <p className="text-gray-400 mb-6">
            Descarga el ebook completo con más de 50 recetas exclusivas, 
            tips de nutrición y guías de preparación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="bg-[#8B0000] hover:bg-[#6B0000] disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generando PDF...
                </>
              ) : (
                <>
                  📥 Descargar Ebook Completo
                </>
              )}
            </button>
            <Link
              href="https://wa.me/51978381334?text=Hola Chepa, me interesa adquirir tu Ebook de recetas completo. ¿Cómo puedo obtenerlo?"
              target="_blank"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              💬 Consultar por WhatsApp
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-500 text-sm">
              © 2024 Gainz Factory - @elchepaaa | Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[#8B0000] hover:bg-[#6B0000] text-white p-3 rounded-full shadow-lg transition-colors z-40"
      >
        ↑
      </button>
    </div>
  );
}
