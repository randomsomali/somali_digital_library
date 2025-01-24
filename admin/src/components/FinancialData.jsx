import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const FinancialChart = ({ data }) => {
  // Transform string values to numbers and ensure proper data structure
  const transformedData = data.map(item => ({
    name: item.name,
    revenue: parseFloat(item.revenue),
    profit: parseFloat(item.profit),
    expenses: parseFloat(item.expenses)
  }));

  // Calculate the maximum value to set proper chart height
  const maxValue = Math.max(
    ...transformedData.map(item => 
      Math.max(item.revenue, item.profit, item.expenses)
    )
  );

  // Generate nice round numbers for ticks
  const generateNiceTicks = (maxValue) => {
    // Round up maxValue to a nice number
    const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const roundedMax = Math.ceil(maxValue / orderOfMagnitude) * orderOfMagnitude;
    
    // Generate 5 evenly spaced ticks including 0
    const tickCount = 5;
    const ticks = [];
    for (let i = 0; i < tickCount; i++) {
      ticks.push((roundedMax / (tickCount - 1)) * i);
    }
    return ticks;
  };

  const yAxisTicks = generateNiceTicks(maxValue);

  // Color palette
  const colors = {
    primary: '#6366f1',
    tertiary: '#10b981',
    secondary: '#f59e0b'
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 py-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm text-gray-600">
                {`${entry.name}: $${entry.value.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={transformedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.tertiary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.tertiary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.secondary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f0f0f0" 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke="#888888"
                tick={{ fill: '#888888', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#888888"
                tick={{ fill: '#888888', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                domain={[0, Math.max(...yAxisTicks)]}
                ticks={yAxisTicks}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
              />
              <Area 
                type="monotone" 
                dataKey="revenue"
                name="Revenue"
                stroke={colors.primary}
                fill="url(#colorRevenue)"
                strokeWidth={2}
                dot={{ fill: colors.primary, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="profit"
                name="Profit"
                stroke={colors.tertiary}
                fill="url(#colorProfit)"
                strokeWidth={2}
                dot={{ fill: colors.tertiary, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="expenses"
                name="Expenses"
                stroke={colors.secondary}
                fill="url(#colorExpenses)"
                strokeWidth={2}
                dot={{ fill: colors.secondary, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChart;