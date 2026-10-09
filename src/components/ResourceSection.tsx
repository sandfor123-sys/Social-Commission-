import { useState } from 'react';
import { RESOURCES_DATA } from '../data/resources';
import { ResourceItem, Organization } from '../types';
import { formatMessageTemplate } from '../utils';
import { 
  Cake, 
  HeartPulse, 
  UserMinus, 
  Baby, 
  Sparkles, 
  Flame, 
  Copy, 
  Check, 
  Search,
  BookOpen,
  HelpCircle,
  MessageSquareCode,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResourceSectionProps {
  organization: Organization;
}

export default function ResourceSection({ organization }: ResourceSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  const getIcon = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case 'Cake':
        return <Cake className={`w-5 h-5 ${colorClass}`} />;
      case 'HeartPulse':
        return <HeartPulse className={`w-5 h-5 ${colorClass}`} />;
      case 'UserMinus':
        return <UserMinus className={`w-5 h-5 ${colorClass}`} />;
      case 'Baby':
        return <Baby className={`w-5 h-5 ${colorClass}`} />;
      case 'Sparkles':
        return <Sparkles className={`w-5 h-5 ${colorClass}`} />;
      case 'Flame':
        return <Flame className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <BookOpen className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  const getColorTheme = (id: string) => {
    switch (id) {
      case 'birthday':
        return {
          bg: 'bg-amber-950/10 border-amber-900/30 hover:border-amber-500/40',
          text: 'text-amber-100',
          subtext: 'text-amber-200/50',
          iconBg: 'bg-amber-950/40 text-amber-400',
          button: 'hover:bg-amber-500 hover:text-black text-amber-300 bg-[#221c18]'
        };
      case 'sick':
        return {
          bg: 'bg-rose-950/10 border-rose-900/30 hover:border-rose-500/40',
          text: 'text-rose-100',
          subtext: 'text-rose-200/50',
          iconBg: 'bg-rose-950/40 text-rose-400',
          button: 'hover:bg-rose-500 hover:text-black text-rose-300 bg-[#221c18]'
        };
      case 'absent':
        return {
          bg: 'bg-indigo-950/10 border-indigo-900/30 hover:border-indigo-500/40',
          text: 'text-indigo-100',
          subtext: 'text-indigo-200/50',
          iconBg: 'bg-indigo-950/40 text-indigo-400',
          button: 'hover:bg-indigo-500 hover:text-black text-indigo-300 bg-[#221c18]'
        };
      case 'birth':
        return {
          bg: 'bg-sky-950/10 border-sky-900/30 hover:border-sky-500/40',
          text: 'text-sky-100',
          subtext: 'text-sky-200/50',
          iconBg: 'bg-sky-950/40 text-sky-400',
          button: 'hover:bg-sky-500 hover:text-black text-sky-300 bg-[#221c18]'
        };
      case 'wedding':
        return {
          bg: 'bg-emerald-950/10 border-emerald-900/30 hover:border-emerald-500/40',
          text: 'text-emerald-100',
          subtext: 'text-emerald-200/50',
          iconBg: 'bg-emerald-950/40 text-emerald-400',
          button: 'hover:bg-emerald-500 hover:text-black text-emerald-300 bg-[#221c18]'
        };
      case 'bereavement':
        return {
          bg: 'bg-slate-900/10 border-slate-800/50 hover:border-slate-500/40',
          text: 'text-slate-100',
          subtext: 'text-slate-300/40',
          iconBg: 'bg-slate-900/40 text-slate-300',
          button: 'hover:bg-slate-500 hover:text-black text-slate-300 bg-[#221c18]'
        };
      default:
        return {
          bg: 'bg-amber-950/10 border-amber-900/30 hover:border-amber-500/40',
          text: 'text-amber-100',
          subtext: 'text-amber-200/50',
          iconBg: 'bg-amber-950/40 text-amber-400',
          button: 'hover:bg-amber-500 hover:text-black text-amber-300 bg-[#221c18]'
        };
    }
  };

  const filteredResources = RESOURCES_DATA.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    const sampleMember = {
      firstName: '[Prénom]',
      lastName: '[Nom]',
      role: '[Sa Fonction]'
    };
    
    const formattedText = formatMessageTemplate(
      text,
      sampleMember,
      organization.name,
      organization.userRole
    );

    navigator.clipboard.writeText(formattedText).then(() => {
      setCopiedTextId(id);
      setTimeout(() => setCopiedTextId(null), 2500);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-amber-50 tracking-tight font-serif">
            Bibliothèque d'Accompagnement
          </h2>
          <p className="text-xs text-amber-200/50 mt-1">
            Fiches pratiques et messages types conçus pour soutenir vos membres dans chaque situation de vie.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-amber-400/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une situation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#161311] border border-[#2d241f] rounded-xl text-sm text-amber-100 placeholder-amber-200/25 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-[#221c18]"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((resource) => {
          const theme = getColorTheme(resource.id);
          return (
            <motion.div
              key={resource.id}
              layoutId={`card-${resource.id}`}
              onClick={() => setSelectedResource(resource)}
              className={`p-6 rounded-2xl border ${theme.bg} bg-[#161311] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.04)] hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl border border-current/10 ${theme.iconBg}`}>
                    {getIcon(resource.icon, 'w-5 h-5')}
                  </div>
                  <span className="text-2xl">{resource.emoji}</span>
                </div>
                
                <h3 className={`text-base font-serif font-bold ${theme.text} mb-2`}>
                  {resource.title}
                </h3>
                
                <p className="text-xs text-amber-200/60 leading-relaxed mb-6">
                  {resource.description}
                </p>
              </div>

              <div className="pt-3.5 border-t border-[#2d241f] flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Consulter le guide</span>
                <span className="text-lg">→</span>
              </div>
            </motion.div>
          );
        })}

        {filteredResources.length === 0 && (
          <div className="col-span-full py-16 text-center bg-[#161311] border border-[#2d241f] rounded-2xl">
            <BookOpen className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
            <p className="text-sm font-bold text-amber-50">Aucune situation trouvée</p>
            <p className="text-xs text-amber-200/40 mt-1">Essayez un autre mot-clé.</p>
          </div>
        )}
      </div>

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="absolute inset-0 bg-[#060505]/95"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#161311] rounded-2xl shadow-2xl border border-[#2d241f] overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[#2d241f] flex items-center justify-between shrink-0 bg-[#1c1815]">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border border-current/10 ${getColorTheme(selectedResource.id).iconBg}`}>
                    {getIcon(selectedResource.icon, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-serif font-bold text-amber-50 flex items-center gap-2">
                      {selectedResource.title}
                      <span>{selectedResource.emoji}</span>
                    </h3>
                    <p className="text-[10px] text-amber-200/50 uppercase tracking-widest font-bold">Fiche Social Commission</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="p-1.5 rounded-lg hover:bg-[#221c18] text-amber-200/40 hover:text-amber-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Section "Que faire ?" */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    Mesures recommandées d'attention
                  </h4>
                  <ul className="space-y-3">
                    {selectedResource.whatToDo.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-amber-100 leading-relaxed">
                        <span className="flex items-center justify-center w-5.5 h-5.5 rounded-lg bg-[#221c18] text-amber-400 border border-amber-500/20 font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section "Quel message envoyer ?" */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquareCode className="w-4 h-4 text-amber-500" />
                    Modèles de communication
                  </h4>
                  <p className="text-[10px] text-amber-200/40 italic">
                    Note : Les balises seront automatiquement personnalisées s'ils sont copiés depuis l'action rapide d'un membre.
                  </p>

                  <div className="space-y-4">
                    {selectedResource.templates.map((tmpl, idx) => {
                      const sampleText = formatMessageTemplate(
                        tmpl.text,
                        { firstName: '[Prénom]', lastName: '[Nom]', role: '[Sa Fonction]' },
                        organization.name,
                        organization.userRole
                      );
                      const copyId = `${selectedResource.id}-tmpl-${idx}`;
                      const isCopied = copiedTextId === copyId;
                      
                      return (
                        <div key={idx} className="border border-[#2d241f] rounded-xl p-4 bg-[#221c18] hover:bg-[#2c241f] transition-all">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-bold text-amber-300">
                              {tmpl.title}
                            </span>
                            <button
                              onClick={() => handleCopy(tmpl.text, copyId)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 ${
                                isCopied 
                                  ? 'bg-amber-500 text-black' 
                                  : 'bg-[#161311] hover:bg-[#2d241f] border border-[#3d2e24] text-amber-200'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copié !</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          <p className="text-xs text-amber-100/90 whitespace-pre-wrap leading-relaxed select-all">
                            {sampleText}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-[#2d241f] bg-[#1c1815] text-center shrink-0">
                <p className="text-[10px] text-amber-200/40">
                  Accompagner chaque vie, avec discrétion, dévouement et attention.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
