const fs = require('fs');
async function testWandbox() {
  try {
    const res = await fetch('https://wandbox.org/api/list.json');
    const data = await res.json();
    const result = data.map(l => ({ name: l.name, language: l.language, version: l.version }));
    fs.writeFileSync('c:/Users/paras/Downloads/code-craft-master/code-craft-master/tmp/wandbox_languages.json', JSON.stringify(result, null, 2));
    console.log("Written successfully");
  } catch (e) {
    console.error(e);
  }
}
testWandbox();
