import { useState, FormEvent } from 'react';
import { Organization, Member } from '../types';
import { exportMembersToCSV } from '../utils';
import { 
  Building2, 
  Download, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Save,
  Music
} from 'lucide-react';

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
  const [userRole, setUserRole] = useState(organization.userRole);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onUpdateOrg({
      name: name.trim(),
      type: 'Chorale',
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
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Configuration de la Chorale
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ajustez les informations de votre groupe et exportez vos données de sauvegarde.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Organization Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 border border-slate-200/90 rounded-2xl shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Music className="w-4 h-4 text-rose-500" />
              <span>Informations de la Chorale</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom de la chorale
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Votre rôle / fonction
                </label>
                <input
                  type="text"
                  required
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  placeholder="Responsable Commission Sociale, Chef de chœur..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                >
                  {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{saveSuccess ? 'Modifications enregistrées !' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Backup Export */}
          <div className="bg-white p-6 border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-500" />
              <span>Sauvegarde & Exportation CSV</span>
            </h3>
            <p className="text-xs text-slate-500">
              Téléchargez l'intégralité de vos {members.length} fiches choristes au format CSV compatible avec Excel.
            </p>
            <button
              onClick={handleExport}
              disabled={members.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Exporter la liste complète ({members.length})</span>
            </button>
          </div>
        </div>

        {/* Right Column: Danger Zone / Reset */}
        <div className="space-y-6">
          <div className="bg-white p-6 border border-rose-200 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Réinitialisation</span>
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Effacer la configuration et la liste des membres pour repartir de zéro.
            </p>

            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Réinitialiser l'espace</span>
              </button>
            ) : (
              <div className="space-y-2 p-3 bg-rose-50 rounded-xl border border-rose-200">
                <p className="text-[11px] font-bold text-rose-800 text-center">
                  Êtes-vous absolument certain ?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
                  >
                    Non
                  </button>
                  <button
                    onClick={onResetApp}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Oui, effacer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
