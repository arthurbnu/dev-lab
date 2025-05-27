// //import sqlite3 from "sqlite3";
// const db = new sqlite3.Database("gravures_sqlite.db");
// const test = useSqlite()

// type tableConf = {
//   table: string,
//   fields: string[]
// }

// const config: tableConf[] = [
//   {
//     table: "gravures",
//     fields: ['TIT', 'REP', 'REFG'],
//   },
//   {
//     table: "bois",
//     fields: ['TIT', 'REP', 'NIAU', 'DAT', 'REFG'],
//   },
//   {
//     table: "dicos",
//     fields: ['FR', 'DE', 'FRI', 'DEI', 'NUM'],
//   },
//   {
//     table: "illustrations",
//     fields: ['BOIS', 'REPI', 'REPDI', 'NUM'],
//   },
//   {
//     table: "livres",
//     fields: ['BIB', 'AUT', 'TITL', 'DATE', 'NBOI', 'REFL'],
//   },
// ]

// const getSearchLike = (field: string, search: string) => `${field} LIKE '%${search}%'`

// async function getData(table = 'bois', limit = 100, search = '') {
//   const tableData = config.find(tableConf => tableConf.table === table) as tableConf
//   const searchLike = search && "WHERE " + tableData.fields.map(field => getSearchLike(field, search)).join(' OR ') + ' ORDER BY rowid '
//   return new Promise((resolve, reject) =>
//     db.all(
//       `SELECT ROWID, ${tableData.fields} FROM ${tableData.table} ${searchLike} LIMIT ${limit}`,
//       (error, rows) => error ? reject(error) : resolve(rows)
//     ))
//   }

// export default defineEventHandler(async (event) => {
//   const {limit, table, search} = getQuery(event) as {table: string, limit: number, search: string}
//   const data = await getData(table, limit, search)
//   // console.log({
//   //   search: search,
//   //   limit: limit, 
//   //   table: table,
//   //   nb: (data as object[])?.length,
//   //   first: (data as object[])?.[0],
//   //   client: process.client,
//   //   info: event
//   // })
//   return {
//     search: search,
//     limit: limit, 
//     table: table,
//     result: data,
//     // table: query,
//     info: event
//   };
// });
