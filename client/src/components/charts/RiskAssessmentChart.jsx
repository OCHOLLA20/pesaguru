import React from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

const RiskAssessmentChart = ({ riskData, userProfile }) => {
  // Default data if none is provided
  const defaultRiskData = [
    {
      subject: 'Volatility Tolerance',
      conservative: 30,
      moderate: 60,
      aggressive: 90,
      userScore: userProfile?.volatilityTolerance || 50,
      fullMark: 100,
    },
    {
      subject: 'Investment Horizon',
      conservative: 40,
      moderate: 70,
      aggressive: 95,
      userScore: userProfile?.investmentHorizon || 60,
      fullMark: 100,
    },
    {
      subject: 'Loss Tolerance',
      conservative: 20,
      moderate: 50,
      aggressive: 85,
      userScore: userProfile?.lossTolerance || 45,
      fullMark: 100,
    },
    {
      subject: 'Financial Knowledge',
      conservative: 45,
      moderate: 65,
      aggressive: 80,
      userScore: userProfile?.financialKnowledge || 55,
      fullMark: 100,
    },
    {
      subject: 'Income Stability',
      conservative: 80,
      moderate: 60,
      aggressive: 40,
      userScore: userProfile?.incomeStability || 70,
      fullMark: 100,
    },
  ];

  // Use provided data or default data
  const data = riskData || defaultRiskData;
  
  // Determine user's overall risk profile based on average score
  const calculateRiskProfile = () => {
    if (!userProfile) return 'Not Assessed';
    
    const scores = [
      userProfile.volatilityTolerance || 50,
      userProfile.investmentHorizon || 60,
      userProfile.lossTolerance || 45,
      userProfile.financialKnowledge || 55,
      userProfile.incomeStability || 70
    ];
    
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    if (averageScore < 40) return 'Conservative';
    if (averageScore < 70) return 'Moderate';
    return 'Aggressive';
  };

  const riskProfile = calculateRiskProfile();
  
  // Custom tooltip to display values
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md text-xs">
          <p className="font-semibold">{payload[0].payload.subject}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Risk Assessment Profile</h3>
          <p className="text-sm text-gray-600">
            Visualizing your risk tolerance across key investment factors
          </p>
        </div>
        <div className="mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium" 
          style={{
            backgroundColor: 
              riskProfile === 'Conservative' ? 'rgba(74, 222, 128, 0.2)' :
              riskProfile === 'Moderate' ? 'rgba(250, 204, 21, 0.2)' :
              riskProfile === 'Aggressive' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(148, 163, 184, 0.2)',
            color: 
              riskProfile === 'Conservative' ? 'rgb(22, 101, 52)' :
              riskProfile === 'Moderate' ? 'rgb(161, 98, 7)' :
              riskProfile === 'Aggressive' ? 'rgb(153, 27, 27)' : 'rgb(71, 85, 105)'
          }}>
          {riskProfile} Investor
        </div>
      </div>
      
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={6} />
            
            <Radar
              name="Conservative"
              dataKey="conservative"
              stroke="#4ade80"
              fill="#4ade80"
              fillOpacity={0.3}
            />
            <Radar
              name="Moderate"
              dataKey="moderate"
              stroke="#facc15"
              fill="#facc15"
              fillOpacity={0.3}
            />
            <Radar
              name="Aggressive"
              dataKey="aggressive"
              stroke="#f87171"
              fill="#f87171"
              fillOpacity={0.3}
            />
            <Radar
              name="Your Profile"
              dataKey="userScore"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This chart visualizes your risk assessment across five key dimensions:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><span className="font-medium">Volatility Tolerance:</span> Your comfort with market fluctuations</li>
          <li><span className="font-medium">Investment Horizon:</span> Your planned investment timeframe</li>
          <li><span className="font-medium">Loss Tolerance:</span> Your ability to withstand temporary losses</li>
          <li><span className="font-medium">Financial Knowledge:</span> Your understanding of investment concepts</li>
          <li><span className="font-medium">Income Stability:</span> The consistency of your income sources</li>
        </ul>
      </div>
    </div>
  );
};

export default RiskAssessmentChart;