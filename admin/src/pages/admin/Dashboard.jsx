import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Download, FileText, Folder } from 'lucide-react'; // Import icons from lucide-react
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Dummy data for stats
  const stats = [
    { title: "Resources", value: "10+", icon: <Folder className="h-6 w-6 text-blue-500" />, route: "/admin/resources" },
    { title: "Downloads", value: "20+", icon: <Download className="h-6 w-6 text-green-500" />, route: "/admin/downloads" },
    { title: "Users", value: "15+", icon: <Users className="h-6 w-6 text-purple-500" />, route: "/admin/users" },
    { title: "Logs", value: "5+", icon: <FileText className="h-6 w-6 text-orange-500" />, route: "/admin/logs" },
  ];

  // Handle card click and navigate to the appropriate route
  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => handleCardClick(stat.route)}
          >
            <CardHeader>
              <div className="flex items-center">
                {stat.icon}
                <CardTitle className="ml-2">{stat.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;