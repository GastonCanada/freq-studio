import fs from 'fs';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist');
const htmlPath = path.join(distPath, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error("No se encontró el archivo index.html en dist. Por favor corre npm run build primero.");
  process.exit(1);
}

let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// Buscamos los archivos JS y CSS compilados por Vite en dist/index.html
const jsRegex = /<script\s+type="module"\s+crossorigin\s+src="\/assets\/([^"]+)"\s*><\/script>/i;
const cssRegex = /<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/([^"]+)"\s*>/i;

const jsMatch = htmlContent.match(jsRegex);
const cssMatch = htmlContent.match(cssRegex);

if (jsMatch) {
  const jsFilename = jsMatch[1];
  const jsFilePath = path.join(distPath, 'assets', jsFilename);
  console.log(`Inlining JS: ${jsFilePath}`);
  if (fs.existsSync(jsFilePath)) {
    const jsContent = fs.readFileSync(jsFilePath, 'utf-8');
    // Reemplazamos la etiqueta de script externa por un script inline usando una función para evitar problemas con caracteres especiales como $&
    htmlContent = htmlContent.replace(jsRegex, () => `<script type="module">${jsContent}</script>`);
  } else {
    console.error(`Archivo JS no encontrado: ${jsFilePath}`);
  }
} else {
  // Regex alternativa por si Vite cambia de formato
  const jsRegex2 = /<script\s+[^>]*src="[^"]*\/assets\/([^"]+\.js)"[^>]*><\/script>/i;
  const jsMatch2 = htmlContent.match(jsRegex2);
  if (jsMatch2) {
    const jsFilename = jsMatch2[1];
    const jsFilePath = path.join(distPath, 'assets', jsFilename);
    console.log(`Inlining JS (fallback): ${jsFilePath}`);
    if (fs.existsSync(jsFilePath)) {
      const jsContent = fs.readFileSync(jsFilePath, 'utf-8');
      htmlContent = htmlContent.replace(jsMatch2[0], () => `<script type="module">${jsContent}</script>`);
    }
  }
}

if (cssMatch) {
  const cssFilename = cssMatch[1];
  const cssFilePath = path.join(distPath, 'assets', cssFilename);
  console.log(`Inlining CSS: ${cssFilePath}`);
  if (fs.existsSync(cssFilePath)) {
    const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
    // Reemplazamos el tag link por un tag style inline usando una función
    htmlContent = htmlContent.replace(cssRegex, () => `<style>${cssContent}</style>`);
  } else {
    console.error(`Archivo CSS no encontrado: ${cssFilePath}`);
  }
} else {
  // Regex alternativa por si acaso
  const cssRegex2 = /<link\s+[^>]*href="[^"]*\/assets\/([^"]+\.css)"[^>]*>/i;
  const cssMatch2 = htmlContent.match(cssRegex2);
  if (cssMatch2) {
    const cssFilename = cssMatch2[1];
    const cssFilePath = path.join(distPath, 'assets', cssFilename);
    console.log(`Inlining CSS (fallback): ${cssFilePath}`);
    if (fs.existsSync(cssFilePath)) {
      const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
      htmlContent = htmlContent.replace(cssMatch2[0], () => `<style>${cssContent}</style>`);
    }
  }
}

// Escribimos el archivo final en múltiples rutas para que el botón de descarga y la build tengan la versión real idéntica inlined
const outputPath1 = path.join(process.cwd(), 'standalone-app.html');
const outputPath2 = path.join(process.cwd(), 'public', 'standalone_radio.html');
const outputPath3 = path.join(process.cwd(), 'dist', 'standalone_radio.html');

fs.writeFileSync(outputPath1, htmlContent, 'utf-8');
console.log(`Guardado en: ${outputPath1}`);

// Asegurar que la carpeta public existe (debería existir)
if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
}
fs.writeFileSync(outputPath2, htmlContent, 'utf-8');
console.log(`Guardado en: ${outputPath2}`);

// Asegurar que la carpeta dist existe (debería existir tras el build)
if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
  fs.writeFileSync(outputPath3, htmlContent, 'utf-8');
  console.log(`Guardado en: ${outputPath3}`);
}

console.log(`\n¡Éxito total! Se ha exportado la app idéntica en todas las rutas.`);
