/**
 * Script de prueba de rendimiento
 * Ejecutar en la consola del navegador después de cargar la app
 */

console.log('🚀 Testing Performance Optimizations...\n');

// Test 1: Verificar caché de usuario
console.log('📊 Test 1: User Cache');
const userCache = sessionStorage.getItem('auth_user_cache');
if (userCache) {
  console.log('✅ User cache found:', JSON.parse(userCache).email);
} else {
  console.log('❌ No user cache (primera carga)');
}

// Test 2: Verificar caché de configs
console.log('\n📊 Test 2: GoPhish Configs Cache');
const configsCache = sessionStorage.getItem('gophish_configs_cache');
const activeConfigCache = sessionStorage.getItem('gophish_active_config_cache');
if (configsCache) {
  const configs = JSON.parse(configsCache);
  console.log(`✅ Configs cache found: ${configs.length} configs`);
} else {
  console.log('❌ No configs cache');
}
if (activeConfigCache) {
  const active = JSON.parse(activeConfigCache);
  console.log(`✅ Active config cache found: ${active.name}`);
} else {
  console.log('❌ No active config cache');
}

// Test 3: Verificar localStorage
console.log('\n📊 Test 3: LocalStorage Persistence');
const activeConfigId = localStorage.getItem('activeGoPhishConfigId');
if (activeConfigId) {
  console.log(`✅ Active config ID persisted: ${activeConfigId}`);
} else {
  console.log('❌ No active config ID in localStorage');
}

// Test 4: Medir tiempo de recarga
console.log('\n📊 Test 4: Reload Performance');
console.log('Para probar, ejecuta: location.reload()');
console.log('Observa los logs [Auth] y [Config] con tiempos en ms');

// Test 5: Limpiar cache y probar carga fría
console.log('\n🧪 Para probar carga fría (sin caché):');
console.log('sessionStorage.clear(); localStorage.clear(); location.reload();');

console.log('\n✅ Tests completados!');
console.log('\n📈 Métricas esperadas:');
console.log('  - Carga inicial (sin caché): ~1-2s');
console.log('  - Recarga (con caché): <300ms');
console.log('  - [Auth] tiempo: <500ms');
console.log('  - [Config] tiempo: <200ms');
