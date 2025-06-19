#!/usr/bin/env tsx

/**
 * Seed Script para Gainz Factory
 * Inicializa la base de datos con los datos de Rodrigo (tu usuario)
 */

import { seedDatabase } from '../src/lib/seed-data';

async function main() {
  console.log('🌱 Iniciando proceso de seed para Gainz Factory...');
  console.log('👤 Usuario: Rodrigo Rodriguez (Founder & CEO)');
  console.log('🎯 Modo: Single-user optimizado\n');

  try {
    await seedDatabase();
    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('📊 Base de datos lista para Gainz Factory');
    console.log('🚀 Puedes iniciar la aplicación ahora');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    process.exit(1);
  }
}

main(); 