import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Factory, 
  TrendingUp, 
  TrendingDown, 
  Settings, 
  Package, 
  BarChart3, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  LineChart, 
  ShoppingCart,
  Loader2,
  ArrowRight,
  Clock,
  Calendar,
  Warehouse,
  Users,
  Plus,
  LayoutDashboard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTheme } from "@/contexts/ThemeContext";

// Mock data
const productionStats = {
  totalLines: 8,
  operational: 6,
  maintenance: 1,
  inactive: 1,
  totalProducts: 15,
  avgEfficiency: 86,
  totalOutput: "24,560 units"
};

const productionLines = [
  { id: 1, name: "Line A", status: "Operational", efficiency: 92, product: "Energy Bars", output: "3,400 units", nextMaintenance: "In 14 days" },
  { id: 2, name: "Line B", status: "Operational", efficiency: 88, product: "Protein Powder", output: "2,800 units", nextMaintenance: "In 8 days" },
  { id: 3, name: "Line C", status: "Maintenance", efficiency: 0, product: "Organic Cereal", output: "0 units", nextMaintenance: "In progress" },
  { id: 4, name: "Line D", status: "Operational", efficiency: 95, product: "Vitamin Tablets", output: "4,500 units", nextMaintenance: "In 21 days" },
  { id: 5, name: "Line E", status: "Operational", efficiency: 82, product: "Organic Snacks", output: "2,460 units", nextMaintenance: "In 5 days" },
];

const orders = [
  { id: 1, client: "Health Foods Co.", product: "Energy Bars", quantity: 12000, status: "In Production", deadline: "Sep 28, 2023" },
  { id: 2, client: "Nutrition Plus", product: "Protein Powder", quantity: 8000, status: "Completed", deadline: "Sep 15, 2023" },
  { id: 3, client: "Organic Brands Inc.", product: "Organic Cereal", quantity: 15000, status: "Scheduled", deadline: "Oct 10, 2023" },
  { id: 4, client: "Wellness Products", product: "Vitamin Tablets", quantity: 20000, status: "In Production", deadline: "Oct 5, 2023" },
];

const alerts = [
  { id: 1, type: "warning", message: "Line C maintenance running behind schedule", time: "2 hours ago" },
  { id: 2, type: "info", message: "New order received from Health Foods Co.", time: "5 hours ago" },
  { id: 3, type: "success", message: "Order #1042 completed and ready for shipment", time: "Yesterday" },
  { id: 4, type: "error", message: "Supply shortage for raw material #R-789", time: "Yesterday" },
];

interface ManufacturerDashboardProps {
  activeTab?: string;
}

const ManufacturerDashboard = ({ activeTab = "overview" }: ManufacturerDashboardProps) => {
  const { user } = useUser();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  // Helper function for status badges - simplified
  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status as any} />;
  };

  // Helper function for alert icons
  const getAlertIcon = (type: string) => {
    switch(type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "info":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Today's date formatted nicely
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Render components based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
  return (
          <>
            {/* Welcome section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{t('manufacturer-welcome-back', { name: user?.name?.split(' ')[0] || 'User' })}</h1>
                    <p className="text-muted-foreground">{today}</p>
                    <p className="mt-2 text-sm max-w-xl">
                      {t('manufacturer-operations-status', { alerts: '2', opportunities: '3' })}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button>
                      <Factory className="mr-2 h-4 w-4" />
                      {t('manufacturer-production-status')}
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      {t('manufacturer-view-analytics')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">{t('manufacturer-quick-actions')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">{t('manufacturer-add-product')}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('manufacturer-create-spec')}</div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">{t('manufacturer-view-matches')}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('manufacturer-explore-partners')}</div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">{t('manufacturer-production-report')}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('manufacturer-view-efficiency')}</div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Warehouse className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">{t('manufacturer-manage-inventory')}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('manufacturer-check-stock')}</div>
              </CardContent>
            </Card>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('manufacturer-production-lines')}</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{productionStats.totalLines}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        <span className="text-green-500 font-medium">{productionStats.operational}</span> {t('manufacturer-operational')}, 
                        <span className="text-yellow-500 font-medium ml-1">{productionStats.maintenance}</span> {t('manufacturer-maintenance')}
                      </span>
                    </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('manufacturer-avg-efficiency')}</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{productionStats.avgEfficiency}%</div>
                    <div className="mt-1">
                      <Progress value={productionStats.avgEfficiency} className="h-1" />
                    </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('manufacturer-total-products')}</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{productionStats.totalProducts}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+3</span>
                      <span className="text-muted-foreground ml-1">{t('manufacturer-since-last-month')}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('manufacturer-daily-output')}</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{productionStats.totalOutput}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+8.2%</span>
                      <span className="text-muted-foreground ml-1">{t('manufacturer-from-yesterday')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Upcoming tasks and calendar */}
              <div className="space-y-8">
                {/* Alerts/Notifications */}
            <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t('manufacturer-alerts')}</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        {t('manufacturer-view-all')} <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-1">
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                          {getAlertIcon(alert.type)}
                          <div className="space-y-1">
                            <p className="text-sm">{alert.message}</p>
                            <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                      ))}
                </div>
              </CardContent>
            </Card>
            
                {/* Upcoming Schedule */}
            <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t('manufacturer-schedule')}</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Calendar className="mr-1 h-4 w-4" />
                        {t('manufacturer-calendar')}
                      </Button>
                    </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="flex flex-col items-center">
                          <div className="text-xs font-medium">{t('manufacturer-today')}</div>
                          <div className="text-lg font-bold">15</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{t('manufacturer-line-maintenance')}</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> 10:00 AM - 2:00 PM
                    </div>
                    </div>
                  </div>
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="flex flex-col items-center">
                          <div className="text-xs font-medium">Wed</div>
                          <div className="text-lg font-bold">16</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{t('manufacturer-meeting')}</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> 11:30 AM - 12:30 PM
                    </div>
                    </div>
                  </div>
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="text-xs font-medium">Fri</div>
                          <div className="text-lg font-bold">18</div>
                    </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{t('manufacturer-inventory-audit')}</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> 9:00 AM - 4:00 PM
                    </div>
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>
          </div>

              {/* Right column - Brand opportunities and Production Status */}
              <div className="lg:col-span-2 space-y-8">
                {/* Active Orders */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{t('manufacturer-active-orders')}</CardTitle>
                        <CardDescription>{t('manufacturer-current-manufacturing')}</CardDescription>
                      </div>
                      <Button>{t('manufacturer-new-order')}</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('manufacturer-client')}</TableHead>
                          <TableHead>{t('manufacturer-product')}</TableHead>
                          <TableHead>{t('manufacturer-quantity')}</TableHead>
                          <TableHead>{t('status')}</TableHead>
                          <TableHead>{t('manufacturer-deadline')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.client}</TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>{order.quantity.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>{order.deadline}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">{t('manufacturer-view-orders')}</Button>
                  </CardFooter>
                </Card>

                {/* Brand Opportunities */}
          <Card>
            <CardHeader>
                      <CardTitle>{t('manufacturer-opportunities')}</CardTitle>
                      <CardDescription>{t('manufacturer-potential-partners')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                        <div className="flex items-start space-x-4 border-b pb-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Natural Foods Inc</p>
                            <p className="text-muted-foreground text-xs">{t('manufacturer-looking-organic')}</p>
                            <p className="text-muted-foreground text-xs mt-1">95% {t('manufacturer-match-capabilities')}</p>
                        </div>
                          <Button size="sm">{t('manufacturer-connect')}</Button>
                    </div>
                    
                        <div className="flex items-start space-x-4 border-b pb-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Wellness Products Co.</p>
                            <p className="text-muted-foreground text-xs">Seeking vitamin supplement production</p>
                            <p className="text-muted-foreground text-xs mt-1">88% {t('manufacturer-match-capabilities')}</p>
                          </div>
                          <Button size="sm">{t('manufacturer-connect')}</Button>
                      </div>
                      
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Fitness Nutrition</p>
                            <p className="text-muted-foreground text-xs">Looking for protein bar manufacturer</p>
                            <p className="text-muted-foreground text-xs mt-1">92% {t('manufacturer-match-capabilities')}</p>
                          </div>
                          <Button size="sm">{t('manufacturer-connect')}</Button>
                        </div>
                    </div>
                  </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        {t('manufacturer-view-opportunities')}
                      </Button>
                    </CardFooter>
                </Card>
              </div>
            </div>
          </>
        );
        
      case "production":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('manufacturer-line-status')}</CardTitle>
              <CardDescription>{t('manufacturer-current-status')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('manufacturer-line')}</TableHead>
                    <TableHead>{t('manufacturer-current-product')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('manufacturer-efficiency')}</TableHead>
                    <TableHead>{t('manufacturer-output')}</TableHead>
                    <TableHead>{t('manufacturer-next-maintenance')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionLines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell className="font-medium">{line.name}</TableCell>
                      <TableCell>{line.product}</TableCell>
                      <TableCell>{getStatusBadge(line.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={line.efficiency} className="h-2 w-20" />
                          <span className="text-sm">{line.efficiency}%</span>
              </div>
                      </TableCell>
                      <TableCell>{line.output}</TableCell>
                      <TableCell>{line.nextMaintenance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                {t('manufacturer-view-details')}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
          
      case "orders":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('manufacturer-orders')}</CardTitle>
              <CardDescription>{t('manufacturer-order-schedules')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('manufacturer-client')}</TableHead>
                    <TableHead>{t('manufacturer-product')}</TableHead>
                    <TableHead>{t('manufacturer-quantity')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('manufacturer-deadline')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.client}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.quantity.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.deadline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                {t('manufacturer-view-orders')}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "performance":
        return (
          <Card>
            <CardHeader>
              <Tabs defaultValue="efficiency">
                <div className="flex items-center justify-between">
                  <CardTitle>{t('manufacturer-performance')}</CardTitle>
                  <TabsList>
                    <TabsTrigger value="efficiency">{t('manufacturer-efficiency')}</TabsTrigger>
                    <TabsTrigger value="output">{t('manufacturer-output')}</TabsTrigger>
                    <TabsTrigger value="quality">{t('manufacturer-quality')}</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>{t('manufacturer-performance-metrics')}</CardDescription>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <LineChart className="h-16 w-16 opacity-50" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-3 w-full gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">{t('manufacturer-overall-efficiency')}</p>
                  <p className="text-lg font-medium">86.5%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('manufacturer-average-output')}</p>
                  <p className="text-lg font-medium">3,072 units/day</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('manufacturer-quality-rating')}</p>
                  <p className="text-lg font-medium text-green-500">A+</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        );
        
      case "opportunities":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('manufacturer-supply-chain')}</CardTitle>
              <CardDescription>{t('manufacturer-material-status')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 border-b pb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Settings className="h-5 w-5 text-primary" />
                      </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t('manufacturer-raw-inventory')}</p>
                    <div className="flex items-center mt-1">
                      <Progress value={72} className="h-2 w-full mr-2" />
                      <span className="text-sm">72%</span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">3 {t('manufacturer-materials-threshold')}</p>
                  </div>
                  <Button size="sm" variant="outline">{t('manufacturer-view')}</Button>
                    </div>
                    
                <div className="flex items-start space-x-4 border-b pb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Factory className="h-5 w-5 text-primary" />
                      </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t('manufacturer-supplier-performance')}</p>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div>
                        <p className="text-xs text-muted-foreground">{t('manufacturer-on-time')}</p>
                        <p className="text-sm font-medium">92%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('manufacturer-quality')}</p>
                        <p className="text-sm font-medium">96%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('manufacturer-cost')}</p>
                        <p className="text-sm font-medium text-green-500">-3.5%</p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">{t('manufacturer-view')}</Button>
              </div>
              
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t('manufacturer-logistics')}</p>
                    <p className="text-muted-foreground text-xs">5 {t('manufacturer-inbound')}</p>
                    <p className="text-muted-foreground text-xs mt-1">3 {t('manufacturer-outbound')}</p>
                  </div>
                  <Button size="sm" variant="outline">{t('manufacturer-view')}</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                {t('manufacturer-supply-dashboard')}
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>{t('manufacturer-loading')}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderTabContent()}
    </div>
  );
};

export default ManufacturerDashboard;
