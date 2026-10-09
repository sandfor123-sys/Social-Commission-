import { useState, useEffect } from 'react';
import { Member, Organization } from './types';
import OrganizationSetup from './components/OrganizationSetup';
import BirthdaySection from './components/BirthdaySection';
import MemberSection from './components/MemberSection';
import ResourceSection from './components/ResourceSection';
import SettingsSection from './components/SettingsSection';
import { 
  Heart, 
  Cake, 
  Users, 
  BookOpen, 
  Settings, 
  Sparkles,
  Bell,
  BellOff,
  Volume2
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  isBirthdayToday, 
  playWarmChime, 
  triggerDesktopNotification, 
  requestDesktopNotificationPermission,
  calculateAge
} from './utils';

export default function App() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<'birthdays' | 'members' | 'resources' | 'settings'>('birthdays');
  const [isInitialized, setIsInitialized] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);

  // Load initial settings
  useEffect(() => {
    const savedOrg = localStorage.getItem('social_commission_org');
    const savedMembers = localStorage.getItem('social_commission_members');

    if (savedOrg) {
      setOrganization(JSON.parse(savedOrg));
    }

    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    } else {
      // START FRESH - No more preloaded mock data!
      setMembers([]);
    }
    
    // Check browser notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        setShowPermissionBanner(true);
      }
    } else {
      setNotificationPermission('unsupported');
    }

    setIsInitialized(true);
  }, []);

  // Play chime and send notification if birthday celebrations are today
  useEffect(() => {
    if (isInitialized && members.length > 0) {
      const todayBirthdays = members.filter(m => isBirthdayToday(m.birthDate));
      if (todayBirthdays.length > 0) {
        // Play the premium warm chime sound safely
        setTimeout(() => {
          playWarmChime();
        }, 1200);

        // Send a separate desktop notification for each member having a birthday
        todayBirthdays.forEach(m => {
          const age = calculateAge(m.birthDate);
          triggerDesktopNotification(
            `🎂 C'est l'anniversaire de ${m.firstName} !`,
            `Aujourd'hui, ${m.firstName} ${m.lastName} (${m.role}) fête ses ${age} ans.`
          );
        });
      }
    }
  }, [isInitialized, members]);

  // Request browser permissions
  const handleRequestPermission = async () => {
    const result = await requestDesktopNotificationPermission();
    if (result !== 'unsupported') {
      setNotificationPermission(result as NotificationPermission);
    }
    setShowPermissionBanner(false);
  };

  const handleSaveOrganization = (org: Organization) => {
    setOrganization(org);
    localStorage.setItem('social_commission_org', JSON.stringify(org));
  };

  const handleAddMember = (newMember: Member) => {
    const updated = [newMember, ...members];
    setMembers(updated);
    localStorage.setItem('social_commission_members', JSON.stringify(updated));
  };

  const handleAddMultipleMembers = (newMembers: Member[]) => {
    const existingKeys = new Set(members.map(m => `${m.firstName.toLowerCase()}-${m.lastName.toLowerCase()}`));
    
    const filteredNew = newMembers.filter(m => {
      const key = `${m.firstName.toLowerCase()}-${m.lastName.toLowerCase()}`;
      return !existingKeys.has(key);
    });

    const updated = [...filteredNew, ...members];
    setMembers(updated);
    localStorage.setItem('social_commission_members', JSON.stringify(updated));
  };

  const handleUpdateMember = (updatedMember: Member) => {
    const updated = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    setMembers(updated);
    localStorage.setItem('social_commission_members', JSON.stringify(updated));
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    localStorage.setItem('social_commission_members', JSON.stringify(updated));
  };

  const handleResetApp = () => {
    localStorage.removeItem('social_commission_org');
    localStorage.removeItem('social_commission_members');
    setOrganization(null);
    setMembers([]);
    setActiveTab('birthdays');
    window.location.reload();
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0b0a] text-[#ebdcd3] font-sans">
        <div className="text-center space-y-3">
          <Heart className="w-10 h-10 text-amber-500 animate-pulse mx-auto fill-amber-500/20" />
          <p className="text-sm font-semibold text-amber-100/70 tracking-wide">Chargement de votre espace chaleureux...</p>
        </div>
      </div>
    );
  }

  // Onboarding setup screen with warm dark theme
  if (!organization) {
    return <OrganizationSetup onSave={handleSaveOrganization} />;
  }

  const todayBirthdaysCount = members.filter(m => isBirthdayToday(m.birthDate)).length;

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-[#ebdcd3] font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* HEADER BAR WITH GLASSMORPHISM AND GOLD TOUCHES */}
      <header className="bg-[#161311]/90 backdrop-blur-md border-b border-[#2d241f] sticky top-0 z-40 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo, premium typography */}
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-[#221c18] rounded-2xl text-amber-400 border border-amber-500/25 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.06)]">
                <Heart className="w-5 h-5 fill-amber-400/20" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-serif font-bold text-amber-50 tracking-tight flex items-center gap-2">
                  Social Commission
                </h1>
                <p className="text-[10px] md:text-xs text-amber-200/50 font-medium italic hidden sm:block">
                  « Accompagner sa communauté avec attention et bienveillance »
                </p>
              </div>
            </div>

            {/* Notification and audio indicator, role badges */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-amber-100/90">{organization.name}</span>
                <span className="text-[9px] text-amber-400/70 font-bold uppercase tracking-widest">{organization.type || 'COMMUNAUTÉ'}</span>
              </div>
              
              <button 
                onClick={playWarmChime}
                title="Tester le carillon sonore"
                className="p-2 bg-[#221c18] border border-[#382d26] text-amber-400 rounded-xl hover:bg-[#2d241f] transition-all active:scale-95 flex items-center justify-center"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#221c18] border border-amber-500/20 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/10" />
                <span className="max-w-[120px] md:max-w-none truncate">{organization.userRole}</span>
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* DESKTOP NOTIFICATIONS PERMISSION BANNER */}
      {showPermissionBanner && (
        <div className="bg-[#221c18] border-b border-[#3d2e24] py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-200">
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Pour être prévenu instantanément des anniversaires, activez les notifications de bureau.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPermissionBanner(false)}
                className="text-amber-200/60 hover:text-amber-200 font-medium transition-colors"
              >
                Plus tard
              </button>
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#0d0b0a] font-bold rounded-lg transition-all active:scale-95"
              >
                Activer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORE LAYOUT WITH TABS */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8">
        
        {/* Navigation Tab rail */}
        <div className="flex overflow-x-auto bg-[#161311] border border-[#2d241f] p-1.5 rounded-2xl shadow-lg gap-1.5 scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('birthdays')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'birthdays'
                ? 'bg-amber-500 text-[#0d0b0a] shadow-md font-bold'
                : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#221c18]'
            }`}
          >
            <Cake className="w-4 h-4 shrink-0" />
            <span>Anniversaires</span>
            {todayBirthdaysCount > 0 ? (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white animate-pulse">
                {todayBirthdaysCount}
              </span>
            ) : (
              members.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-[#2c241f] text-amber-200/50 text-[10px]">
                  {members.filter(m => isBirthdayToday(m.birthDate)).length}
                </span>
              )
            )}
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-amber-500 text-[#0d0b0a] shadow-md font-bold'
                : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#221c18]'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Membres</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'members' ? 'bg-[#221c18] text-amber-300' : 'bg-[#221c18] text-amber-200/60'
            }`}>
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'resources'
                ? 'bg-amber-500 text-[#0d0b0a] shadow-md font-bold'
                : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#221c18]'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Ressources</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ml-auto ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-[#0d0b0a] shadow-md font-bold'
                : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#221c18]'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Configuration</span>
          </button>
        </div>

        {/* ACTIVE SECTION CARRIER */}
        <div className="flex-1">
          {activeTab === 'birthdays' && (
            <BirthdaySection 
              members={members} 
              organization={organization} 
            />
          )}

          {activeTab === 'members' && (
            <MemberSection 
              members={members}
              onAddMember={handleAddMember}
              onAddMultipleMembers={handleAddMultipleMembers}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceSection 
              organization={organization}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsSection 
              organization={organization}
              members={members}
              onUpdateOrg={handleSaveOrganization}
              onResetApp={handleResetApp}
            />
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#120f0e] border-t border-[#2d241f] py-8 text-center text-xs text-amber-200/30 shrink-0">
        <p className="font-semibold tracking-wide">
          Social Commission &copy; {new Date().getFullYear()} • Pour une communauté plus unie, attentive et chaleureuse.
        </p>
        <p className="text-[10px] text-amber-200/20 mt-1 flex items-center justify-center gap-1.5">
          <span>Hébergement Local</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            {notificationPermission === 'granted' ? (
              <><Bell className="w-3 h-3 text-emerald-500" /> Notifications actives</>
            ) : (
              <><BellOff className="w-3 h-3 text-amber-500/50" /> Notifications inactives</>
            )}
          </span>
        </p>
      </footer>

    </div>
  );
}
