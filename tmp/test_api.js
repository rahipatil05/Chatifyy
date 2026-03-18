async function testApi() {
  try {
    const res = await fetch('https://api.codex.jaagrav.in/');
    const data = await res.text();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
testApi();
