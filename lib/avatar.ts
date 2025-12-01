// lib/avatar.ts

export function getAvatarInitial(name: string) {
  if (!name) return "?";
  const trimmed = name.trim();
  // use first letter of first non-empty word
  const firstWord = trimmed.split(/\s+/)[0];
  return firstWord.charAt(0).toUpperCase();
}

// simple hash -> [0, 360)
function hashToHue(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 360;
}

export function getAvatarGradient(name: string) {
  const hue = hashToHue(name || "player");
  const hue2 = (hue + 40) % 360;
  // neon-ish gradient, matches your brand
  return {
    backgroundImage: `linear-gradient(135deg, hsl(${hue} 90% 60%), hsl(${hue2} 95% 55%))`,
  };
}

