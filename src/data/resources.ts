import { ResourceItem } from '../types';

export const RESOURCES_DATA: ResourceItem[] = [
  {
    id: 'birthday',
    title: 'Anniversaires',
    icon: 'Cake',
    emoji: '🎂',
    description: 'Souhaiter un joyeux anniversaire aux choristes et musiciens.',
    whatToDo: [
      'Vérifier les anniversaires du jour dans l\'application.',
      'Envoyer un message individuel WhatsApp ou SMS.',
      'Partager le souhait sur le groupe WhatsApp de la chorale / du pupitre.'
    ],
    templates: [
      {
        title: 'Message Individuel (WhatsApp / SMS)',
        text: 'Joyeux anniversaire {firstName} ! 🎉 Toute la chorale {orgName} te souhaite une excellente journée, une santé de fer et beaucoup de joie en chantant avec nous au pupitre {role}. Passe une très belle fête ! 🎂🎶'
      },
      {
        title: 'Message sur le Groupe Chorale',
        text: '🎂 C\'est l\'anniversaire de notre cher(e) {firstName} {lastName} ({role}) aujourd\'hui ! Joignons nos voix pour lui souhaiter un très joyeux anniversaire et une magnifique année ! 🥳🎶🎉'
      },
      {
        title: 'Message Court',
        text: 'Très joyeux anniversaire {firstName} ! Plein de bénédictions, de bonheur et de belles harmonies pour cette nouvelle année. 🎂✨'
      }
    ]
  },
  {
    id: 'rehearsal_absence',
    title: 'Absence aux Répétitions',
    icon: 'UserMinus',
    emoji: '🎵',
    description: 'Prendre des nouvelles d\'un choriste absent aux séances ou raccords.',
    whatToDo: [
      'Contacter le choriste après la répétition ou le raccord.',
      'S\'assurer que tout va bien et lui transmettre les morceaux travaillés.',
      'Lui rappeler la date et l\'horaire de la prochaine répétition.'
    ],
    templates: [
      {
        title: 'Prise de nouvelles amicale',
        text: 'Salut {firstName}, tu nous as manqué à la répétition de {orgName} aujourd\'hui. J\'espère que tout va bien pour toi. Fais-nous signe quand tu es disponible pour qu\'on te passe les partitions travaillées. À bientôt ! 🎶'
      },
      {
        title: 'Rappel de la prochaine répétition',
        text: 'Bonjour {firstName}, nous avons remarqué ton absence lors de la dernière répétition. On espère que tout va bien. Prochaine séance : sois au rendez-vous pour qu\'on harmonise bien le pupitre {role} ! Bonne semaine à toi.'
      }
    ]
  },
  {
    id: 'sick',
    title: 'Santé & Repos Vocal',
    icon: 'HeartPulse',
    emoji: '🌿',
    description: 'Prendre des nouvelles d\'un choriste souffrant ou au repos.',
    whatToDo: [
      'Envoyer un message de soutien simple et sans obligation de réponse.',
      'Lui conseiller de bien reposer sa voix.',
      'Informer le responsable de pupitre si besoin.'
    ],
    templates: [
      {
        title: 'Message de prompt rétablissement',
        text: 'Bonjour {firstName}, nous avons appris que tu n\'es pas très en forme. Au nom de {orgName}, nous te souhaitons un prompt rétablissement. Repose-toi bien et prends soin de ta voix. Reviens-nous en pleine forme ! ❤️'
      },
      {
        title: 'Soutien simple',
        text: 'Pensées fraternelles {firstName}. Prends tout le repos nécessaire pour te remettre. Bon rétablissement de la part de toute l\'équipe !'
      }
    ]
  },
  {
    id: 'welcome_member',
    title: 'Nouveau Choriste / Intégration',
    icon: 'Sparkles',
    emoji: '👋',
    description: 'Accueillir chaleureusement une nouvelle recrue dans son pupitre.',
    whatToDo: [
      'L\'ajouter au groupe de discussion de la chorale et de son pupitre.',
      'Lui transmettre le répertoire et les horaires de répétition.',
      'Lui présenter son responsable de pupitre.'
    ],
    templates: [
      {
        title: 'Bienvenue dans la chorale',
        text: 'Bienvenue parmi nous {firstName} ! Toute la chorale {orgName} est ravie de t\'accueillir au pupitre {role}. N\'hésite pas si tu as des questions sur les partitions ou les répétitions. Belle aventure musicale avec nous ! 🎶✨'
      }
    ]
  },
  {
    id: 'events',
    title: 'Mariage / Naissance / Fête',
    icon: 'Baby',
    emoji: '💍',
    description: 'Féliciter un choriste à l\'occasion d\'un événement heureux.',
    whatToDo: [
      'Envoyer les félicitations de la chorale.',
      'Partager l\'information sur le groupe pour les vœux collectifs.'
    ],
    templates: [
      {
        title: 'Félicitations Mariage',
        text: 'Toutes nos félicitations {firstName} pour ton mariage ! Toute la famille de {orgName} te souhaite un foyer harmonieux, plein de bonheur, de paix et de joie. Félicitations aux mariés ! 💍🎉✨'
      },
      {
        title: 'Félicitations Naissance',
        text: 'Félicitations {firstName} pour cette merveilleuse naissance ! Beaucoup de bonheur et de santé à ton bébé et à toute la famille. Bienvenue au nouveau membre de la famille {orgName} ! 👶🍼✨'
      }
    ]
  },
  {
    id: 'bereavement',
    title: 'Soutien & Deuil',
    icon: 'Flame',
    emoji: '🕊️',
    description: 'Exprimer la solidarité de la chorale en cas de deuil.',
    whatToDo: [
      'Envoyer un message de condoléances sobre et digne.',
      'Informer la chorale des dispositions pour la présence ou le soutien.'
    ],
    templates: [
      {
        title: 'Condoléances de la chorale',
        text: 'Cher(e) {firstName}, toute la chorale {orgName} est de tout cœur avec toi et ta famille dans cette douloureuse épreuve. Nous te présentons nos plus sincères condoléances et t\'assurons de notre soutien et de nos pensées fraternelles. 🕊️'
      }
    ]
  }
];

