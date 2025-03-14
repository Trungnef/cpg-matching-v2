import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellRing, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Megaphone, 
  Globe, 
  TrendingUp, 
  Award, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCheck,
  BadgeCheck,
  ArrowRight,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

interface AnnouncementItem {
  id: number;
  type: 'notification' | 'alert' | 'promotion' | 'update' | 'installation' | 'ad';
  title: string;
  content: string;
  longContent?: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  action?: string;
  icon?: string;
  image?: string;
}

interface DashboardAnnouncementProps {
  role: string;
  userName?: string;
  companyName?: string;
}

const getIcon = (iconName: string) => {
  switch(iconName) {
    case 'bell': return <BellRing className="h-4 w-4" />;
    case 'alert': return <AlertTriangle className="h-4 w-4" />;
    case 'check': return <CheckCircle className="h-4 w-4" />;
    case 'checkcheck': return <CheckCheck className="h-4 w-4" />;
    case 'clock': return <Clock className="h-4 w-4" />;
    case 'megaphone': return <Megaphone className="h-4 w-4" />;
    case 'globe': return <Globe className="h-4 w-4" />;
    case 'trending': return <TrendingUp className="h-4 w-4" />;
    case 'award': return <Award className="h-4 w-4" />;
    case 'sparkles': return <Sparkles className="h-4 w-4" />;
    case 'download': return <Download className="h-4 w-4" />;
    case 'badge': return <BadgeCheck className="h-4 w-4" />;
    default: return <BellRing className="h-4 w-4" />;
  }
};

// Updated mock data with installation confirmations and manufacturer ads
const MANUFACTURER_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 1,
    type: 'installation',
    title: 'Cài đặt hệ thống thành công',
    content: 'Hệ thống quản lý sản xuất đã được cài đặt thành công. Tất cả các module đều hoạt động bình thường.',
    longContent: 'Hệ thống quản lý sản xuất đã được cài đặt thành công. Tất cả các module đều hoạt động bình thường. Bạn có thể bắt đầu sử dụng các tính năng như lập kế hoạch sản xuất, quản lý nguyên vật liệu và theo dõi quy trình. Hệ thống sẽ tự động đồng bộ dữ liệu mỗi 24 giờ.',
    timestamp: '2h ago',
    priority: 'high',
    category: 'Hệ thống',
    action: 'Xem chi tiết',
    icon: 'checkcheck',
    image: '/dashboard/installation-success.png'
  },
  {
    id: 2,
    type: 'update',
    title: 'Cập nhật lịch sản xuất Q3',
    content: 'Lịch trình sản xuất Q3 đã được cập nhật dựa trên dự báo mới nhất. Vui lòng xem xét các thay đổi.',
    timestamp: '1d ago',
    priority: 'medium',
    category: 'Sản xuất',
    action: 'Xem lịch',
    icon: 'clock'
  },
  {
    id: 3,
    type: 'ad',
    title: 'Nhà sản xuất Green Foods đạt chứng nhận ISO 22000',
    content: 'Green Foods vừa đạt chứng nhận ISO 22000 về an toàn thực phẩm. Tìm hiểu về quy trình của họ.',
    longContent: 'Green Foods, một trong những nhà sản xuất thực phẩm hàng đầu, vừa đạt được chứng nhận ISO 22000 về an toàn thực phẩm. Chứng nhận này khẳng định cam kết của họ về chất lượng và an toàn trong toàn bộ chuỗi cung ứng. Tìm hiểu thêm về quy trình của họ và cách họ duy trì tiêu chuẩn cao trong sản xuất.',
    timestamp: '3d ago',
    priority: 'low',
    category: 'Tin tức ngành',
    action: 'Tìm hiểu thêm',
    icon: 'badge',
    image: '/dashboard/green-foods.png'
  }
];

const BRAND_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 1,
    type: 'installation',
    title: 'Xác nhận tích hợp thành công',
    content: 'Hệ thống quản lý thương hiệu đã được tích hợp thành công với nền tảng phân tích thị trường.',
    longContent: 'Hệ thống quản lý thương hiệu đã được tích hợp thành công với nền tảng phân tích thị trường. Việc tích hợp này sẽ giúp bạn nhận được báo cáo phân tích chi tiết về hiệu suất thương hiệu, xu hướng thị trường và hành vi người tiêu dùng. Dự kiến sẽ tăng hiệu quả marketing lên 25%.',
    timestamp: '6h ago',
    priority: 'medium',
    category: 'Hệ thống',
    action: 'Khám phá ngay',
    icon: 'download',
    image: '/dashboard/integration-success.png'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Chứng nhận sản phẩm sắp hết hạn',
    content: 'Chứng nhận hữu cơ cho 3 sản phẩm sẽ hết hạn trong 30 ngày. Hãy gia hạn để duy trì tính tuân thủ.',
    timestamp: '1d ago',
    priority: 'high',
    category: 'Chứng nhận',
    action: 'Gia hạn ngay',
    icon: 'alert'
  },
  {
    id: 3,
    type: 'ad',
    title: 'Thương hiệu Healthy Harvest mở rộng thị trường châu Á',
    content: 'Healthy Harvest vừa công bố kế hoạch mở rộng sang thị trường châu Á với 5 dòng sản phẩm mới.',
    longContent: 'Thương hiệu Healthy Harvest vừa công bố kế hoạch mở rộng ấn tượng sang thị trường châu Á với 5 dòng sản phẩm mới tập trung vào thực phẩm chức năng và dinh dưỡng cao cấp. Dự án này dự kiến sẽ tạo ra tăng trưởng 40% doanh thu cho công ty trong năm tới. Chiến lược mở rộng bao gồm hợp tác với các nhà phân phối lớn tại Nhật Bản, Hàn Quốc và Singapore.',
    timestamp: '2d ago',
    priority: 'low',
    category: 'Tin tức ngành',
    action: 'Xem chi tiết',
    icon: 'globe',
    image: '/dashboard/healthy-harvest.png'
  }
];

const RETAILER_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 1,
    type: 'installation',
    title: 'Cập nhật hệ thống POS hoàn tất',
    content: 'Hệ thống POS đã được cập nhật lên phiên bản mới nhất. Tính năng quản lý khách hàng đã được nâng cấp.',
    longContent: 'Hệ thống POS đã được cập nhật thành công lên phiên bản 4.2.1. Bản cập nhật này bao gồm các tính năng mới như quản lý khách hàng nâng cao, tích hợp với hệ thống khuyến mãi, và báo cáo doanh thu thời gian thực. Nhân viên có thể tham gia khóa đào tạo trực tuyến về các tính năng mới.',
    timestamp: '3h ago',
    priority: 'medium',
    category: 'Hệ thống',
    action: 'Xem hướng dẫn',
    icon: 'download',
    image: '/dashboard/pos-update.png'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Cảnh báo hàng tồn kho',
    content: '5 sản phẩm bán chạy đang có lượng tồn kho thấp. Cân nhắc bổ sung để tránh mất doanh số.',
    timestamp: '1d ago',
    priority: 'high',
    category: 'Kho hàng',
    action: 'Đặt hàng ngay',
    icon: 'alert'
  },
  {
    id: 3,
    type: 'ad',
    title: 'Nhà phân phối Fresh Choice giới thiệu dòng sản phẩm hữu cơ mới',
    content: 'Fresh Choice vừa ra mắt dòng sản phẩm hữu cơ mới với giá cạnh tranh. Cơ hội tốt cho các nhà bán lẻ.',
    longContent: 'Nhà phân phối Fresh Choice vừa ra mắt dòng sản phẩm hữu cơ mới với giá cạnh tranh, mở ra cơ hội tuyệt vời cho các nhà bán lẻ. Dòng sản phẩm này bao gồm 20 mặt hàng từ rau củ, trái cây đến các sản phẩm từ sữa, tất cả đều có chứng nhận hữu cơ quốc tế. Biên lợi nhuận dự kiến cao hơn 15% so với các sản phẩm thông thường.',
    timestamp: '5d ago',
    priority: 'low',
    category: 'Sản phẩm mới',
    action: 'Liên hệ ngay',
    icon: 'sparkles',
    image: '/dashboard/fresh-choice.png'
  }
];

const DashboardAnnouncement = ({ role, userName, companyName }: DashboardAnnouncementProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Select announcements based on role
  const announcements = role === 'manufacturer' 
    ? MANUFACTURER_ANNOUNCEMENTS 
    : role === 'brand' 
      ? BRAND_ANNOUNCEMENTS 
      : RETAILER_ANNOUNCEMENTS;
  
  // Reset timer when current index changes
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (!isPaused) {
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }, 10000); // 10 seconds
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isPaused, announcements.length]);
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
  };
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? announcements.length - 1 : prevIndex - 1
    );
  };
  
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsPaused(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPaused(false);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-emerald-500';
      default: return 'text-slate-500';
    }
  };

  const getBackgroundColor = (type: string) => {
    switch(type) {
      case 'installation': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'alert': return 'bg-red-50 dark:bg-red-900/20';
      case 'ad': return 'bg-purple-50 dark:bg-purple-900/20';
      case 'update': return 'bg-emerald-50 dark:bg-emerald-900/20';
      case 'notification': return 'bg-slate-50 dark:bg-slate-900/20';
      case 'promotion': return 'bg-amber-50 dark:bg-amber-900/20';
      default: return 'bg-slate-50 dark:bg-slate-900/20';
    }
  };

  const getBorderColor = (type: string) => {
    switch(type) {
      case 'installation': return 'border-blue-200 dark:border-blue-800';
      case 'alert': return 'border-red-200 dark:border-red-800';
      case 'ad': return 'border-purple-200 dark:border-purple-800';
      case 'update': return 'border-emerald-200 dark:border-emerald-800';
      case 'notification': return 'border-slate-200 dark:border-slate-800';
      case 'promotion': return 'border-amber-200 dark:border-amber-800';
      default: return 'border-slate-200 dark:border-slate-800';
    }
  };

  const hasLongContent = (announcement: AnnouncementItem) => {
    return announcement.longContent && announcement.longContent.length > 0;
  };

  return (
    <>
      <div className="w-full h-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Card className={cn(
          "border shadow-sm overflow-hidden transition-all w-full h-full",
          getBorderColor(announcements[currentIndex].type)
        )}>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <span>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</span>
                <Badge className="ml-2 text-xs" variant="outline">
                  {announcements.length}
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex space-x-1">
                  {announcements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentIndex 
                          ? "bg-primary" 
                          : "bg-muted hover:bg-primary/50"
                      )}
                      aria-label={`Announcement ${index + 1} of ${announcements.length}`}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className={cn(
            "transition-all duration-300 flex-grow",
            getBackgroundColor(announcements[currentIndex].type),
            "py-3 px-4"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="relative h-full"
              >
                <div className="flex flex-col md:flex-row gap-4 h-full">
                  {/* Animated visual element */}
                  <motion.div 
                    className="flex justify-center items-center overflow-hidden rounded-md"
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      duration: 0.5 
                    }}
                  >
                    <div className={cn(
                      "w-full md:w-16 md:h-16 rounded-md flex items-center justify-center flex-shrink-0",
                      announcements[currentIndex].type === 'installation' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                      announcements[currentIndex].type === 'alert' ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                      announcements[currentIndex].type === 'ad' ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" :
                      announcements[currentIndex].type === 'update' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400"
                    )}>
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, 0, -5, 0],
                          scale: [1, 1.05, 1, 1.05, 1] 
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          repeatType: "reverse" 
                        }}
                      >
                        {getIcon(announcements[currentIndex].icon || 'bell')}
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-medium">{announcements[currentIndex].title}</h3>
                      <Badge 
                        className={cn(
                          "text-xs",
                          getPriorityColor(announcements[currentIndex].priority)
                        )}
                        variant="outline"
                      >
                        {announcements[currentIndex].priority}
                      </Badge>
                      {announcements[currentIndex].category && (
                        <Badge variant="secondary" className="text-xs">
                          {announcements[currentIndex].category}
                        </Badge>
                      )}
                    </div>
                    
                    <div 
                      onClick={hasLongContent(announcements[currentIndex]) ? openModal : undefined}
                      className={cn(
                        "text-sm text-muted-foreground overflow-hidden max-h-[40px] relative flex-grow",
                        hasLongContent(announcements[currentIndex]) && "cursor-pointer hover:text-foreground"
                      )}
                    >
                      {announcements[currentIndex].content}
                      {hasLongContent(announcements[currentIndex]) && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs mt-auto">
                      <span className="text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {announcements[currentIndex].timestamp}
                      </span>
                      
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="h-7 text-xs flex items-center gap-1"
                      >
                        {announcements[currentIndex].action}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <motion.div
                  className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${
                      announcements[currentIndex].type === 'installation' ? 'rgba(59, 130, 246, 0.6)' :
                      announcements[currentIndex].type === 'alert' ? 'rgba(239, 68, 68, 0.6)' :
                      announcements[currentIndex].type === 'ad' ? 'rgba(147, 51, 234, 0.6)' :
                      announcements[currentIndex].type === 'update' ? 'rgba(16, 185, 129, 0.6)' :
                      'rgba(99, 102, 241, 0.6)'
                    } 0%, transparent 70%)`
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Modal for full content */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className={cn(
          "sm:max-w-[525px] p-0 overflow-hidden border-2",
          getBorderColor(announcements[currentIndex].type)
        )}>
          <DialogHeader className={cn(
            "p-4",
            getBackgroundColor(announcements[currentIndex].type)
          )}>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-md",
                  announcements[currentIndex].type === 'installation' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                  announcements[currentIndex].type === 'alert' ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                  announcements[currentIndex].type === 'ad' ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" :
                  announcements[currentIndex].type === 'update' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400"
                )}>
                  {getIcon(announcements[currentIndex].icon || 'bell')}
                </div>
                {announcements[currentIndex].title}
              </DialogTitle>
              <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge 
                className={cn(
                  "text-xs",
                  getPriorityColor(announcements[currentIndex].priority)
                )}
                variant="outline"
              >
                {announcements[currentIndex].priority}
              </Badge>
              {announcements[currentIndex].category && (
                <Badge variant="secondary" className="text-xs">
                  {announcements[currentIndex].category}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                {announcements[currentIndex].timestamp}
              </span>
            </div>
          </DialogHeader>

          <div className="p-5">
            <p className="text-sm text-foreground mb-4">
              {announcements[currentIndex].longContent || announcements[currentIndex].content}
            </p>
            
            <div className="flex justify-end">
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center gap-1"
              >
                {announcements[currentIndex].action}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardAnnouncement; 