// Cardly Pro — mock data layer (shaped to match future Supabase schema)

window.CARDLY_DATA = (function() {
  const entreprise = {
    id: "ent-001",
    nom_entreprise: "Immo Costa",
    code_secret: "CARDLY-8K4P",
    plan: "team", // 'solo' | 'team' | 'enterprise'
    max_collaborateurs: 10,
    owner_id: "u-001",
    statut: "active",
  };

  const profileMe = {
    id: "u-001",
    nom: "Martin",
    prenom: "Lucas",
    telephone: "07 67 56 92 24",
    email: "contact.cardly@gmail.com",
    poste: "Directeur commercial",
    role: "admin", // 'admin' | 'collaborator'
    site_web: "immocosta.fr",
    instagram: "immocosta",
    linkedin: "lucas-martin-immocosta",
  };

  const collaborators = [
    { id: "u-002", prenom: "Emma", nom: "Laurent", email: "emma@immocosta.fr", poste: "Conseillère", leads: 42, statut: "actif", role_membre: "responsable", last_click: "Il y a 2h" },
    { id: "u-003", prenom: "Hugo", nom: "Bernard", email: "hugo@immocosta.fr", poste: "Commercial", leads: 31, statut: "actif", role_membre: "collaborateur", last_click: "Il y a 5h" },
    { id: "u-004", prenom: "Sofia", nom: "Garcia", email: "sofia@immocosta.fr", poste: "Agent immobilier", leads: 18, statut: "en_attente", role_membre: "collaborateur", last_click: "—" },
    { id: "u-005", prenom: "Nathan", nom: "Morel", email: "nathan@immocosta.fr", poste: "Commercial junior", leads: 9, statut: "actif", role_membre: "collaborateur", last_click: "Hier" },
  ];

  // 6 card design variants (used in landing carousel + Mes cartes)
  const cardDesigns = [
    { id: "design-style-chinois",      label: "Style Chinois",      front: "assets/design-style-chinois-front.png",      back: "assets/design-style-chinois-back.png",      ink: "#2a241a", tag: "Signature" },
    { id: "design-serisier",           label: "Cerisier",           front: "assets/design-serisier-front.png",           back: "assets/design-serisier-back.png",           ink: "#2a241a", tag: "Nature" },
    { id: "design-bambou",             label: "Bambou",             front: "assets/design-bambou-front.png",             back: "assets/design-bambou-back.png",             ink: "#2a241a", tag: "Nature" },
    { id: "design-coline",             label: "Coline",             front: "assets/design-coline-front.png",             back: "assets/design-coline-back.png",             ink: "#2a241a", tag: "Nature" },
    { id: "design-fleures-roses",      label: "Fleurs Roses",       front: "assets/design-fleures-roses-front.png",      back: "assets/design-fleures-roses-back.png",      ink: "#2a241a", tag: "Floral" },
    { id: "design-plantes-verte",      label: "Plantes",            front: "assets/design-plantes-verte-front.png",      back: "assets/design-plantes-verte-back.png",      ink: "#2a241a", tag: "Nature" },
    { id: "design-nature-vert",        label: "Nature Vert",        front: "assets/design-nature-vert-front.png",        back: "assets/design-nature-vert-back.png",        ink: "#2a241a", tag: "Nature" },
    { id: "design-anime-nuage-vert",   label: "Nuage Vert",         front: "assets/design-anime-nuage-vert-front.png",   back: "assets/design-anime-nuage-vert-back.png",   ink: "#2a241a", tag: "Animé" },
    { id: "design-eventail-rouge",     label: "Éventail Rouge",     front: "assets/design-eventail-rouge-front.png",     back: "assets/design-eventail-rouge-back.png",     ink: "#2a241a", tag: "Artistique" },
    { id: "design-mon-fugi-vangog",    label: "Fuji Van Gogh",      front: "assets/design-mon-fugi-vangog-front.png",    back: "assets/design-mon-fugi-vangog-back.png",    ink: "#2a241a", tag: "Artistique" },
    { id: "design-papier-1",           label: "Papier I",           front: "assets/design-papier-1-front.png",           back: "assets/design-papier-1-back.png",           ink: "#2a241a", tag: "Minimal" },
    { id: "design-papier-simple-2",    label: "Papier II",          front: "assets/design-papier-simple-2-front.png",    back: "assets/design-papier-simple-2-back.png",    ink: "#2a241a", tag: "Minimal" },
    { id: "design-papirer-simple-3",   label: "Papier III",         front: "assets/design-papirer-simple-3-front.png",   back: "assets/design-papirer-simple-3-back.png",   ink: "#2a241a", tag: "Minimal" },
    { id: "design-papier-simple-4",    label: "Papier IV",          front: "assets/design-papier-simple-4-front.png",    back: "assets/design-papier-simple-4-back.png",    ink: "#2a241a", tag: "Minimal" },
    { id: "design-papie-simple-5",     label: "Papier V",           front: "assets/design-papie-simple-5-front.png",     back: "assets/design-papie-simple-5-back.png",     ink: "#2a241a", tag: "Minimal" },
    { id: "design-sobre-elegant",      label: "Sobre & Élégant",    front: "assets/design-sobre-elegant-front.png",      back: "assets/design-sobre-elegant-back.png",      ink: "#2a241a", tag: "Élégant" },
    { id: "design-beige-unie",         label: "Beige",              front: "assets/design-beige-unie-front.png",         back: "assets/design-beige-unie-back.png",         ink: "#2a241a", tag: "Uni" },
    { id: "design-argent-unie",        label: "Argent",             front: "assets/design-argent-unie-front.png",        back: "assets/design-argent-unie-back.png",        ink: "#2a241a", tag: "Uni" },
    { id: "design-unie-or",            label: "Or",                 front: "assets/design-unie-or-front.png",            back: "assets/design-unie-or-back.png",            ink: "#2a241a", tag: "Uni" },
    { id: "design-unie-rose",          label: "Rose",               front: "assets/design-unie-rose-front.png",          back: "assets/design-unie-rose-back.png",          ink: "#2a241a", tag: "Uni" },
    { id: "design-unie-orange",        label: "Orange",             front: "assets/design-unie-orange-front.png",        back: "assets/design-unie-orange-back.png",        ink: "#ffffff", tag: "Uni" },
    { id: "design-unie-violet",        label: "Violet",             front: "assets/design-unie-violet-front.png",        back: "assets/design-unie-violet-back.png",        ink: "#ffffff", tag: "Uni" },
    { id: "design-red-unie",           label: "Rouge",              front: "assets/design-red-unie-front.png",           back: "assets/design-red-unie-back.png",           ink: "#ffffff", tag: "Uni" },
    { id: "design-blue-unie",          label: "Bleu",               front: "assets/design-blue-unie-front.png",          back: "assets/design-blue-unie-back.png",          ink: "#ffffff", tag: "Uni" },
    { id: "design-black-unie",         label: "Noir",               front: "assets/design-black-unie-front.png",         back: "assets/design-black-unie-back.png",         ink: "#f1deb6", tag: "Uni" },
    { id: "design-classie-black",      label: "Classique Noir",     front: "assets/design-classie-black-front.png",      back: "assets/design-classie-black-back.png",      ink: "#f1deb6", tag: "Premium" },
    { id: "design-luxe-blac-or",       label: "Luxe Noir & Or",     front: "assets/design-luxe-blac-or-front.png",       back: "assets/design-luxe-blac-or-back.png",       ink: "#f1deb6", tag: "Luxe" },
    { id: "design-premium-blue",       label: "Premium Bleu",       front: "assets/design-premium-blue-front.png",       back: "assets/design-premium-blue-back.png",       ink: "#ffffff", tag: "Premium" },
    { id: "design-classique-immo",     label: "Classique Immo",     front: "assets/design-classique-immo-front.png",     back: "assets/design-classique-immo-back.png",     ink: "#2a241a", tag: "Immobilier" },
    { id: "design-immoblier-bleu",     label: "Immo Bleu",          front: "assets/design-immoblier-bleu-front.png",     back: "assets/design-immoblier-bleu-back.png",     ink: "#ffffff", tag: "Immobilier" },
    { id: "design-immoblier-luxe-bleu",label: "Immo Luxe Bleu",     front: "assets/design-immoblier-luxe-bleu-front.png",back: "assets/design-immoblier-luxe-bleu-back.png",ink: "#ffffff", tag: "Immobilier" },
    { id: "design-immoblier-vert",     label: "Immo Vert",          front: "assets/design-immoblier-vert-front.png",     back: "assets/design-immoblier-vert-back.png",     ink: "#ffffff", tag: "Immobilier" },
    { id: "design-ocean",              label: "Océan",              front: "assets/design-ocean-front.png",              back: "assets/design-ocean-back.png",              ink: "#ffffff", tag: "Nature" },
    { id: "design-costume",            label: "Costume",            front: "assets/design-costume-front.png",            back: "assets/design-costume-back.png",            ink: "#f1deb6", tag: "Élégant" },
  ];

  // Current cards owned by current user
  const cards = [
    {
      id: "card-001",
      type: "enterprise",
      nom_carte: "Carte entreprise — Immo Costa",
      design: "design-blossom",
      // displayed fields
      nom_affiche: "Martin",
      prenom_affiche: "Lucas",
      entreprise_affiche: "Immo Costa",
      poste_affiche: "Directeur commercial",
      telephone_affiche: "07 67 56 92 24",
      email_affiche: "contact.cardly@gmail.com",
      site_web: "immocosta.fr",
      // visibility
      afficher_nom: true,
      afficher_prenom: true,
      afficher_entreprise: true,
      afficher_poste: true,
      afficher_telephone: true,
      afficher_email: true,
      afficher_site_web: true,
      // positions (% on back face)
      positions: {
        name:       { x: 70, y: 26 },
        entreprise: { x: 70, y: 36 },
        poste:      { x: 70, y: 46 },
        phone:      { x: 70, y: 60 },
        email:      { x: 70, y: 70 },
        web:        { x: 70, y: 80 },
      },
      is_default: true,
      event: null,
      statut: "active",
    },
    {
      id: "card-002",
      type: "personal",
      nom_carte: "Ma carte minimal",
      design: "design-clean",
      nom_affiche: "Martin",
      prenom_affiche: "Lucas",
      entreprise_affiche: "Immo Costa",
      poste_affiche: "Directeur commercial",
      telephone_affiche: "07 67 56 92 24",
      email_affiche: "lucas@immocosta.fr",
      site_web: "lucasmartin.fr",
      afficher_nom: true,
      afficher_prenom: true,
      afficher_entreprise: false,
      afficher_poste: true,
      afficher_telephone: true,
      afficher_email: true,
      afficher_site_web: true,
      positions: {
        name:       { x: 50, y: 28 },
        entreprise: { x: 50, y: 38 },
        poste:      { x: 50, y: 48 },
        phone:      { x: 50, y: 62 },
        email:      { x: 50, y: 72 },
        web:        { x: 50, y: 82 },
      },
      is_default: false,
      event: "Salon Immobilier 2026",
      statut: "active",
    },
  ];

  const crmContacts = [
    { id: "c-001", nom: "Dupont",    prenom: "Marie",    email: "marie.dupont@nexity.fr",      tel: "06 11 22 33 44", entreprise: "Nexity",        membre_id: "u-002", membre: "Emma Laurent",   date: "28/04/2026", event: "Salon Immobilier 2026" },
    { id: "c-002", nom: "Renard",    prenom: "Thomas",   email: "thomas.renard@bouygues.fr",   tel: "06 55 44 33 22", entreprise: "Bouygues",      membre_id: "u-003", membre: "Hugo Bernard",   date: "27/04/2026", event: "Réseau MEDEF" },
    { id: "c-003", nom: "Lefebvre",  prenom: "Sophie",   email: "s.lefebvre@gmail.com",        tel: "07 12 34 56 78", entreprise: "Indépendante",  membre_id: "u-002", membre: "Emma Laurent",   date: "26/04/2026", event: "Salon Immobilier 2026" },
    { id: "c-004", nom: "Moreau",    prenom: "Julien",   email: "jmoreau@seloger.com",          tel: "06 98 76 54 32", entreprise: "SeLoger",       membre_id: "u-005", membre: "Nathan Morel",   date: "25/04/2026", event: "Portes ouvertes" },
    { id: "c-005", nom: "Bernard",   prenom: "Claire",   email: "claire.b@orpi.com",           tel: "07 65 43 21 09", entreprise: "Orpi",          membre_id: "u-002", membre: "Emma Laurent",   date: "24/04/2026", event: "Salon Immobilier 2026" },
    { id: "c-006", nom: "Petit",     prenom: "Antoine",  email: "apetit@century21.fr",         tel: "06 22 33 44 55", entreprise: "Century 21",    membre_id: "u-003", membre: "Hugo Bernard",   date: "24/04/2026", event: "Réseau MEDEF" },
    { id: "c-007", nom: "Martin",    prenom: "Laure",    email: "lmartin@laforet.com",         tel: "07 88 77 66 55", entreprise: "Laforêt",       membre_id: "u-005", membre: "Nathan Morel",   date: "23/04/2026", event: "Portes ouvertes" },
    { id: "c-008", nom: "Simon",     prenom: "Nicolas",  email: "n.simon@lcl.fr",              tel: "06 44 55 66 77", entreprise: "LCL",           membre_id: "u-003", membre: "Hugo Bernard",   date: "22/04/2026", event: "Réseau MEDEF" },
    { id: "c-009", nom: "Garcia",    prenom: "Isabelle", email: "igarcia@groupeama.fr",        tel: "07 33 22 11 00", entreprise: "Groupama",      membre_id: "u-002", membre: "Emma Laurent",   date: "21/04/2026", event: "Salon Immobilier 2026" },
    { id: "c-010", nom: "Laurent",   prenom: "Pierre",   email: "plaurent@bnpparibas.com",     tel: "06 77 88 99 00", entreprise: "BNP Paribas",   membre_id: "u-005", membre: "Nathan Morel",   date: "20/04/2026", event: "Sans étiquette" },
    { id: "c-011", nom: "Fontaine",  prenom: "Céline",   email: "cfontaine@axa.fr",            tel: "07 56 45 34 23", entreprise: "AXA",           membre_id: "u-003", membre: "Hugo Bernard",   date: "19/04/2026", event: "Réseau MEDEF" },
    { id: "c-012", nom: "Rousseau",  prenom: "Marc",     email: "marc.rousseau@free.fr",       tel: "06 13 24 35 46", entreprise: "Freelance",     membre_id: "u-002", membre: "Emma Laurent",   date: "18/04/2026", event: "Salon Immobilier 2026" },
  ];

  return {
    entreprise, profileMe, collaborators, cardDesigns, cards, crmContacts,
    // helpers
    getDesign: (id) => cardDesigns.find(d => d.id === id) || cardDesigns[0],
    leadsThisMonth: 142,
    leadsLastMonth: 118,
    activeCollabs: 3,
  };
})();
