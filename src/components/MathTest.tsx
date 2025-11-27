import React from 'react';
import MarkdownWrapper from './MarkdownWrapper';

const MathTest = () => {
  const testContent = `
# Cost Variance Analysis

To calculate the total cost variance, you compare the actual cost incurred with the standard (or budgeted) cost that should have been incurred for the actual level of activity achieved.

The fundamental formula is:

$$ \\text{Cost Variance} = \\text{Actual Cost} - \\text{Standard Cost}$$

Where:

- **Actual Cost (AC)** = The total cost actually paid for inputs (e.g., actual quantity of materials used $\\times$ actual price per unit).
- **Standard Cost (SC)** = The expected total cost for the actual output achieved (e.g., standard quantity of materials allowed for actual production $\\times$ standard price per unit).

A negative result indicates a favorable variance (actual cost was less than standard). A positive result indicates an unfavorable variance (actual cost was more than standard).

## Additional Examples

Inline math example: The variance can be calculated as $V = AC - SC$ where $V$ is the variance.

Another display equation:
$$\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\mu)^2$$

## Reference Links

- ACCA P5 Advanced Performance Management Study Text (search "variance calculation")
- CIMA F2 Advanced Financial Reporting Study Text (search "standard costing")  
- Managerial Accounting by Garrison, Noreen, Brewer (Chapter 10: Standard Costs and Variance Analysis)
`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Math Rendering Test</h1>
      <MarkdownWrapper content={testContent} />
    </div>
  );
};

export default MathTest;
