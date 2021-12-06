import Airtable from "airtable";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
  "appkhnPIrdnWik2H1"
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    console.log(req.body);

    const { body } = req;

    if (body?.name && body?.data) {
      const { name, data } = body;
      const response = await base("views").create([
        {
          fields: {
            name: name,
            data: data,
          },
        },
      ]);

      console.log(response);
    }

    res.status(200).json({ message: "Data probably inserted..." });
  } else {
    // Handle any other HTTP method
    res.status(200).json({ message: "Use POST" });
  }
}
