📦 GitHub Webhook Deployment Automation
This project sets up an automated deployment pipeline using GitHub webhooks, Node.js, and PM2 to streamline the process of deploying code updates from the master branch.

🚀 Features
Automated Deployment: Automatically deploys the latest changes pushed to the master branch.
Secure Signature Verification: Verifies the integrity of GitHub webhook requests using HMAC signatures.
Comprehensive Logging: Logs all deployment activities for easy monitoring and debugging.
Seamless Reloads: Uses PM2 for zero-downtime reloads of the Node.js application.
🛠️ Tech Stack
Node.js
Express.js
Crypto (for HMAC signature verification)
PM2 (for process management)
Bash (for deployment script)
GitHub Webhooks
📂 Project Structure
perl
Copy code
├── server.js                # Webhook listener in Node.js
├── deploy.sh                # Bash script for deployment
├── socket/                  # Directory for the socket service
├── deploy.log               # Log file for deployment activities
└── README.md                # Project documentation
⚙️ Setup
1. Clone the repository
bash
Copy code
git clone git@github.com:mojahid0862/GitHub-Deployments-with-a-Webhook.git
cd your-repo-name
2. Install dependencies
bash
Copy code
npm install
3. Set up environment variables
Define your secret key for the HMAC signature in server.js:

js
Copy code
const SECRET = 'your-secret-key'; // Change this to your own secret key
4. Start the webhook server
bash
Copy code
node server.js
5. Configure GitHub Webhook
Go to your GitHub repository settings.
Navigate to Webhooks > Add webhook.
Set the Payload URL to your server URL (e.g., http://your-server-ip:4000/github-webhook).
Choose application/json as the content type.
Add your secret (same as the SECRET in server.js).
Select Just the push event.
📜 Deployment Script (deploy.sh)
The deploy.sh script handles the following tasks:

Pulls the latest code from the master branch.
Installs project dependencies (npm install).
Builds the main project (npm run build).
Installs dependencies for the socket service.
Reloads the application using PM2.
Example of deploy.sh:
bash
Copy code
#!/bin/bash
cd /home/ubuntu/paper-trade

LOG_FILE="/home/ubuntu/paper-trade/deploy.log"

echo "Starting deployment..." >> $LOG_FILE
date >> $LOG_FILE

git pull origin master >> $LOG_FILE 2>&1
npm install --omit=dev >> $LOG_FILE 2>&1
npm run build >> $LOG_FILE 2>&1

cd ./socket || { echo "Failed to change directory to ./socket" >> $LOG_FILE; exit 1; }
npm install --omit=dev >> $LOG_FILE 2>&1

pm2 reload all >> $LOG_FILE 2>&1

echo "Deployment completed." >> $LOG_FILE
date >> $LOG_FILE
🛡️ Security
The webhook request is verified using HMAC with SHA-256 hashing. If the signature in the x-hub-signature-256 header does not match, the request is rejected with a 403 status.

js
Copy code
function verifySignature(req, res, buf) {
  const signature = `sha256=${crypto
    .createHmac('sha256', SECRET)
    .update(buf)
    .digest('hex')}`;

  if (req.headers['x-hub-signature-256'] !== signature) {
    return res.status(403).send('Invalid signature');
  }
}
🚀 Usage
Push changes to the master branch of your GitHub repository.
The webhook server receives the push event and triggers deploy.sh.
The latest code is pulled, dependencies are installed, and the app is reloaded using PM2.
📝 Logging
All actions are logged in deploy.log:

bash
Copy code
cat /home/ubuntu/paper-trade/deploy.log
This log file helps in tracking the deployment process and debugging if something goes wrong.

🔧 Troubleshooting
Invalid Signature Error: Ensure that the secret in your GitHub webhook settings matches the SECRET in server.js.
PM2 Not Found: Make sure PM2 is installed globally (npm install -g pm2).
Permissions Issues: Ensure the script has executable permissions (chmod +x deploy.sh).
📖 Contributing
Feel free to open issues or submit pull requests for improvements and fixes.