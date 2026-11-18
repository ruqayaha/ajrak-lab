/**
 * Export utilities for high-resolution PNG and clean vector SVG downloads
 */

export async function exportSvgAsPng(
  svgElement: SVGSVGElement,
  filename: string = 'ajrak-pattern-design.png',
  resolutionMultiplier: number = 3
): Promise<boolean> {
  try {
    const bbox = svgElement.viewBox.baseVal;
    const width = (bbox.width || 600) * resolutionMultiplier;
    const height = (bbox.height || 600) * resolutionMultiplier;

    // Serialize SVG XML
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    // Ensure xmlns is present
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();

    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(blobURL);
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        // Smooth high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill background
        ctx.drawImage(image, 0, 0, width, height);

        // Export as PNG
        canvas.toBlob(
          (pngBlob) => {
            URL.revokeObjectURL(blobURL);
            if (!pngBlob) {
              reject(new Error('PNG conversion failed'));
              return;
            }
            const downloadUrl = URL.createObjectURL(pngBlob);
            const anchor = document.createElement('a');
            anchor.href = downloadUrl;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(downloadUrl);
            resolve(true);
          },
          'image/png',
          1.0
        );
      };

      image.onerror = (e) => {
        URL.revokeObjectURL(blobURL);
        reject(e);
      };

      image.src = blobURL;
    });
  } catch (error) {
    console.error('Error during PNG export:', error);
    return false;
  }
}

export function exportSvgDirect(
  svgElement: SVGSVGElement,
  filename: string = 'ajrak-pattern-vector.svg'
): boolean {
  try {
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
    return true;
  } catch (err) {
    console.error('Error during SVG export:', err);
    return false;
  }
}
