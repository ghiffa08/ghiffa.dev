/**
 * PDF Generator Utility
 * Lazy-loaded module untuk mengurangi bundle size DashboardHome
 * Split dari DashboardHome.jsx untuk code splitting optimization
 */
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import React from 'react';
import { ATSResume } from '../components/cv-templates/ATSResume';
import { EditorialResume } from '../components/cv-templates/EditorialResume';

/**
 * Generate resume ZIP file containing ATS and Editorial PDF versions
 * @param {Object} resumeData - Resume data object {info, experiences, qualifications}
 * @param {Function} onProgress - Progress callback (message: string) => void
 * @returns {Promise<Blob>} ZIP blob containing both PDF files
 */
export async function generateResumeZip(resumeData, onProgress) {
  if (!resumeData) {
    throw new Error('Resume data is required');
  }

  // Generate ATS PDF blob
  if (onProgress) onProgress('Generating ATS Resume PDF...');
  const atsBlob = await pdf(React.createElement(ATSResume, { data: resumeData })).toBlob();

  // Generate Editorial PDF blob
  if (onProgress) onProgress('Generating Editorial Resume PDF...');
  const editorialBlob = await pdf(React.createElement(EditorialResume, { data: resumeData })).toBlob();

  // Create ZIP archive
  if (onProgress) onProgress('Creating ZIP archive...');
  const zip = new JSZip();
  zip.file('CV_Haikal_Jibran_ATS.pdf', atsBlob);
  zip.file('CV_Haikal_Jibran_Creative.pdf', editorialBlob);
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  
  return zipBlob;
}
