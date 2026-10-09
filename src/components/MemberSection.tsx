import { useState, useRef, FormEvent, DragEvent, ChangeEvent } from 'react';
import { Member, Gender } from '../types';
import { downloadCSVTemplate, parseAndValidateCSV, CSVRowValidation } from '../utils';
import { 
  UserPlus, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Trash2, 
  Edit2, 
  Check, 
  AlertCircle, 
  AlertTriangle,
  Users,
  X,
  Plus,
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemberSectionProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onAddMultipleMembers: (newMembers: Member[]) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

export default function MemberSection({
  members,
  onAddMember,
  onAddMultipleMembers,
  onUpdateMember,
  onDeleteMember
}: MemberSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'import'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Manual Add/Edit Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState<Gender>('M');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  // CSV Import State
  const [dragActive, setDragActive] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<CSVRowValidation[]>([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingMember(null);
    setLastName('');
    setFirstName('');
    setGender('M');
    setBirthDate('');
    setPhone('');
    setEmail('');
    setRole('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setLastName(member.lastName);
    setFirstName(member.firstName);
    setGender(member.gender);
    setBirthDate(member.birthDate);
    setPhone(member.phone);
    setEmail(member.email || '');
    setRole(member.role);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!lastName.trim() || !firstName.trim() || !birthDate || !phone.trim() || !role.trim()) {
      return;
    }

    const memberData: Member = {
      id: editingMember ? editingMember.id : Math.random().toString(36).substring(2, 9),
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      gender,
      birthDate,
      phone: phone.trim(),
      email: email.trim() ? email.trim() : undefined,
      role: role.trim()
    };

    if (editingMember) {
      onUpdateMember(memberData);
    } else {
      onAddMember(memberData);
    }

    setIsModalOpen(false);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      alert("Veuillez sélectionner uniquement un fichier au format .csv");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvRawText(text);
      const validationResults = parseAndValidateCSV(text);
      setParsedRows(validationResults);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleConfirmImport = () => {
    const validMembers = parsedRows
      .filter(row => row.isValid)
      .map(row => row.data as Member);
    
    if (validMembers.length > 0) {
      onAddMultipleMembers(validMembers);
      handleCancelImport();
      setActiveSubTab('list');
    }
  };

  const handleCancelImport = () => {
    setCsvRawText('');
    setParsedRows([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const allRoles = Array.from(new Set(members.map(m => m.role))).filter(Boolean);

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = genderFilter === 'ALL' || m.gender === genderFilter;
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;

    return matchesSearch && matchesGender && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* Tab Navigation with premium warm layout */}
      <div className="flex items-center justify-between border-b border-[#2d241f] pb-1">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'list'
                ? 'border-amber-500 text-amber-300 font-extrabold'
                : 'border-transparent text-amber-200/50 hover:text-amber-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Liste des membres ({members.length})</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('import')}
            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'import'
                ? 'border-amber-500 text-amber-300 font-extrabold'
                : 'border-transparent text-amber-200/50 hover:text-amber-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Importer des membres (.csv)</span>
          </button>
        </div>

        {activeSubTab === 'list' && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-all active:scale-95 shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>Ajouter un membre</span>
          </button>
        )}
      </div>

      {activeSubTab === 'list' ? (
        // LIST TAB
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-[#161311] p-4 border border-[#2d241f] rounded-2xl flex flex-col md:flex-row md:items-center gap-4 shadow-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#221c18] border border-[#382e27] rounded-xl text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-[#2c241f] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Gender Filter Toggle */}
              <div className="flex items-center gap-1 bg-[#221c18] rounded-xl p-1 text-xs border border-[#382e27]">
                <button
                  onClick={() => setGenderFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                    genderFilter === 'ALL' ? 'bg-amber-500 text-black' : 'text-amber-200/60 hover:text-amber-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setGenderFilter('M')}
                  className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                    genderFilter === 'M' ? 'bg-amber-500 text-black' : 'text-amber-200/60 hover:text-amber-200'
                  }`}
                >
                  Hommes
                </button>
                <button
                  onClick={() => setGenderFilter('F')}
                  className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                    genderFilter === 'F' ? 'bg-amber-500 text-black' : 'text-amber-200/60 hover:text-amber-200'
                  }`}
                >
                  Femmes
                </button>
              </div>

              {/* Role Filter Selector */}
              <div className="flex items-center gap-2 bg-[#221c18] border border-[#382e27] rounded-xl px-3 py-1">
                <Filter className="w-3.5 h-3.5 text-amber-400/50" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-amber-200 py-1.5 focus:outline-none border-none cursor-pointer"
                >
                  <option value="ALL" className="bg-[#161311] text-amber-100">Toutes fonctions</option>
                  {allRoles.map(role => (
                    <option key={role} value={role} className="bg-[#161311] text-amber-100">{role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Members List Container */}
          {filteredMembers.length > 0 ? (
            <div className="bg-[#161311] border border-[#2d241f] rounded-2xl overflow-hidden shadow-lg">
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2d241f] text-left text-sm">
                  <thead className="bg-[#1c1815] text-xs font-bold text-amber-400/70 uppercase tracking-widest">
                    <tr>
                      <th scope="col" className="px-6 py-4.5">Membre</th>
                      <th scope="col" className="px-6 py-4.5">Genre</th>
                      <th scope="col" className="px-6 py-4.5">Date de Naissance</th>
                      <th scope="col" className="px-6 py-4.5">Téléphone</th>
                      <th scope="col" className="px-6 py-4.5">Fonction / Rôle</th>
                      <th scope="col" className="px-6 py-4.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2d241f] bg-transparent">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-[#1c1815]/50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                              member.gender === 'F' 
                                ? 'bg-rose-950/40 text-rose-300 border-rose-900/30' 
                                : 'bg-sky-950/40 text-sky-300 border-sky-900/30'
                            }`}>
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-amber-50">{member.firstName} {member.lastName}</div>
                              {member.email && (
                                <div className="text-xs text-amber-200/40 mt-0.5">{member.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                            member.gender === 'F' 
                              ? 'bg-rose-950/30 text-rose-300' 
                              : 'bg-sky-950/30 text-sky-300'
                          }`}>
                            {member.gender === 'F' ? 'Femme' : 'Homme'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-amber-100">
                          {new Date(member.birthDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-amber-200/80">
                          {member.phone}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-amber-200 font-semibold">
                          {member.role}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(member)}
                              className="p-2 rounded-lg bg-[#221c18] hover:bg-[#2d241f] text-amber-400 transition-colors border border-[#382d26]"
                              title="Modifier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer définitivement ${member.firstName} ${member.lastName} ?`)) {
                                  onDeleteMember(member.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-[#221c18] hover:bg-rose-950/40 text-amber-400 hover:text-rose-400 border border-[#382d26] transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Grid View */}
              <div className="block md:hidden grid grid-cols-1 divide-y divide-[#2d241f]">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="p-4 space-y-3 bg-[#161311]">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                          member.gender === 'F' 
                            ? 'bg-rose-950/30 text-rose-300 border-rose-900/40' 
                            : 'bg-sky-950/30 text-sky-300 border-sky-900/40'
                        }`}>
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-amber-50">{member.firstName} {member.lastName}</div>
                          <div className="text-xs font-bold text-amber-400 mt-0.5">{member.role}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 rounded-lg bg-[#221c18] text-amber-400 border border-[#3d2e24]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer définitivement ${member.firstName} ${member.lastName} ?`)) {
                              onDeleteMember(member.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-[#221c18] text-rose-400 border border-[#3d2e24]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#2d241f] text-xs">
                      <div>
                        <span className="text-amber-200/40 block mb-0.5">Téléphone</span>
                        <span className="font-mono font-bold text-amber-200">{member.phone}</span>
                      </div>
                      <div>
                        <span className="text-amber-200/40 block mb-0.5">Anniversaire</span>
                        <span className="font-bold text-amber-200">
                          {new Date(member.birthDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center bg-[#161311] border border-[#2d241f] rounded-2xl max-w-2xl mx-auto space-y-4">
              <Users className="w-12 h-12 text-amber-500/40 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-50">Aucun membre enregistré</p>
                <p className="text-xs text-amber-200/50 max-w-sm mx-auto leading-relaxed">
                  {searchTerm || roleFilter !== 'ALL' || genderFilter !== 'ALL'
                    ? "Aucun membre ne correspond à vos filtres de recherche."
                    : "Commencez à créer votre communauté en ajoutant votre premier membre manuellement ou en important un fichier CSV de contacts."}
                </p>
              </div>
              {!searchTerm && roleFilter === 'ALL' && genderFilter === 'ALL' && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-all shadow-md"
                  >
                    Ajouter manuellement
                  </button>
                  <button
                    onClick={() => setActiveSubTab('import')}
                    className="px-4 py-2 bg-[#221c18] border border-[#3d2e24] text-amber-400 font-bold rounded-xl text-xs transition-all hover:bg-[#2d241f]"
                  >
                    Importer un CSV
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // IMPORT CSV TAB WITH LUXURY STYLING
        <div className="space-y-6">
          <div className="bg-[#221c18] p-5 rounded-2xl border border-[#3d2e24] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-200 flex items-center gap-1.5 font-serif">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                Modèle CSV structuré d'importation
              </h4>
              <p className="text-xs text-amber-200/60 leading-relaxed max-w-xl">
                Téléchargez notre fichier modèle pré-configuré afin d'éviter tout conflit de colonnes lors de l'importation de vos membres.
              </p>
            </div>
            
            <button
              onClick={downloadCSVTemplate}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#161311] border border-[#3d2e24] hover:border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Modèle d'import (.csv)</span>
            </button>
          </div>

          {parsedRows.length === 0 ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] ${
                dragActive 
                  ? 'border-amber-400 bg-amber-500/5 scale-98' 
                  : 'border-[#382d26] hover:border-amber-400/50 bg-[#161311] hover:bg-[#1c1815]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="p-3.5 bg-[#221c18] rounded-2xl text-amber-400 border border-[#3d2e24] mb-4 shadow-inner">
                <Upload className="w-8 h-8" />
              </div>
              <h5 className="text-sm font-bold text-amber-100">
                Glissez-déposez votre fichier .csv ici
              </h5>
              <p className="text-xs text-amber-200/40 mt-1 max-w-sm">
                ou cliquez pour parcourir les dossiers (séparateurs autorisés : ";" ou ",")
              </p>
              
              <div className="mt-5 flex gap-4 text-[9px] uppercase tracking-widest font-bold text-amber-200/30 bg-[#221c18] py-2 px-4 rounded-xl border border-[#382d26]">
                <span>Encodage: UTF-8</span>
                <span>•</span>
                <span>Max: 500 lignes</span>
              </div>
            </div>
          ) : (
            // REVIEW IMPORT PANEL
            <div className="space-y-6">
              <div className="bg-[#161311] border border-[#2d241f] rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-amber-50 font-serif">
                    Vérification du fichier : <span className="text-amber-400 italic font-medium">{fileName}</span>
                  </h4>
                  
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="text-xs text-amber-200/60 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-500/40" />
                      Total lignes : <strong>{parsedRows.length}</strong>
                    </span>
                    <span className="text-xs text-amber-200/60 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Valides et prêts : <strong className="text-emerald-400">{parsedRows.filter(r => r.isValid).length}</strong>
                    </span>
                    {parsedRows.some(r => !r.isValid) && (
                      <span className="text-xs text-amber-200/60 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        Erreurs identifiées : <strong className="text-rose-400">{parsedRows.filter(r => !r.isValid).length}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCancelImport}
                    className="px-4 py-2 border border-[#3d2e24] hover:bg-[#221c18] text-amber-200 rounded-xl text-xs font-semibold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    disabled={parsedRows.filter(r => r.isValid).length === 0}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-[#221c18] disabled:text-amber-200/30 text-black font-bold rounded-xl text-xs transition-all shadow-md disabled:cursor-not-allowed active:scale-95"
                  >
                    Confirmer l'import ({parsedRows.filter(r => r.isValid).length})
                  </button>
                </div>
              </div>

              {/* ROWS VERIFICATION */}
              <div className="bg-[#161311] border border-[#2d241f] rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 bg-[#1c1815] border-b border-[#2d241f]">
                  <h5 className="text-xs font-bold text-amber-400/80 uppercase tracking-widest">
                    Journal d'analyse des lignes de données
                  </h5>
                </div>

                <div className="overflow-x-auto max-h-[350px]">
                  <table className="min-w-full divide-y divide-[#2d241f] text-left text-xs">
                    <thead className="bg-[#221c18] font-bold text-amber-200/60">
                      <tr>
                        <th className="px-4 py-3 text-center w-12 border-r border-[#2d241f]">Ligne</th>
                        <th className="px-4 py-3">Données Trouvées</th>
                        <th className="px-4 py-3">Statut & Diagnostics</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d241f] bg-transparent">
                      {parsedRows.map((row, idx) => (
                        <tr key={idx} className={`hover:bg-[#1c1815]/50 transition-colors ${!row.isValid ? 'bg-rose-950/10' : ''}`}>
                          <td className="px-4 py-3 text-center font-mono font-bold text-amber-200/30 border-r border-[#2d241f]">
                            {row.rowNumber}
                          </td>
                          <td className="px-4 py-3 space-y-1">
                            <div className="font-bold text-amber-50">
                              {row.data.firstName || '[Nom manquant]'} {row.data.lastName || ''} ({row.data.gender || '?'})
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-amber-200/50">
                              <div>Anniv : <span className="font-semibold text-amber-200">{row.data.birthDate || '[Vide]'}</span></div>
                              <div>Tél : <span className="font-mono text-amber-200">{row.data.phone || '[Vide]'}</span></div>
                              <div className="col-span-2">Fonction : <span className="font-medium text-amber-300">{row.data.role || '[Vide]'}</span></div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {row.isValid ? (
                              row.warnings.length > 0 ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/30 px-2.5 py-1 rounded-md border border-amber-900/40">
                                    <AlertTriangle className="w-3 h-3 text-amber-400" /> Converti avec alerte
                                  </span>
                                  {row.warnings.map((w, wIdx) => (
                                    <p key={wIdx} className="text-[10px] text-amber-200/40 pl-1">{w}</p>
                                  ))}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-900/40">
                                  <Check className="w-3 h-3 text-emerald-400" /> Prêt pour import
                                </span>
                              )
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-950/30 px-2.5 py-1 rounded-md border border-rose-900/40">
                                  <AlertCircle className="w-3 h-3 text-rose-400" /> Ligne incorrecte
                                </span>
                                {row.errors.map((e, eIdx) => (
                                  <p key={eIdx} className="text-[10px] font-semibold text-rose-400 pl-1">• {e}</p>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Add/Edit Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#060505]/90"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-[#161311] rounded-2xl shadow-2xl border border-[#2d241f] overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-[#2d241f] flex items-center justify-between bg-[#1c1815]">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <UserPlus className="w-5 h-5" />
                  <h4 className="text-base font-bold font-serif text-amber-50">
                    {editingMember ? 'Modifier la fiche membre' : 'Créer un nouveau membre'}
                  </h4>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#221c18] text-amber-200/40 hover:text-amber-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-200/60 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kouassi"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-amber-100 placeholder-amber-200/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-[#2c241f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200/60 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Marie"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-amber-100 placeholder-amber-200/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-[#2c241f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-200/60 mb-1">
                      Sexe *
                    </label>
                    <div className="flex bg-[#221c18] p-1 rounded-lg gap-1 text-xs border border-[#3d2e24]">
                      <button
                        type="button"
                        onClick={() => setGender('M')}
                        className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
                          gender === 'M' ? 'bg-amber-500 text-black' : 'text-amber-200/50 hover:text-amber-200'
                        }`}
                      >
                        Homme (M)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('F')}
                        className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
                          gender === 'F' ? 'bg-amber-500 text-black' : 'text-amber-200/50 hover:text-amber-200'
                        }`}
                      >
                        Femme (F)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200/60 mb-1">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-[#ebdcd3] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-[#2c241f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-200/60 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +22507070707"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-amber-100 placeholder-amber-200/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-[#2c241f] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200/60 mb-1">
                      Adresse Email (facultatif)
                    </label>
                    <input
                      type="email"
                      placeholder="Ex: marie@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-amber-100 placeholder-amber-200/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-[#2c241f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200/60 mb-1">
                    Fonction ou Rôle au sein de la communauté *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Chanteuse Alto, Secrétaire, Trésorier..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#221c18] border border-[#3d2e24] rounded-lg text-sm text-amber-100 placeholder-amber-200/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-[#2c241f]"
                  />
                </div>

                <div className="pt-4 border-t border-[#2d241f] flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-[#221c18] border border-[#3d2e24] hover:bg-[#2d241f] text-amber-200 rounded-xl text-sm font-semibold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
                  >
                    {editingMember ? 'Enregistrer les modifications' : 'Ajouter le membre'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
