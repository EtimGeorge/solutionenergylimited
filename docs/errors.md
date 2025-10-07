Solution Energy Local Dev reCAPTCHA
SITE KEY: 6LcYieErAAAAAA8kxDf3bk5djZ5tbp2TO7T2nCVF
SECRETE KEY: 6LcYieErAAAAAHOMUdInp6hBPQBatYiikjR3Vr3K

FOR PRODUCTION
Solution Energy Website reCAPTCHA
SITE KEY: 6LcXkeErAAAAAI6JHRuUckmYrIGcLg992-oZGkju
SECRETE KEY: 6LcXkeErAAAAAJfHTxm3f2U0xxyrZftcEvIhULVy





Verifying the user's response

bookmark_border
Spark icon
AI-generated Key Takeaways
This page explains how to verify a user's response to a reCAPTCHA challenge from your application's backend.

For web users, you can get the user’s response token in one of three ways:

g-recaptcha-response POST parameter when the user submits the form on your site
grecaptcha.getResponse(opt_widget_id) after the user completes the reCAPTCHA challenge
As a string argument to your callback function if data-callback is specified in either the g-recaptcha tag attribute or the callback parameter in the grecaptcha.render method
For Android library users, you can call the SafetyNetApi.RecaptchaTokenResult.getTokenResult() method to get response token if the status returns successful.

Token Restrictions
Each reCAPTCHA user response token is valid for two minutes, and can only be verified once to prevent replay attacks. If you need a new token, you can re-run the reCAPTCHA verification.

After you get the response token, you need to verify it within two minutes with reCAPTCHA using the following API to ensure the token is valid.

API Request
URL: https://www.google.com/recaptcha/api/siteverify

METHOD: POST

POST Parameter	Description
secret	Required. The shared key between your site and reCAPTCHA.
response	Required. The user response token provided by the reCAPTCHA client-side integration on your site.
remoteip	Optional. The user's IP address.
API Response
The response is a JSON object:


{
  "success": true|false,
  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
  "error-codes": [...]        // optional
}
For reCAPTCHA Android:


{
  "success": true|false,
  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  "apk_package_name": string, // the package name of the app where the reCAPTCHA was solved
  "error-codes": [...]        // optional
}
Error code reference
Error code	Description
missing-input-secret	The secret parameter is missing.
invalid-input-secret	The secret parameter is invalid or malformed.
missing-input-response	The response parameter is missing.
invalid-input-response	The response parameter is invalid or malformed.
bad-request	The request is invalid or malformed.
timeout-or-duplicate	The response is no longer valid: either is too old or has been used previously.
Was this helpful?





Verifying the user's response

bookmark_border
Spark icon
AI-generated Key Takeaways
This page explains how to verify a user's response to a reCAPTCHA challenge from your application's backend.

For web users, you can get the user’s response token in one of three ways:

g-recaptcha-response POST parameter when the user submits the form on your site
grecaptcha.getResponse(opt_widget_id) after the user completes the reCAPTCHA challenge
As a string argument to your callback function if data-callback is specified in either the g-recaptcha tag attribute or the callback parameter in the grecaptcha.render method
For Android library users, you can call the SafetyNetApi.RecaptchaTokenResult.getTokenResult() method to get response token if the status returns successful.

Token Restrictions
Each reCAPTCHA user response token is valid for two minutes, and can only be verified once to prevent replay attacks. If you need a new token, you can re-run the reCAPTCHA verification.

After you get the response token, you need to verify it within two minutes with reCAPTCHA using the following API to ensure the token is valid.

API Request
URL: https://www.google.com/recaptcha/api/siteverify

METHOD: POST

POST Parameter	Description
secret	Required. The shared key between your site and reCAPTCHA.
response	Required. The user response token provided by the reCAPTCHA client-side integration on your site.
remoteip	Optional. The user's IP address.
API Response
The response is a JSON object:


{
  "success": true|false,
  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
  "error-codes": [...]        // optional
}
For reCAPTCHA Android:


{
  "success": true|false,
  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  "apk_package_name": string, // the package name of the app where the reCAPTCHA was solved
  "error-codes": [...]        // optional
}
Error code reference
Error code	Description
missing-input-secret	The secret parameter is missing.
invalid-input-secret	The secret parameter is invalid or malformed.
missing-input-response	The response parameter is missing.
invalid-input-response	The response parameter is invalid or malformed.
bad-request	The request is invalid or malformed.
timeout-or-duplicate	The response is no longer valid: either is too old or has been used previously.
Was this helpful?