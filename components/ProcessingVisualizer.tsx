import React from 'react';
import type { ProcessingTask } from '../types';
import { SpinnerIcon, CheckIcon } from './icons/Icons';

interface ProcessingVisualizerProps {
  tasks: ProcessingTask[];
  currentTaskIndex: number;
}

const TaskStatusIcon: React.FC<{status: 'completed' | 'in-progress' | 'pending'}> = ({ status }) => {
    switch (status) {
        case 'completed':
            return <CheckIcon className="w-5 h-5 text-green-400" />;
        case 'in-progress':
            return <SpinnerIcon className="w-5 h-5 text-cyan-400 animate-spin" />;
        case 'pending':
            return <div className="w-5 h-5 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-gray-500"></div></div>;
    }
}

export const ProcessingVisualizer: React.FC<ProcessingVisualizerProps> = ({ tasks, currentTaskIndex }) => {
  return (
    <div className="bg-black/50 border border-gray-700 rounded-lg p-6 font-mono text-sm shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <p className="flex-1 text-center text-gray-400">AI Processing Terminal</p>
      </div>
      <div className="bg-gray-900 p-4 rounded-md min-h-[150px]">
        <ul>
          {tasks.map((task, index) => {
            const getStatus = (): 'completed' | 'in-progress' | 'pending' => {
              if (index < currentTaskIndex) return 'completed';
              if (index === currentTaskIndex) return 'in-progress';
              return 'pending';
            };
            const status = getStatus();
            const textClass = status === 'pending' ? 'text-gray-500' : 'text-gray-200';

            return (
              <li key={index} className="flex items-center space-x-3 mb-2 animate-fade-in-slow">
                <TaskStatusIcon status={status} />
                <span className={`transition-colors duration-300 ${textClass}`}>{task.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
       <style>{`
          @keyframes fade-in-slow {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in-slow {
            animation: fade-in-slow 0.6s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
