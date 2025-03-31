import React, { useEffect, useRef, useState } from 'react';
import { useScreen } from '@/contexts/ScreenContext';
import { cn } from '@/lib/utils';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface ResponsiveTabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  scrollable?: boolean;
  showIcons?: boolean;
  variant?: 'default' | 'outline' | 'underline';
}

export function ResponsiveTabsList({
  tabs,
  activeTab,
  onTabChange,
  scrollable = true,
  showIcons = true,
  variant = 'default',
  className,
  ...props
}: ResponsiveTabsListProps) {
  const { isMobile, isSplitScreen, width } = useScreen();
  const [visibleTabs, setVisibleTabs] = useState<TabItem[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<TabItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Determine if we're in compact mode
  const isCompactMode = isMobile || isSplitScreen || width < 640;

  // Calculate which tabs should be visible and which should be hidden
  useEffect(() => {
    if (!containerRef.current || !scrollable) {
      setVisibleTabs(tabs);
      setHiddenTabs([]);
      return;
    }

    if (isCompactMode) {
      // In compact mode, show fewer tabs
      const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
      let visibleCount = 3; // Show at most 3 tabs in compact mode
      
      let startIndex = Math.max(0, activeTabIndex - 1);
      if (startIndex + visibleCount > tabs.length) {
        startIndex = Math.max(0, tabs.length - visibleCount);
      }
      
      const endIndex = Math.min(startIndex + visibleCount, tabs.length);
      
      setVisibleTabs(tabs.slice(startIndex, endIndex));
      setHiddenTabs(tabs.filter((_, i) => i < startIndex || i >= endIndex));
      return;
    }

    // For normal mode, calculate based on available width
    const containerWidth = containerRef.current.clientWidth;
    let totalWidth = 44; // Start with space for dropdown button
    let lastVisibleIndex = -1;

    // Reset refs array to match tabs length
    tabsRef.current = tabsRef.current.slice(0, tabs.length);
    
    for (let i = 0; i < tabs.length; i++) {
      const tabElement = tabsRef.current[i];
      if (!tabElement) continue;
      
      const tabWidth = tabElement.offsetWidth;
      if (totalWidth + tabWidth > containerWidth) {
        break;
      }
      
      totalWidth += tabWidth;
      lastVisibleIndex = i;
    }

    if (lastVisibleIndex === -1 || lastVisibleIndex >= tabs.length - 1) {
      // All tabs fit or no tabs fit
      setVisibleTabs(tabs);
      setHiddenTabs([]);
    } else {
      // Find active tab
      const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
      
      // If active tab is hidden, ensure it's visible
      if (activeTabIndex > lastVisibleIndex) {
        // Show active tab and some tabs before it
        const startIndex = Math.max(0, activeTabIndex - 2);
        const availableTabs = Math.min(lastVisibleIndex + 1, 3);
        
        setVisibleTabs(tabs.slice(startIndex, startIndex + availableTabs));
        setHiddenTabs([
          ...tabs.slice(0, startIndex),
          ...tabs.slice(startIndex + availableTabs)
        ]);
      } else {
        // Active tab is already visible
        setVisibleTabs(tabs.slice(0, lastVisibleIndex + 1));
        setHiddenTabs(tabs.slice(lastVisibleIndex + 1));
      }
    }
  }, [tabs, containerRef, width, isCompactMode, activeTab, scrollable]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollAmount = 150;
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  // Class variants
  const tabsVariants = {
    default: 'bg-muted rounded-lg p-1',
    outline: 'border rounded-md p-1',
    underline: 'border-b',
  };

  return (
    <div 
      className={cn(
        'relative flex items-center',
        className
      )}
      {...props}
    >
      {scrollable && visibleTabs.length < tabs.length && (
        <Button
          variant="ghost"
          size="icon"
          className="flex-none mr-1 h-8 w-8"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div className="relative flex-grow overflow-hidden" ref={containerRef}>
        <TabsList 
          className={cn(
            'w-full gap-1 overflow-x-auto no-scrollbar justify-start',
            tabsVariants[variant]
          )}
        >
          {visibleTabs.map((tab, index) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => onTabChange(tab.id)}
              disabled={tab.disabled}
              ref={el => tabsRef.current[tabs.indexOf(tab)] = el}
              className={cn(
                'flex-none',
                isCompactMode && !showIcons && 'text-xs py-1 px-2',
                activeTab === tab.id && 'font-medium'
              )}
            >
              {showIcons && tab.icon && (
                <span className="mr-2">{tab.icon}</span>
              )}
              {isCompactMode && !showIcons
                ? typeof tab.label === 'string' && tab.label.length > 10
                  ? `${tab.label.substring(0, 10)}...`
                  : tab.label
                : tab.label
              }
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {scrollable && visibleTabs.length < tabs.length && (
        <Button
          variant="ghost"
          size="icon"
          className="flex-none ml-1 h-8 w-8"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      {hiddenTabs.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-none ml-1 h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuRadioGroup value={activeTab} onValueChange={onTabChange}>
              {hiddenTabs.map(tab => (
                <DropdownMenuRadioItem 
                  key={tab.id} 
                  value={tab.id}
                  disabled={tab.disabled}
                  className="flex items-center gap-2"
                >
                  {showIcons && tab.icon && (
                    <span className="mr-2">{tab.icon}</span>
                  )}
                  {tab.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default ResponsiveTabsList; 