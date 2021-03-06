import Airtable from "airtable";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
  "appkhnPIrdnWik2H1"
);

const handler = async (req, res) => {
  const { method } = req;

  if (method !== "POST") {
    res.status(200).json({ message: "Please use a POST request..." });
    return;
  }

  const { body } = req;

  console.log("Got body:", body);

  if (!body.id && !body.config) {
    res.status(400).json({ message: "We need an 'id' and 'data'" });
    return;
  }

  const { id, config } = body;

  const records: any = await base("all-views")
    .select({
      maxRecords: 1,
      view: "Grid view",
      filterByFormula: `{id} = '${id}'`,
    })
    .all();

  if (records.length === 0) {
    // Create a new record
    const response = await base("all-views").create({
      id: id,
      config: config,
    });

    console.log(response);

    res.status(200).json({ message: "Creating new record..." });
  } else {
    // Record already in there
    const record = records[0];

    // Check if we are deleting
    const { deleted } = body;

    if (deleted) {
      const response = await base("all-views").update(record.id, {
        id: id,
        config: config,
        deleted: deleted ? deleted : false,
      });

      res.status(200).json({ message: "Record set as deleted" });
      return;
    }

    // See if changed
    const configOnAirtable = record.get("config");
    if (configOnAirtable === config) {
      res.status(200).json({ message: "No changes" });
      return;
    }

    // Update record
    const response = await base("all-views").update(record.id, {
      id: id,
      config: config,
      deleted: false,
    });

    console.log(response);

    res.status(200).json({ message: "Record update!" });
  }
};

export default handler;
