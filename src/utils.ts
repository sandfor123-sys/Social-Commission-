import { Member, Gender } from './types';

/**
 * Checks if a birthdate (YYYY-MM-DD) is today.
 */
export function isBirthdayToday(birthDateStr: string): boolean {
  if (!birthDateStr) return false;
  const parts = birthDateStr.split('-');
  if (parts.length < 3) return false;
  
  const birthMonth = parseInt(parts[1], 10);
  const birthDay = parseInt(parts[2], 10);
  
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-indexed
  const currentDay = today.getDate();
  
  return birthMonth === currentMonth && birthDay === currentDay;
}

/**
 * Calculates how many days until the next birthday.
 */
export function getDaysUntilBirthday(birthDateStr: string): number {
  if (!birthDateStr) return 999;
  const parts = birthDateStr.split('-');
  if (parts.length < 3) return 999;
  
  const birthMonth = parseInt(parts[1], 10) - 1; // 0-indexed for Date
  const birthDay = parseInt(parts[2], 10);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const currentYear = today.getFullYear();
  const nextBDay = new Date(currentYear, birthMonth, birthDay);
  
  if (nextBDay.getTime() < today.getTime()) {
    // Birthday has already passed this year, set to next year
    nextBDay.setFullYear(currentYear + 1);
  }
  
  const diffTime = nextBDay.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates age based on birth date (YYYY-MM-DD).
 */
export function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const parts = birthDateStr.split('-');
  if (parts.length < 3) return 0;
  
  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10) - 1;
  const birthDay = parseInt(parts[2], 10);
  
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  
  const monthDiff = today.getMonth() - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
    age--;
  }
  
  return age;
}

/**
 * Normalizes and formats phone numbers (especially Ivory Coast and general format).
 */
export function formatPhoneNumber(phone: string): string {
  // Simple cleanup: remove spaces, dots, dashes
  return phone.replace(/[\s\.\-\(\)]/g, '');
}

/**
 * Custom template text interpolator.
 */
export function formatMessageTemplate(
  template: string,
  member: Partial<Member>,
  orgName: string,
  userRole: string
): string {
  return template
    .replace(/{firstName}/g, member.firstName || '')
    .replace(/{lastName}/g, member.lastName || '')
    .replace(/{role}/g, member.role || '')
    .replace(/{orgName}/g, orgName || '')
    .replace(/{userRole}/g, userRole || '');
}

/**
 * Generates and triggers download of the CSV template.
 */
export function downloadCSVTemplate(): void {
  const headers = ['Nom', 'Prénom', 'Sexe (M/F)', 'Date de Naissance (AAAA-MM-JJ)', 'Téléphone', 'Email (facultatif)', 'Pupitre ou Rôle'];
  const rowExample1 = ['Kouassi', 'Marie', 'F', '1995-06-30', '+2250707070707', 'marie.kouassi@email.com', 'Alto'];
  const rowExample2 = ['Koné', 'Jean', 'M', '1990-11-15', '+2250101010101', '', 'Ténor'];
  
  const csvContent = [
    headers.join(';'),
    rowExample1.join(';'),
    rowExample2.join(';')
  ].join('\n');
  
  // Add UTF-8 BOM so Excel opens it with correct French accents
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'modele_membres_chorale.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface CSVRowValidation {
  rowNumber: number;
  data: Partial<Member>;
  errors: string[];
  warnings: string[];
  isValid: boolean;
}

/**
 * Parses and validates CSV string.
 */
export function parseAndValidateCSV(csvText: string): CSVRowValidation[] {
  const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length === 0) return [];
  
  // Detect delimiter: check count of semicolons vs commas in the first line
  const firstLine = lines[0];
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const delimiter = semicolons >= commas ? ';' : ',';
  
  const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  
  // Map headers to fields
  // Support variations in naming
  const fieldMapping: { [key: string]: number } = {
    lastName: headers.findIndex(h => h.includes('nom') && !h.includes('prenom')),
    firstName: headers.findIndex(h => h.includes('prenom') || h.includes('prénom')),
    gender: headers.findIndex(h => h.includes('sexe') || h.includes('genre')),
    birthDate: headers.findIndex(h => h.includes('naiss') || h.includes('date')),
    phone: headers.findIndex(h => h.includes('tel') || h.includes('phone') || h.includes('mobile')),
    email: headers.findIndex(h => h.includes('email') || h.includes('mail')),
    role: headers.findIndex(h => h.includes('fonc') || h.includes('role') || h.includes('poste') || h.includes('travail'))
  };
  
  // Fallbacks if headers match poorly
  if (fieldMapping.lastName === -1) fieldMapping.lastName = 0;
  if (fieldMapping.firstName === -1) fieldMapping.firstName = 1;
  if (fieldMapping.gender === -1) fieldMapping.gender = 2;
  if (fieldMapping.birthDate === -1) fieldMapping.birthDate = 3;
  if (fieldMapping.phone === -1) fieldMapping.phone = 4;
  if (fieldMapping.email === -1) fieldMapping.email = 5;
  if (fieldMapping.role === -1) fieldMapping.role = 6;
  
  const results: CSVRowValidation[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(delimiter).map(c => c.trim());
    
    // Skip empty lines
    if (cells.length === 0 || (cells.length === 1 && cells[0] === '')) continue;
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const rawLastName = cells[fieldMapping.lastName] || '';
    const rawFirstName = cells[fieldMapping.firstName] || '';
    const rawGender = cells[fieldMapping.gender] || '';
    const rawBirthDate = cells[fieldMapping.birthDate] || '';
    const rawPhone = cells[fieldMapping.phone] || '';
    const rawEmail = cells[fieldMapping.email] || '';
    const rawRole = cells[fieldMapping.role] || '';
    
    // Validate Nom
    if (!rawLastName) {
      errors.push('Le nom de famille est obligatoire.');
    }
    
    // Validate Prénom
    if (!rawFirstName) {
      errors.push('Le prénom est obligatoire.');
    }
    
    // Validate Sexe
    let gender: Gender = 'M';
    const cleanGender = rawGender.toUpperCase();
    if (!cleanGender) {
      errors.push('Le sexe (M/F) est obligatoire.');
    } else if (cleanGender === 'M' || cleanGender === 'MASCULIN' || cleanGender === 'H' || cleanGender === 'HOMME') {
      gender = 'M';
    } else if (cleanGender === 'F' || cleanGender === 'FEMININ' || cleanGender === 'FEMME') {
      gender = 'F';
    } else {
      errors.push(`Sexe invalide: "${rawGender}". Utilisez "M" ou "F".`);
    }
    
    // Validate Date de Naissance
    let birthDate = '';
    if (!rawBirthDate) {
      errors.push('La date de naissance est obligatoire.');
    } else {
      // Try to parse YYYY-MM-DD
      const dateRegexYMD = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/;
      // Try to parse DD-MM-YYYY or DD/MM/YYYY (common in French files)
      const dateRegexDMY = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/;
      
      const matchYMD = rawBirthDate.match(dateRegexYMD);
      const matchDMY = rawBirthDate.match(dateRegexDMY);
      
      if (matchYMD) {
        const year = parseInt(matchYMD[1], 10);
        const month = matchYMD[2].padStart(2, '0');
        const day = matchYMD[3].padStart(2, '0');
        birthDate = `${year}-${month}-${day}`;
      } else if (matchDMY) {
        const day = matchDMY[1].padStart(2, '0');
        const month = matchDMY[2].padStart(2, '0');
        const year = parseInt(matchDMY[3], 10);
        birthDate = `${year}-${month}-${day}`;
        warnings.push(`Date de naissance convertie du format JJ/MM/AAAA vers AAAA-MM-JJ : "${birthDate}"`);
      } else {
        // Fallback or JS Date check
        const testDate = new Date(rawBirthDate);
        if (!isNaN(testDate.getTime())) {
          const y = testDate.getFullYear();
          const m = String(testDate.getMonth() + 1).padStart(2, '0');
          const d = String(testDate.getDate()).padStart(2, '0');
          birthDate = `${y}-${m}-${d}`;
          warnings.push(`Format de date non standard, converti en: "${birthDate}"`);
        } else {
          errors.push(`Format de date invalide: "${rawBirthDate}". Utilisez le format AAAA-MM-JJ.`);
        }
      }
    }
    
    // Validate Téléphone
    if (!rawPhone) {
      errors.push('Le numéro de téléphone est obligatoire.');
    }
    
    // Validate Email
    if (rawEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      errors.push(`Adresse email invalide : "${rawEmail}"`);
    }
    
    results.push({
      rowNumber: i + 1,
      data: {
        id: Math.random().toString(36).substring(2, 9),
        lastName: rawLastName,
        firstName: rawFirstName,
        gender,
        birthDate,
        phone: rawPhone,
        email: rawEmail || undefined,
        role: rawRole || 'Membre'
      },
      errors,
      warnings,
      isValid: errors.length === 0
    });
  }
  
  return results;
}

/**
 * Export actual member database to CSV.
 */
export function exportMembersToCSV(members: Member[]): void {
  const headers = ['Nom', 'Prénom', 'Sexe', 'Date de Naissance', 'Téléphone', 'Email', 'Fonction'];
  const rows = members.map(m => [
    m.lastName,
    m.firstName,
    m.gender,
    m.birthDate,
    m.phone,
    m.email || '',
    m.role
  ]);
  
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `membres_chorale_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates a warm, high-fidelity double chime sound using Web Audio API
 */
export function playWarmChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First notes of the celebration chime (Arpeggio style)
    const playNote = (freq: number, startTime: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Warm elegant chord chime (C major 9 chord vibe)
    const now = ctx.currentTime;
    playNote(261.63, now, 1.2, 0.15);        // C4 (Fundamental)
    playNote(329.63, now + 0.1, 1.0, 0.12);  // E4 (Third)
    playNote(392.00, now + 0.2, 0.8, 0.10);  // G4 (Fifth)
    playNote(493.88, now + 0.3, 1.0, 0.08);  // B4 (Major 7th)
    playNote(523.25, now + 0.4, 1.4, 0.06);  // C5 (Octave)
  } catch (err) {
    console.warn("L'API Web Audio n'a pas pu être initialisée", err);
  }
}

/**
 * Requests desktop notification permissions
 */
export async function requestDesktopNotificationPermission(): Promise<string> {
  if (!("Notification" in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error("Erreur de permission de notification", err);
    return 'default';
  }
}

/**
 * Triggers a standard desktop notification if permission is granted
 */
export function triggerDesktopNotification(title: string, body: string): void {
  if (!("Notification" in window)) return;
  
  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        tag: 'chorale-anniversary',
        icon: '/choir-logo.png'
      });
    } catch (err) {
      console.warn("Notification non envoyée", err);
    }
  }
}

