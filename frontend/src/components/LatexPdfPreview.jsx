import { useEffect, useRef, useState } from 'react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

function PdfPage({ pdf, pageNumber }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const updateWidth = () => setWidth(container.clientWidth);
    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pdf || !canvasRef.current || !width) return undefined;

    let cancelled = false;
    let renderTask;

    pdf.getPage(pageNumber).then((page) => {
      if (cancelled) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const scale = width / baseViewport.width;
      const viewport = page.getViewport({ scale });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = Math.ceil(viewport.width * pixelRatio);
      canvas.height = Math.ceil(viewport.height * pixelRatio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      const context = canvas.getContext('2d', { alpha: false });
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      renderTask = page.render({ canvasContext: context, viewport });
      return renderTask.promise;
    }).catch((error) => {
      if (!cancelled && error?.name !== 'RenderingCancelledException') {
        console.error('Unable to render compiled LaTeX page:', error);
      }
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdf, pageNumber, width]);

  return (
    <div ref={containerRef} className="mx-auto w-full bg-white">
      <canvas ref={canvasRef} className="mx-auto block max-w-full" aria-label={`Compiled resume page ${pageNumber}`} />
    </div>
  );
}

export default function LatexPdfPreview({ pdfData }) {
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!pdfData) {
      setPdf(null);
      setError('');
      return undefined;
    }

    let cancelled = false;
    let loadingTask;
    setPdf(null);
    setError('');

    import('pdfjs-dist').then((pdfjsLib) => {
      if (cancelled) return null;
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
      loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData) });
      return loadingTask.promise;
    }).then((document) => {
      if (!cancelled && document) setPdf(document);
    }).catch((loadError) => {
      if (!cancelled) setError(loadError?.message || 'The compiled PDF could not be displayed.');
    });

    return () => {
      cancelled = true;
      if (loadingTask) void loadingTask.destroy().catch(() => {});
    };
  }, [pdfData]);

  if (!pdfData) {
    return (
      <div className="py-10 text-center text-xs italic text-gray-400">
        The PDF preview will appear after the first successful pdfLaTeX compile.
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-center text-xs text-rose-700">{error}</div>;
  }

  if (!pdf) {
    return <div className="py-10 text-center text-xs text-gray-500">Preparing compiled PDF preview…</div>;
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: pdf.numPages }, (_, index) => (
        <PdfPage key={index + 1} pdf={pdf} pageNumber={index + 1} />
      ))}
    </div>
  );
}
