// Helpers compartidos para los scripts CLI de admin de recursos.
// Cero dependencias externas — stdlib pura.

import { readFile, writeFile, stat, copyFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const SCRIPTS_DIR = path.dirname(path.dirname(__filename));
export const ROOT = path.dirname(SCRIPTS_DIR);

export const PATHS = {
  areasJson: path.join(ROOT, 'src/data/areas.json'),
  resourcesJson: path.join(ROOT, 'src/data/resources.json'),
  publicResources: path.join(ROOT, 'public/resources'),
};

export const VALID_TIPOS = ['prompt', 'plantilla', 'framework', 'checklist', 'skill', 'sop'];

export async function readJson(filePath) {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function writeJson(filePath, data) {
  const json = JSON.stringify(data, null, 2);
  await writeFile(filePath, json + '\n', 'utf-8');
}

export function formatBytes(bytes) {
  if (bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export async function fileExists(p) {
  try {
    await access(p, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function copyResourceFile(srcPath, slug) {
  const ext = path.extname(srcPath) || '.md';
  const fileName = `${slug}${ext}`;
  const dest = path.join(PATHS.publicResources, fileName);
  await copyFile(srcPath, dest);
  const s = await stat(dest);
  return { fileName, sizeBytes: s.size };
}

export async function loadAreas() {
  return readJson(PATHS.areasJson);
}

export async function loadResources() {
  return readJson(PATHS.resourcesJson);
}

export async function saveAreas(arr) {
  return writeJson(PATHS.areasJson, arr);
}

export async function saveResources(arr) {
  return writeJson(PATHS.resourcesJson, arr);
}

// Mini parser de argv estilo --key value / --flag
export function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (tok.startsWith('--')) {
      const key = tok.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(tok);
    }
  }
  return { positional, flags };
}
