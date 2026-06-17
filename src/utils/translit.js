// Cyrillic → Latin for tumo.world email generation
const MAP = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh',
  'з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
  'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts',
  'ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu',
  'я':'ya',
  // Kazakh letters
  'қ':'k','ң':'n','ғ':'g','ұ':'u','ү':'u','ı':'i','ө':'o','ә':'a','һ':'h',
}

function convertChar(c) {
  return MAP[c] ?? c
}

function cyrToLat(str) {
  return str.toLowerCase().split('').map(convertChar).join('').replace(/[^a-z0-9.]/g, '')
}

export function generateEmail(fullName) {
  const parts = fullName.trim().split(/\s+/)
  const first = cyrToLat(parts[0] || '')
  const last  = cyrToLat(parts[1] || '')
  if (!first) return null
  return last ? `${first}.${last}@tumo.world` : `${first}@tumo.world`
}

export function generatePassword() {
  const adjectives = ['Sky','Star','Code','Tech','Bold','Fast','Bright']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const num = String(Math.floor(1000 + Math.random() * 9000))
  return adj + num + '!'
}
