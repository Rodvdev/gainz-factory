"use client"

import { useState } from "react"
import AnimatedEgg from "./AnimatedEgg"

export default function EggDemo() {
  const [attemptCount, setAttemptCount] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [totalXP, setTotalXP] = useState(25)

  const handleAttempt = () => {
    setAttemptCount(prev => prev + 1)
    console.log(`Intento #${attemptCount + 1}`)
  }

  const addXP = () => {
    setTotalXP(prev => {
      const newXP = prev + 10
      if (newXP >= 100 && currentLevel === 1) {
        setCurrentLevel(2)
        return 0
      }
      return newXP
    })
  }

  const resetDemo = () => {
    setAttemptCount(0)
    setCurrentLevel(1)
    setTotalXP(25)
  }

  return (
    <div className="bg-gray-50 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Demo del Huevo Animado
      </h2>
      
      <div className="flex flex-col items-center space-y-6">
        {/* Huevo animado */}
        <AnimatedEgg
          currentLevel={currentLevel}
          nextLevelXP={100}
          currentLevelXP={totalXP}
          isActive={true}
          onAttempt={handleAttempt}
        />
        
        {/* Controles de demostración */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-md">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Nivel:</strong> {currentLevel} | <strong>XP:</strong> {totalXP}/100
            </p>
            <p className="text-xs text-gray-500">
              Intentos: {attemptCount} | Toca el huevo 3 veces para ver la animación de &ldquo;ilusionar&rdquo;
            </p>
          </div>
          
          <div className="flex gap-2 justify-center">
            <button
              onClick={addXP}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              +10 XP
            </button>
            <button
              onClick={resetDemo}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Reset
            </button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p><strong>Características:</strong></p>
            <ul className="mt-2 space-y-1">
              <li>• El huevo crece según el nivel y progreso</li>
              <li>• Cambia de color según el nivel</li>
              <li>• Expresión facial según el progreso</li>
              <li>• Animación de &ldquo;ilusionar&rdquo; al tercer intento</li>
              <li>• Efectos visuales al crecer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
