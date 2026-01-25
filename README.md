# Site Portfolio

Un site portfolio moderne et responsive construit avec Next.js, TypeScript, et un style inspiré de Tailwind CSS.

## Fonctionnalités

- **Design Responsive**: Fonctionne parfaitement sur toutes les tailles d'appareils
- **Animations Fluides**: Animations Framer Motion pour une expérience utilisateur améliorée
- **Interface Moderne**: Design épuré et minimaliste avec une palette de couleurs chaleureuse
- **Performance Optimisée**: Temps de chargement rapides et SEO friendly
- **Accessibilité**: HTML sémantique approprié et attributs ARIA
- **Focus Symfony**: Met en valeur l'expertise en développement Symfony et API Platform

## Sections

1. **Section Hero** - Introduction avec texte animé et points clés
2. **Section À Propos** - Parcours personnel et professionnel
3. **Section Compétences** - Expertise technique avec indicateurs de maîtrise
4. **Section Projets** - Présentation des travaux mis en avant avec démos en direct
5. **Section Contact** - Moyens de prendre contact et se connecter

## Stack Technologique

- **Framework**: Next.js 14
- **Langage**: TypeScript
- **Style**: Modules CSS avec classes utilitaires personnalisées
- **Animations**: Framer Motion
- **Icônes**: Lucide React
- **Focus Backend**: Spécialisation PHP, Symfony, API Platform

## Pour Commencer

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Personnalisation

### Mettre à Jour le Contenu
- Modifier le contenu dans `src/app/page.tsx`
- Mettre à jour les informations personnelles dans les composants Header et Footer
- Changer les données de projets dans le tableau `projects`
- Ajuster les niveaux de compétence dans le tableau `skills`

### Style
- Le schéma de couleurs peut être modifié dans `src/app/globals.css` (variables CSS)
- La typographie et les utilitaires d'espacement sont définis dans le CSS global
- Les styles spécifiques aux composants se trouvent dans leurs fichiers respectifs

### Ajouter de Nouvelles Sections
1. Créer un nouveau composant dans `src/components/`
2. L'importer et l'utiliser dans `src/app/page.tsx`
3. Ajouter le style approprié dans `globals.css` si nécessaire

## Déploiement

### Vercel (Recommandé)
1. Pousser vers GitHub
2. Connecter le dépôt à Vercel
3. Déployer automatiquement lors des pushes vers la branche principale

### Autres Plateformes
```bash
npm run build
npm start
```

## Structure du Projet

```
src/
├── app/
│   ├── globals.css          # Styles et utilitaires globaux
│   ├── layout.tsx           # Mise en page racine avec métadonnées
│   └── page.tsx             # Contenu principal de la page
├── components/
│   ├── Header.tsx           # En-tête de navigation
│   ├── Section.tsx          # Wrapper de section réutilisable
│   ├── ProjectCard.tsx      # Cartes de présentation de projets
│   ├── SkillCard.tsx        # Cartes d'affichage des compétences
│   └── Footer.tsx           # Pied de page avec liens sociaux
public/
└── images/                  # Images de projets et ressources
```

## Performance

- Chargement différé des images
- Animations optimisées avec Framer Motion
- CSS efficace avec taille minimale du bundle
- Balises meta appropriées pour le SEO

## Accessibilité

- Structure HTML sémantique
- Hiérarchie de titres appropriée
- Labels ARIA pour les éléments interactifs
- Support de navigation au clavier
- Compatible avec les lecteurs d'écran

## Support Navigateurs

- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)

## Licence

Licence MIT - n'hésitez pas à utiliser ce modèle pour votre propre portfolio !

## Auteur

Paul-Joseph Krogulec - [GitHub](https://github.com/paul-joseph-krogulec) | [LinkedIn](https://linkedin.com/in/paul-joseph-krogulec)