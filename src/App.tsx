import { useState, useEffect } from 'react';
import { Member, Organization } from './types';
import OrganizationSetup from './components/OrganizationSetup';
import BirthdaySection from './components/BirthdaySection';
import MemberSection from './components/MemberSection';
import ResourceSection from './components/ResourceSection';
import SettingsSection from './components/SettingsSection';
import { 
  Cake, 
  Users, 
  BookOpen, 
  Settings, 
  Sparkles,
  Bell,
  BellOff,
  Volume2,
  Music
} from 'lucide-react';
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
        setTimeout(() => {
          playWarmChime();
        }, 800);

        todayBirthdays.forEach(m => {
          const age = calculateAge(m.birthDate);
          triggerDesktopNotification(
            `🎂 Anniversaire : ${m.firstName} (${m.role})`,
            `C'est l'anniversaire de ${m.firstName} ${m.lastName} aujourd'hui (${age} ans).`
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="text-center space-y-3">
          <Music className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Chargement de l'espace chorale...</p>
        </div>
      </div>
    );
  }

  // Setup screen if no org configured yet
  if (!organization) {
    return <OrganizationSetup onSave={handleSaveOrganization} />;
  }

  const todayBirthdaysCount = members.filter(m => isBirthdayToday(m.birthDate)).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo & Choir Name */}
            <div className="flex items-center gap-3">
              <img 
                src="/choir-logo.png" 
                alt="Logo" 
                className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs bg-white"
              />
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {organization.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Gestion & Anniversaires
                </p>
              </div>
            </div>

            {/* Role & Audio Test */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={playWarmChime}
                title="Tester la cloche d'anniversaire"
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all active:scale-95 flex items-center justify-center"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 border border-rose-200/70 text-rose-700">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span className="max-w-[130px] sm:max-w-none truncate">{organization.userRole}</span>
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* NOTIFICATIONS BANNER */}
      {showPermissionBanner && (
        <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <Bell className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Activez les notifications pour être alerté automatiquement des anniversaires du jour.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPermissionBanner(false)}
                className="text-amber-700 hover:text-amber-900 font-medium transition-colors"
              >
                Plus tard
              </button>
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all"
              >
                Activer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto bg-white border border-slate-200 p-1 rounded-2xl shadow-xs gap-1 scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('birthdays')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'birthdays'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Cake className="w-4 h-4 shrink-0" />
            <span>Anniversaires</span>
            {todayBirthdaysCount > 0 ? (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-rose-600 shadow-xs animate-bounce">
                {todayBirthdaysCount}
              </span>
            ) : (
              members.length > 0 && (
                <span className={`ml-1 px-1.5 py-0.2 rounded text-[10px] ${
                  activeTab === 'birthdays' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  0
                </span>
              )
            )}
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Choristes & Pupitres</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'members' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'resources'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Modèles de Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ml-auto ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Configuration</span>
          </button>
        </div>

        {/* TAB VIEWS */}
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
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500 shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            {organization.name} &copy; {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Stockage local sécurisé</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {notificationPermission === 'granted' ? (
                <><Bell className="w-3 h-3 text-emerald-600" /> Notifications activées</>
              ) : (
                <><BellOff className="w-3 h-3 text-slate-400" /> Notifications désactivées</>
              )}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

