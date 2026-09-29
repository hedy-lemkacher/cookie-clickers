# Cookie Clicker

Jeu de cookies statique en HTML, CSS et JavaScript. Le navigateur peut lancer la version locale sans installation.

## Etat actuel

- `index.html` contient uniquement la structure de l'interface.
- `styles.css` contient les styles et la mise en page responsive.
- `app.js` contient le gameplay local, la boutique, les ameliorations, les evenements et les mini-jeux.
- La sauvegarde locale utilise maintenant `cookie-clicker-worlds-v3`.
- Les anciennes cles de sauvegarde sont supprimees au premier lancement : les anciennes parties ne sont donc pas reprises.
- Le mini-jeu Tir aux cibles a ete retire de la liste et remplace par un mini-jeu de reaction tactile.
- Le maintien d'une touche ne repete plus l'action du mini-jeu qui utilise le clavier (`event.repeat` est ignore).

La version fournie reste un prototype local. `localStorage` ne permet ni comptes ni classement mondial fiable. Les etapes ci-dessous ajoutent ces fonctions avec Supabase et Vercel.

## Securite importante

Le code `HTML`, `CSS` et JavaScript execute dans un navigateur est forcement visible par le joueur. Il est donc impossible d'empecher completement `Inspecter`, de cacher le code frontend ou d'empecher un joueur de modifier sa copie locale du jeu. Ces modifications ne changent pas les fichiers du depot et ne donnent pas acces au serveur si celui-ci est correctement configure.

Pour securiser une vraie version en ligne :

1. Ne jamais mettre de mot de passe, token prive, cle `service_role` ou secret dans `index.html`, `app.js`, `styles.css` ou GitHub.
2. La cle `anon` Supabase peut etre visible dans le frontend. La protection vient des policies RLS, pas du fait de cacher cette cle.
3. Activer RLS sur toutes les tables et tester les policies avec un compte normal.
4. Ne jamais accepter depuis le navigateur un score Speedrun, un solde de cookies ou un classement sans validation serveur.
5. Valider les records avec une Edge Function Supabase et enregistrer uniquement le temps calcule côté serveur.
6. Ajouter une limitation de requetes et une validation des entrees pour eviter le spam.
7. Activer la confirmation email, une politique de mot de passe forte et la protection contre les redirections non autorisees dans Supabase Auth.
8. Utiliser HTTPS en production. Vercel fournit HTTPS automatiquement ; GitHub Pages aussi.

Une politique CSP de base est incluse dans `index.html`. Elle limite les scripts, les connexions et les ressources autorises, mais elle ne remplace pas l'authentification, RLS ou la validation serveur.

`vercel.json` ajoute les en-tetes HTTP de securite si le projet est deploye sur Vercel. GitHub Pages ne permet pas de definir ces en-tetes avec ce fichier ; dans ce cas, utiliser un proxy HTTPS comme Cloudflare ou deployer la version securisee sur Vercel.

Le jeu contient aussi un ralentissement contre les rafales de plus de 25 clics par seconde. C'est une protection de confort contre les scripts simples, pas une preuve anti-triche : un utilisateur qui controle son navigateur peut modifier JavaScript. Les records officiels doivent donc etre calcules et valides par une Edge Function Supabase.

## 1. Tester en local

Option rapide : ouvrir `index.html` dans un navigateur.

Option recommandee : lancer un serveur statique depuis ce dossier.

```powershell
npx serve .
```

Puis ouvrir l'URL affichee, en general `http://localhost:3000`.

Un serveur local evite les limitations de certains navigateurs sur les modules, les requetes reseau et les fichiers ouverts directement.

## 2. Creer le projet Supabase gratuitement

### Supabase, c'est quoi ?

Supabase est le service qui fournit la partie serveur du jeu :

- les comptes joueurs et la connexion par email ;
- la base de donnees des mondes ;
- les sauvegardes accessibles depuis plusieurs appareils ;
- les classements Speedrun et CPS ;
- les classements Speedrun et CPS en ligne.

Sans Supabase, le jeu fonctionne uniquement dans le navigateur avec `localStorage`. Cela veut dire que la progression est locale a un navigateur et qu'il n'y a pas de vrai compte, de classement mondial ou de multijoueur fiable.

Vercel sert a publier le site. Supabase sert a stocker les comptes et les donnees. Ce sont deux services differents mais ils fonctionnent ensemble.

1. Aller sur <https://supabase.com> et creer un compte.
2. Creer un nouveau projet gratuit.
3. Dans `Project Settings > API`, copier :
   - `Project URL` ;
   - `anon public key`.
4. Dans `Authentication > Providers`, activer `Email`.
5. Dans `Authentication > URL Configuration`, ajouter l'URL de production Vercel et l'URL locale.
6. Ouvrir `SQL Editor`, coller puis executer le schema ci-dessous.

### Ou trouver les URLs et les cles ?

Dans Supabase, ouvrir `Project Settings > API` :

- `Project URL` ressemble a `https://abcdefghijkl.supabase.co`. C'est l'adresse de la base Supabase.
- `anon public key` est la cle publique utilisee par le navigateur. Elle peut etre presente dans le code frontend, mais elle doit toujours etre protegee par les policies RLS.
- `service_role key` est une cle privee toute-puissante. Ne jamais la mettre dans `index.html`, `app.js`, GitHub ou Vercel comme variable frontend.

Les URLs a configurer dans Supabase sont :

- URL locale : `http://localhost:3000` pendant les tests avec `npx serve .` ;
- URL Vercel : par exemple `https://cookie-game.vercel.app` apres le deploiement ;
- URL de redirection : la meme URL suivie de `/`.

Dans Supabase, aller dans `Authentication > URL Configuration`, puis :

1. mettre l'URL Vercel dans `Site URL` ;
2. ajouter `http://localhost:3000` dans `Redirect URLs` ;
3. ajouter aussi l'URL Vercel dans `Redirect URLs`.

Ne pas inventer ces adresses : l'URL locale est celle affichee par `npx serve .` et l'URL de production est celle affichee par Vercel apres `Deploy`.

### Exemple concret

```text
SUPABASE_URL=https://abcdefghijkl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
URL_LOCALE=http://localhost:3000
URL_PRODUCTION=https://cookie-game.vercel.app
```

`SUPABASE_URL` et `SUPABASE_ANON_KEY` servent au client web. `URL_LOCALE` et `URL_PRODUCTION` servent a autoriser les connexions et les redirections. La cle `service_role` ne doit jamais apparaitre dans cet exemple.

Ne jamais mettre la `service_role key` dans `index.html`, `app.js`, Vercel ou Git. Cette cle contourne les regles de securite.

## 3. Schema de base de donnees

Le schema impose cinq mondes maximum par compte, un mode immuable apres creation et des lignes de classement indexees.

```sql
create type public.world_mode as enum ('classic', 'speedrun');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (char_length(username) between 3 and 24),
  created_at timestamptz not null default now()
);

create table public.worlds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  mode public.world_mode not null,
  speedrun_goal numeric,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz,
  check ((mode = 'speedrun') = (speedrun_goal is not null and speedrun_goal > 0))
);

create table public.speedrun_records (
  id bigint generated always as identity primary key,
  world_id uuid not null references public.worlds(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  username text not null,
  goal numeric not null,
  duration_ms bigint not null check (duration_ms > 0),
  created_at timestamptz not null default now()
);

create table public.cps_scores (
  user_id uuid not null references public.profiles(id) on delete cascade,
  world_id uuid not null references public.worlds(id) on delete cascade,
  username text not null,
  cps numeric not null check (cps >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, world_id)
);

create index speedrun_records_duration_idx on public.speedrun_records(goal, duration_ms);
create index cps_scores_live_idx on public.cps_scores(cps desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger worlds_touch_updated_at
before update on public.worlds
for each row execute function public.touch_updated_at();

create or replace function public.enforce_world_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.worlds where owner_id = new.owner_id) >= 5 then
    raise exception 'Maximum de 5 mondes atteint';
  end if;
  return new;
end;
$$;

create trigger worlds_limit
before insert on public.worlds
for each row execute function public.enforce_world_limit();

```

## 4. Activer la securite RLS

Executer ensuite :

```sql
alter table public.profiles enable row level security;
alter table public.worlds enable row level security;
alter table public.speedrun_records enable row level security;
alter table public.cps_scores enable row level security;

create policy profiles_read on public.profiles for select to authenticated using (true);
create policy profiles_self_insert on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_self_update on public.profiles for update to authenticated using (id = auth.uid());

create policy worlds_owner_read on public.worlds for select to authenticated using (owner_id = auth.uid());
create policy worlds_owner_insert on public.worlds for insert to authenticated with check (owner_id = auth.uid());
create policy worlds_owner_update on public.worlds for update to authenticated using (owner_id = auth.uid());
create policy worlds_owner_delete on public.worlds for delete to authenticated using (owner_id = auth.uid());

create policy speedrun_public_read on public.speedrun_records for select to authenticated using (true);
create policy speedrun_self_insert on public.speedrun_records for insert to authenticated with check (user_id = auth.uid());
create policy cps_public_read on public.cps_scores for select to authenticated using (true);
create policy cps_self_write on public.cps_scores for insert to authenticated with check (user_id = auth.uid());
create policy cps_self_update on public.cps_scores for update to authenticated using (user_id = auth.uid());

```

Pour une vraie securite anti-triche, la mise a jour de `worlds.state`, les wagers et la validation Speedrun doivent passer par des Edge Functions Supabase. Le navigateur ne doit jamais decider seul d'un score ou d'un pari.

## 5. Relier le client a Supabase

Installer le client :

```powershell
npm install @supabase/supabase-js
```

Creer un fichier `supabase.js` :

```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  window.ENV.SUPABASE_URL,
  window.ENV.SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);
```

Pour une version statique, ne commitez pas les secrets. Le plus simple est de convertir le projet en petite application Vite, puis de fournir les variables au build avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. La cle `anon` est publique par conception, mais les policies RLS doivent etre correctes.

Flux recommande :

1. `supabase.auth.signUp({ email, password })` pour creer un compte.
2. Inserer le profil dans `profiles` apres confirmation de l'email.
3. Charger les mondes dont `owner_id` correspond au compte connecte.
4. Creer un monde avec `mode` et, si necessaire, `variant`. Le mode Speedrun utilise toujours l'objectif fixe de `500000` cookies.
5. Ne jamais proposer de select permettant de modifier le mode d'un monde existant.
6. Sauvegarder l'etat du monde dans `worlds.state` par petites transactions debitees cote serveur.
7. Publier `cps_scores` uniquement avec le CPS normal permanent, jamais `cps()` pendant une frenesie.

## 6. Classements en temps reel

Dans Supabase, ouvrir `Database > Replication` et activer Realtime pour `cps_scores` et `speedrun_records`.

Exemple de classement CPS :

```js
const { data } = await supabase
  .from('cps_scores')
  .select('username, cps')
  .order('cps', { ascending: false })
  .limit(100);

supabase.channel('live-cps')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'cps_scores' }, refreshCps)
  .subscribe();
```

Le classement Speedrun doit trier `duration_ms` par objectif. Le temps doit etre arrete par une fonction serveur au moment ou l'objectif est valide.

## 7. Classement Speedrun et CPS

Le classement Speedrun compare les temps des comptes connectes sur l'objectif fixe de 500 000 cookies. Le classement CPS utilise uniquement la production normale et permanente, sans bonus de frenesie.

## 8. Deployer gratuitement sur Vercel

1. Installer Git et creer un depot GitHub prive ou public.
2. Ajouter les fichiers `index.html`, `styles.css`, `app.js` et `README.md`.
3. Pousser le projet :

```powershell
git init
git add .
git commit -m "Initial cookie game"
git branch -M main
git remote add origin https://github.com/UTILISATEUR/cookie-game.git
git push -u origin main
```

4. Aller sur <https://vercel.com>, choisir `Add New > Project` et importer le depot.
5. Pour la version HTML actuelle :
   - Framework Preset : `Other` ;
   - Build Command : vide ;
   - Output Directory : `.`.
6. Cliquer `Deploy`.
7. Dans `Project Settings > Environment Variables`, ajouter `SUPABASE_URL` et `SUPABASE_ANON_KEY` si le projet utilise un build ou une configuration publique.
8. Ajouter le domaine Vercel dans Supabase `Authentication > URL Configuration`.
9. Chaque push sur `main` redeploie automatiquement le jeu.

Vercel fournit un domaine gratuit `*.vercel.app`. Le plan gratuit convient au prototype ; surveiller les limites si le jeu devient public.

## 9. Checklist avant ouverture au public

- Tester l'inscription, la reconnexion et la deconnexion.
- Tester la creation des mondes 1 a 5 et verifier que le sixieme est refuse par la base.
- Verifier que chaque monde a un etat independant.
- Tester le changement de monde sur un ecran de smartphone.
- Tester un Speedrun termine, un record plus lent et un record plus rapide.
- Verifier que le CPS du classement ignore la frenesie.
- Tester deux comptes et verifier que chacun ne voit que ses mondes.
- Tester le maintien de `Enter`, `Space` et les clics tactiles repetes.
- Tester avec `prefers-reduced-motion` et une connexion lente.
- Activer les logs Supabase et Vercel avant la premiere diffusion.

## Limites gratuites a connaitre

Supabase et Vercel proposent tous deux un palier gratuit avec des quotas et des mises en veille possibles. Ils ne garantissent pas une disponibilite illimitee. Pour un lancement public, consulter leurs limites actuelles et ajouter une limitation de requetes, une validation serveur des scores et des sauvegardes regulieres.
