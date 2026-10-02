// TOUT le texte du site. Les composants n'écrivent aucune phrase en dur.

/** Photo Pexels (licence Pexels : gratuite, usage commercial autorisé). */
const pexels = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

// --- Fiche du club : à remplir avec les vraies informations ---
export const club = {
  name: "Padel House",
  street: "18 rue des Frères Lumière",
  zip: "69008",
  city: "Lyon",
  district: "Lyon 8e",
  phone: "04 26 68 12 34",
  phoneIntl: "+33 4 26 68 12 34",
  country: "FR",
  email: "contact@padel-house.fr", // reçoit les demandes de réservation
  url: "https://www.padel-house.fr", // adresse réelle du site
  hours: "Ouvert 7j/7 · 7h–23h",
  opens: "07:00",
  closes: "23:00",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=18+rue+des+Fr%C3%A8res+Lumi%C3%A8re+69008+Lyon",
  socials: [
    { name: "Instagram", url: "#" },
    { name: "TikTok", url: "#" },
    { name: "YouTube", url: "#" },
  ],
};

export const site = {
  seo: {
    title: `${club.name} — Club de padel à ${club.city}`,
    description: `Club de padel à ${club.city} : 8 terrains vitrés indoor et outdoor, ouverts 7j/7 de 7h à 23h. Initiation, cours collectifs, location de terrain et tournois.`,
    ogImage: pexels(32474981, 1200),
  },

  announcement: { enabled: false, text: "Tournoi d'ouverture le 12 octobre — inscriptions ouvertes", linkLabel: "Je m'inscris", linkTarget: "#reservation" },

  nav: [
    { label: "Offres", target: "#offres" },
    { label: "Le club", target: "#parcours" },
    { label: "Galerie", target: "#galerie" },
    { label: "Avis", target: "#avis" },
  ],
  navCta: "Réserver un terrain",
  navCtaShort: "Réserver",

  hero: {
    label: `Club de padel · ${club.district}`,
    title: "Le jeu commence ici", // le point final est la balle
    subtitle: "Réservez un terrain, prenez un cours, vibrez à chaque échange. Le padel comme vous ne l'avez jamais vécu : vitré, éclairé, électrique.",
    ctaPrimary: "Réserver un terrain",
    ctaSecondary: "Découvrir le club",
    figure: {
      label: "Fig. 1",
      caption: "Sortie de vitre : la balle rebondit au sol, touche la vitre du fond, puis revient en jeu.",
      alt: "Plan d'un court de padel de 20 mètres sur 10, avec la trajectoire d'une sortie de vitre",
      players: ["J1", "J2", "J3", "J4"],
    },
  },

  // Des faits, pas des promesses : à garder exacts.
  facts: [
    { value: "8", label: "terrains vitrés, indoor et outdoor" },
    { value: "7h–23h", label: "ouvert tous les jours" },
    { value: "0 €", label: "de location de raquette et de balles" },
    { value: "24 h", label: "pour annuler sans frais" },
  ],

  offers: {
    eyebrow: "Nos offres",
    title: "Une formule pour chaque joueur",
    intro: "Du tout premier échange au tournoi du dimanche, on a le créneau qu'il vous faut. Raquettes prêtées, terrains impeccables, coachs diplômés.",
    from: "dès",
    book: "Réserver",
    items: [
      { name: "Initiation Padel", duration: "1 h", level: "Débutant", price: "25 €", unit: "", badge: "", players: { left: 1, right: 0 }, coach: true, image: pexels(35248374),
        description: "Une séance ludique pour découvrir le padel : prise en main, service, vitrage et premiers points. Encadré par un coach, raquettes fournies." },
      { name: "Cours collectifs", duration: "1 h 30", level: "Tous niveaux", price: "19 €", unit: "/ pers.", badge: "", players: { left: 3, right: 0 }, coach: true, image: pexels(35248501),
        description: "Des sessions par niveau pour travailler technique, placement et tactique, dans une ambiance conviviale." },
      { name: "Location de terrain", duration: "1 h ou 1 h 30", level: "Libre", price: "32 €", unit: "/ terrain", badge: "La plus demandée", players: { left: 2, right: 2 }, coach: false, image: pexels(32897040),
        description: "Un court rien que pour vous et vos partenaires, vitré et éclairé, disponible 7j/7 de 7h à 23h." },
      { name: "Tournois & ligues", duration: "Demi-journée", level: "Compétiteur", price: "15 €", unit: "", badge: "", players: { left: 2, right: 2 }, coach: false, image: pexels(32524250),
        description: "Tournois du week-end, soirées américaines et ligues entre clubs. Tous les niveaux, des lots à gagner." },
      { name: "Padel Corporate", duration: "Sur mesure", level: "Entreprise", price: "Sur devis", unit: "", badge: "", players: { left: 2, right: 2 }, coach: true, image: pexels(34079998),
        description: "Team building, séminaires et privatisations. On organise tout : terrains, coachs, animation et repas." },
    ],
  },

  journey: {
    eyebrow: "Le club",
    title: "Le club en quatre temps",
    intro: "On pousse la porte pour essayer, on revient pour progresser, puis on ne compte plus ses soirées au club.",
    cta: "Réserver un terrain",
    items: [
      { step: "01", title: "Découvrir", subtitle: "Le premier échange", image: pexels(31012869, 1600), alt: "Raquette et balle de padel posées sur un court bleu, près du filet",
        text: "Poussez la porte du club. Raquette en main, ressentez l'adrénaline du premier échange contre la vitre. Le padel s'apprend en quelques minutes." },
      { step: "02", title: "S'entraîner", subtitle: "Avec nos coachs", image: pexels(35248286, 1600), alt: "Joueuse concentrée qui frappe la balle sur un court de padel intérieur",
        text: "Affûtez votre jeu avec nos coachs : sortie de vitre, bandeja, lob et amorti. Chaque séance, vous sentez vos automatismes progresser." },
      { step: "03", title: "Jouer", subtitle: "Terrain réservé", image: pexels(35248475, 1600), alt: "Joueuse en plein échange sur un court de padel bleu",
        text: "Réservez votre terrain, réunissez vos partenaires et vibrez à chaque point. Indoor ou outdoor, le jeu ne s'arrête jamais au club." },
      { step: "04", title: "Vibrer", subtitle: "Tournois & soirées", image: pexels(33641987, 1600), alt: "Joueuse de padel souriante, raquette en main, sous les lumières du club",
        text: "Tournois, ligues, soirées : montez en niveau et faites partie de la communauté. Le padel, c'est aussi tout ce qui se passe après le match." },
    ],
  },

  gallery: {
    eyebrow: "En images",
    title: "L'énergie du terrain",
    intro: "Huit courts vitrés, des soirées qui finissent tard et une communauté qui grandit.",
    items: [
      { src: pexels(35248338, 1200), caption: "Au filet", alt: "Joueuse au filet pendant un match de padel en salle" },
      { src: pexels(32474981, 900), caption: "Court intérieur", alt: "Court de padel intérieur au sol bleu, sous une grande charpente" },
      { src: pexels(35248469, 900), caption: "Retour de service", alt: "Joueuse souriante qui renvoie la balle sur un court bleu" },
      { src: pexels(4536850, 900), caption: "Avant le match", alt: "Raquette de padel et balles jaunes contre le filet" },
      { src: pexels(38155778, 900), caption: "Entre deux courts", alt: "Allée entre deux courts de padel vitrés" },
      { src: pexels(35248470, 900), caption: "Prête à servir", alt: "Joueuse en tenue rouge, prête à servir" },
      { src: pexels(32897038, 900), caption: "Le matériel", alt: "Raquette de padel et balles posées sur le court" },
      { src: pexels(35248481, 1200), caption: "Échauffement", alt: "Joueuse qui se prépare avant un match de padel en salle" },
    ],
  },

  // EXEMPLES : remplace-les par de vrais avis, puis passe `examples` à false.
  reviews: {
    eyebrow: "Ils jouent chez nous",
    title: "La parole aux joueurs",
    examples: true,
    examplesNote: "Avis d'exemple, en attendant les vôtres.",
    items: [
      { name: "Camille R.", role: "Cours collectifs", rating: 5, quote: "J'ai commencé débutante il y a six mois, je dispute déjà mes premiers tournois. Les coachs sont au top et l'ambiance est dingue." },
      { name: "Thomas & Léa", role: "Location de terrain", rating: 5, quote: "On réserve notre terrain chaque semaine en deux clics. Courts impeccables, éclairage parfait le soir. Notre rituel padel préféré." },
      { name: "Sofia M.", role: "Initiation", rating: 5, quote: "Première séance et déjà accro ! En une heure on tape déjà de vrais échanges. Le padel, c'est le sport le plus fun que j'ai testé." },
      { name: "L'équipe Marlow", role: "Padel Corporate", rating: 5, quote: "Notre team-building le plus réussi. Organisation millimétrée, fous rires garantis et tout le monde réclame déjà la revanche." },
    ],
  },

  faq: {
    eyebrow: "Première fois ?",
    title: "Tout ce qu'on vous demande avant de venir",
    intro: "Le padel s'apprend en quelques minutes. Voici les réponses aux questions qu'on nous pose le plus souvent au téléphone.",
    items: [
      { question: "Faut-il apporter sa raquette ?", answer: "Non. Les raquettes et les balles sont prêtées avec chaque créneau. Venez en tenue de sport avec des chaussures propres, on s'occupe du reste." },
      { question: "Le tarif est-il par personne ou par terrain ?", answer: "La location de terrain se paie au terrain, quel que soit le nombre de joueurs. Les cours et les initiations se paient par personne." },
      { question: "Faut-il être quatre pour jouer ?", answer: "Le padel se joue à quatre, mais vous n'avez pas besoin d'arriver à quatre : dites-le nous et nous vous mettons en relation avec d'autres joueurs de votre niveau." },
      { question: "Je n'ai jamais joué, est-ce que c'est un problème ?", answer: "Aucun. La majorité de nos visiteurs découvrent le padel chez nous. L'initiation est conçue exactement pour ça : en une heure, vous tapez de vrais échanges." },
      { question: "Peut-on annuler une réservation ?", answer: "Oui, jusqu'à 24 h avant le créneau. Passé ce délai, la séance reste due. Prévenez-nous au plus tôt, on trouve presque toujours une solution." },
      { question: "Y a-t-il des vestiaires et des douches ?", answer: "Oui, vestiaires et douches sont accessibles à tous les joueurs, sans supplément." },
    ],
  },

  booking: {
    eyebrow: "Réservation",
    title: "Réservez votre terrain",
    intro: "Composez votre demande en quatre étapes, puis envoyez-la au club. On vous rappelle pour confirmer.",
    stepLabel: (n: number, total: number) => `Étape ${n} / ${total}`,
    steps: ["Formule", "Créneau", "Coordonnées", "Votre message"],
    defaultOffer: 2, // index de « Location de terrain »
    timeSlots: ["09:00", "10:30", "12:00", "14:00", "17:30", "19:00", "20:30", "22:00"],
    defaultPlayers: 4,
    maxPlayers: 8,
    slotLabel: "Créneau",
    playersLabel: "Joueurs",
    nameLabel: "Nom complet",
    emailLabel: "E-mail",
    phoneLabel: "Téléphone",
    submit: "Préparer ma demande",
    privacyNote: "Vos coordonnées ne sont pas enregistrées : elles servent uniquement à composer le message que vous enverrez vous-même.",
    finalTitle: "Votre demande est prête",
    finalBody: "Envoyez le message ci-dessous au club. Nous vous rappelons sous 24 h ouvrées pour bloquer le créneau. Aucun terrain n'est retenu avant ce rappel.",
    messageLabel: "Le message à envoyer",
    copy: "Copier le texte",
    copied: "Copié",
    openMail: "Ouvrir ma messagerie",
    call: "Appeler le club",
    fallback: (email: string, phone: string) => `Si votre messagerie ne s'ouvre pas, copiez le texte ci-dessus et envoyez-le à ${email}, ou appelez le ${phone}.`,
    paymentNote: "Aucun paiement en ligne : le règlement se fait sur place.",
  },

  footer: {
    ctaTitle: "Prêt à entrer sur le court ?",
    ctaButton: "Réserver un terrain",
    mapLabel: "Plan du club",
    highlight: 7, // index du court marqué d'une balle
    courts: [
      { name: "Court 1 · Indoor", x: 6, y: 10 }, { name: "Court 2 · Indoor", x: 29, y: 10 },
      { name: "Court 3 · Indoor", x: 52, y: 10 }, { name: "Court 4 · Indoor", x: 75, y: 10 },
      { name: "Court 5 · Outdoor", x: 6, y: 56 }, { name: "Court 6 · Outdoor", x: 29, y: 56 },
      { name: "Court panoramique", x: 52, y: 56 }, { name: "Court central", x: 75, y: 56 },
    ], // x, y : coin haut gauche en %, chaque court mesure 19 % × 34 %
    linksTitle: "Navigation",
    contactTitle: "Contact",
    socialsTitle: "Suivez-nous",
    directions: "Y aller",
    rights: "Tous droits réservés.",
  },

  ui: {
    continue: "Continuer",
    back: "← Retour",
    backHome: "← Retour à l'accueil",
    close: "Fermer",
    menu: "Menu",
    dateLabel: "Date",
    legalLinks: { mentions: "Mentions légales", privacy: "Confidentialité" },
    placeholders: { name: "Camille Rivière", email: "camille@email.com", phone: "06 12 34 56 78" },
    errors: { name: "Indiquez votre nom complet.", email: "Cette adresse e-mail semble incomplète.", phone: "Ce numéro semble trop court." },
  },

  legal: {
    mentions: {
      title: "Mentions légales",
      sections: [
        { heading: "Éditeur du site", body: `[Raison sociale], [forme juridique] au capital de [montant] €. Siège social : [adresse du siège]. SIRET : [numéro SIRET] — RCS [ville] [numéro]. Téléphone : ${club.phone} — E-mail : ${club.email}. Directeur de la publication : [prénom et nom].` },
        { heading: "Hébergement", body: "[Nom de l'hébergeur], [adresse de l'hébergeur], [site web de l'hébergeur]." },
        { heading: "Propriété intellectuelle", body: "L'ensemble des contenus de ce site — textes, mise en page, identité visuelle — est la propriété de [raison sociale]. Toute reproduction, même partielle, sans autorisation écrite préalable est interdite. Les photographies de démonstration proviennent de Pexels et restent la propriété de leurs auteurs." },
        { heading: "Médiation de la consommation", body: "Conformément à l'article L612-1 du Code de la consommation, tout client peut recourir gratuitement à un médiateur de la consommation pour résoudre un litige à l'amiable : [nom et coordonnées du médiateur]." },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      sections: [
        { heading: "Responsable du traitement", body: `[Raison sociale], ${club.street}, ${club.zip} ${club.city}. Contact : ${club.email}.` },
        { heading: "Ce que nous collectons", body: "Le formulaire de réservation n'enregistre rien. Ce que vous y saisissez reste dans votre navigateur le temps de composer le message que vous nous envoyez vous-même depuis votre messagerie, puis disparaît quand vous fermez la page. Aucune base de données ne conserve vos coordonnées." },
        { heading: "Les demandes que nous recevons", body: "Votre message arrive dans notre boîte e-mail comme tout courrier. Nous l'utilisons uniquement pour vous rappeler et organiser votre venue, et nous le conservons trois ans après le dernier contact. Base légale : votre demande, et notre intérêt légitime à y répondre." },
        { heading: "Vos droits", body: `Vous pouvez demander l'accès à vos données, leur rectification ou leur effacement, ou vous opposer à leur traitement, en écrivant à ${club.email} : nous répondons sous un mois. En cas de désaccord, vous pouvez saisir la CNIL (3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, www.cnil.fr).` },
        { heading: "Cookies et services tiers", body: "Ce site ne dépose aucun cookie et n'utilise ni mesure d'audience ni traceur publicitaire, d'où l'absence de bannière de consentement. Les polices viennent de Google Fonts et les photos de Pexels : ces services reçoivent votre adresse IP, comme pour toute ressource chargée depuis un autre site." },
      ],
    },
  },
};
