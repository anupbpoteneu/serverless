# serverless
Serverless repo for Lambda Functions


# Serverless Assignment

## Setup Instructions

Follow these steps to set up and deploy the serverless architecture:

1. **Google Cloud APIs Setup:**
   - Enable the required Google Cloud APIs:
     - Cloud Build API
     - Cloud Functions API
     - Cloud Logging API
     - Cloud Pub/Sub API
     - Eventarc API
     - Cloud Run Admin API

2. **Cloud Function Implementation:**
   - Create a Cloud Function triggered by Pub/Sub messages for user account verification.
   - Ensure the Cloud Function sends verification emails with expiring links and tracks sent emails in Cloud SQL.

3. **Pub/Sub Setup:**
   - Create a Pub/Sub topic named "verify_email" and set up a subscription for the Cloud Function.
   - Set the data retention period for the topic to 7 days.

4. **Web Application Updates:**
   - Update the web application to publish messages to the "verify_email" Pub/Sub topic when new user accounts are created.
   - Ensure the message payload contains necessary information for the Cloud Function to send verification emails.

The Cloud Function handles email verification and tracking of sent emails. Additionally, the function's source code is stored in a Google Storage bucket to be accessed and executed by the Cloud Function.

For more information on Google Cloud Functions, refer to the [Google Cloud Functions documentation](https://cloud.google.com/functions/docs/concepts/overview#:~:text=Google%20Cloud%20Functions%20is%20a,event%20being%20watched%20is%20fired).