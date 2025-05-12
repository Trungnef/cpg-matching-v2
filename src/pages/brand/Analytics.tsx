import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, TrendingUp, ShoppingBag, DollarSign, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandLayout from "@/components/layouts/BrandLayout";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Mock data for charts
const salesData = [
  { month: "Jan", revenue: 48500, units: 4250 },
  { month: "Feb", revenue: 52000, units: 4600 },
  { month: "Mar", revenue: 61000, units: 5100 },
  { month: "Apr", revenue: 64500, units: 5350 },
  { month: "May", revenue: 72000, units: 6000 },
  { month: "Jun", revenue: 85000, units: 7100 },
  { month: "Jul", revenue: 94000, units: 7800 },
];

const productPerformance = [
  { name: "Organic Cereal", sales: 32500, growth: 8.5 },
  { name: "Energy Bars", sales: 28700, growth: 12.3 },
  { name: "Fresh Smoothies", sales: 21900, growth: 15.7 },
  { name: "Trail Mix", sales: 18600, growth: 6.2 },
  { name: "Protein Powder", sales: 15800, growth: 9.8 },
];

const channelData = [
  { name: "Retail Stores", value: 65 },
  { name: "Online Direct", value: 20 },
  { name: "Grocery Chains", value: 10 },
  { name: "Other", value: 5 },
];

const brandInProduction = [
  { name: "Organic Cereal", units: 2500 },
  { name: "Energy Bars", units: 3200 },
  { name: "Fresh Smoothies", units: 1800 },
  { name: "Trail Mix", units: 1500 },
  { name: "Protein Powder", units: 950 },
];

const Analytics = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t("brand-analytics-title");

    // If not authenticated or not a brand, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "brand") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role, t]);

  if (!isAuthenticated || role !== "brand") {
    return null;
  }

  return (
    <BrandLayout>
      <div className="max-w-none px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-6">
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                    {t("analytics-management")}
                  </h1>
                  <p className="text-muted-foreground">
                    {user?.companyName} - {t("performance-metrics")}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t("last-30-days")}
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    {t("export")}
                  </Button>
                </div>
              </div>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("monthly-revenue")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$94,000</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500">+10.5%</span>
                    <span className="ml-1">{t("from-last-month")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("units-sold")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7,800</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500">+9.8%</span>
                    <span className="ml-1">{t("from-last-month")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("active-products")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500">+2</span>
                    <span className="ml-1">{t("new-this-month")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("growth-rate-yoy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15.2%</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500">+2.1%</span>
                    <span className="ml-1">{t("from-last-year")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rest of the content... */}
            <Tabs defaultValue="revenue" className="space-y-8">
              <TabsList className="grid grid-cols-3 w-full max-w-[400px]">
                <TabsTrigger value="revenue">{t("revenue")}</TabsTrigger>
                <TabsTrigger value="products">{t("products")}</TabsTrigger>
                <TabsTrigger value="distribution">{t("distribution")}</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("revenue-trends")}</CardTitle>
                    <CardDescription>{t("monthly-revenue-units-desc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name={t("revenue-dollars")}
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="units"
                            name={t("units-sold")}
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorUnits)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("product-performance")}</CardTitle>
                    <CardDescription>{t("sales-by-product")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productPerformance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          barSize={60}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" scale="band" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sales" name={t("sales-dollars")} fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("units-in-production")}</CardTitle>
                    <CardDescription>{t("manufacturing-volumes")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={brandInProduction}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          barSize={60}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" scale="band" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="units" name={t("units")} fill="#82ca9d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="distribution" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("sales-channels")}</CardTitle>
                    <CardDescription>{t("distribution-by-channel")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={channelData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={130}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {channelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 36}, 70%, 50%)`} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default Analytics;
