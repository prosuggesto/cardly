// Cardly Pro — Supabase client + API layer
(function () {
  try {
    const SUPABASE_URL = 'https://wkwchmcmdazcrlxcofmo.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrd2NobWNtZGF6Y3JseGNvZm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjQxNDEsImV4cCI6MjA5MjcwMDE0MX0.gZcrLf8BZYVkDR5K3ecoFikHa7EP4a_wm-io6Oh9s3k';
    const FN_URL = SUPABASE_URL + '/functions/v1';

    window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window._CARDLY_ANON_KEY = SUPABASE_ANON_KEY;
    window._CARDLY_FN_URL = FN_URL;

    window.CardlyAPI = {

      // ── Auth ─────────────────────────────────────────────────────────────
      async signIn(email, password) {
        return window.sb.auth.signInWithPassword({ email, password });
      },
      async signUp(email, password) {
        return window.sb.auth.signUp({ email, password });
      },
      async signOut() {
        return window.sb.auth.signOut();
      },
      // Démarre le flow OAuth Google. Supabase redirige vers Google puis revient
      // sur redirectTo (l'app détecte la session automatiquement au retour).
      async signInWithGoogle() {
        const base = window.location.origin + window.location.pathname;
        return window.sb.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: base + '#/app' },
        });
      },

      // ── Profile ──────────────────────────────────────────────────────────
      async getProfile(userId) {
        return window.sb.from('profiles').select('*').eq('id', userId).single();
      },
      async upsertProfile(userId, data) {
        return window.sb.from('profiles').upsert({ id: userId, ...data }, { onConflict: 'id' }).select().single();
      },

      // ── Entreprise ───────────────────────────────────────────────────────
      async createEntreprise(adminId, nom_entreprise, website) {
        return window.sb.from('entreprises')
          .insert({ admin_id: adminId, nom_entreprise, website: website || null })
          .select().single();
      },
      async getEntrepriseByCode(code) {
        return window.sb.from('entreprises')
          .select('id, nom_entreprise, plan, statut, code_secret, website')
          .eq('code_secret', code.toUpperCase().trim())
          .single();
      },
      async regenerateCode(entrepriseId) {
        const newCode = 'CARDLY-' + Math.random().toString(36).slice(2, 6).toUpperCase()
          + Math.random().toString(36).slice(2, 6).toUpperCase();
        return window.sb.from('entreprises')
          .update({ code_secret: newCode })
          .eq('id', entrepriseId)
          .select('code_secret').single();
      },

      // ── Membres ──────────────────────────────────────────────────────────
      async joinEntreprise(entrepriseId, userId) {
        return window.sb.from('entreprise_members')
          .insert({ entreprise_id: entrepriseId, user_id: userId, role: 'member', statut: 'pending' })
          .select().single();
      },
      async getMyMembership(userId) {
        return window.sb.from('entreprise_members')
          .select('*, entreprises(*)')
          .eq('user_id', userId)
          .eq('statut', 'active')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();
      },
      async getMyPendingMembership(userId) {
        return window.sb.from('entreprise_members')
          .select('*, entreprises(nom_entreprise)')
          .eq('user_id', userId)
          .eq('statut', 'pending')
          .maybeSingle();
      },
      async getMembers(entrepriseId) {
        return window.sb.from('entreprise_members')
          .select('*, profiles(id, nom, prenom, email, poste, telephone)')
          .eq('entreprise_id', entrepriseId)
          .order('created_at', { ascending: true });
      },
      async acceptMember(memberId) {
        return window.sb.from('entreprise_members')
          .update({ statut: 'active' }).eq('id', memberId).select().single();
      },
      async removeMember(memberId) {
        return window.sb.from('entreprise_members').delete().eq('id', memberId);
      },
      async updateMemberRole(memberId, role) {
        return window.sb.from('entreprise_members')
          .update({ role }).eq('id', memberId).select().single();
      },

      // ── Cartes ───────────────────────────────────────────────────────────
      async getCartes(entrepriseId) {
        return window.sb.from('cartes').select('*')
          .eq('entreprise_id', entrepriseId)
          .order('created_at', { ascending: true });
      },
      async getMyCartes(userId, entrepriseId) {
        return window.sb.from('cartes').select('*')
          .eq('collaborateur_id', userId)
          .eq('entreprise_id', entrepriseId)
          .order('created_at', { ascending: true });
      },
      async getCarteByUuid(carteUuid) {
        return window.sb.from('cartes').select('*').eq('carte_uuid', carteUuid).single();
      },
      async createCarte(data) {
        return window.sb.from('cartes').insert(data).select().single();
      },
      // Réplique une carte entreprise pour chaque membre actif de l'entreprise
      // (sauf le créateur, qui a déjà sa carte). Chaque réplique partage le même
      // design / positions / scan config, mais avec son propre collaborateur_id.
      // Les infos personnelles (nom, prenom, telephone, email, poste) sont
      // lues depuis le profil du membre au moment du render (mapCarteFromDB).
      async replicateCarteForMembers(carteData, entrepriseId, excludeUserId) {
        // 1) Récupérer tous les membres ACTIFS de l'entreprise (sauf le créateur)
        const { data: members, error: mErr } = await window.sb
          .from('entreprise_members')
          .select('user_id')
          .eq('entreprise_id', entrepriseId)
          .eq('statut', 'active');
        if (mErr || !members?.length) return { data: [], error: mErr };
        const targets = members.map(m => m.user_id).filter(uid => uid && uid !== excludeUserId);
        if (!targets.length) return { data: [], error: null };
        // 2) Construire les payloads (un par membre cible) — on retire les champs auto-gérés
        const { id, carte_uuid, created_at, updated_at, ...base } = carteData;
        const rows = targets.map(uid => ({ ...base, collaborateur_id: uid }));
        // 3) Insertion en bulk
        return window.sb.from('cartes').insert(rows).select();
      },
      async updateCarte(carteUuid, data) {
        const { data: master, error } = await window.sb.from('cartes')
          .update(data).eq('carte_uuid', carteUuid).select().single();
        if (error) return { data: null, error };
        // Si carte entreprise : propager la modif à toutes les répliques
        // (même entreprise + même nom de carte + type entreprise, sauf la master)
        if (master?.type_card === 'entreprise' && master.entreprise_id && master.card_name) {
          try {
            await window.sb.from('cartes')
              .update(data)
              .eq('entreprise_id', master.entreprise_id)
              .eq('card_name', master.card_name)
              .eq('type_card', 'entreprise')
              .neq('carte_uuid', carteUuid);
          } catch (_) { /* best-effort */ }
        }
        return { data: master, error: null };
      },
      async deleteCarte(carteUuid) {
        return window.sb.from('cartes').delete().eq('carte_uuid', carteUuid);
      },

      // ── Événements ───────────────────────────────────────────────────────
      async getEvenements(entrepriseId) {
        return window.sb.from('evenements').select('*')
          .eq('entreprise_id', entrepriseId)
          .order('created_at', { ascending: false });
      },
      async createEvenement(entrepriseId, name) {
        const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
        return window.sb.from('evenements').insert({
          entreprise_id: entrepriseId,
          evenement_name: name,
          evenement_uuid: uuid,
        }).select().single();
      },

      // ── Logs Leads ───────────────────────────────────────────────────────
      // Retourne les lignes agrégées (1 par user/mois/event)
      async getLogsLeads(entrepriseId, { mois, annee, userId, evenementUuid } = {}) {
        let q = window.sb.from('logs_leads').select('*').eq('entreprise_id', entrepriseId);
        if (mois)   q = q.eq('mois', parseInt(mois, 10));
        if (annee)  q = q.eq('annee', parseInt(annee, 10));
        if (userId) q = q.eq('user_id', userId);
        if (evenementUuid) q = q.eq('evenement_uuid', evenementUuid);
        return q;
      },

      // ── CRM Contacts ─────────────────────────────────────────────────────
      async getCRMContacts(entrepriseId) {
        return window.sb.from('crm_contacts').select('*')
          .eq('entreprise_id', entrepriseId)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });
      },
      async deleteCRMContact(contactId) {
        return window.sb.from('crm_contacts').delete().eq('id', contactId);
      },

      // ── Mes idées ────────────────────────────────────────────────────────
      async getIdees(userId) {
        return window.sb.from('mes_idees').select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });
      },
      async sendMessage(userId, { message, categorie, mail, telephone }) {
        return window.sb.from('mes_idees').insert({
          user_id: userId, message, categorie,
          mail: mail || null, telephone: telephone || null,
          sender: 'user',
        }).select().single();
      },

      // ── NFC Cards ────────────────────────────────────────────────────────
      async getNFCCards(userId, entrepriseId) {
        return window.sb.from('nfc_cards')
          .select('*, cartes(card_name, carte_uuid, statut)')
          .eq('user_id', userId).eq('entreprise_id', entrepriseId);
      },
      async createNFCCard(userId, entrepriseId, carteUuid) {
        return window.sb.from('nfc_cards')
          .insert({ user_id: userId, entreprise_id: entrepriseId, carte_uuid: carteUuid || null })
          .select().single();
      },
      async linkNFCCard(nfcId, carteUuid) {
        return window.sb.from('nfc_cards')
          .update({ carte_uuid: carteUuid }).eq('id', nfcId).select().single();
      },
      async regenerateNFCCard(nfcId) {
        // Force la régénération du nfc_uuid via un update sur lui-même.
        return window.sb.from('nfc_cards')
          .update({ nfc_uuid: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : null })
          .eq('id', nfcId).select().single();
      },
      // Résout un nfc_uuid en carte_uuid via la fonction publique resolve_nfc (SECURITY DEFINER).
      async resolveNFC(nfcUuid) {
        return window.sb.rpc('resolve_nfc', { p_nfc_uuid: nfcUuid });
      },

      // ── Edge Functions ───────────────────────────────────────────────────
      async trackAction(carteUuid, action) {
        try {
          const { data: { session } } = await window.sb.auth.getSession();
          // keepalive:true → la requête termine même si la page est en
          // train d'être unload/suspendue (mailto:, wa.me deep link,
          // download .vcf qui passe la main à l'app Contacts, etc.).
          await fetch(FN_URL + '/track-action', {
            method: 'POST',
            keepalive: true,
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              ...(session ? { 'Authorization': 'Bearer ' + session.access_token } : {}),
            },
            body: JSON.stringify({ carte_uuid: carteUuid, action }),
          });
        } catch (_) { /* non-bloquant */ }
      },

      // Récupère les stats par-carte fraîches (table cartes, colonnes
    // stat_clic_*). Le RPC track_card_action les incrémente directement.
    async getCardStats(carteUuid) {
      const { data, error } = await window.sb
        .from('cartes')
        .select('stat_clic_scans, stat_clic_add_contact, stat_clic_whatsapp, stat_clic_mail, stat_clic_instagram, stat_clic_linkedin, stat_clic_site_web, stat_clic_crm')
        .eq('carte_uuid', carteUuid)
        .single();
      if (error || !data) return { data: null, error };
      return {
        data: {
          scans:       +(data.stat_clic_scans       || 0),
          add_contact: +(data.stat_clic_add_contact || 0),
          whatsapp:    +(data.stat_clic_whatsapp    || 0),
          mail:        +(data.stat_clic_mail        || 0),
          instagram:   +(data.stat_clic_instagram   || 0),
          linkedin:    +(data.stat_clic_linkedin    || 0),
          site_web:    +(data.stat_clic_site_web    || 0),
          crm:         +(data.stat_clic_crm         || 0),
        },
        error: null,
      };
    },

    async saveCRMContact(carteUuid, { nom, prenom, mail, tel, prospect_entreprise_nom } = {}) {
        const { data: { session } } = await window.sb.auth.getSession();
        const res = await fetch(FN_URL + '/save-crm-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            ...(session ? { 'Authorization': 'Bearer ' + session.access_token } : {}),
          },
          body: JSON.stringify({ carte_uuid: carteUuid, nom, prenom, mail, tel, prospect_entreprise_nom }),
        });
        return res.json();
      },

      // ── Mappers DB ↔ Frontend ────────────────────────────────────────────
      // Convertit une ligne DB `cartes` en objet card utilisé par le frontend.
      mapCarteFromDB(c, profile, entreprise) {
        return {
          id: c.carte_uuid,
          type: c.type_card,
          nom_carte: c.card_name,
          tag: c.evenement_name || null,
          evenement_uuid: c.evenement_uuid || null,
          nom_affiche:        profile?.nom            || '',
          prenom_affiche:     profile?.prenom         || '',
          entreprise_affiche: profile?.nom_entreprise || entreprise?.nom_entreprise || '',
          poste_affiche:      profile?.poste          || '',
          telephone_affiche:  profile?.telephone      || '',
          email_affiche:      profile?.email          || '',
          instagram_url:      profile?.instagram      || '',
          linkedin_url:       profile?.linkedin       || '',
          // Site web : TOUJOURS celui de l'entreprise (pour carte perso comme entreprise).
          // Le profil personnel ne sert plus pour le site web affiché sur la carte.
          site_web:           entreprise?.website || '',
          afficher_nom:        c.afficher_nom            ?? false,
          afficher_prenom:     c.afficher_prenom         ?? false,
          afficher_entreprise: c.afficher_nom_entreprise ?? false,
          afficher_poste:      c.afficher_poste          ?? false,
          afficher_telephone:  c.afficher_telephone      ?? false,
          afficher_email:      c.afficher_email          ?? false,
          afficher_site_web:   c.afficher_site_web       ?? false,
          positions: {
            name:       { x: +(c.prenom_x         || 57.7706770270831),   y: +(c.prenom_y         || 19.33460308118465)  },
            entreprise: { x: +(c.nom_entreprise_x || 47.063215515592084), y: +(c.nom_entreprise_y || 50.7604620755852)   },
            poste:      { x: +(c.poste_x          || 57.197057416883915), y: +(c.poste_y          || 31.197713989721958) },
            phone:      { x: +(c.telephone_x      || 70),                 y: +(c.telephone_y      || 60)                 },
            email:      { x: +(c.email_x          || 70),                 y: +(c.email_y          || 70)                 },
            web:        { x: +(c.site_web_x       || 44.57755728227542),  y: +(c.site_web_y       || 64.7528528713908)  },
            logoRecto:  { x: +(c.logo_recto_x     || 46.10719255709519),  y: +(c.logo_recto_y     || 29.372629375965424) },
            logoVerso:  { x: +(c.logo_verso_x     || 23.162641553169696), y: +(c.logo_verso_y     || 21.463871364811073) },
          },
          fieldColors: {
            name:       c.prenom_couleur         || '#f3f0ed',
            entreprise: c.nom_entreprise_couleur || '#f3f0ed',
            poste:      c.poste_couleur          || '#f3f0ed',
            phone:      c.telephone_couleur      || '#f3f0ed',
            email:      c.email_couleur          || '#f3f0ed',
            web:        c.site_web_couleur       || '#f3f0ed',
          },
          fieldSides: {
            name:       c.prenom_side         || 'verso',
            entreprise: c.nom_entreprise_side || 'recto',
            poste:      c.poste_side          || 'verso',
            phone:      c.telephone_side      || 'verso',
            email:      c.email_side          || 'verso',
            web:        c.site_web_side       || 'recto',
          },
          fieldSizes: {
            name:       (+(c.prenom_size         || 175)) / 100,
            entreprise: (+(c.nom_entreprise_size || 250)) / 100,
            poste:      (+(c.poste_size          || 100)) / 100,
            phone:      (+(c.telephone_size      || 100)) / 100,
            email:      (+(c.email_size          || 100)) / 100,
            web:        (+(c.site_web_size       || 100)) / 100,
          },
          fieldFonts: {
            name:       (c.prenom_police === 'Inter' ? 'default' : c.prenom_police)                 || 'serif',
            entreprise: (c.nom_entreprise_police === 'Inter' ? 'default' : c.nom_entreprise_police) || 'playfair',
            poste:      (c.poste_police === 'Inter' ? 'default' : c.poste_police)                   || 'default',
            phone:      (c.telephone_police === 'Inter' ? 'default' : c.telephone_police)           || 'cinzel',
            email:      (c.email_police === 'Inter' ? 'default' : c.email_police)                   || 'playfair',
            web:        (c.site_web_police === 'Inter' ? 'default' : c.site_web_police)             || 'default',
          },
          fieldDecorations: {
            name:       { bold: !!c.prenom_gras,         italic: !!c.prenom_italique,         underline: !!c.prenom_souligne },
            entreprise: { bold: !!c.nom_entreprise_gras, italic: !!c.nom_entreprise_italique, underline: !!c.nom_entreprise_souligne },
            poste:      { bold: !!c.poste_gras,          italic: !!c.poste_italique,          underline: !!c.poste_souligne },
            phone:      { bold: !!c.telephone_gras,      italic: !!c.telephone_italique,      underline: !!c.telephone_souligne },
            email:      { bold: !!c.email_gras,          italic: !!c.email_italique,          underline: !!c.email_souligne },
            web:        { bold: !!c.site_web_gras,       italic: !!c.site_web_italique,       underline: !!c.site_web_souligne },
          },
          logoUrl:       c.image_logo   || null,
          logoSide:      ((c.afficher_logo_recto ?? true) && (c.afficher_logo_verso ?? false)) ? 'both'
                       : (c.afficher_logo_verso ?? false) ? 'verso' : 'recto',
          logoSizeRecto: (+(c.logo_recto_size || 100)) / 100,
          logoSizeVerso: (+(c.logo_verso_size || 100)) / 100,
          frontImageUrl: c.image_verso  || (() => { const d = (window.CARTALIS_DATA?.cardDesigns || []).find(x => x.id === 'design-immoblier-bleu') || window.CARTALIS_DATA?.cardDesigns?.[0]; return d?.front ?? null; })(),
          backImageUrl:  c.image_recto  || (() => { const d = (window.CARTALIS_DATA?.cardDesigns || []).find(x => x.id === 'design-immoblier-bleu') || window.CARTALIS_DATA?.cardDesigns?.[0]; return d?.back  ?? null; })(),
          scanButtons: {
            contact:   c.btn_contact   ?? true,
            whatsapp:  c.btn_whatsapp  ?? true,
            mail:      c.btn_mail      ?? true,
            instagram: c.btn_instagram ?? true,
            linkedin:  c.btn_linkedin  ?? true,
            crm:       c.btn_crm       ?? true,
            rdv:       c.btn_rdv       ?? false,
          },
          rdvUrl: c.rdv_url || '',
          crmFields: {
            nom:     c.crm_champ_nom     ?? true,
            prenom:  c.crm_champ_prenom  ?? true,
            societe: c.crm_champ_societe ?? true,
            mail:    c.crm_champ_mail    ?? true,
            tel:     c.crm_champ_tel     ?? true,
          },
          statut:     c.statut || 'active',
          is_default: false,
          // Stats par-carte alimentées par le RPC track_card_action.
          // Lecture seule depuis la table cartes.stat_clic_*.
          stats: {
            scans:       +(c.stat_clic_scans       || 0),
            add_contact: +(c.stat_clic_add_contact || 0),
            whatsapp:    +(c.stat_clic_whatsapp    || 0),
            mail:        +(c.stat_clic_mail        || 0),
            instagram:   +(c.stat_clic_instagram   || 0),
            linkedin:    +(c.stat_clic_linkedin    || 0),
            site_web:    +(c.stat_clic_site_web    || 0),
            crm:         +(c.stat_clic_crm         || 0),
          },
        };
      },

      // Convertit l'état frontend en colonnes DB pour un updateCarte.
      carteToDBUpdate(card, { fieldColors = {}, fieldSides = {}, fieldSizes = {}, fieldFonts = {}, fieldDecorations = {}, logoUrl, logoSide, logoSizeRecto, logoSizeVerso, frontImageUrl, backImageUrl } = {}) {
        const fc = fieldColors, fs = fieldSides, fz = fieldSizes, ff = fieldFonts, fd = fieldDecorations;
        const font = (k) => ff[k] === 'default' || !ff[k] ? 'Inter' : ff[k];
        return {
          afficher_prenom:         card.afficher_prenom   ?? true,
          afficher_nom:            card.afficher_nom       ?? true,
          afficher_nom_entreprise: card.afficher_entreprise ?? true,
          afficher_poste:          card.afficher_poste     ?? true,
          afficher_telephone:      card.afficher_telephone ?? true,
          afficher_email:          card.afficher_email     ?? true,
          afficher_site_web:       card.afficher_site_web  ?? true,
          prenom_x:         card.positions?.name?.x       ?? 57.7706770270831,   prenom_y:         card.positions?.name?.y       ?? 19.33460308118465,
          nom_x:            card.positions?.name?.x       ?? 57.7706770270831,   nom_y:            card.positions?.name?.y       ?? 19.33460308118465,
          nom_entreprise_x: card.positions?.entreprise?.x ?? 47.063215515592084, nom_entreprise_y: card.positions?.entreprise?.y ?? 50.7604620755852,
          poste_x:          card.positions?.poste?.x      ?? 57.197057416883915, poste_y:          card.positions?.poste?.y      ?? 31.197713989721958,
          telephone_x:      card.positions?.phone?.x      ?? 70,                 telephone_y:      card.positions?.phone?.y      ?? 60,
          email_x:          card.positions?.email?.x      ?? 70,                 email_y:          card.positions?.email?.y      ?? 70,
          site_web_x:       card.positions?.web?.x        ?? 44.57755728227542,  site_web_y:       card.positions?.web?.y        ?? 64.7528528713908,
          logo_recto_x:     card.positions?.logoRecto?.x  ?? 46.10719255709519,  logo_recto_y:     card.positions?.logoRecto?.y  ?? 29.372629375965424,
          logo_verso_x:     card.positions?.logoVerso?.x  ?? 23.162641553169696, logo_verso_y:     card.positions?.logoVerso?.y  ?? 21.463871364811073,
          prenom_couleur:         fc.name       || '#f3f0ed',
          nom_couleur:            fc.name       || '#f3f0ed',
          nom_entreprise_couleur: fc.entreprise || '#f3f0ed',
          poste_couleur:          fc.poste      || '#f3f0ed',
          telephone_couleur:      fc.phone      || '#f3f0ed',
          email_couleur:          fc.email      || '#f3f0ed',
          site_web_couleur:       fc.web        || '#f3f0ed',
          prenom_side:         fs.name       || 'recto',
          nom_side:            fs.name       || 'recto',
          nom_entreprise_side: fs.entreprise || 'recto',
          poste_side:          fs.poste      || 'recto',
          telephone_side:      fs.phone      || 'recto',
          email_side:          fs.email      || 'recto',
          site_web_side:       fs.web        || 'recto',
          prenom_size:         Math.round((fz.name       || 1)   * 100),
          nom_size:            Math.round((fz.name       || 1)   * 100),
          nom_entreprise_size: Math.round((fz.entreprise || 1)   * 100),
          poste_size:          Math.round((fz.poste      || 0.9) * 100),
          telephone_size:      Math.round((fz.phone      || 0.8) * 100),
          email_size:          Math.round((fz.email      || 0.8) * 100),
          site_web_size:       Math.round((fz.web        || 0.8) * 100),
          prenom_police:         font('name'),
          nom_police:            font('name'),
          nom_entreprise_police: font('entreprise'),
          poste_police:          font('poste'),
          telephone_police:      font('phone'),
          email_police:          font('email'),
          site_web_police:       font('web'),
          prenom_gras:             !!fd.name?.bold,       prenom_italique:             !!fd.name?.italic,       prenom_souligne:             !!fd.name?.underline,
          nom_gras:                !!fd.name?.bold,       nom_italique:                !!fd.name?.italic,       nom_souligne:                !!fd.name?.underline,
          nom_entreprise_gras:     !!fd.entreprise?.bold, nom_entreprise_italique:     !!fd.entreprise?.italic, nom_entreprise_souligne:     !!fd.entreprise?.underline,
          poste_gras:              !!fd.poste?.bold,      poste_italique:              !!fd.poste?.italic,      poste_souligne:              !!fd.poste?.underline,
          telephone_gras:          !!fd.phone?.bold,      telephone_italique:          !!fd.phone?.italic,      telephone_souligne:          !!fd.phone?.underline,
          email_gras:              !!fd.email?.bold,      email_italique:              !!fd.email?.italic,      email_souligne:              !!fd.email?.underline,
          site_web_gras:           !!fd.web?.bold,        site_web_italique:           !!fd.web?.italic,        site_web_souligne:           !!fd.web?.underline,
          image_logo:           logoUrl ?? null,
          afficher_logo_recto:  logoSide === 'recto' || logoSide === 'both',
          afficher_logo_verso:  logoSide === 'verso' || logoSide === 'both',
          logo_recto_size: Math.round((logoSizeRecto || 1) * 100),
          logo_verso_size: Math.round((logoSizeVerso || 1) * 100),
          image_recto:     backImageUrl  ?? null,
          image_verso:     frontImageUrl ?? null,
        };
      },

      // Config scan → colonnes DB.
      scanConfigToDBUpdate(scanButtons, rdvUrl, crmFields) {
        return {
          btn_contact:       scanButtons?.contact   ?? true,
          btn_whatsapp:      scanButtons?.whatsapp  ?? true,
          btn_mail:          scanButtons?.mail      ?? true,
          btn_instagram:     scanButtons?.instagram ?? true,
          btn_linkedin:      scanButtons?.linkedin  ?? true,
          btn_crm:           scanButtons?.crm       ?? true,
          btn_rdv:           scanButtons?.rdv       ?? false,
          rdv_url:           rdvUrl   || '',
          crm_champ_nom:     crmFields?.nom     ?? true,
          crm_champ_prenom:  crmFields?.prenom  ?? true,
          crm_champ_societe: crmFields?.societe ?? true,
          crm_champ_mail:    crmFields?.mail    ?? true,
          crm_champ_tel:     crmFields?.tel     ?? true,
        };
      },
    };
  } catch (e) {
    console.error('[Cardly] Supabase init failed:', e);
    window.sb = null;
    window.CardlyAPI = null;
  }
})();
