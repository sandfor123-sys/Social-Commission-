import { useState, FormEvent } from 'react';
import { Organization } from '../types';
import { Shield, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface OrganizationSetupProps {
  onSave: (org: Organization) => void;
}

export default function OrganizationSetup({ onSave }: OrganizationSetupProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Chorale');
  const [customType, setCustomType] = useState('');
  const [userRole, setUserRole] = useState('Responsable de la commission sociale');
  const [customRole, setCustomRole] = useState('');

  const orgTypes = [
    'Chorale',
    'Église / Groupe religieux',
    'ONG',
    'Association locale',
    'Club sportif',
    'Groupe de classe / Alumni',
    'Entreprise / Équipe',
    'Autre'
  ];

  const commonRoles = [
    'Responsable de la commission sociale',
    'Secrétaire',
    'Président / Présidente',
    'Administrateur / Administratrice',
    'Chargé(e) des membres',
    'Autre'
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalType = type === 'Autre' ? customType : type;
    const finalRole = userRole === 'Autre' ? customRole : userRole;

    onSave({
      name: name.trim(),
      type: finalType || undefined,
      userRole: finalRole || 'Responsable de la commission sociale'
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0b0a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* App branding */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3"
      >
        <div className="flex justify-center text-amber-400">
          <div className="p-4 bg-[#161311] border border-amber-500/25 rounded-3xl shadow-[0_0_20px_rgba(245,158,11,0.06)]">
            <Heart className="h-10 w-10 fill-amber-400/20" />
          </div>
        </div>
        <h2 className="text-3xl font-serif font-extrabold text-amber-50 tracking-tight">
          Social Commission
        </h2>
        <p className="text-xs text-amber-200/50 italic max-w-xs mx-auto">
          « Les communautés se construisent aussi par les petites attentions. »
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-[#161311] py-8 px-6 shadow-2xl border border-[#2d241f] rounded-3xl sm:px-10 space-y-6">
          
          <h3 className="text-base font-serif font-bold text-amber-100 pb-3 border-b border-[#2d241f] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Création de votre espace
          </h3>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div>
              <label htmlFor="org-name" className="block text-xs font-bold text-amber-200/60 mb-1.5">
                Nom de votre organisation ou communauté *
              </label>
              <input
                id="org-name"
                name="org-name"
                type="text"
                required
                placeholder="Ex: Chorale Sainte Cécile, Football Club..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3.5 py-3 bg-[#221c18] border border-[#3d2e24] rounded-xl text-amber-100 placeholder-amber-200/25 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs transition-colors"
              />
            </div>

            <div>
              <label htmlFor="org-type" className="block text-xs font-bold text-amber-200/60 mb-1.5">
                Type de structure
              </label>
              <select
                id="org-type"
                name="org-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="block w-full px-3.5 py-3 bg-[#221c18] border border-[#3d2e24] rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs transition-colors cursor-pointer"
              >
                {orgTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#161311] text-amber-100">
                    {t}
                  </option>
                ))}
              </select>

              {type === 'Autre' && (
                <input
                  type="text"
                  required
                  placeholder="Spécifiez le type de communauté..."
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="mt-2 block w-full px-3.5 py-3 bg-[#221c18] border border-[#3d2e24] rounded-xl text-amber-100 placeholder-amber-200/25 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs transition-colors"
                />
              )}
            </div>

            <div>
              <label htmlFor="user-role" className="block text-xs font-bold text-amber-200/60 mb-1.5">
                Quel est votre rôle / fonction ? *
              </label>
              <select
                id="user-role"
                name="user-role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="block w-full px-3.5 py-3 bg-[#221c18] border border-[#3d2e24] rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs transition-colors cursor-pointer"
              >
                {commonRoles.map((r) => (
                  <option key={r} value={r} className="bg-[#161311] text-amber-100">
                    {r}
                  </option>
                ))}
              </select>

              {userRole === 'Autre' && (
                <input
                  type="text"
                  required
                  placeholder="Spécifiez votre fonction..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="mt-2 block w-full px-3.5 py-3 bg-[#221c18] border border-[#3d2e24] rounded-xl text-amber-100 placeholder-amber-200/25 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs transition-colors"
                />
              )}
            </div>

            <div className="bg-[#221c18] p-4 rounded-xl border border-[#3d2e24] flex items-start gap-3">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-200/60 leading-relaxed">
                Vos fiches de membres restent confinées dans la mémoire locale de votre navigateur. Aucune donnée n'est envoyée vers des serveurs tiers.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-[#221c18] disabled:text-amber-200/20 disabled:cursor-not-allowed transition-all duration-150 active:scale-98"
              >
                Créer l'espace communautaire
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
