# Production URLs for Ad Campaigns

This document provides complete, production-ready URLs for use in various online advertising platforms. These URLs include UTM (Urchin Tracking Module) parameters, which are essential for tracking the effectiveness of your campaigns in analytics tools like Google Analytics.

## Understanding UTM Parameters

A URL with UTM parameters looks like this:
`https://solutionenergylimited.com/campaign-landing.html?utm_source=facebook&utm_campaign=iso_q4_2025`

-   **`?`**: Separates the main URL from the tracking parameters.
-   **`utm_source`**: Identifies the source of the traffic (e.g., `facebook`, `linkedin`, `google`).
-   **`&`**: Separates each UTM parameter.
-   **`utm_campaign`**: A name you create for your specific campaign (e.g., `iso_global_opportunities`).
-   **`utm_medium`**: The marketing medium (e.g., `cpc` for paid ads, `social` for organic posts, `email` for newsletters).
-   **`utm_content`**: (Optional) Differentiates ads within the same campaign (e.g., `video_ad` vs. `image_ad`).

---

## How to Track Campaign Results

For a complete picture of your ad performance, you should use a combination of universal tracking (UTMs with Google Analytics) and platform-specific tracking (the Meta Pixel).

### 1. Google Analytics (for UTM Tracking)

The primary platform to see the results from your UTM parameters and compare all your marketing channels is **Google Analytics**.

**How It Works:**
1.  **Set Up**: Add your Google Analytics tracking code to the `<head>` of all your HTML pages.
2.  **Data Capture**: When a user lands on your site via a UTM link, Google Analytics reads the parameters.
3.  **Reporting**: In your Google Analytics dashboard, go to **Reports > Acquisition > Traffic acquisition**. Set the primary dimension to **"Session campaign"** to see metrics for each of your `utm_campaign` values (e.g., `iso_global_opportunities`, `iso_trusted_partner_nigeria`).

### 2. Meta Pixel (for Facebook & Instagram Ads)

The Meta Pixel is a piece of JavaScript code from Facebook that you also add to your website. It is essential for running effective ads on Facebook and Instagram.

**What It Does:**
-   **Conversion Tracking**: It reports back to Facebook Ads Manager when a user takes a specific action (like submitting your form). This tells you how effective your ads are at generating leads.
-   **Ad Optimization**: By tracking conversions, it allows Facebook's algorithm to learn what kind of user is likely to convert and then show your ads to more people like them.
-   **Retargeting**: It allows you to create "Custom Audiences" of people who have visited your landing page, so you can show them follow-up ads later.

**How It Works with UTMs:**
The Pixel and UTMs work together perfectly:
-   The **Pixel** answers: "Did my Facebook ad lead to a conversion?" (Viewed inside Facebook Ads Manager).
-   **UTMs** answer: "How did my Facebook campaign's conversion rate compare to my LinkedIn campaign?" (Viewed inside Google Analytics).

**Setup Steps:**
1.  **Create a Pixel** in your Facebook Events Manager.
2.  **Install the Pixel Code** by adding the provided JavaScript snippet to the `<head>` of all your HTML pages.
3.  **Set Up Events**: Configure a "Lead" event to fire when a user successfully submits a form. This tells Facebook that a conversion has occurred.

### 3. LinkedIn Insight Tag

The equivalent for LinkedIn is the **LinkedIn Insight Tag**. It's a piece of JavaScript code that you add to your website to unlock powerful campaign reporting and audience insights.

**What It Does:**
-   **Conversion Tracking**: Tracks when a LinkedIn member clicks your ad and completes a key action on your site, like submitting the form.
-   **Website Demographics**: Provides valuable, anonymous demographic data about your website visitors, including their job titles, industries, and company sizes. This is extremely useful for B2B marketing.
-   **Retargeting (Matched Audiences)**: Enables you to build audiences of your website visitors to show them follow-up ads on LinkedIn.

**How It Works with UTMs:**
-   The **Insight Tag** answers: "What are the job titles of the people visiting my landing page from my LinkedIn ad?" (Viewed inside LinkedIn Campaign Manager).
-   **UTMs** answer: "Did my LinkedIn campaign generate more leads than my Facebook campaign?" (Viewed inside Google Analytics).

**Setup Steps:**
1.  Go to your **LinkedIn Campaign Manager**.
2.  Navigate to **Account Assets > Insight Tag**.
3.  Copy the JavaScript code snippet provided.
4.  Paste the snippet into the `<head>` of all your HTML pages.
5.  Set up **Conversion Tracking** in Campaign Manager to define a "Lead" or "Submit" conversion event that fires when your form is successfully submitted.

**Best Practice:** Use both. The Pixel optimizes your ad performance within Meta's ecosystem, while UTMs give you a clear, comparable view of all your marketing efforts in Google Analytics.

---

## Ready-to-Use URLs

**Base URL:** `https://solutionenergylimited.com/campaign-landing.html`

### Facebook Ad URLs

*   **For a campaign focused on "Global Opportunities" (e.g., using a video ad):**
    ```
    https://solutionenergylimited.com/campaign-landing.html?utm_source=facebook&utm_medium=cpc&utm_campaign=iso_global_opportunities&utm_content=video_ad
    ```

*   **For a campaign focused on "Operational Excellence" (e.g., using a carousel ad):**
    ```
    https://solutionenergylimited.com/campaign-landing.html?utm_source=facebook&utm_medium=cpc&utm_campaign=iso_operational_excellence&utm_content=carousel_ad
    ```

### Instagram Ad URLs

*   **For an ad placed in Instagram Stories:**
    ```
    https://solutionenergylimited.com/campaign-landing.html?utm_source=instagram&utm_medium=cpc&utm_campaign=iso_global_opportunities&utm_content=story_ad
    ```

*   **For an ad placed in the main Instagram Feed:**
    ```
    https://solutionenergylimited.com/campaign-landing.html?utm_source=instagram&utm_medium=cpc&utm_campaign=iso_trusted_partner&utm_content=feed_image_ad
    ```

### LinkedIn Ad URLs

*   **For a Sponsored Content ad targeting Nigerian managers:**
    ```
    https://solutionenergylimited.com/campaign-landing.html?utm_source=linkedin&utm_medium=cpc&utm_campaign=iso_trusted_partner_nigeria&utm_content=sponsored_content
    ```

*   **For a Message Ad (InMail) sent to CEOs:**
    ```
    https://solutionenergylimited.com/campaign-landing.html?utm_source=linkedin&utm_medium=inmail&utm_campaign=iso_excellence_ceo&utm_content=message_ad
    ```

---
### How to Customize

You can create your own URLs by changing the values after the `=` sign. For example, for a new Christmas campaign on LinkedIn, you might use:

`...html?utm_source=linkedin&utm_medium=cpc&utm_campaign=iso_christmas_promo&utm_content=main_banner`

---

## How to View Campaign Results

The primary platform to see the results from your UTM parameters is **Google Analytics**.

### How It Works

1.  **Set Up Google Analytics**: You must have a Google Analytics account and add its tracking code (a small JavaScript snippet) to the `<head>` of all your HTML pages.
2.  **Data Capture**: When a user clicks your ad, they land on your page with the full URL (including UTMs). The Google Analytics script on your page reads these parameters.
3.  **Reporting**: Google Analytics automatically categorizes the user's session with the source, medium, and campaign information you provided.

### Where to Find the Reports

Inside your Google Analytics dashboard, navigate to:

**Reports > Acquisition > Traffic acquisition**

In this report, you can analyze your campaign performance. Set the "Primary dimension" to **"Session campaign"** to see metrics for each of your `utm_campaign` values (e.g., `iso_global_opportunities`, `iso_trusted_partner_nigeria`).

This will allow you to see exactly how many users, new users, sessions, and conversions each specific ad campaign is generating, enabling you to measure your return on investment accurately.

