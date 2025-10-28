import React, { useState } from 'react';
import { generateJMeterTestPlan } from '../services/geminiService';
import Card from './common/Card';
import TextArea from './common/TextArea';
import Button from './common/Button';

const JMeterAgent: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Create a JMeter test plan to test the login API at https://example.com/api/login. It should be a POST request with username and password parameters. Simulate 100 users with a 10 second ramp-up time and loop for 5 minutes.');
  const [jmxContent, setJmxContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');
    setJmxContent('');
    setCopySuccess('');

    const result = await generateJMeterTestPlan(prompt);
    
    if (result.startsWith('Error:')) {
      setError(result);
    } else {
      setJmxContent(result);
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (jmxContent) {
      navigator.clipboard.writeText(jmxContent);
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };
  
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-green-400">JMeter Plan Designer</h2>
        <form onSubmit={handleGeneratePlan} className="space-y-4">
          <TextArea
            id="jmeter-prompt"
            label="Describe Your Test Scenario"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Test the checkout API with 50 concurrent users..."
            rows={8}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" isLoading={isLoading} icon={<PlayIcon />}>
            Generate Test Plan
          </Button>
        </form>
      </Card>
      
      <Card className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-400">Generated JMX Plan</h2>
          <div className="relative">
            <Button onClick={handleCopy} disabled={!jmxContent || isLoading} variant="secondary">
              Copy XML
            </Button>
            {copySuccess && <span className="absolute -top-6 right-0 text-sm text-green-400 transition-opacity duration-300">{copySuccess}</span>}
          </div>
        </div>
        <div className="bg-gray-900 rounded-md p-4 flex-grow h-96">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap break-all h-full overflow-y-auto font-mono">
            {isLoading 
              ? <span className="text-gray-400">Generating JMX with Gemini...</span> 
              : jmxContent || <span className="text-gray-500">Generated .jmx content will appear here.</span>}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default JMeterAgent;
