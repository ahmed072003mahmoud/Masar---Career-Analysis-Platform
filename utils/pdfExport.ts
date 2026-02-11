
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportOptions {
  fileName?: string;
  format?: 'a4' | 'letter';
  orientation?: 'p' | 'l';
}

export const exportToPDF = async (
  elementId: string, 
  options: ExportOptions | string = 'masar-export.pdf'
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  const settings = typeof options === 'string' 
    ? { fileName: options, format: 'a4' as const, orientation: 'p' as const }
    : { fileName: options.fileName || 'masar-export.pdf', format: options.format || 'a4', orientation: options.orientation || 'p' };

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(settings.orientation, 'mm', settings.format);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(settings.fileName);
    return true;
  } catch (error) {
    console.error('PDF Export failed:', error);
    return false;
  }
};
