import React, { useState, useEffect } from 'react';
import { TestStatus } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';

const StatusIndicator: React.FC<{ status: TestStatus }> = ({ status }) => {
    const statusConfig = {
      [TestStatus.Idle]: { color: 'bg-gray-500', text: 'Idle' },
      [TestStatus.Running]: { color: 'bg-blue-500 animate-pulse', text: 'Running' },
      [TestStatus.Completed]: { color: 'bg-green-500', text: 'Completed' },
      [TestStatus.Failed]: { color: 'bg-red-500', text: 'Failed' },
    };
  
    return (
      <div className="flex items-center">
        <span className={`h-3 w-3 rounded-full mr-2 ${statusConfig[status].color}`}></span>
        <span>{statusConfig[status].text}</span>
      </div>
    );
};

const LoadRunnerAgent: React.FC = () => {
  const [status, setStatus] = useState<TestStatus>(TestStatus.Idle);
  const [runId, setRunId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [metrics, setMetrics] = useState({ vusers: 0, tps: 0, errors: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer: number;
    if (status === TestStatus.Running) {
      timer = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setMetrics(prev => ({
          vusers: Math.min(prev.vusers + Math.floor(Math.random() * 5), 100),
          tps: Math.random() * 20 + 50,
          errors: prev.errors + (Math.random() > 0.95 ? 1 : 0),
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleTriggerTest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(TestStatus.Running);
    setRunId(`LR-RUN-${Date.now()}`);
    setElapsedTime(0);
    setMetrics({ vusers: 0, tps: 0, errors: 0 });

    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      setStatus(success ? TestStatus.Completed : TestStatus.Failed);
      setIsSubmitting(false);
    }, 15000); // Simulate a 15-second test run
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">LoadRunner Configuration</h2>
        <form onSubmit={handleTriggerTest} className="space-y-4">
          <Input id="lr-server" label="Server URL" type="text" placeholder="https://lr-enterprise.cloud:8080" defaultValue="https://lr-enterprise.cloud:8080" required />
          <Input id="lr-domain" label="Domain" type="text" placeholder="DEFAULT" defaultValue="DEFAULT" required />
          <Input id="lr-project" label="Project" type="text" placeholder="MyWebApp" defaultValue="MyWebApp" required />
          <Input id="lr-testid" label="Test ID" type="number" placeholder="1001" defaultValue="1001" required />
          <Input id="lr-token" label="Bearer Token" type="password" placeholder="••••••••••••••••••••" defaultValue="dummy-token-for-ui" required />
          <Button type="submit" isLoading={isSubmitting} disabled={status === TestStatus.Running}>
            Trigger Test Run
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Live Test Monitor</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Status:</p>
            <StatusIndicator status={status} />
          </div>
          <div>
            <p className="font-semibold">Run ID:</p>
            <p className="font-mono text-gray-300">{runId || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Elapsed Time:</p>
            <p className="font-mono text-gray-300">{formatTime(elapsedTime)}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-400">Virtual Users</p>
              <p className="text-2xl font-bold text-blue-400">{metrics.vusers}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Transactions/sec</p>
              <p className="text-2xl font-bold text-green-400">{metrics.tps.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Errors</p>
              <p className="text-2xl font-bold text-red-400">{metrics.errors}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadRunnerAgent;
