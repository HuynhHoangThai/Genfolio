// AI Visual Asset Engine: generates high-fidelity thematic artworks & mockups

export interface GeneratedVisualOptions {
  theme: string;
  title: string;
  category?: string;
  primaryColor?: string;
  aspectRatio?: '16:9' | '1:1' | '4:3';
}

/**
 * Procedurally generates custom generative SVG artworks with crisp nodes,
 * isometric grids, gradient meshes, holographic contours, and technical HUDs.
 */
export function generateProceduralVisual(options: GeneratedVisualOptions): string {
  const { theme, title, category = '', primaryColor = '#10b981', aspectRatio = '16:9' } = options;
  const width = aspectRatio === '16:9' ? 960 : aspectRatio === '1:1' ? 600 : 800;
  const height = aspectRatio === '16:9' ? 540 : aspectRatio === '1:1' ? 600 : 600;

  // Derive accent palettes
  const hex = primaryColor;

  if (theme === 'tech' || theme === 'cyberpunk') {
    // Futuristic cyber & distributed topology layout
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#05070c"/>
            <stop offset="50%" stop-color="#0b101c"/>
            <stop offset="100%" stop-color="#030508"/>
          </linearGradient>
          <linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${hex}" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.7"/>
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>

        <!-- Ambient Glow -->
        <circle cx="${width * 0.8}" cy="${height * 0.3}" r="180" fill="${hex}" opacity="0.12" filter="blur(50px)"/>
        <circle cx="${width * 0.2}" cy="${height * 0.7}" r="150" fill="#38bdf8" opacity="0.08" filter="blur(40px)"/>

        <!-- Network Topology Nodes & Connections -->
        <g stroke="${hex}" stroke-width="1.5" stroke-opacity="0.3" fill="none">
          <line x1="${width * 0.2}" y1="${height * 0.3}" x2="${width * 0.45}" y2="${height * 0.25}" stroke-dasharray="4 4"/>
          <line x1="${width * 0.45}" y1="${height * 0.25}" x2="${width * 0.75}" y2="${height * 0.4}"/>
          <line x1="${width * 0.45}" y1="${height * 0.25}" x2="${width * 0.5}" y2="${height * 0.7}"/>
          <line x1="${width * 0.2}" y1="${height * 0.3}" x2="${width * 0.3}" y2="${height * 0.65}"/>
          <line x1="${width * 0.3}" y1="${height * 0.65}" x2="${width * 0.7}" y2="${height * 0.75}"/>
          <line x1="${width * 0.75}" y1="${height * 0.4}" x2="${width * 0.7}" y2="${height * 0.75}"/>
        </g>

        <!-- Server Pod Glyphs -->
        <circle cx="${width * 0.45}" cy="${height * 0.25}" r="8" fill="${hex}" opacity="0.9"/>
        <circle cx="${width * 0.45}" cy="${height * 0.25}" r="18" fill="none" stroke="${hex}" stroke-opacity="0.5" stroke-width="1.5"/>
        <circle cx="${width * 0.2}" cy="${height * 0.3}" r="5" fill="#38bdf8"/>
        <circle cx="${width * 0.75}" cy="${height * 0.4}" r="6" fill="${hex}"/>
        <circle cx="${width * 0.3}" cy="${height * 0.65}" r="6" fill="#38bdf8"/>
        <circle cx="${width * 0.7}" cy="${height * 0.75}" r="7" fill="${hex}"/>

        <!-- Tech Window Card -->
        <rect x="${width * 0.1}" y="${height * 0.52}" width="${width * 0.5}" height="${height * 0.36}" rx="8" fill="#0d131f" stroke="#1e293b" stroke-width="1.5"/>
        <rect x="${width * 0.1}" y="${height * 0.52}" width="${width * 0.5}" height="24" fill="#070a10"/>
        <circle cx="${width * 0.1 + 14}" cy="${height * 0.52 + 12}" r="3" fill="#f43f5e"/>
        <circle cx="${width * 0.1 + 26}" cy="${height * 0.52 + 12}" r="3" fill="#f59e0b"/>
        <circle cx="${width * 0.1 + 38}" cy="${height * 0.52 + 12}" r="3" fill="${hex}"/>
        <text x="${width * 0.1 + 55}" y="${height * 0.52 + 16}" fill="#64748b" font-family="monospace" font-size="10">service-mesh.go [active]</text>

        <!-- Code Snippet lines -->
        <rect x="${width * 0.13}" y="${height * 0.63}" width="180" height="6" rx="3" fill="${hex}" opacity="0.8"/>
        <rect x="${width * 0.13}" y="${height * 0.68}" width="240" height="5" rx="2.5" fill="#475569"/>
        <rect x="${width * 0.13}" y="${height * 0.73}" width="140" height="5" rx="2.5" fill="#38bdf8" opacity="0.7"/>
        <rect x="${width * 0.13}" y="${height * 0.78}" width="200" height="5" rx="2.5" fill="#475569"/>

        <!-- Metadata Stamp -->
        <text x="32" y="44" fill="${hex}" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">SYS_ARCH // ${category.toUpperCase() || 'DISTRIBUTED'}</text>
        <text x="32" y="${height - 24}" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold">${title.slice(0, 40)}</text>
        <text x="${width - 32}" y="${height - 24}" text-anchor="end" fill="#64748b" font-family="monospace" font-size="11">LATENCY: 1.8ms</text>
      </svg>
    `)}`;
  }

  if (theme === 'brutalist') {
    // High-contrast raw neo-brutalist graphic
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="#121212"/>
        <!-- Chunky Diagonal Hazard Stripes -->
        <g stroke="${hex}" stroke-width="8" opacity="0.3">
          <line x1="-50" y1="0" x2="300" y2="350"/>
          <line x1="50" y1="0" x2="400" y2="350"/>
          <line x1="150" y1="0" x2="500" y2="350"/>
        </g>
        <!-- Offset Brutalist Solid Blocks -->
        <rect x="${width * 0.15 + 8}" y="${height * 0.18 + 8}" width="${width * 0.68}" height="${height * 0.58}" fill="#000000"/>
        <rect x="${width * 0.15}" y="${height * 0.18}" width="${width * 0.68}" height="${height * 0.58}" fill="#1f1f1f" stroke="#ffffff" stroke-width="3"/>
        
        <!-- Vibrant Accent Stamp -->
        <rect x="${width * 0.2}" y="${height * 0.25}" width="140" height="32" fill="${hex}"/>
        <text x="${width * 0.2 + 10}" y="${height * 0.25 + 21}" fill="#000000" font-family="sans-serif" font-weight="900" font-size="13">Nº 01 / VERIFIED</text>
        
        <!-- Large Architectural Typography -->
        <text x="${width * 0.2}" y="${height * 0.48}" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="28" letter-spacing="-1">${title.slice(0, 24).toUpperCase()}</text>
        <text x="${width * 0.2}" y="${height * 0.56}" fill="#a3a3a3" font-family="monospace" font-size="13">${category.toUpperCase() || 'EXHIBITION EDITION'}</text>

        <!-- Raw Grid Crosshairs -->
        <path d="M 30 30 L 50 30 M 40 20 L 40 40" stroke="#ffffff" stroke-width="2"/>
        <path d="M ${width - 30} 30 L ${width - 50} 30 M ${width - 40} 20 L ${width - 40} 40" stroke="#ffffff" stroke-width="2"/>
      </svg>
    `)}`;
  }

  if (theme === 'creative') {
    // Glassmorphism, 3D ambient spheres, iridescent lighting
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090514"/>
            <stop offset="50%" stop-color="#180b2b"/>
            <stop offset="100%" stop-color="#05030a"/>
          </linearGradient>
          <linearGradient id="sphereGrad" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stop-color="#fb7185"/>
            <stop offset="50%" stop-color="${hex}"/>
            <stop offset="100%" stop-color="#6366f1"/>
          </linearGradient>
          <linearGradient id="glassCard" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>

        <!-- Soft Ambient Light Blobs -->
        <circle cx="${width * 0.7}" cy="${height * 0.4}" r="${height * 0.4}" fill="url(#sphereGrad)" opacity="0.35" filter="blur(60px)"/>
        <circle cx="${width * 0.25}" cy="${height * 0.6}" r="${height * 0.3}" fill="${hex}" opacity="0.25" filter="blur(50px)"/>

        <!-- Geometric Spatial Rings -->
        <ellipse cx="${width * 0.5}" cy="${height * 0.5}" rx="${width * 0.32}" ry="${height * 0.35}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" transform="rotate(-15 ${width * 0.5} ${height * 0.5})"/>
        <ellipse cx="${width * 0.5}" cy="${height * 0.5}" rx="${width * 0.22}" ry="${height * 0.24}" fill="none" stroke="${hex}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="6 6"/>

        <!-- 3D Frosted Glass Pane -->
        <rect x="${width * 0.2}" y="${height * 0.25}" width="${width * 0.6}" height="${height * 0.5}" rx="24" fill="url(#glassCard)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>

        <!-- Center Typography -->
        <text x="${width * 0.5}" y="${height * 0.46}" text-anchor="middle" fill="#ffffff" font-family="'Syne', system-ui, sans-serif" font-weight="800" font-size="22" letter-spacing="-0.5">${title.slice(0, 32)}</text>
        <text x="${width * 0.5}" y="${height * 0.56}" text-anchor="middle" fill="${hex}" font-family="monospace" font-size="12" letter-spacing="2">${category.toUpperCase() || 'EDITORIAL ARTWORK'}</text>

        <text x="32" y="44" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="11" font-weight="600">STUDIO ARCHIVES // 2026</text>
      </svg>
    `)}`;
  }

  // Business / Corporate / Swiss Minimalist
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="corpBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a0e17"/>
          <stop offset="100%" stop-color="#04060a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#corpBg)"/>

      <!-- Clean Swiss Architectural Lines -->
      <line x1="${width * 0.1}" y1="${height * 0.2}" x2="${width * 0.9}" y2="${height * 0.2}" stroke="#1e293b" stroke-width="1"/>
      <line x1="${width * 0.1}" y1="${height * 0.8}" x2="${width * 0.9}" y2="${height * 0.8}" stroke="#1e293b" stroke-width="1"/>
      <line x1="${width * 0.5}" y1="${height * 0.2}" x2="${width * 0.5}" y2="${height * 0.8}" stroke="#1e293b" stroke-width="1" stroke-dasharray="2 4"/>

      <!-- Financial Chart / Trajectory Curve -->
      <path d="M ${width * 0.15} ${height * 0.65} Q ${width * 0.35} ${height * 0.6} ${width * 0.5} ${height * 0.45} T ${width * 0.85} ${height * 0.3}" fill="none" stroke="${hex}" stroke-width="3"/>
      <circle cx="${width * 0.85}" cy="${height * 0.3}" r="6" fill="${hex}"/>

      <!-- Area fill under curve -->
      <path d="M ${width * 0.15} ${height * 0.65} Q ${width * 0.35} ${height * 0.6} ${width * 0.5} ${height * 0.45} T ${width * 0.85} ${height * 0.3} L ${width * 0.85} ${height * 0.75} L ${width * 0.15} ${height * 0.75} Z" fill="${hex}" opacity="0.06"/>

      <!-- KPI Bar Metrics -->
      <text x="${width * 0.15}" y="${height * 0.32}" fill="#ffffff" font-family="'Cormorant Garamond', Georgia, serif" font-size="28" font-weight="600">${title.slice(0, 30)}</text>
      <text x="${width * 0.15}" y="${height * 0.38}" fill="${hex}" font-family="monospace" font-size="11" letter-spacing="1.5">${category.toUpperCase() || 'ENTERPRISE INITIATIVE'}</text>

      <text x="${width * 0.85}" y="${height * 0.26}" text-anchor="end" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">+215% ARR</text>
      <text x="32" y="32" fill="#475569" font-family="monospace" font-size="10">EXEC REPORT // SECURED CONTRACT</text>
    </svg>
  `)}`;
}

/**
 * Procedurally generates handsome, minimalist modern executive avatars
 */
export function generateProceduralAvatar(fullName: string, industry: string, primaryColor: string = '#10b981'): string {
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#avatarGrad)" stroke="${primaryColor}" stroke-width="3"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
      <circle cx="100" cy="72" r="32" fill="${primaryColor}" fill-opacity="0.18" stroke="${primaryColor}" stroke-opacity="0.4" stroke-width="1.5"/>
      <path d="M 40 162 C 40 120 70 115 100 115 C 130 115 160 120 160 162 Z" fill="${primaryColor}" fill-opacity="0.12" stroke="${primaryColor}" stroke-opacity="0.3" stroke-width="1.5"/>
      <text x="100" y="82" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="24" font-weight="bold">${initials}</text>
    </svg>
  `)}`;
}
