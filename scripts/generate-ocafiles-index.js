const fs = require('fs')
const path = require('path')

const ocafilesDir = path.resolve(__dirname, '../public/ocafiles')
const indexPath = path.join(ocafilesDir, 'index.json')

function toLabel(fileName) {
  const base = fileName.replace(/\.ocafile$/i, '')
  const spaced = base
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()

  return spaced
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function generateIndex() {
  if (!fs.existsSync(ocafilesDir)) {
    throw new Error(`Directory not found: ${ocafilesDir}`)
  }

  const entries = fs
    .readdirSync(ocafilesDir)
    .filter(file => file.toLowerCase().endsWith('.ocafile'))
    .sort((a, b) => a.localeCompare(b))
    .map(file => ({
      file,
      label: toLabel(file)
    }))

  fs.writeFileSync(indexPath, `${JSON.stringify(entries, null, 2)}\n`, 'utf8')
  console.log(`Generated ${indexPath} (${entries.length} entries)`)
}

generateIndex()
