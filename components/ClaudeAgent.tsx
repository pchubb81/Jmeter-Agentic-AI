import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import TextArea from './common/TextArea';
import Button from './common/Button';

const ClaudeAgent: React.FC = () => {
  const [headers, setHeaders] = useState([
    { id: 1, key: 'x-api-key', value: '' },
    { id: 2, key: 'anthropic-version', value: '2023-06-01' },
    { id: 3, key: 'content-type', value: 'application/json' },
  ]);
  const [apiKey, setApiKey] = useState('');
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

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    // Also update the 'x-api-key' header value
    setHeaders(headers.map(h => h.key === 'x-api-key' ? { ...h, value: newApiKey } : h));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    
    // Simulate API call to Claude
    setTimeout(() => {
      const mockResponse = {
        "id": `msg_sim_${Date.now()}`,
        "type": "message",
        "role": "assistant",
        "model": "claude-3-opus-20240229",
        "content": [
          {
            "type": "text",
            "text": "This is a simulated response from the Claude API. The agent successfully constructed the request. In a real scenario, this would contain the AI's answer to your prompt."
          }
        ],
        "stop_reason": "end_turn",
        "usage": {
          "input_tokens": 25,
          "output_tokens": 48
        }
      };
      setResponse(JSON.stringify(mockResponse, null, 2));
      setIsLoading(false);
    }, 2000);
  };

  const defaultPayload = JSON.stringify({
    "model": "claude-3-opus-20240229",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Explain the difference between performance testing and load testing."
      }
    ]
  }, null, 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-amber-400">Claude AI Interaction</h2>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <Input id="claude-endpoint" label="API Endpoint" type="text" placeholder="https://api.anthropic.com/v1/messages" required defaultValue="https://api.anthropic.com/v1/messages"/>
          <Input id="claude-key" label="API Key" type="password" placeholder="••••••••••••••••••••" required value={apiKey} onChange={handleApiKeyChange}/>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Request Headers</label>
            <div className="space-y-2">
              {headers.map((header) => (
                <div key={header.id} className="flex items-center space-x-2">
                  <input type="text" placeholder="Key" value={header.key} onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm"/>
                  <input type="text" placeholder="Value" value={header.value} onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm"/>
                  <button type="button" onClick={() => removeHeader(header.id)} className="text-red-400 hover:text-red-300 p-1">&times;</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addHeader} className="text-sm text-indigo-400 hover:text-indigo-300 mt-2">+ Add Header</button>
          </div>

          <TextArea id="claude-payload" label="Request Payload" defaultValue={defaultPayload} required rows={10}/>

          <Button type="submit" isLoading={isLoading}>Send Request</Button>
        </form>
      </Card>
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-amber-400">Claude AI Response</h2>
        <div className="bg-gray-900 rounded-md p-4 h-full">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap break-all h-full overflow-y-auto">
            {isLoading ? <span className="text-gray-400">Awaiting Claude's response...</span> : response || <span className="text-gray-500">Response will appear here.</span>}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default ClaudeAgent;