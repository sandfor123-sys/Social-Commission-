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
  Users, 
  X, 
  Plus, 
  Music,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemberSectionProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onAddMultipleMembers: (newMembers: Member[]) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

const PUPITRE_PRESETS = [
  { label: 'Soprano', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { label: 'Alto', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { label: 'Ténor', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  { label: 'Basse', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { label: 'Chef de chœur', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { label: 'Sous-chef de chœur', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { label: 'Pianiste / Organiste', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { label: 'Responsable Social', color: 'bg-pink-50 text-pink-800 border-pink-200' }
];

export default function MemberSection({
  members,
  onAddMember,
  onAddMultipleMembers,
  onUpdateMember,
  onDeleteMember
}: MemberSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'import'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [pupitreFilter, setPupitreFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');

  // Manual Add/Edit Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState<Gender>('F');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Soprano');

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
    setGender('F');
    setBirthDate('');
    setPhone('');
    setEmail('');
    setRole('Soprano');
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
      alert("Veuillez sélectionner un fichier CSV valide.");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      const validated = parseAndValidateCSV(text);
      setParsedRows(validated);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    const validMembers: Member[] = parsedRows
      .filter(r => r.isValid)
      .map(r => ({
        id: Math.random().toString(36).substring(2, 9),
        lastName: r.data.lastName || '',
        firstName: r.data.firstName || '',
        gender: r.data.gender || 'M',
        birthDate: r.data.birthDate || '',
        phone: r.data.phone || '',
        email: r.data.email,
        role: r.data.role || 'Choriste'
      }));

    if (validMembers.length === 0) {
      alert("Aucune ligne valide à importer.");
      return;
    }

    onAddMultipleMembers(validMembers);
    setParsedRows([]);
    setCsvRawText('');
    setFileName('');
    setActiveSubTab('list');
  };

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPupitre = 
      pupitreFilter === 'ALL' || 
      m.role.toLowerCase().includes(pupitreFilter.toLowerCase());

    const matchesGender = 
      genderFilter === 'ALL' || 
      m.gender === genderFilter;

    return matchesSearch && matchesPupitre && matchesGender;
  });

  const getPupitreBadgeClass = (memberRole: string) => {
    const lower = memberRole.toLowerCase();
    if (lower.includes('soprano')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (lower.includes('alto')) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (lower.includes('ténor') || lower.includes('tenor')) return 'bg-sky-50 text-sky-800 border-sky-200';
    if (lower.includes('basse')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (lower.includes('chef') || lower.includes('maître') || lower.includes('maitre')) return 'bg-purple-50 text-purple-800 border-purple-200';
    if (lower.includes('pianiste') || lower.includes('organiste') || lower.includes('musicien')) return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Sub navigation & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'list'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Liste des Choristes ({members.length})
          </button>

          <button
            onClick={() => setActiveSubTab('import')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'import'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importer CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadCSVTemplate}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            title="Télécharger le modèle de fichier CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Modèle CSV</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Choriste</span>
          </button>
        </div>
      </div>

      {/* SUBTAB: LIST OF MEMBERS */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom, pupitre, téléphone..."
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

              {/* Genre Filter */}
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as 'ALL' | 'M' | 'F')}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="ALL">Tous genres</option>
                <option value="F">Femmes</option>
                <option value="M">Hommes</option>
              </select>
            </div>

            {/* Pupitre Quick Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-slate-400 font-semibold text-[11px] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Pupitre :
              </span>
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'Soprano', label: 'Soprano' },
                { id: 'Alto', label: 'Alto' },
                { id: 'Ténor', label: 'Ténor' },
                { id: 'Basse', label: 'Basse' },
                { id: 'Chef', label: 'Direction' },
                { id: 'Pianiste', label: 'Musiciens' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPupitreFilter(p.id)}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                    pupitreFilter === p.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table / Grid */}
          {filteredMembers.length > 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
              
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-5 py-3.5">Choriste</th>
                      <th scope="col" className="px-5 py-3.5">Pupitre / Rôle</th>
                      <th scope="col" className="px-5 py-3.5">Date de Naissance</th>
                      <th scope="col" className="px-5 py-3.5">Téléphone</th>
                      <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                              member.gender === 'F' ? 'bg-rose-500' : 'bg-indigo-600'
                            }`}>
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{member.firstName} {member.lastName}</div>
                              {member.email && (
                                <div className="text-[11px] text-slate-400">{member.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getPupitreBadgeClass(member.role)}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-700 font-medium">
                          {new Date(member.birthDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 font-mono text-slate-800 font-semibold">
                          {member.phone}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(member)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
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
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
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

              {/* Mobile Card Grid */}
              <div className="block md:hidden divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                          member.gender === 'F' ? 'bg-rose-500' : 'bg-indigo-600'
                        }`}>
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{member.firstName} {member.lastName}</div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border mt-1 ${getPupitreBadgeClass(member.role)}`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer définitivement ${member.firstName} ${member.lastName} ?`)) {
                              onDeleteMember(member.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Téléphone</span>
                        <span className="font-mono font-bold text-slate-800">{member.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Date de Naissance</span>
                        <span className="font-semibold text-slate-800">
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
            <div className="py-12 text-center bg-white border border-slate-200/90 rounded-2xl max-w-lg mx-auto space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Aucun choriste trouvé</p>
                <p className="text-xs text-slate-500">
                  {searchTerm || pupitreFilter !== 'ALL' || genderFilter !== 'ALL'
                    ? "Modifiez vos filtres ou termes de recherche."
                    : "Ajoutez votre premier choriste ou importez votre fichier CSV."}
                </p>
              </div>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un membre</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* SUBTAB: CSV IMPORT */}
      {activeSubTab === 'import' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-rose-500" />
                <span>Importer un fichier CSV de choristes</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Glissez votre fichier Excel/CSV contenant les colonnes : <strong>Nom, Prénom, Sexe, Date de naissance, Téléphone, Pupitre</strong>.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-rose-500 bg-rose-50/50' 
                  : 'border-slate-300 hover:border-rose-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">
                {fileName ? fileName : "Cliquez ou glissez-déposez votre fichier CSV ici"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Séparateur point-virgule (;) ou virgule (,)</p>
            </div>

            {/* Preview of Parsed Rows */}
            {parsedRows.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-700">
                    {parsedRows.filter(r => r.isValid).length} ligne(s) valide(s) sur {parsedRows.length} détectée(s)
                  </div>
                  <button
                    onClick={handleConfirmImport}
                    disabled={parsedRows.filter(r => r.isValid).length === 0}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-40"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirmer l'importation ({parsedRows.filter(r => r.isValid).length})</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-80">
                  <table className="min-w-full divide-y divide-slate-100 text-xs">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                      <tr>
                        <th className="px-3 py-2">État</th>
                        <th className="px-3 py-2">Nom</th>
                        <th className="px-3 py-2">Prénom</th>
                        <th className="px-3 py-2">Sexe</th>
                        <th className="px-3 py-2">Date Naiss.</th>
                        <th className="px-3 py-2">Téléphone</th>
                        <th className="px-3 py-2">Pupitre</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedRows.map((row, idx) => (
                        <tr key={idx} className={row.isValid ? 'bg-white' : 'bg-rose-50/50'}>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {row.isValid ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Valide
                              </span>
                            ) : (
                              <span className="text-rose-600 font-bold flex items-center gap-1" title={row.errors.join(', ')}>
                                <AlertCircle className="w-3.5 h-3.5" /> Erreur
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 font-medium text-slate-800">{row.data.lastName}</td>
                          <td className="px-3 py-2 font-medium text-slate-800">{row.data.firstName}</td>
                          <td className="px-3 py-2">{row.data.gender}</td>
                          <td className="px-3 py-2 font-mono">{row.data.birthDate}</td>
                          <td className="px-3 py-2 font-mono">{row.data.phone}</td>
                          <td className="px-3 py-2">{row.data.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MEMBER */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Music className="w-4 h-4 text-rose-500" />
                  <span>{editingMember ? 'Modifier la fiche choriste' : 'Nouveau choriste'}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kouassi"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Marie"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sexe *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                    >
                      <option value="F">Femme</option>
                      <option value="M">Homme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date de Naissance *</label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+2250707070707"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email (facultatif)</label>
                    <input
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pupitre ou Fonction *</label>
                  <input
                    type="text"
                    required
                    placeholder="Soprano, Alto, Ténor, Basse, Chef de chœur..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {/* Quick selection pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {PUPITRE_PRESETS.map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setRole(p.label)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                          role === p.label ? 'ring-2 ring-rose-500 ring-offset-1 ' + p.color : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                  >
                    {editingMember ? 'Enregistrer les modifications' : 'Ajouter le choriste'}
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
