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
            <h1 className="text-5xl md:text-6xl font-bold text-[#8B0000] mb-4">
              Ebook de Recetas FIT
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-300 mb-6">
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
        <h2 className="text-3xl font-bold text-center mb-8 text-[#8B0000]">
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
              <h3 className="text-xl font-bold mb-2 text-[#8B0000]">{recipe.name}</h3>
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
                  <h2 className="text-2xl font-bold text-[#8B0000] mb-2">{selectedRecipe.name}</h2>
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
                <h3 className="font-bold mb-3 text-[#8B0000]">📊 Información Nutricional</h3>
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
                <h3 className="font-bold mb-3 text-[#8B0000]">🥘 Ingredientes</h3>
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
                <h3 className="font-bold mb-3 text-[#8B0000]">👨‍🍳 Instrucciones</h3>
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
                  <h3 className="font-bold mb-3 text-[#8B0000]">💡 Tips</h3>
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
          <h3 className="text-2xl font-bold text-[#8B0000] mb-4">
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
