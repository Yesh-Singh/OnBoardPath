// One-off recovery: scan the Chromium LevelDB log for historical versions of
// the onboardpath:answerFeedback value (JSON objects containing "rating").
import fs from 'node:fs';

const file = 'C:/Users/yeshs/AppData/Roaming/Freebuff/Partitions/freebuff-browser-16dc30eb5b23f856682a-default/Local Storage/LevelDB/000003.log';
const raw = fs.readFileSync(file).toString('latin1');

const candidates = [];
const starts = [];
let idx = 0;
while ((idx = raw.indexOf('{"', idx)) !== -1) { starts.push(idx); idx += 2; }

for (const start of starts) {
  // Walk forward with brace tracking (string-aware) to find the balanced end.
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = start; i < Math.min(raw.length, start + 40000); i++) {
    const ch = raw[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end !== -1) candidates.push(raw.slice(start, end + 1));
}

let best = null;
for (const c of candidates) {
  try {
    const parsed = JSON.parse(c);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const entries = Object.values(parsed);
      if (entries.length && entries.every(e => e && typeof e === 'object' && 'rating' in e)) {
        if (!best || c.length > best.length) best = c;
      }
    }
  } catch { /* not a complete version */ }
}

if (best) {
  fs.writeFileSync('.recovered-feedback.json', best);
  console.log('RECOVERED', best.length, 'chars,', Object.keys(JSON.parse(best)).length, 'entries');
} else {
  console.log('NOT_FOUND');
  process.exit(1);
}
