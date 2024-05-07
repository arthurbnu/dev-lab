import sqlite3 from "sqlite3";
const db = new sqlite3.Database("gravures_sqlite.db");

async function getGravures() {
  return new Promise((resolve, reject) => {
    // db.all("SELECT * FROM gravures", (error, rows) => {
    db.all("SELECT TIT, REP, REFG, COM FROM gravures LIMIT 100", (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

var gravures: any;
getGravures().then((g) => {
  gravures = g;
});

export default defineEventHandler(async (event) => {
  await getGravures();
  return {
    result: gravures,
  };
});
