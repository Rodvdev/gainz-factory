import EggDemo from "@/components/dashboard/EggDemo"

export default function EggDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🥚 Demo del Huevo Animado
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora todas las características del huevo animado para usuarios novatos. 
            Toca el huevo, agrega experiencia y observa cómo crece y se anima.
          </p>
        </div>
        
        <EggDemo />
        
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎮 Instrucciones de Uso
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Animaciones Disponibles:
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <div>
                    <strong>Crecimiento:</strong> El huevo aumenta de tamaño según el nivel y progreso
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <div>
                    <strong>Ilusionar:</strong> Vibra y muestra partículas al tercer toque consecutivo
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <div>
                    <strong>Expresiones:</strong> Cambia según el progreso (feliz, emocionado, preocupado, etc.)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <div>
                    <strong>Efectos:</strong> Brillos y partículas durante las transiciones
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Controles de Prueba:
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <div>
                    <strong>+10 XP:</strong> Agrega experiencia para ver el crecimiento
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500">•</span>
                  <div>
                    <strong>Reset:</strong> Reinicia el demo al estado inicial
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Toca el huevo:</strong> Haz clic 3 veces seguidas para ver la animación de "ilusionar"
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              💡 Nota Técnica:
            </h4>
            <p className="text-blue-800 text-sm">
              Este componente se muestra automáticamente en el Dashboard para usuarios de nivel 1 (Novato GF). 
              Los usuarios de niveles superiores verán sus avatares correspondientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
