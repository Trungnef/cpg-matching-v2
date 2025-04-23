import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  Book, 
  FileText, 
  MessageSquare, 
  Video, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {PageTitle} from '@/components/PageTitle';

const AdminHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Common card component to keep consistent styling
  const HelpCard = ({ icon, title, description, linkText, linkUrl, className = "" }) => (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={className}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
            <Badge variant="outline">Resource</Badge>
          </div>
          <CardTitle className="mt-3">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            {Array.isArray(description) && 
              description.map((item, i) => (
                <li key={i}>{item}</li>
              ))
            }
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full justify-between group"
            asChild
          >
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              <span>{linkText}</span>
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto space-y-6"
    >
      <PageTitle
        title="Help Center"
        description="Resources and documentation to help you use the admin panel"
        icon={<HelpCircle className="h-6 w-6 text-primary" />}
      />

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative"
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              className="pl-10 py-6 text-lg shadow-md"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Popular searches: user management, security settings, announcements, profiles
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>FAQs</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>Guides</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Contact</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQs Tab */}
        <TabsContent value="faq" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I create a new user account?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To create a new user account:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                        <li>Navigate to the User Management section from the sidebar</li>
                        <li>Click the "Add User" button in the top right corner</li>
                        <li>Fill in the required fields in the form</li>
                        <li>Select the appropriate role for the user</li>
                        <li>Click "Create User" to complete the process</li>
                      </ol>
                      <p className="mt-2 text-sm text-muted-foreground">
                        New users will receive an email with instructions to set their password.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I reset a user's password?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To reset a user's password:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                        <li>Go to the User Management section</li>
                        <li>Find the user in the list and click the three dots (...) menu</li>
                        <li>Select "Reset Password" from the dropdown</li>
                        <li>Confirm the action when prompted</li>
                      </ol>
                      <p className="mt-2 text-sm text-muted-foreground">
                        The user will receive an email with instructions to set a new password.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How do I create a system-wide announcement?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To create a system-wide announcement:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                        <li>Navigate to the Announcements section from the sidebar</li>
                        <li>Click the "New Announcement" button</li>
                        <li>Fill in the title, content, and set the priority level</li>
                        <li>Select the target audience (All Users, Manufacturers, Brands, or Retailers)</li>
                        <li>Set the expiration date if needed</li>
                        <li>Click "Publish" to make the announcement live</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How can I view system activity logs?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To view system activity logs:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                        <li>Navigate to the Activity Log section from the sidebar</li>
                        <li>Use the filters at the top to narrow down by activity type or date range</li>
                        <li>Click on any activity to view more details</li>
                      </ol>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Activity logs are retained for 90 days by default. You can export logs for longer-term storage.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>What are the different user roles in the system?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">The system has the following user roles:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                        <li><strong>Admin:</strong> Full system access with all privileges</li>
                        <li><strong>Moderator:</strong> Can manage users and content but cannot change system settings</li>
                        <li><strong>Manufacturer:</strong> Access to manufacturer-specific features</li>
                        <li><strong>Brand:</strong> Access to brand-specific features</li>
                        <li><strong>Retailer:</strong> Access to retailer-specific features</li>
                      </ul>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Roles can be assigned when creating a user or modified later from the User Management section.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger>How do I customize system settings?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To customize system settings:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                        <li>Navigate to the Settings section from the sidebar</li>
                        <li>Use the tabs to navigate between different setting categories</li>
                        <li>Make the desired changes to settings</li>
                        <li>Click "Save Settings" to apply your changes</li>
                      </ol>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Some settings may require system restart to take effect. This will be indicated when applicable.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">Can't find what you're looking for?</p>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact Support</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <HelpCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                title="Getting Started Guide"
                description="A complete overview of the admin panel for new administrators."
                linkText="View Guide"
                linkUrl="#getting-started"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <HelpCard
                icon={<Book className="h-6 w-6 text-primary" />}
                title="User Management Guide"
                description="Learn how to effectively manage users, roles, and permissions."
                linkText="Read Documentation"
                linkUrl="#user-management"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <HelpCard
                icon={<MessageSquare className="h-6 w-6 text-primary" />}
                title="Announcements Guide"
                description="Best practices for creating effective system announcements."
                linkText="View Guide"
                linkUrl="#announcements"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <HelpCard
                icon={<HelpCircle className="h-6 w-6 text-primary" />}
                title="Security Best Practices"
                description="Recommendations for maintaining system and data security."
                linkText="Read Documentation"
                linkUrl="#security"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <HelpCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                title="Reports & Analytics"
                description="How to interpret and use the analytics dashboard."
                linkText="View Guide"
                linkUrl="#analytics"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <HelpCard
                icon={<Book className="h-6 w-6 text-primary" />}
                title="System Settings"
                description="Detailed documentation about configuring system settings."
                linkText="Read Documentation"
                linkUrl="#settings"
              />
            </motion.div>
          </div>
        </TabsContent>

        {/* Video Tutorials Tab */}
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Card>
                <div className="aspect-video bg-muted relative rounded-t-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground opacity-50" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button variant="outline" className="bg-white/90 hover:bg-white">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Admin Panel Overview</CardTitle>
                  <CardDescription>A complete tour of the admin dashboard and key features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Beginner</Badge>
                      <span>10:45</span>
                    </div>
                    <span>Updated 2 weeks ago</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Card>
                <div className="aspect-video bg-muted relative rounded-t-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground opacity-50" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button variant="outline" className="bg-white/90 hover:bg-white">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>User Management Tutorial</CardTitle>
                  <CardDescription>How to add, edit, and manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Intermediate</Badge>
                      <span>15:20</span>
                    </div>
                    <span>Updated 1 month ago</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Card>
                <div className="aspect-video bg-muted relative rounded-t-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground opacity-50" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button variant="outline" className="bg-white/90 hover:bg-white">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Creating Effective Announcements</CardTitle>
                  <CardDescription>How to create targeted announcements for different user groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Beginner</Badge>
                      <span>8:15</span>
                    </div>
                    <span>Updated 3 weeks ago</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Card>
                <div className="aspect-video bg-muted relative rounded-t-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground opacity-50" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button variant="outline" className="bg-white/90 hover:bg-white">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Analytics Dashboard Deep Dive</CardTitle>
                  <CardDescription>Understanding metrics and generating actionable insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Advanced</Badge>
                      <span>22:30</span>
                    </div>
                    <span>Updated 2 months ago</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Contact Support Tab */}
        <TabsContent value="contact" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Get in touch with our support team for personalized assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="mt-3">Email Support</CardTitle>
                      <CardDescription>24/7 support via email</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Average response time: <span className="font-medium">2 hours</span></p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Email Support
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="mt-3">Live Chat</CardTitle>
                      <CardDescription>Chat with a support agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Available: <span className="font-medium">9am-5pm EST, Mon-Fri</span></p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Start Chat
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Phone Support</h3>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">+1 (800) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Monday to Friday, 9am to 5pm EST</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Schedule a Call</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Book a 30-minute call with a support specialist to solve complex issues
                  </p>
                  <Button className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule Appointment</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Quick Links Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { name: "User Manual", icon: <FileText className="h-5 w-5 text-primary" />, url: "#manual" },
            { name: "Video Tutorials", icon: <Video className="h-5 w-5 text-primary" />, url: "#tutorials" },
            { name: "API Documentation", icon: <Book className="h-5 w-5 text-primary" />, url: "#api" },
            { name: "Release Notes", icon: <FileText className="h-5 w-5 text-primary" />, url: "#releases" },
          ].map((link, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a 
                href={link.url} 
                className="flex items-center p-3 border rounded-md transition-colors hover:bg-muted hover:border-primary/20 group"
              >
                {link.icon}
                <span className="ml-2 font-medium">{link.name}</span>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminHelp; 