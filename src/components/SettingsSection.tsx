import { useState, FormEvent } from 'react';
import { Organization, Member } from '../types';
import { exportMembersToCSV } from '../utils';
import { 
  Building2, 
  UserSquare2, 
  Download, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Save,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsSectionProps {
  organization: Organization;
  members: Member[];
  onUpdateOrg: (org: Organization) => void;
  onResetApp: () => void;
}

export default function SettingsSection({ 
  organization, 
  members, 
  onUpdateOrg, 
  onResetApp 
}: SettingsSectionProps) {
  const [name, setName] = useState(organization.name);
  const [type, setType] = useState(organization.type || 'Chorale');
  const [userRole, setUserRole] = useState(organization.userRole);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onUpdateOrg({
      name: name.trim(),
      type: type || undefined,
      userRole: userRole.trim()
    });
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExport = () => {
    exportMembersToCSV(members);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-amber-50 tracking-tight font-serif">
          Configuration & Paramètres
        </h2>
        <p className="text-xs text-amber-200/50 mt-1">
          Ajustez les détails de votre commission sociale et exportez vos données de sauvegarde.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Org Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#161311] p-6 border border-[#2d241f] rounded-2xl shadow-lg">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              Informations Générales
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200/60 mb-1">
                  Nom de la communauté / organisation
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-200/60 mb-1">
                    Type d'organisation
                  </label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Ex: Chorale, Club..."
                    className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200/60 mb-1">
                    Votre fonction
                  </label>
                  <input
                    type="text"
                    required
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end border-t border-[#2d241f]">
                <button
                  type="submit"
                  disabled={!name.trim() || !userRole.trim()}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    saveSuccess 
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-black shadow-md hover:bg-amber-400'
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Paramètres enregistrés !</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Enregistrer les modifications</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#161311] p-6 border border-[#2d241f] rounded-2xl shadow-lg">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <UserSquare2 className="w-4 h-4 text-amber-500" />
              Sauvegarde et Exportation
            </h3>
            <p className="text-xs text-amber-200/50 mb-4 leading-relaxed">
              Exportez l'ensemble de vos fiches membres au format universel .csv. Cela vous permet de créer une sauvegarde locale sécurisée et de réimporter vos membres sur n'importe quel appareil.
            </p>

            <button
              onClick={handleExport}
              disabled={members.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#221c18] border border-[#3d2e24] hover:border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le fichier de sauvegarde ({members.length} membre{members.length > 1 ? 's' : ''})</span>
            </button>
          </div>
        </div>

        {/* Right column: Risk Zone */}
        <div className="space-y-6">
          <div className="bg-rose-950/20 p-6 border border-rose-900/40 rounded-2xl">
            <h3 className="text-xs font-bold text-rose-300 uppercase tracking-widest mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Zone Critique
            </h3>
            <p className="text-xs text-rose-200/50 mb-4 leading-relaxed">
              La réinitialisation supprimera définitivement vos fiches membres ainsi que le paramétrage de votre communauté de ce navigateur.
            </p>

            {showConfirmReset ? (
              <div className="space-y-2.5 bg-[#161311] p-4 rounded-xl border border-rose-900/30">
                <p className="text-[11px] font-bold text-rose-300">
                  Cette action est irréversible. Confirmer l'effacement total ?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onResetApp}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Oui, tout effacer
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 bg-[#221c18] text-amber-200 rounded-lg text-xs font-bold border border-[#3d2e24] transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#161311] border border-rose-900/40 hover:bg-rose-950/40 text-rose-300 rounded-xl text-xs font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Réinitialiser l'application</span>
              </button>
            )}
          </div>

          <div className="bg-[#161311] p-6 border border-[#2d241f] rounded-2xl shadow-lg">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500/50" />
              Données locales
            </h3>
            <p className="text-xs text-amber-200/60 leading-relaxed mb-2.5">
              Toutes les fiches de vos membres sont conservées au chaud dans votre stockage de session local.
            </p>
            <p className="text-xs text-amber-200/60 leading-relaxed">
              Aucun serveur n'héberge ou n'analyse vos contacts. Pensez à faire un export CSV régulier de sauvegarde.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
