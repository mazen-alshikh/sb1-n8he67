import { readFileSync } from 'fs';

export async function validateResourceData(filePath, type) {
  const content = readFileSync(filePath, 'utf-8');

  try {
    const data = JSON.parse(content);
    await validateSchema(data, type);
    return data;
  } catch (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
}

async function validateSchema(data, type) {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }

  const validators = {
    quran: validateQuranEntry,
    hadith: validateHadithEntry
  };

  const validator = validators[type];
  if (!validator) {
    throw new Error('Invalid resource type');
  }

  data.forEach(validator);
}

function validateQuranEntry(entry) {
  const required = ['chapter', 'verse', 'text'];
  validateRequiredFields(entry, required);
}

function validateHadithEntry(entry) {
  const required = ['book', 'number', 'text'];
  validateRequiredFields(entry, required);
}

function validateRequiredFields(entry, required) {
  const missing = required.filter(field => !entry[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}