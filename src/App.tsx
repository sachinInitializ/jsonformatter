import React, { useState } from 'react';
import { AlertCircle, Code2, RefreshCw } from 'lucide-react';

function App() {
  const [template, setTemplate] = useState<string>(`// Example: Process complex data and return a formatted string
const items = output.items || [];
const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const categories = [...new Set(items.map(item => item.category))];

// Format dates
const orderDate = new Date(output.orderDate);
const formattedDate = orderDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Build the formatted output string
return \`Order Summary:
Date: \${formattedDate}
Customer ID: \${output.customerId}

Items (\${items.length}):
\${items.map(item => \`  - \${item.name}: \${item.quantity}x @ $\${item.price} = $\${item.price * item.quantity}\`).join('\\n')}

Categories: \${categories.join(', ')}
Total Amount: $\${total.toFixed(2)}
Status: \${total > 1000 ? 'VIP Order' : 'Standard Order'}\`;`);

  const [output, setOutput] = useState<string>(`{
  "orderDate": "2024-03-15T10:30:00Z",
  "customerId": "CUST123",
  "items": [
    {
      "id": 1,
      "name": "Premium Widget",
      "category": "Electronics",
      "price": 299.99,
      "quantity": 2
    },
    {
      "id": 2,
      "name": "Deluxe Gadget",
      "category": "Electronics",
      "price": 499.99,
      "quantity": 1
    },
    {
      "id": 3,
      "name": "Premium Service",
      "category": "Services",
      "price": 99.99,
      "quantity": 3
    }
  ]
}`);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const processTemplate = () => {
    try {
      // Parse the output if it's JSON, otherwise use as is
      let outputValue;
      try {
        outputValue = JSON.parse(output);
      } catch {
        outputValue = output;
      }

      // Create and execute the function with the output
      const functionBody = `
        return function(output) {
          ${template}
        }
      `;
      
      const templateFunction = new Function(functionBody)();
      const formattedResult = templateFunction(outputValue);
      
      if (typeof formattedResult !== 'string') {
        throw new Error('Template must return a string value');
      }
      
      setResult(formattedResult);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setResult('');
    }
  };

  const resetExample = () => {
    setTemplate(`// Example: Process complex data and return a formatted string
const items = output.items || [];
const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const categories = [...new Set(items.map(item => item.category))];

// Format dates
const orderDate = new Date(output.orderDate);
const formattedDate = orderDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Build the formatted output string
return \`Order Summary:
Date: \${formattedDate}
Customer ID: \${output.customerId}

Items (\${items.length}):
\${items.map(item => \`  - \${item.name}: \${item.quantity}x @ $\${item.price} = $\${item.price * item.quantity}\`).join('\\n')}

Categories: \${categories.join(', ')}
Total Amount: $\${total.toFixed(2)}
Status: \${total > 1000 ? 'VIP Order' : 'Standard Order'}\`;`);
    setOutput(`{
  "orderDate": "2024-03-15T10:30:00Z",
  "customerId": "CUST123",
  "items": [
    {
      "id": 1,
      "name": "Premium Widget",
      "category": "Electronics",
      "price": 299.99,
      "quantity": 2
    },
    {
      "id": 2,
      "name": "Deluxe Gadget",
      "category": "Electronics",
      "price": 499.99,
      "quantity": 1
    },
    {
      "id": 3,
      "name": "Premium Service",
      "category": "Services",
      "price": 99.99,
      "quantity": 3
    }
  ]
}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Output Template Formatter</h1>
          <button
            onClick={resetExample}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            title="Reset to example"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Example
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Function Body
              </label>
              <div className="relative">
                <textarea
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm bg-white"
                  placeholder="Enter your template function body here..."
                />
                <Code2 className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Write your processing logic and return a string. The input data is available as 'output'.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Value
              </label>
              <div className="relative">
                <textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="w-full h-[300px] p-4 border border-gray-300 rounded-lg font-mono text-sm bg-white"
                  placeholder="Enter string or JSON value..."
                />
                <Code2 className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              onClick={processTemplate}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Process Template
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Result</h2>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-red-700 text-sm">
                  <strong className="font-medium">Error:</strong> {error}
                </div>
              </div>
            )}

            {result && (
              <div className="h-[800px] overflow-auto">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <pre className="whitespace-pre-wrap break-words text-sm font-mono">
                    {result}
                  </pre>
                </div>
              </div>
            )}

            {!error && !result && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
                Process the template to see the result here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;