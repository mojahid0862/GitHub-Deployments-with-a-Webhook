const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = 4000;
const SECRET = 'HAHAHA'; 

app.use(bodyParser.json());

function verifySignature(req, res, buf) {
  const signature = `sha256=${crypto
    .createHmac('sha256', SECRET)
    .update(buf)
    .digest('hex')}`;

  if (req.headers['x-hub-signature-256'] !== signature) {
    return res.status(403).send('Invalid signature');
  }
}

app.post('/github-webhook', bodyParser.json({ verify: verifySignature }), (req, res) => {
  const payload = req.body;

  if (payload.ref === 'refs/heads/master') {
    // Respond immediately to GitHub
    res.sendStatus(200);

    // Run the deploy script in the background
    exec('/home/ubuntu/path/deploy.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Deployment error: ${error}`);
        return;
      }
      console.log(`Deployment output: ${stdout}`);
      if (stderr) console.error(`Deployment stderr: ${stderr}`);
    });
  } else {
    res.sendStatus(200); 
  }
});

app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});