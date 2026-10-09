import { useState, useEffect } from 'react';
import { Member, Organization } from '../types';
import { 
  isBirthdayToday, 
  getDaysUntilBirthday, 
  calculateAge, 
  formatPhoneNumber,
  formatMessageTemplate,
  requestDesktopNotificationPermission
} from '../utils';
import { 
  Cake, 
  Phone, 
  MessageCircle, 
  Mail, 
  Copy, 
  Check, 
  ChevronRight, 
  Bell, 
  Calendar, 
  Smile, 
  Share2,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BirthdaySectionProps {
  members: Member[];
  organization: Organization;
}

export default function BirthdaySection({ members, organization }: BirthdaySectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeActionsMemberId, setActiveActionsMemberId] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string>('default');

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const handleRequestNotify = async () => {
    const res = await requestDesktopNotificationPermission();
    setNotificationStatus(res);
  };

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

  // Template messages
  const personalTemplate = "Bonjour {firstName}, en ce jour spécial, toute la communauté de {orgName} et moi-même te souhaitons un merveilleux anniversaire ! Merci pour ton engagement et ta présence en tant que {role}. Passe une excellente journée ! 🎂✨";
  const groupTemplate = "🎉 C'est la fête aujourd'hui ! Nous célébrons l'anniversaire de notre cher(e) {firstName} {lastName} ({role}). En tant que {userRole}, je vous invite tous à vous joindre à moi pour lui souhaiter le meilleur. Joyeux anniversaire {firstName} ! 🥳🎂🎁";

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
    <div className="space-y-8">
      
      {/* Top Welcome / Notification area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#161311] border border-[#2d241f] p-6 rounded-2xl shadow-lg gap-5">
        <div>
          <h2 className="text-xl font-bold text-amber-50 tracking-tight flex items-center gap-2">
            <span>Bonjour,</span>
            <span className="text-amber-400 font-serif italic font-extrabold">{organization.userRole}</span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-1">
            Espace <strong className="font-semibold text-amber-100">{organization.name}</strong> • Suivi et célébration des anniversaires.
          </p>
        </div>

        {todayBirthdays.length > 0 ? (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/25 px-4 py-2.5 rounded-xl self-start md:self-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <div className="text-xs">
              <span className="font-bold text-amber-200 block">Notifications Actives</span>
              <span className="text-amber-200/70">{todayBirthdays.length} anniversaire{todayBirthdays.length > 1 ? 's' : ''} aujourd'hui !</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 bg-[#221c18] border border-[#2d241f] px-4 py-2.5 rounded-xl text-amber-200/50 text-xs self-start md:self-center">
            <CalendarDays className="w-4 h-4 text-amber-500/60 shrink-0" />
            <span>Aucune célébration aujourd'hui.</span>
          </div>
        )}
      </div>

      {/* TODAY CELEBRATIONS SECTION */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-amber-400/70 uppercase tracking-widest flex items-center gap-3">
          <span>Célébrations du Jour</span>
          <span className="h-px bg-gradient-to-r from-[#2d241f] to-transparent flex-1"></span>
        </h3>

        {todayBirthdays.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {todayBirthdays.map((member) => {
              const age = calculateAge(member.birthDate);
              const personalMsg = getPersonalMessage(member);
              const groupMsg = getGroupMessage(member);
              const isExpanded = activeActionsMemberId === member.id;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#161311] border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.04)] flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    
                    {/* Member profile header card */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-sm text-[#0d0b0a] shrink-0 shadow-md border-2 ${
                          member.gender === 'F' 
                            ? 'bg-rose-400 border-rose-300' 
                            : 'bg-amber-400 border-amber-300'
                        }`}>
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-serif font-bold text-amber-50 flex items-center gap-2 leading-none">
                            {member.firstName} {member.lastName}
                            <span className="text-lg">🎂</span>
                          </h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#221c18] border border-amber-500/20 text-amber-400 mt-2">
                            {member.role}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-[9px] uppercase font-bold text-amber-200/40 tracking-widest">Célèbre ses</span>
                        <span className="text-2xl font-serif font-extrabold text-amber-400">{age} ans</span>
                      </div>
                    </div>

                    {/* Member Info grid */}
                    <div className="grid grid-cols-2 gap-4 bg-[#221c18] p-4 rounded-xl border border-[#2d241f] text-xs">
                      <div>
                        <span className="text-amber-200/40 block font-medium mb-0.5">Téléphone</span>
                        <span className="font-mono font-bold text-amber-100">{member.phone}</span>
                      </div>
                      <div>
                        <span className="text-amber-200/40 block font-medium mb-0.5">E-mail</span>
                        <span className="font-medium text-amber-100 truncate block">
                          {member.email || 'Non renseigné'}
                        </span>
                      </div>
                    </div>

                    {/* Actions list */}
                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-bold text-amber-200/40 uppercase tracking-widest">Actions de bienveillance</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Call directly */}
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#2d241f] hover:bg-[#3d3129] border border-[#4d3d34] text-amber-100 font-bold rounded-xl text-xs transition-all active:scale-95"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Appeler</span>
                        </a>

                        {/* Open WhatsApp */}
                        <button
                          onClick={() => handleWhatsApp(member)}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1e2e1a] hover:bg-[#283e23] border border-[#3b5934] text-emerald-300 font-bold rounded-xl text-xs transition-all active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/15" />
                          <span>WhatsApp</span>
                        </button>

                        {/* Email if available */}
                        <button
                          onClick={() => handleEmail(member)}
                          disabled={!member.email}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#2d241f] hover:bg-[#3d3129] disabled:opacity-30 disabled:cursor-not-allowed border border-[#4d3d34] text-amber-100 font-bold rounded-xl text-xs transition-all active:scale-95"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>E-mail</span>
                        </button>
                      </div>

                      {/* Copier templates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={() => handleCopy(personalMsg, `p-${member.id}`)}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                            copiedId === `p-${member.id}`
                              ? 'bg-amber-500 border-amber-500 text-black shadow-md'
                              : 'bg-[#1c1815] hover:bg-[#2c241f] border-[#382e27] text-amber-200'
                          }`}
                        >
                          {copiedId === `p-${member.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-amber-400/70" />}
                          <span>Message Direct</span>
                        </button>

                        <button
                          onClick={() => handleCopy(groupMsg, `g-${member.id}`)}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                            copiedId === `g-${member.id}`
                              ? 'bg-amber-500 border-amber-500 text-black shadow-md'
                              : 'bg-[#1c1815] hover:bg-[#2c241f] border-[#382e27] text-amber-200'
                          }`}
                        >
                          {copiedId === `g-${member.id}` ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5 text-amber-400/70" />}
                          <span>Annonce Groupe</span>
                        </button>
                      </div>
                    </div>

                    {/* Preview message section */}
                    <div className="border-t border-[#2d241f] pt-3">
                      <button
                        onClick={() => setActiveActionsMemberId(isExpanded ? null : member.id)}
                        className="w-full flex items-center justify-between text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <span>{isExpanded ? 'Masquer' : 'Afficher/Modifier'} l'aperçu du texte</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-3 pt-3 text-xs"
                          >
                            <div className="bg-[#1c1815] border border-[#2d241f] rounded-xl p-3.5">
                              <span className="font-bold text-[9px] text-amber-400/50 uppercase tracking-wider block mb-1">Message personnel pré-rempli :</span>
                              <p className="text-amber-100/90 whitespace-pre-wrap leading-relaxed select-all">{personalMsg}</p>
                            </div>

                            <div className="bg-[#1c1815] border border-[#2d241f] rounded-xl p-3.5">
                              <span className="font-bold text-[9px] text-amber-400/50 uppercase tracking-wider block mb-1">Annonce groupe pré-remplie :</span>
                              <p className="text-amber-100/90 whitespace-pre-wrap leading-relaxed select-all">{groupMsg}</p>
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
          /* Premium Empty State with instructions since mock data is deleted */
          <div className="bg-[#161311] border border-[#2d241f] p-10 rounded-2xl text-center shadow-lg max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-[#221c18] border border-amber-500/25 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.06)]">
              <Smile className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-serif font-bold text-amber-50">Aucun anniversaire aujourd'hui</h4>
              <p className="text-xs text-amber-200/50 max-w-md mx-auto leading-relaxed">
                Votre base de données ne contient aucun anniversaire pour aujourd'hui. C'est l'occasion idéale d'enrichir votre liste ou d'importer vos membres !
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="text-xs text-amber-400 font-semibold bg-[#221c18] border border-[#382e27] px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500" />
                <span>Rendez-vous dans l'onglet "Membres"</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UPCOMING BIRTHDAYS TIMELINE */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-amber-400/70 uppercase tracking-widest flex items-center gap-3">
          <span>Prochains Anniversaires (30 prochains jours)</span>
          <span className="h-px bg-gradient-to-r from-[#2d241f] to-transparent flex-1"></span>
        </h3>

        {upcomingBirthdays.filter(item => item.daysLeft <= 30).length > 0 ? (
          <div className="bg-[#161311] border border-[#2d241f] rounded-2xl divide-y divide-[#2d241f] shadow-lg overflow-hidden">
            {upcomingBirthdays
              .filter(item => item.daysLeft <= 30)
              .map(({ member, daysLeft }) => {
                const age = calculateAge(member.birthDate) + 1; // Age they will turn
                const bDate = new Date(member.birthDate);
                const dayMonthStr = bDate.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long'
                });

                return (
                  <div key={member.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#1c1815]/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                        member.gender === 'F' 
                          ? 'bg-rose-950/30 text-rose-300 border-rose-900/40' 
                          : 'bg-amber-950/30 text-amber-300 border-amber-900/40'
                      }`}>
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </div>
                      
                      <div>
                        <div className="font-semibold text-amber-50 text-sm">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-amber-200/50">
                          <span className="font-medium text-amber-400">{member.role}</span>
                          <span>•</span>
                          <span>Fêtera ses <strong className="font-bold text-amber-200">{age} ans</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-[#221c18] border border-[#382d26] text-amber-300">
                        {dayMonthStr}
                      </span>
                      <span className="block text-[10px] font-bold text-amber-200/40 mt-1 uppercase tracking-widest">
                        Dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="bg-[#161311] border border-[#2d241f] p-8 rounded-2xl text-center shadow-lg">
            <Calendar className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
            <p className="text-xs font-bold text-amber-200/60">Aucun anniversaire prévu dans les 30 prochains jours</p>
            <p className="text-[10px] text-amber-200/30 mt-1">Vos fiches de membres ne contiennent pas d'anniversaires à venir pour ce mois.</p>
          </div>
        )}
      </div>

    </div>
  );
}
