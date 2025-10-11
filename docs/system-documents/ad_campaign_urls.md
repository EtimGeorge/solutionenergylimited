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

**Why use them with a Pixel?** While the Meta Pixel tracks on-site actions for Facebook's system, UTMs provide universal, detailed source data for your *own* analytics (like Google Analytics), allowing you to compare Facebook's performance directly against Google's, LinkedIn's, and others.

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
