import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import CrawlerForm from '@/components/crawler/CrawlerForm';
import CrawlerJobList, { CrawlTask } from '@/components/crawler/CrawlerJobList';
import CrawlerResultView, { CrawlResult } from '@/components/crawler/CrawlerResultView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageTitle } from '@/components/PageTitle';
import { Loader2, Search, Database, ArrowRight, Brain } from 'lucide-react';
import { crawlerApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const WebCrawler: React.FC = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [tasks, setTasks] = useState<CrawlTask[]>([]);
  const [currentResult, setCurrentResult] = useState<CrawlResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Fetch tasks when component mounts or page changes
  useEffect(() => {
    fetchTasks();
  }, [currentPage]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await crawlerApi.getTasks(currentPage, 10);
      
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch crawl tasks',
        variant: 'destructive',
      });
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new crawl task
  const handleSubmitCrawl = async (data: any) => {
    try {
      const payload = {
        url: data.url,
        config: {
          depth: data.depth,
          maxPages: data.maxPages,
          selectors: data.selectors,
        },
        userId: 'admin', // This should come from auth context in a real app
        autoSave: data.autoSave || false, // Add autoSave parameter
        aiProvider: data.aiProvider || 'default', // Add aiProvider parameter
      };

      const response = await crawlerApi.createTask(payload);
      const estimatedTime = response.data.estimatedTime;
      
      // Format time for display
      const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes === 0) {
          return `${remainingSeconds} seconds`;
        } else if (remainingSeconds === 0) {
          return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
          return `${minutes} minute${minutes > 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`;
        }
      };
      
      // Customize toast message based on AI provider
      const aiProviderText = data.aiProvider === 'default' ? '' : 
                            ` Using ${data.aiProvider === 'openai' ? 'OpenAI GPT-4o' : 
                                        data.aiProvider === 'gemini' ? 'Google Gemini Pro' : 
                                        'AWS Claude 3 Sonnet'} for processing.`;
      
      toast({
        title: 'Task Created',
        description: `Crawl task has been created successfully. ${data.autoSave ? 'Results will be automatically saved to catalog. ' : ''}${aiProviderText} Estimated time: ${estimatedTime ? formatTime(estimatedTime) : 'Unknown'}`,
      });

      // Switch to tasks tab and refresh the list
      setActiveTab('tasks');
      fetchTasks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create crawl task',
        variant: 'destructive',
      });
      console.error('Error creating task:', error);
      throw error; // Re-throw to be caught by the form component
    }
  };

  // View results for a task
  const handleViewResults = async (taskId: string) => {
    try {
      setIsLoading(true);
      const response = await crawlerApi.getResults(taskId);
      
      if (response.data && response.data.length > 0) {
        setCurrentResult(response.data[0]); // Get the latest result
        setActiveTab('result');
      } else {
        toast({
          title: 'No Results',
          description: 'No results found for this task',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch results',
        variant: 'destructive',
      });
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await crawlerApi.deleteTask(taskId);
      
      toast({
        title: 'Task Deleted',
        description: 'Crawl task has been deleted successfully',
      });
      
      // Refresh the list
      fetchTasks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process result with AI
  const handleProcessResult = async (resultId: string) => {
    try {
      const response = await crawlerApi.processResult(resultId);
      
      toast({
        title: 'Processing Complete',
        description: 'The result has been processed with AI',
      });
      
      // Update the current result with processed data
      if (currentResult && currentResult._id === resultId) {
        setCurrentResult({
          ...currentResult,
          processedData: response.data.processedData,
          aiAnalysis: response.data.aiAnalysis,
        });
      }
      
      return response.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process result with AI',
        variant: 'destructive',
      });
      console.error('Error processing result:', error);
      throw error;
    }
  };

  // Integrate product into catalog
  const handleIntegrateProduct = async (productData: any) => {
    try {
      if (!currentResult) {
        throw new Error('No result selected');
      }
      
      // Enhanced product integration with numeric data handling
      // Prepare integration data
      const integrationData = {
        userId: 'admin', // Or get from context/state
        productCategoryId: null,
        minimumOrderQuantity: 10,
        dailyCapacity: 100,
        unitType: 'units',
        currentAvailableStock: 50,
        leadTime: '3',
        leadTimeUnit: 'days'
      };
      
      console.log("Integrating product with data:", {
        resultId: currentResult._id,
        metadata: productData?.metadata || {},
        integrationData
      });
      
      // Call the API to integrate the product
      await crawlerApi.integrateProduct(currentResult._id, integrationData.userId);
      
      toast({
        title: 'Product Added',
        description: 'The product has been added to your catalog successfully',
      });
      
      // Navigate to the product catalog page after a brief delay
      setTimeout(() => {
        window.location.href = '/admin/catalog/productcatalog';
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to catalog',
        variant: 'destructive',
      });
      console.error('Error adding product:', error);
      throw error;
    }
  };

  // Handle back button from result view
  const handleBackFromResult = () => {
    setCurrentResult(null);
    setActiveTab('tasks');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header Section */}
      <motion.div 
        variants={itemVariants}
        className="w-full p-6 md:p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b"
      >
        <div className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 bg-primary/15 rounded-lg">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Web Crawler</h1>
              <p className="text-muted-foreground">Extract and analyze product information from websites using AI</p>
            </div>
          </div>

          {/* Process Visualization */}
          {activeTab === 'form' && !currentResult && (
            <motion.div 
              className="hidden md:flex items-center justify-between gap-6 mt-6 mb-2 w-full mx-auto bg-card/50 rounded-lg p-6 border border-border/50 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shadow-sm">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium mt-2">Extract Data</span>
              </div>
              <motion.div 
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </motion.div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shadow-sm">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium mt-2">Process with AI</span>
              </div>
              <motion.div 
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
              >
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </motion.div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shadow-sm">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium mt-2">Add to Catalog</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Loading Indicator */}
      {isLoading && activeTab !== 'tasks' && (
        <motion.div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </motion.div>
      )}
      
      {/* Main Content Area */}
      <motion.div 
        className="flex-grow w-full overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full p-4 md:p-6">
          <AnimatePresence mode="wait">
            {currentResult ? (
              <motion.div
                key="result-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="w-full"
              >
                <CrawlerResultView
                  result={currentResult}
                  onBack={handleBackFromResult}
                  onProcess={handleProcessResult}
                  onIntegrate={handleIntegrateProduct}
                />
              </motion.div>
            ) : (
              <motion.div
                key="tabs-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="w-full"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 mx-auto rounded-lg border bg-background p-1">
                    <TabsTrigger 
                      value="form" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
                    >
                      New Crawl Task
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tasks" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
                    >
                      Manage Tasks
                    </TabsTrigger>
                  </TabsList>
                  
                  <AnimatePresence mode="wait">
                    {activeTab === 'form' && (
                      <TabsContent value="form" className="mt-0">
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          transition={{ type: "spring", stiffness: 300, damping: 26 }}
                          className="w-full"
                        >
                          <CrawlerForm onSubmit={handleSubmitCrawl} />
                        </motion.div>
                      </TabsContent>
                    )}
                    
                    {activeTab === 'tasks' && (
                      <TabsContent value="tasks" className="mt-0">
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        >
                          <CrawlerJobList
                            tasks={tasks}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            isLoading={isLoading}
                            onPageChange={setCurrentPage}
                            onViewResults={handleViewResults}
                            onDeleteTask={handleDeleteTask}
                            onRefreshList={fetchTasks}
                          />
                        </motion.div>
                      </TabsContent>
                    )}
                  </AnimatePresence>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default WebCrawler; 