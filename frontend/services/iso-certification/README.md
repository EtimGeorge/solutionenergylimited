


          
Let's search for all HTML forms to identify where we need to add form identifiers.
        
            
toolName: search_by_regex
            
status: success
          
          
Let's examine the form structures to add unique identifiers and hidden input fields for form identification.
        
            
toolName: view_files
            
status: success
          
            
filePath: c:\Users\user\Desktop\solutionenrgylimited\services\iso-certification\contact.html
c:\Users\user\Desktop\solutionenrgylimited\services\iso-certification\certification.html
          
I'll help you add form identifiers to all your forms that use the Formspree endpoint. Here are the necessary changes for each form:

1. For the general inquiry form in contact.html:
```html:c:\Users\user\Desktop\solutionenrgylimited\services\iso-certification\contact.html
<form id="contact-form" class="contact-form" action="https://formspree.io/f/meogpvoq" method="POST">
    // ... existing code ...
    <!-- Add this hidden field for form identification -->
    <input type="hidden" name="form_type" value="general_inquiry">
    // ... existing code ...
</form>
```

2. For the quote request form in contact.html:
```html:c:\Users\user\Desktop\solutionenrgylimited\services\iso-certification\contact.html
<form id="quote-form" class="contact-form" action="https://formspree.io/f/meogpvoq" method="POST">
    // ... existing code ...
    <!-- Add this hidden field for form identification -->
    <input type="hidden" name="form_type" value="quote_request">
    // ... existing code ...
</form>
```

3. For the support form in contact.html:
```html:c:\Users\user\Desktop\solutionenrgylimited\services\iso-certification\contact.html
<form id="support-form" class="contact-form" action="https://formspree.io/f/meogpvoq" method="POST">
    // ... existing code ...
    <!-- Add this hidden field for form identification -->
    <input type="hidden" name="form_type" value="customer_support">
    // ... existing code ...
</form>
```

4. For the certification page form:
```html:c:\Users\user\Desktop\solutionenrgylimited\services\iso-certification\certification.html
<form id="contact-form" class="contact-form" action="https://formspree.io/f/meogpvoq" method="POST">
    // ... existing code ...
    <!-- Add this hidden field for form identification -->
    <input type="hidden" name="form_type" value="certification_inquiry">
    // ... existing code ...
</form>
```

5. For other forms using the same endpoint:
- Process page form: Add `<input type="hidden" name="form_type" value="process_inquiry">`
- Training page form: Add `<input type="hidden" name="form_type" value="training_inquiry">`
- Audit page form: Add `<input type="hidden" name="form_type" value="audit_inquiry">`
- Main contact page form: Add `<input type="hidden" name="form_type" value="main_contact">`
- ISO certification index page form: Add `<input type="hidden" name="form_type" value="iso_index_inquiry">`

Add these hidden input fields just before the submit button in each form. This will help you identify which form was submitted when you receive the email notifications from Formspree. The `form_type` field will be included in the form submission data, making it easy to distinguish between different forms.

Note: The form in `images\SEES-home-hero-image.html` uses a different service (nicepagesrv.com) so it doesn't need this modification.
        