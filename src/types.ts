export type Gender = 'M' | 'F';

export interface Member {
  id: string;
  lastName: string;
  firstName: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  phone: string;
  email?: string;
  role: string; // Fonction au sein de l'organisation
}

export interface Organization {
  name: string;
  type?: string;
  userRole: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  icon: string;
  emoji: string;
  description: string;
  whatToDo: string[];
  templates: {
    title: string;
    text: string;
  }[];
}
