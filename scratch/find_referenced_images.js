import fs from 'fs';
import readline from 'readline';

async function searchTranscript() {
  const fileStream = fs.createReadStream('C:/Users/escom/.gemini/antigravity/brain/866b4843-f45a-4d4a-965d-e1d706d8cba8/.system_generated/logs/transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    // Let's search for references to "_referencias" or copy file/write file tools with references
    if (line.includes('_referencias') && lineCount < 240) {
      console.log(`Line ${lineCount}:`);
      try {
        const obj = JSON.parse(line);
        console.log(`  Source: ${obj.source}, Type: ${obj.type}`);
        console.log(`  Content snippet: ${JSON.stringify(obj.content || '').substring(0, 300)}`);
        if (obj.tool_calls) {
          console.log(`  Tool Calls: ${JSON.stringify(obj.tool_calls)}`);
        }
      } catch (err) {
        console.log(`  Error parsing line ${lineCount}: ${err.message}`);
      }
    }
  }
}

searchTranscript();
