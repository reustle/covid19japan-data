// One off tool to inspect the data

const fs = require("fs");

const main = () => {
  const latest = JSON.parse(fs.readFileSync("docs/patient_data/latest.json"));
  const tokyoPatients = latest.filter((p) => p.detectedPrefecture == "Tokyo");
  for (const p of tokyoPatients) {
    console.log(p.dateAnnounced);
  }
  console.log(tokyoPatients.length);
};

main();
