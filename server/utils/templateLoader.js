import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import branding from '../config/branding.js';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, '../templates');

/**
 * Vasavi Mart - Email Template Rendering Engine
 */

export const renderTemplate = async (templateName, data = {}) => {
  try {
    // Try emails subdirectory first, then root templates
    let filePath = path.join(TEMPLATE_DIR, 'emails', `${templateName}.html`);
    
    try {
      await fs.access(filePath);
    } catch (e) {
      filePath = path.join(TEMPLATE_DIR, `${templateName}.html`);
    }

    let html = await fs.readFile(filePath, 'utf-8');

    // Merge dynamic data with branding defaults
    const mergedData = {
      ...branding,
      ...data,
      year: new Date().getFullYear()
    };

    // Simple interpolation: {{variable}}
    html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (mergedData[key] === undefined) {
        logger.warn(`Missing template variable: ${key} in ${templateName}`);
        return match;
      }
      return mergedData[key];
    });

    return html;
  } catch (error) {
    logger.error(`Failed to render template: ${templateName}`, error);
    throw new Error(`Template rendering failed for ${templateName}`);
  }
};
