"use client"

import { motion } from "framer-motion"
import { Trophy, Crown, Zap, Flame, Target } from "lucide-react"

interface UserLevelProps {
  level: number
  totalPoints: number
  nextLevelPoints: number
  levelName: string
  levelIcon: string
  progress: number
}

const levelData = {
  1: { name: "Novato GF", icon: "🎯", color: "from-gray-400 to-gray-600", bgColor: "bg-gray-100", textColor: "text-gray-800" },
  2: { name: "Rookie GF", icon: "🔥", color: "from-orange-400 to-orange-600", bgColor: "bg-orange-100", textColor: "text-orange-800" },
  3: { name: "Warrior GF", icon: "⚡", color: "from-yellow-400 to-yellow-600", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
  4: { name: "Beast GF", icon: "💪", color: "from-red-400 to-red-600", bgColor: "bg-red-100", textColor: "text-red-800" },
  5: { name: "Legendary GF", icon: "👑", color: "from-purple-400 to-purple-600", bgColor: "bg-purple-100", textColor: "text-purple-800" },
  6: { name: "Gainz Master", icon: "🏆", color: "from-indigo-400 to-indigo-600", bgColor: "bg-indigo-100", textColor: "text-indigo-800" }
}

const getLevelData = (level: number) => {
  return levelData[level as keyof typeof levelData] || levelData[1]
}

export default function UserLevel({ level, totalPoints, nextLevelPoints, progress }: UserLevelProps) {
  const currentLevelData = getLevelData(level)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Level Badge */}
      <div className={`relative p-6 rounded-2xl ${currentLevelData.bgColor} border-2 border-white/20 backdrop-blur-sm`}>
        {/* Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentLevelData.color} opacity-10 rounded-2xl`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLevelData.color} flex items-center justify-center text-2xl shadow-lg`}>
                {currentLevelData.icon}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${currentLevelData.textColor}`}>
                  {currentLevelData.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Nivel {level}
                </p>
              </div>
            </div>
            
            {/* Points Display */}
            <div className="text-right">
              <p className={`text-2xl font-bold ${currentLevelData.textColor}`}>
                {totalPoints.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Puntos</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progreso al siguiente nivel</span>
              <span className={`font-semibold ${currentLevelData.textColor}`}>
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="relative h-3 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full bg-gradient-to-r ${currentLevelData.color} rounded-full relative`}
              >
                {/* Shimmer Effect */}
                <motion.div
                  animate={{ x: [-100, 100] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            
            <p className="text-xs text-gray-600 text-center">
              {nextLevelPoints - totalPoints} puntos para el siguiente nivel
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="mt-4 flex justify-center gap-2">
        {level >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
          >
            <Flame className="w-4 h-4 text-white" />
          </motion.div>
        )}
        {level >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
          >
            <Zap className="w-4 h-4 text-white" />
          </motion.div>
        )}
        {level >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
          >
            <Target className="w-4 h-4 text-white" />
          </motion.div>
        )}
        {level >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
          >
            <Crown className="w-4 h-4 text-white" />
          </motion.div>
        )}
        {level >= 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center"
          >
            <Trophy className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
