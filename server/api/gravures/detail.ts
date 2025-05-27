// //import sqlite3 from "sqlite3";
// const db = new sqlite3.Database("gravures_sqlite.db");

// type tableConf = {
//   table: string;
//   idLabel: string;
// };

// const config: tableConf[] = [
//   {
//     table: "gravures",
//     idLabel: "REFG",
//   },
//   {
//     table: "bois",
//     idLabel: "REFG",
//   },
//   {
//     table: "dicos",
//     idLabel: "NUM",
//   },
//   {
//     table: "illustrations",
//     idLabel: "NUM",
//   },
//   {
//     table: "livres",
//     idLabel: "REFL",
//   },
// ];

// async function getData(id: string, _table = "bois") {
//   const {table, idLabel} = config.find(tableConf => tableConf.table === _table) as tableConf;
//   return new Promise((resolve, reject) =>
//   db.all(
//     `SELECT ROWID, * FROM ${table} WHERE ${idLabel} = "${id}"`,
//     (error, rows) => error ? reject(error) : resolve(rows)
//   ))
// }

// export default defineEventHandler(async (event) => {
//   const { id, table } = getQuery(event) as { id: string; table: string };
//   const data = await getData(id, table);
//   return {
//     id: id,
//     // table: table,
//     result: data,
//     info: event,
//   };
// });
