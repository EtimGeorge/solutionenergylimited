  }                                                                                                    │
 │    102                                                                                                        │
 │    103   // reCAPTCHA is completely bypassed for now                                                          │
 │    104 - logger.warn('reCAPTCHA is completely bypassed on server.');                                          │
 │    104 + logger.warn('reCAPTCHA is completely bypassed for now.');                                            │
 │    105                                                                                                        │
 │    106 + // 2. reCAPTCHA Verification                                                                         │
 │    107 + const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;                                         │
 │    108 + const recaptchaResponse = req.body.recaptchaToken; // Assuming token is sent in body                 │
 │    109 +                                                                                                      │
 │    110 + if (!recaptchaResponse) {                                                                            │
 │    111 +     logger.warn('reCAPTCHA token missing from submission.');                                         │
 │    112 +     return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed: Token     │
 │        missing.' });                                                                                          │
 │    113 + }                                                                                                    │
 │    114 +                                                                                                      │
 │    115   try {                                                                                                │
 │    116 +     const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=              │
 │        ${recaptchaSecretKey}&response=${recaptchaResponse}`;                                                  │
 │    117 +     const recaptchaRes = await fetch(recaptchaVerifyUrl, { method: 'POST' });                        │
 │    118 +     const recaptchaData = await recaptchaRes.json();                                                 │
 │    119 +                                                                                                      │
 │    120 +     if (!recaptchaData.success || recaptchaData.score < 0.5) { // Adjust score threshold as needed   │
 │    121 +         logger.warn('reCAPTCHA verification failed or low score', { score: recaptchaData.score,      │
 │        errors: recaptchaData['error-codes'] });                                                               │
 │    122 +         return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed.       │
 │        Please try again.' });                                                                                 │
 │    123 +     }                                                                                                │
 │    124 +     logger.info('reCAPTCHA verification successful', { score: recaptchaData.score });                │
 │    125 + } catch (recaptchaError) {                                                                           │
 │    126 +     logger.error('reCAPTCHA verification API error:', { message: recaptchaError.message, stack:      │
 │        recaptchaError.stack });                                                                               │
 │    127 +     return res.status(500).json({ success: false, message: 'reCAPTCHA service error. Please try      │
 │        again later.' });                                                                                      │
 │    128 + }                                                                                                    │
 │    129 +                                                                                                      │
 │    130 + try {                                                                                                │
 │    131       // 3. Database Insertion                                                                         │
 │    132       const standardsArray = Array.isArray(standard) ? standard : (standard ? [standard] : []);        │
 │    133       if (standard_other) { 