const express = require("express");
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors(
    {
      origin: ["https://modbustcp.vercel.app/"],
      methods: ["POST", "GET", "DELETE", "PUT"],
      credentials: true
    }
  ));
  
const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
const plcIP = "192.168.0.137";
const plcPort = 502;
const startAddress = 60;
const quantity = 2; // Number of holding registers to read

app.get("/", (req, res) => {
  //   res.status(200).send("Hello from the server");

  client
    .connectTCP(plcIP, { port: plcPort })
    .then(async () => {
      // console.log('Connected to PLC');

      // Read holding registers
      const data = await client.readHoldingRegisters(startAddress, quantity);
      // console.log('Holding Registers:', data.data); // Data will be an array containing the values of holding registers
      res.status(200).json({ data: data.data });
    })
    .catch((error) => {
      // console.error('Error connecting to PLC:', error);
      res.status(500).json({ error: "Error connecting to PLC" });
    });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening at port ${port}`));
