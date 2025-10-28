import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import TextArea from './common/TextArea';
import Button from './common/Button';

const CustomAIAgent: React.FC = () => {
  const [headers, setHeaders] = useState([{ id: 1, key: 'Content-Type', value: 'application/json' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now(), key: '', value: '' }]);
  };

  const removeHeader = (id: number) => {
    setHeaders(headers.filter(header => header.id !== id));
  };
  
  const handleHeaderChange = (id: number, field: 'key' | 'value', value: string) => {
    setHeaders(headers.map(header => header.id === id ? { ...header, [field]: value } : header));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        id: `resp_${Date.now()}`,
        object: "text_completion",
        created: Math.floor(Date.now() / 1000),
        model: "native-ai-platform-v1",
        choices: [
          {
            text: "\n\nThis is a simulated response from your native AI platform. The agent successfully sent the request with the provided bearer token and custom headers.",
            index: 0,
            logprobs: null,
            finish_reason: "length"
          }
        ]
      };
      setResponse(JSON.stringify(mockResponse, null, 2));
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Custom AI Platform Interaction</h2>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <Input id="ai-endpoint" label="API Endpoint" type="text" placeholder="https://api.native-ai.internal/v1/completions" required defaultValue="https://api.native-ai.internal/v1/completions"/>
          <Input id="ai-token" label="Bearer Token" type="password" placeholder="••••••••••••••••••••" required defaultValue="dummy-secret-token"/>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Custom Headers</label>
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={header.id} className="flex items-center space-x-2">
                  <input type="text" placeholder="Key" value={header.key} onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm"/>
                  <input type="text" placeholder="Value" value={header.value} onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm"/>
                  <button type="button" onClick={() => removeHeader(header.id)} className="text-red-400 hover:text-red-300 p-1">&times;</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addHeader} className="text-sm text-indigo-400 hover:text-indigo-300 mt-2">+ Add Header</button>
          </div>

          <TextArea id="ai-payload" label="Request Payload (Prompt)" defaultValue={'{\n  "prompt": "Explain the importance of performance testing in AI applications.",\n  "max_tokens": 150\n}'} required/>

          <Button type="submit" isLoading={isLoading}>Send Request</Button>
        </form>
      </Card>
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-purple-400">AI Response</h2>
        <div className="bg-gray-900 rounded-md p-4 h-full">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap break-all h-full overflow-y-auto">
            {isLoading ? <span className="text-gray-400">Awaiting response...</span> : response || <span className="text-gray-500">Response will appear here.</span>}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default CustomAIAgent;
