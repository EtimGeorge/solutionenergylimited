ALTER TABLE form_submissions
ADD COLUMN status VARCHAR(20) DEFAULT 'new',
ADD COLUMN qualification_notes TEXT,
ADD COLUMN gemini_score NUMERIC(3, 2),
ADD COLUMN source VARCHAR(20) DEFAULT 'webform';
