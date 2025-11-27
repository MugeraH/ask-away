import React from 'react';
import MarkdownWrapper from './MarkdownWrapper';
import { processChunkedContent } from '@/utils/processChunkedContent';

const ChunkedContentTest = () => {
  // Sample chunked content like what you're receiving
  const chunkedContent = `0:"# Cost Variance Analysis\\n\\n## 1. DIRECT ANSWER\\nTo calculate the total cost variance, you compare the actual cost incurred with the standard (or budgeted) cost that should have been incurred for the actual level of activity achieved.\\n\\nThe fundamental formula is:\\n\\n"
0:"$$ \\\\text{Cost Variance} = \\\\text{Actual Cost} - \\\\text{Standard Cost}$$\\n\\n### 2. CONCEPT EXPLANATION\\n\\nWhere:\\n\\n- **Actual Cost (AC)** = The total cost actually paid for inputs (e.g., actual quantity of materials used $\\\\times$ actual price per unit).\\n- **Standard Cost (SC)** = The expected total cost for the actual output achieved (e.g., standard quantity of materials allowed for actual production $\\\\times$ standard price per unit).\\n\\n#### Key Points:\\n\\nA *negative* result indicates a **favorable variance** (actual cost was less than standard). A *positive* result indicates an **unfavorable variance** (actual cost was more than standard).\\n\\n> This is a fundamental concept in management accounting for performance evaluation."`;

  const processedContent = processChunkedContent(chunkedContent);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Chunked Content Processing Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Raw Chunked Content:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {chunkedContent}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-green-600">Processed Content (Rendered):</h2>
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-6 rounded-xl shadow-lg shadow-slate-200/40">
          <MarkdownWrapper content={processedContent} />
        </div>
      </div>
    </div>
  );
};

export default ChunkedContentTest;
