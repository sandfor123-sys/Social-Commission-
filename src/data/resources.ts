import { ResourceItem } from '../types';

export const RESOURCES_DATA: ResourceItem[] = [
  {
    id: 'birthday',
    title: 'Anniversaire',
    icon: 'Cake',
    emoji: '🎂',
    description: 'Célébrer un membre de la communauté le jour de sa naissance pour renforcer son sentiment d\'appartenance.',
    whatToDo: [
      'Consulter la liste du jour dès le matin.',
      'Envoyer un message de vœux personnalisé (WhatsApp, SMS ou Email).',
      'Si possible, passer un appel téléphonique de vive voix, très apprécié.',
      'Publier un message officiel de félicitations sur le groupe de discussion de l\'organisation.',
      'S\'il s\'agit d\'un membre clé ou actif, envisager une petite attention collective lors de la prochaine réunion.'
    ],
    templates: [
      {
        title: 'Message Personnel (Chaleureux)',
        text: 'Bonjour {firstName}, en ce jour spécial, toute la communauté de {orgName} et moi-même te souhaitons un merveilleux anniversaire ! Merci pour ton engagement et ta présence parmi nous. Que cette nouvelle année t\'apporte joie, santé et réussite dans tous tes projets. Passe une excellente journée ! 🎂✨'
      },
      {
        title: 'Message de Groupe (WhatsApp/Telegram)',
        text: '🎉 C\'est la fête aujourd\'hui ! Nous célébrons l\'anniversaire de notre cher(e) {firstName} {lastName} ({role}). En tant que {userRole}, je vous invite tous à vous joindre à moi pour lui souhaiter le meilleur. Joyeux anniversaire {firstName} ! 🥳🎂🎁'
      },
      {
        title: 'Message Court & Direct',
        text: 'Joyeux anniversaire {firstName} ! Que cette journée soit douce et festive. Très heureux de te compter parmi nous à {orgName}. Amicalement, {userRole}.'
      }
    ]
  },
  {
    id: 'sick',
    title: 'Membre malade',
    icon: 'HeartPulse',
    emoji: '🤒',
    description: 'Soutenir un membre qui traverse des difficultés de santé pour lui montrer qu\'il n\'est pas seul.',
    whatToDo: [
      'Prendre des nouvelles discrètement auprès des proches ou du membre directement s\'il est en état de répondre.',
      'Envoyer un message de soutien court, sans exiger de réponse immédiate.',
      'Proposer l\'aide pratique de la communauté si nécessaire (courses, repas, visites selon son accord).',
      'Informer l\'équipe restreinte pour organiser une chaîne de solidarité ou de prière si cela correspond aux valeurs de votre communauté.',
      'Respecter la confidentialité et le choix de discrétion du membre.'
    ],
    templates: [
      {
        title: 'Soutien Chaleureux',
        text: 'Bonjour {firstName}, nous avons appris que tu traverses des soucis de santé en ce moment. Au nom de {orgName}, je tiens à t\'apporter tout notre soutien et nos pensées chaleureuses. Repose-toi bien. Sache que nous sommes là si tu as besoin de quoi que ce soit. Bon rétablissement ! ❤️'
      },
      {
        title: 'Proposition d\'Aide Pratique',
        text: 'Bonjour {firstName}, j\'espère que tu ne fatigues pas trop. C\'est {userRole} de {orgName}. Si tu as besoin d\'aide pour des courses, des repas ou tout autre besoin du quotidien pendant ta convalescence, n\'hésite surtout pas. La communauté est là pour s\'entraider. Prends soin de toi.'
      },
      {
        title: 'Message Court (Sans pression)',
        text: 'Pensées amicales pour toi en ce jour, {firstName}. Prends tout le temps nécessaire pour te reposer et retrouver tes forces. Pas besoin de répondre à ce message, l\'important est que tu te rétablisses bien.'
      }
    ]
  },
  {
    id: 'absent',
    title: 'Membre absent',
    icon: 'UserMinus',
    emoji: '🙏',
    description: 'Reprendre contact avec un membre qui ne participe plus aux activités pour maintenir le lien social.',
    whatToDo: [
      'Identifier les absences prolongées ou répétées lors des dernières activités.',
      'Contacter le membre avec bienveillance, sans chercher à le culpabiliser.',
      'Lui exprimer que sa présence et sa contribution manquent au groupe.',
      'Se montrer à l\'écoute de ses raisons (surcharge de travail, fatigue, soucis familiaux, perte de motivation).',
      'Lui proposer de revenir à son rythme, dès qu\'il le souhaitera.'
    ],
    templates: [
      {
        title: 'Prise de nouvelles bienveillante',
        text: 'Bonjour {firstName}, j\'espère que tu te portes bien ! Nous avons remarqué ton absence lors de nos récentes rencontres à {orgName} et tu nous as manqué. Je voulais simplement prendre de tes nouvelles et m\'assurer que tout va bien de ton côté. Au plaisir d\'échanger avec toi quand tu auras un moment.'
      },
      {
        title: 'Expression de manque & Invitation',
        text: 'Salut {firstName}, c\'est {userRole}. Ta bonne humeur et ta présence nous manquent beaucoup au sein de {orgName} ! J\'espère que tes projets avancent bien. Si tu as besoin de faire une pause, on le comprend parfaitement, mais sache que notre porte te reste toujours grande ouverte. À très bientôt !'
      }
    ]
  },
  {
    id: 'birth',
    title: 'Naissance',
    icon: 'Baby',
    emoji: '👶',
    description: 'Accueillir et célébrer l\'arrivée d\'un nouvel enfant dans la famille d\'un de vos membres.',
    whatToDo: [
      'Féliciter chaleureusement les parents dès la naissance.',
      'Demander des nouvelles de la maman et du bébé.',
      'Partager la joyeuse nouvelle avec l\'accord des parents sur le groupe de la communauté.',
      'Si c\'est dans les habitudes de l\'organisation, organiser une cagnotte ou l\'achat d\'un cadeau de naissance symbolique.',
      'Laisser du temps à la famille avant d\'organiser une visite physique de courtoisie.'
    ],
    templates: [
      {
        title: 'Félicitations aux parents',
        text: 'Toutes nos félicitations {firstName} pour la naissance de votre merveilleux bébé ! C\'est un immense bonheur et toute l\'équipe de {orgName} se réjouit avec vous. Nous souhaitons beaucoup de douceur, de sourires et de belles nuits (le plus tôt possible !) à toute la famille. Bienvenue au petit ange ! 🍼✨👶'
      },
      {
        title: 'Annonce au Groupe',
        text: '✨ Grande et belle nouvelle pour notre communauté ! Notre cher(e) {firstName} {lastName} vient d\'accueillir un petit trésor dans sa vie. Félicitons chaleureusement les parents pour cette merveilleuse naissance et souhaitons une vie pleine de bonheur et de santé à leur bébé ! 👶🎉🎈'
      }
    ]
  },
  {
    id: 'wedding',
    title: 'Mariage',
    icon: 'Sparkles',
    emoji: '💍',
    description: 'Féliciter un membre à l\'occasion de son union et marquer ce jour de fête.',
    whatToDo: [
      'Envoyer les vœux officiels de l\'organisation la veille ou le jour du mariage.',
      'Si la communauté est invitée, coordonner la présence et l\'organisation d\'un cadeau ou d\'un geste commun.',
      'Partager des photos ou un mot de célébration sur le réseau interne après l\'événement.',
      'Accueillir chaleureusement le conjoint lors de sa première visite future au sein du groupe.'
    ],
    templates: [
      {
        title: 'Vœux de Bonheur',
        text: 'Félicitations chaleureuses {firstName} pour ton mariage ! Toute la communauté de {orgName} te souhaite, ainsi qu\'à ton conjoint, une vie de couple harmonieuse, remplie d\'amour, de complicité et de projets partagés. Que ce jour de fête soit le début d\'une magnifique aventure commune ! 💍🎉✨'
      },
      {
        title: 'Félicitations de Groupe',
        text: '✨ Unissons nos voix pour féliciter chaleureusement notre {role}, {firstName} {lastName}, à l\'occasion de son mariage célébré récemment ! Tous nos vœux de bonheur, de prospérité et d\'amour infini pour ce nouveau foyer. Vive les mariés ! 💍🥂❤️'
      }
    ]
  },
  {
    id: 'bereavement',
    title: 'Deuil / Perte d\'un proche',
    icon: 'Flame',
    emoji: '😔',
    description: 'Accompagner un membre endeuillé avec dignité, discrétion et compassion.',
    whatToDo: [
      'Envoyer un message de condoléances sobre, respectueux et chaleureux dès l\'annonce.',
      'S\'enquérir discrètement des détails de l\'organisation (obsèques, veillée) pour informer la communauté de manière appropriée.',
      'Organiser la représentation physique de l\'organisation lors des cérémonies si la famille le permet.',
      'Coordonner un geste de solidarité financière ou florale (cotisation, couronne de fleurs) de la part de l\'organisation.',
      'Prendre des nouvelles quelques semaines après les obsèques, une fois la foule partie, moment où la solitude se fait souvent le plus ressentir.'
    ],
    templates: [
      {
        title: 'Condoléances Respectueuses',
        text: 'Bonjour {firstName}, c\'est avec une profonde tristesse que nous avons appris le deuil qui te frappe, toi et ta famille. Au nom de toute la communauté de {orgName}, je tiens à t\'exprimer nos plus sincères condoléances et toute notre compassion. Nous partageons ta peine et sommes à tes côtés dans cette douloureuse épreuve. Douces pensées pour vous.'
      },
      {
        title: 'Soutien de la communauté',
        text: 'Cher(e) {firstName}, en ces moments particulièrement douloureux de la perte de ton proche, sache que toute la famille de {orgName} fait bloc autour de toi. Nous te souhaitons beaucoup de courage et de force. Si tu as besoin de nous pour quoi que ce soit, nous serons là. Avec toute notre affection.'
      }
    ]
  }
];
