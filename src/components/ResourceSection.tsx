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
  X,
  Music,
  ChevronRight
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

  const filteredResources = RESOURCES_DATA.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    const sampleMember = {
      firstName: '[Prénom]',
      lastName: '[Nom]',
      role: '[Pupitre]'
    };
    const interpolated = formatMessageTemplate(text, sampleMember, organization.name, organization.userRole);
    navigator.clipboard.writeText(interpolated).then(() => {
      setCopiedTextId(id);
      setTimeout(() => setCopiedTextId(null), 2500);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            <span>Guide & Modèles de Messages</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Messages types pré-remplis pour la vie de la chorale {organization.name}.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {item.templates.length} modèle{item.templates.length > 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action checklist */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Que faire :</span>
                {item.whatToDo.slice(0, 2).map((todo, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{todo}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedResource(item)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all active:scale-98"
              >
                <span>Voir les modèles de texte</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedResource.emoji}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedResource.title}</h3>
                    <p className="text-xs text-slate-500">{selectedResource.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-4">
                {/* Guidelines */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-xs text-slate-700 block">Conseils pratiques :</span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {selectedResource.whatToDo.map((todo, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{todo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Templates */}
                <div className="space-y-3 pt-2">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block">
                    Modèles de messages prêts à l'emploi :
                  </span>

                  {selectedResource.templates.map((tpl, idx) => {
                    const sampleMember = {
                      firstName: '[Prénom]',
                      lastName: '[Nom]',
                      role: '[Pupitre]'
                    };
                    const sampleText = formatMessageTemplate(tpl.text, sampleMember, organization.name, organization.userRole);
                    const templateId = `${selectedResource.id}-${idx}`;

                    return (
                      <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800">{tpl.title}</span>
                          <button
                            onClick={() => handleCopy(tpl.text, templateId)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              copiedTextId === templateId
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                            }`}
                          >
                            {copiedTextId === templateId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedTextId === templateId ? 'Copié !' : 'Copier le texte'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-100 whitespace-pre-wrap select-all">
                          {sampleText}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Fermer
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
