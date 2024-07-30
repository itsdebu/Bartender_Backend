const express = require('express');
const bodyParser = require('body-parser');
const { NtlmClient } = require('axios-ntlm');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/print-labels', (req, res) => {
  const { printerName, copies, labelPath, items } = req.body;

  items.forEach(item => {
    printLabel(item, printerName, copies, labelPath)
      .catch(error => {
        console.error('Error printing label:', error);
      });
  });

  res.send('Print job submitted.');
});

const printLabel = async (item, printerName, copies, labelPath) => {
  const namedDataSources = { ...item }; // Using all item fields as NamedDataSources

  const data = {
    PrintBTWAction: {
      DocumentFile: labelPath,
      Printer: printerName,
      Copies: copies,
      PrintToFileFolder: 'C:\\Users\\Divyanshu\\Desktop\\bartender_automation',
      PrintToFileFileName: 'Testing.pdf',
      VerifyPrintJobIsComplete: true,
      NamedDataSources: namedDataSources
    }
  };
  console.log(data);

  const credentials = {
    username: 'Divyanshu',
    password: '?'
  };

  const axiosConfig = {
    baseURL: 'http://localhost:5159'
  };

  const axiosInstance = NtlmClient(credentials, axiosConfig);

  try {
    const response = await axiosInstance.post('/api/actions', data);
    console.log('Label printed successfully:', response.data);
  } catch (error) {
    console.error('Error printing label:', error);
    throw error;
  }
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
