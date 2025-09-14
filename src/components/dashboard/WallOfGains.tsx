"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, Star, Crown, Zap, Flame, Target, Award, CheckCircle } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  rarity: "common" | "rare" | "epic" | "legendary"
  category: "streak" | "habits" | "challenges" | "milestone"
}

interface WallOfGainsProps {
  achievements: Achievement[]
  totalAchievements: number
  recentAchievements: Achievement[]
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600", 
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-600"
}

const rarityIcons = {
  common: Medal,
  rare: Star,
  epic: Crown,
  legendary: Trophy
}

const categoryIcons = {
  streak: Flame,
  habits: CheckCircle,
  challenges: Target,
  milestone: Award
}

export default function WallOfGains({ achievements, totalAchievements, recentAchievements }: WallOfGainsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
            🏆 WALL OF GAINS 🏆
          </h2>
          <p className="text-gray-600 mt-2">Tus logros y conquistas</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{totalAchievements}</p>
              <p className="text-xs text-gray-600">Logros</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{recentAchievements.length}</p>
              <p className="text-xs text-gray-600">Recientes</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Logros Recientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAchievements.slice(0, 4).map((achievement, index) => {
              const RarityIcon = rarityIcons[achievement.rarity]
              const CategoryIcon = categoryIcons[achievement.category]
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`relative p-4 rounded-xl bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white shadow-lg hover:scale-105 transition-transform duration-200`}
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <RarityIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{achievement.title}</h4>
                        <div className="flex items-center gap-1">
                          <CategoryIcon className="w-3 h-3" />
                          <span className="text-xs opacity-90 capitalize">{achievement.category}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs opacity-90 mb-2">{achievement.description}</p>
                    <p className="text-xs opacity-75">
                      {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* All Achievements Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-600" />
          Todos tus Logros
        </h3>
        
        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const RarityIcon = rarityIcons[achievement.rarity]
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={`group relative p-4 rounded-xl bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer`}
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <RarityIcon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm mb-1 group-hover:text-yellow-200 transition-colors">
                      {achievement.title}
                    </h4>
                    <p className="text-xs opacity-90 line-clamp-2">
                      {achievement.description}
                    </p>
                  </div>
                  
                  {/* Rarity Indicator */}
                  <div className="absolute top-2 right-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]} border border-white/30`}></div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Sin logros aún</h4>
            <p className="text-gray-500 mb-6">Completa hábitos y desafíos para desbloquear tus primeros logros</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Comenzar mi transformación
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Achievement Categories */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
      >
        {Object.entries(categoryIcons).map(([category, Icon], index) => {
          const categoryAchievements = achievements.filter(a => a.category === category)
          const categoryCount = categoryAchievements.length
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 capitalize mb-1">{category}</h4>
              <p className="text-2xl font-bold text-orange-600">{categoryCount}</p>
              <p className="text-xs text-gray-600">logros</p>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
