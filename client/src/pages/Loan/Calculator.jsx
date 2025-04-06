import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Slider } from '../../components/ui/slider';
import { useTranslation } from 'react-i18next';

const Calculator = () => {
  const { t } = useTranslation();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(15);
  const [loanTerm, setLoanTerm] = useState(12);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const COLORS = ['#0088FE', '#FF8042'];

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, paymentFrequency]);

  const calculateLoan = () => {
    setIsCalculating(true);

    // Convert annual interest rate to monthly
    const monthlyInterestRate = (interestRate / 100) / 12;
    
    // Number of payments
    const numberOfPayments = loanTerm;
    
    // Calculate monthly payment using the formula: P = L[i(1+i)^n]/[(1+i)^n-1]
    const x = Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const monthly = (loanAmount * monthlyInterestRate * x) / (x - 1);
    
    setMonthlyPayment(monthly);
    setTotalPayment(monthly * numberOfPayments);
    setTotalInterest(monthly * numberOfPayments - loanAmount);
    
    // Generate amortization schedule
    let balance = loanAmount;
    const schedule = [];
    
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = balance * monthlyInterestRate;
      const principalPayment = monthly - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        payment: i,
        date: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        totalPayment: monthly,
        remainingBalance: balance > 0 ? balance : 0
      });
    }
    
    setAmortizationSchedule(schedule);
    setIsCalculating(false);
  };

  const handleLoanAmountChange = (value) => {
    setLoanAmount(value[0]);
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(value[0]);
  };

  const handleLoanTermChange = (value) => {
    setLoanTerm(value[0]);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(value);
  };

  const pieData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: totalInterest }
  ];

  // Line chart data for payment breakdown over time
  const lineData = amortizationSchedule.map((item, index) => ({
    name: `Month ${item.payment}`,
    Principal: item.principalPayment,
    Interest: item.interestPayment
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Loan Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Controls */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Loan Parameters</CardTitle>
            <CardDescription>Adjust the values to calculate your loan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Loan Amount (KES)</label>
                <span className="text-sm font-semibold">{formatCurrency(loanAmount)}</span>
              </div>
              <Slider
                defaultValue={[loanAmount]}
                min={10000}
                max={10000000}
                step={10000}
                onValueChange={handleLoanAmountChange}
                className="py-4"
              />
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Interest Rate (%)</label>
                <span className="text-sm font-semibold">{interestRate}%</span>
              </div>
              <Slider
                defaultValue={[interestRate]}
                min={1}
                max={30}
                step={0.1}
                onValueChange={handleInterestRateChange}
                className="py-4"
              />
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Loan Term (Months)</label>
                <span className="text-sm font-semibold">{loanTerm} months</span>
              </div>
              <Slider
                defaultValue={[loanTerm]}
                min={1}
                max={60}
                step={1}
                onValueChange={handleLoanTermChange}
                className="py-4"
              />
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Frequency</label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
            <CardDescription>Payment details and breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm text-blue-700 font-medium">Monthly Payment</h3>
                <p className="text-2xl font-bold text-blue-800">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-sm text-green-700 font-medium">Total Payment</h3>
                <p className="text-2xl font-bold text-green-800">{formatCurrency(totalPayment)}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <h3 className="text-sm text-amber-700 font-medium">Total Interest</h3>
                <p className="text-2xl font-bold text-amber-800">{formatCurrency(totalInterest)}</p>
              </div>
            </div>

            <Tabs defaultValue="chart">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chart">Payment Chart</TabsTrigger>
                <TabsTrigger value="breakdown">Payment Breakdown</TabsTrigger>
                <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineData.filter((_, i) => i % Math.ceil(lineData.length / 20) === 0)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="Principal" stroke="#0088FE" />
                      <Line type="monotone" dataKey="Interest" stroke="#FF8042" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="breakdown">
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{entry.name}: {formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="schedule">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 mt-4">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {amortizationSchedule.map((item) => (
                        <tr key={item.payment}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.payment}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.principalPayment)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.interestPayment)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.totalPayment)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.remainingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Understanding Your Loan</CardTitle>
            <CardDescription>Key terms and information about your loan calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">What is an Amortization Schedule?</h3>
                <p className="text-gray-600">
                  An amortization schedule is a table that shows each periodic payment on an amortizing loan, 
                  specifying the amount going to principal and interest, and the remaining balance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">How is the Monthly Payment Calculated?</h3>
                <p className="text-gray-600">
                  The monthly payment is calculated using the formula: P = L[i(1+i)^n]/[(1+i)^n-1], where L is the loan amount, 
                  i is the monthly interest rate, and n is the number of payments.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Tips to Reduce Interest Payments</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Make extra payments toward the principal</li>
                  <li>Consider a shorter loan term</li>
                  <li>Look for lower interest rates</li>
                  <li>Set up bi-weekly payments instead of monthly</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Next Steps</h3>
                <p className="text-gray-600">
                  After calculating your loan, you might want to compare offers from different lenders or 
                  speak with our financial advisor for personalized recommendations.
                </p>
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Compare Loan Offers
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;