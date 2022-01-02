const fs = require("fs");

const main = () => {
  const patients = JSON.parse(fs.readFileSync("docs/patient_data/latest.json"));
  const chiba = patients.filter((p) => (p.detectedPrefecture == "Chiba" && p.patientStatus != "Deceased" && p.patientId == -1));
  console.log(chiba);
  console.log(chiba.length);
};

main();
