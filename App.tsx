import React, { useState } from 'react';
import LoadRunnerAgent from './components/LoadRunnerAgent';
import JMeterAgent from './components/JMeterAgent';
import CustomAIAgent from './components/CustomAIAgent';
import ClaudeAgent from './components/ClaudeAgent';
import { AgentType } from './types';

const App: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<AgentType>(AgentType.JMeter);

  const renderAgent = () => {
    switch (activeAgent) {
      case AgentType.LoadRunner:
        return <LoadRunnerAgent />;
      case AgentType.JMeter:
        return <JMeterAgent />;
      case AgentType.CustomAI:
        return <CustomAIAgent />;
      case AgentType.Claude:
        return <ClaudeAgent />;
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{agent: AgentType; label: string}> = ({ agent, label }) => (
    <button
      onClick={() => setActiveAgent(agent)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
        activeAgent === agent
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Unified Performance Testing AI Agent
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Orchestrate performance tests across platforms with the power of generative AI.
          </p>
        </header>

        <nav className="flex justify-center space-x-2 md:space-x-4 mb-8">
          <TabButton agent={AgentType.JMeter} label="JMeter AI Agent" />
          <TabButton agent={AgentType.Claude} label="Claude Agent" />
          <TabButton agent={AgentType.LoadRunner} label="LoadRunner Agent" />
          <TabButton agent={AgentType.CustomAI} label="Custom AI Agent" />
        </nav>

        <main>
          {renderAgent()}
        </main>
      </div>
    </div>
  );
};

export default App;