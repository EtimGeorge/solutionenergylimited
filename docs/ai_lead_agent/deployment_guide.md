### **Part 1: Deploy the Customer Service Agent (`cs_agent`)**

This agent will be a **Web Service**, as it needs to receive HTTP requests from your Node.js backend.

1.  **Log in to Render** and go to your Dashboard.
2.  Click **New +** and select **Web Service**.
3.  **Connect your Git repository** (`solutionenergylimited`).
4.  On the settings page, fill in the following:
    *   **Name:** `seesl-cs-agent` (or a name of your choice).
    *   **Region:** Choose a region close to your users.
    *   **Branch:** `main` (or your primary branch).
    *   **Root Directory:** `python-agents`
    *   **Runtime:** `Python 3`.
    *   **Build Command:** `pip install -r requirements.txt && python cs_agent/build_kb.py`
    *   **Start Command:** `uvicorn cs_agent.main:app --host 0.0.0.0 --port $PORT`
    *   **Instance Type:** `Free` or `Starter` is likely sufficient to begin.

5.  Click **Advanced** and then click **Add Environment Variable** for each of the following, copying the values from your local `.env` file:
    *   `GEMINI_API_KEY`
    *   `AGENT_API_KEY`
    *   `DATABASE_URL` (Use the **internal** connection string for your Render database if applicable).
    *   `RESEND_API_KEY`
    *   `RESEND_FROM_EMAIL`
    *   `RECIPIENT_EMAIL`

6.  Click **Create Web Service**. Render will now build and deploy your agent. Once it's live, Render will provide you with a URL (e.g., `https://seesl-cs-agent.onrender.com`). **Copy this URL.**

### **Part 2: Deploy the Lead Qualification Agent (`lead_qualifier`)**

This agent will be a **Background Worker**, as it needs to run continuously.

1.  Go back to the Render Dashboard.
2.  Click **New +** and select **Background Worker**.
3.  **Connect the same Git repository.**
4.  On the settings page:
    *   **Name:** `seesl-lead-qualifier`
    *   **Region:** Use the same region as your other services.
    *   **Branch:** `main`
    *   **Root Directory:** `python-agents`
    *   **Runtime:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `python lead_qualifier/main.py`
    *   **Instance Type:** `Free` or `Starter`.

5.  Just as before, go to **Advanced** and add the **exact same environment variables** as you did for the `cs_agent`. The background worker also needs all these keys to connect to the database, Gemini, and Resend.
6.  Click **Create Background Worker**.

### **Part 3: Connect the Backend to the New Agent**

Finally, you need to tell your Node.js backend the address of your new Customer Service Agent.

1.  In Render, go to the settings for your **Node.js backend** service (`solutionenergylimited`).
2.  Go to the **Environment** page.
3.  Click **Add Environment Variable** and create a new variable:
    *   **Key:** `PYTHON_AGENT_URL`
    *   **Value:** Paste the URL you copied from the `seesl-cs-agent` Web Service in Part 1, making sure to add `/chat` at the end (e.g., `https://seesl-cs-agent.onrender.com/chat`).

Your entire system is now deployed and interconnected in a production environment.
