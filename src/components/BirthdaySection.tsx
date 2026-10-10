import { useState } from 'react';
import { Member, Organization } from '../types';
import { 
  isBirthdayToday, 
  getDaysUntilBirthday, 
  calculateAge, 
  formatPhoneNumber,
  formatMessageTemplate
} from '../utils';
import { 
  Cake, 
  Phone, 
  MessageCircle, 
  Mail, 
  Copy, 
  Check, 
  ChevronRight, 
  Calendar, 
  Share2,
  CalendarDays,
  Sparkles,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BirthdaySectionProps {
  members: Member[];
  organization: Organization;
}

export default function BirthdaySection({ members, organization }: BirthdaySectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeActionsMemberId, setActiveActionsMemberId] = useState<string | null>(null);

  // Filter members having birthday TODAY
  const todayBirthdays = members.filter(m => isBirthdayToday(m.birthDate));

  // Filter members with upcoming birthdays sorted by days remaining
  const upcomingBirthdays = members
    .filter(m => !isBirthdayToday(m.birthDate))
    .map(m => ({
      member: m,
      daysLeft: getDaysUntilBirthday(m.birthDate)
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // Templates
  const personalTemplate = "Joyeux anniversaire {firstName} ! 🎉 Toute la chorale {orgName} te souhaite une excellente journée, une santé de fer et beaucoup de joie au pupitre {role}. Passe une très belle fête ! 🎂🎶";
  const groupTemplate = "🎂 C'est l'anniversaire de notre cher(e) {firstName} {lastName} ({role}) aujourd'hui ! Joignons nos voix pour lui souhaiter une magnifique année et plein de bonheur ! 🥳🎶🎉";

  const getPersonalMessage = (m: Member) => {
    return formatMessageTemplate(personalTemplate, m, organization.name, organization.userRole);
  };

  const getGroupMessage = (m: Member) => {
    return formatMessageTemplate(groupTemplate, m, organization.name, organization.userRole);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleWhatsApp = (m: Member) => {
    const message = getPersonalMessage(m);
    const cleanedPhone = formatPhoneNumber(m.phone);
    const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEmail = (m: Member) => {
    if (!m.email) return;
    const subject = `Joyeux Anniversaire ${m.firstName} ! - ${organization.name}`;
    const body = getPersonalMessage(m);
    const url = `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Tableau des Anniversaires</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {organization.name} • {members.length} choriste{members.length > 1 ? 's' : ''} enregistré{members.length > 1 ? 's' : ''}
          </p>
        </div>

        {todayBirthdays.length > 0 ? (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl self-start sm:self-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <div className="text-xs">
              <span className="font-bold text-rose-800 block">{todayBirthdays.length} anniversaire{todayBirthdays.length > 1 ? 's' : ''} aujourd'hui !</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-500 text-xs self-start sm:self-center">
            <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Aucun anniversaire aujourd'hui</span>
          </div>
        )}
      </div>

      {/* TODAY CELEBRATIONS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Cake className="w-4 h-4 text-rose-500" />
          <span>Anniversaires du jour</span>
        </h3>

        {todayBirthdays.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {todayBirthdays.map((member) => {
              const age = calculateAge(member.birthDate);
              const personalMsg = getPersonalMessage(member);
              const groupMsg = getGroupMessage(member);
              const isExpanded = activeActionsMemberId === member.id;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-rose-400/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs ${
                          member.gender === 'F' 
                            ? 'bg-rose-500' 
                            : 'bg-indigo-600'
                        }`}>
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                            {member.firstName} {member.lastName}
                            <span>🎂</span>
                          </h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-100 mt-1">
                            {member.role}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-rose-600">{age} ans</span>
                      </div>
                    </div>

                    {/* Contacts info */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium text-[10px]">Téléphone</span>
                        <span className="font-mono font-bold text-slate-800">{member.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium text-[10px]">E-mail</span>
                        <span className="font-medium text-slate-800 truncate block">
                          {member.email || 'Non renseigné'}
                        </span>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Call */}
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-all active:scale-95"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-600" />
                          <span>Appeler</span>
                        </a>

                        {/* WhatsApp */}
                        <button
                          onClick={() => handleWhatsApp(member)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-all shadow-xs active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        {/* Email */}
                        <button
                          onClick={() => handleEmail(member)}
                          disabled={!member.email}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-all active:scale-95"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-600" />
                          <span>E-mail</span>
                        </button>
                      </div>

                      {/* Copy buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(personalMsg, `p-${member.id}`)}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                            copiedId === `p-${member.id}`
                              ? 'bg-rose-500 border-rose-500 text-white'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {copiedId === `p-${member.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                          <span>Copier Message Direct</span>
                        </button>

                        <button
                          onClick={() => handleCopy(groupMsg, `g-${member.id}`)}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                            copiedId === `g-${member.id}`
                              ? 'bg-rose-500 border-rose-500 text-white'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {copiedId === `g-${member.id}` ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                          <span>Copier Annonce Groupe</span>
                        </button>
                      </div>
                    </div>

                    {/* Preview toggle */}
                    <div className="border-t border-slate-100 pt-2.5">
                      <button
                        onClick={() => setActiveActionsMemberId(isExpanded ? null : member.id)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        <span>{isExpanded ? 'Masquer le texte' : 'Afficher le texte complet'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-2 pt-2 text-xs"
                          >
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                              <span className="font-bold text-[10px] text-slate-500 block mb-1">Message direct :</span>
                              <p className="text-slate-800 whitespace-pre-wrap select-all">{personalMsg}</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                              <span className="font-bold text-[10px] text-slate-500 block mb-1">Annonce groupe :</span>
                              <p className="text-slate-800 whitespace-pre-wrap select-all">{groupMsg}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 p-8 rounded-2xl text-center shadow-xs max-w-xl mx-auto space-y-2">
            <Cake className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">Aucun anniversaire aujourd'hui</h4>
            <p className="text-xs text-slate-500">
              Consultez les dates à venir ci-dessous ou ajoutez des choristes dans l'onglet "Choristes & Pupitres".
            </p>
          </div>
        )}
      </div>

      {/* UPCOMING BIRTHDAYS (30 DAYS) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>Prochains Anniversaires (30 prochains jours)</span>
        </h3>

        {upcomingBirthdays.filter(item => item.daysLeft <= 30).length > 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
            {upcomingBirthdays
              .filter(item => item.daysLeft <= 30)
              .map(({ member, daysLeft }) => {
                const age = calculateAge(member.birthDate) + 1;
                const bDate = new Date(member.birthDate);
                const dayMonthStr = bDate.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long'
                });

                return (
                  <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                        member.gender === 'F' ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}>
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </div>
                      
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{member.role}</span>
                          <span>•</span>
                          <span>Fêtera ses <strong className="font-bold text-slate-900">{age} ans</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800">
                        {dayMonthStr}
                      </span>
                      <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">
                        Dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl text-center text-xs text-slate-500 shadow-xs">
            Aucun anniversaire prévu dans les 30 prochains jours.
          </div>
        )}
      </div>

    </div>
  );
}

