const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./migrated_prompt_history/prompt_2026-02-08T03:42:35.753Z.json', 'utf8'));

for (let i = 0; i < data.length; i++) {
  const m = data[i];
  if (m.payload) {
    if (m.payload.text) {
      console.log(`MSG ${i}: ${m.payload.text.substring(0, 150).replace(/\n/g, ' ')}`);
    }
    if (m.payload.files && m.payload.files.length) {
      console.log(`MSG ${i} has files!`);
      m.payload.files.forEach(f => console.log(f.name || f.fileName || "unknown name"));
    }
  }
}
