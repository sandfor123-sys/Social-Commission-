import { useState, FormEvent } from 'react';
import { Organization } from '../types';
import { Music, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface OrganizationSetupProps {
  onSave: (org: Organization) => void;
}

export default function OrganizationSetup({ onSave }: OrganizationSetupProps) {
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState('Responsable Commission Sociale');
  const [customRole, setCustomRole] = useState('');

  const choirRoles = [
    'Responsable Commission Sociale',
    'Chef de chœur / Maître de chœur',
    'Sous-chef de chœur / Répétiteur',
    'Secrétaire',
    'Président(e) de la chorale',
    'Trésorier(ère)',
    'Responsable de pupitre',
    'Organiste / Pianiste',
    'Choriste',
    'Autre'
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalRole = userRole === 'Autre' ? customRole : userRole;

    onSave({
      name: name.trim(),
      type: 'Chorale',
      userRole: finalRole || 'Responsable Commission Sociale'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Branding */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3"
      >
        <div className="flex justify-center">
          <img 
            src="/choir-logo.png" 
            alt="Logo Chorale" 
            className="w-24 h-24 rounded-2xl object-cover shadow-lg border border-slate-200/80 bg-white"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Espace Chorale
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
          Gestion des choristes, pupitres et suivi des anniversaires
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/80 rounded-2xl sm:px-8 space-y-6">
          
          <h2 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Music className="w-4 h-4 text-rose-500" />
            Configuration initiale
          </h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div>
              <label htmlFor="org-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nom de votre chorale *
              </label>
              <input
                id="org-name"
                name="org-name"
                type="text"
                required
                placeholder="Ex : Chorale Sainte Cécile, Chœur Harmonique..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label htmlFor="user-role" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Votre rôle dans la chorale *
              </label>
              <select
                id="user-role"
                name="user-role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm transition-all cursor-pointer"
              >
                {choirRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {userRole === 'Autre' && (
                <input
                  type="text"
                  required
                  placeholder="Précisez votre fonction..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="mt-2 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm transition-all"
                />
              )}
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500 hover:opacity-95 shadow-md shadow-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                Accéder à l'application
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

