const fs = require("fs");
const target = "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\api\\index.ts";
const existing = fs.readFileSync(target, "utf8");
console.log("First 20 chars:", existing.substring(0, 20));
console.log("Length:", existing.length);
