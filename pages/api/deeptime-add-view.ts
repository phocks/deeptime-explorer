
import Airtable from 'airtable';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
  'appkhnPIrdnWik2H1'
);

// async function fetchData() {
//   let combinedRecords = [];

//   const err = await base('views')
//     .select({
//       // maxRecords: 100,
//       view: 'Grid view'
//     })
//     .eachPage(function page(records, fetchNextPage) {
//       // This function (`page`) will get called for each page of records.

//       records.forEach(function (record) {
//         const { _rawJson } = record;
//         combinedRecords.push(_rawJson);
//       });

//       // To fetch the next page of records, call `fetchNextPage`.
//       // If there are more records, `page` will get called again.
//       // If there are no more records, `done` will get called.
//       fetchNextPage();
//     });

//   if (err) {
//     console.error(err);
//     return;
//   } else {
//     return combinedRecords;
//   }
// }

// // export async function get({ params }) {
// //   const records = await fetchData();

// //   return {
// //     body: records
// //   };
// // }

// export async function post({ body }) {
  

//   console.log(body);
//   const records = await fetchData();

//   if (body?.name && body?.data) {
//     const { name, data } = body;
//     const response = await base('views').create([
//       {
//         fields: {
//           name: name,
//           data: data
//         }
//       }
//     ]);

//     console.log(response);
//   }

//   return {
//     status: 200,
//     body: { message: 'Data probably inserted...' }
//   };
// }


export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Process a POST request
      console.log(req.body);

      const {body} = req;

      if (body?.name && body?.data) {
            const { name, data } = body;
            const response = await base('views').create([
              {
                fields: {
                  name: name,
                  data: data
                }
              }
            ]);
        
            console.log(response);
          }
        
          

          res.status(200).json({ message: "Data probably inserted..." })
    } else {
      // Handle any other HTTP method
      res.status(200).json({ message: "Use POST" })
    }
  }
  
