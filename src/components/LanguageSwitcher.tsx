import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useLanguageContext } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguageContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative group"
          aria-label={t('language')}
        >
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium hidden md:inline-block">
              {currentLanguage.toUpperCase()}
            </span>
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-xl border-white/10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex items-center gap-2 ${
                currentLanguage === language.code ? 'bg-primary/10' : ''
              }`}
            >
              <span className="text-xl" role="img" aria-label={language.name}>
                {language.flag}
              </span>
              <span>{t(language.code === 'en' ? 'english' : 'japanese')}</span>
              {currentLanguage === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </motion.div>
              )}
            </DropdownMenuItem>
          ))}
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher; 