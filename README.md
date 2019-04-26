# cz-jira-smart-commit-fr

Un adaptateur commitizen pour [Jira smart commits](https://confluence.atlassian.com/display/FISHEYE/Using+smart+commits).
Permet de créer des commits compatible avec Jira.

## Usage

### Installation

Installer le paquet Commitizen Globalement"

```bash
npm install -g commitizen
```

Installer l'adaptateur dans votre application

```bash
npm install cz-jira-smart-commit-fr
```

#### Configuration

```bash
Créer le fichier .cz.json à la racine du projet, avec ses informations

{
  "path": "node_modules/cz-jira-smart-commit-fr/",
  "scopes": {
    "jiraPrefixIssue": "DR",
    "commitMessageRegex": "^(build|ci|docs|feat|fix|perf|refactor|style|test)(\\(([a-z]+)\\):|:)\\s([a-z].*)",
    "timeRegex": "^(\\d{1,2}w\\s\\d{1,2}d\\s\\d{1,2}h\\s\\d{1,2}m$)|(\\d{1,2}w\\s\\d{1,2}d\\s\\d{1,2}h\\s\\d{1,2}m\\s(.*\\w.*))",
    "commitTransition": [
      {"name": "Aucun", "value": null},
      {"name": "En cours", "value": "déclencher-l'accueil"},
      {"name": "Fermeture", "value": "close"}
    ],
    "messages": {
      "issues": {
        "message": "Numéro de billet Jira ex:DR-1 DR-2 (requis):",
        "errorNoInput": "Vous devez spécifiez un ou des numéros de billet Jira valide. Sinon utilisez simplement un commit message normal (git commit)",
        "errorValidation": "Le numéro ou les numéros de billet(s) ne sont pas valide(s)"
      },
      "messageCommit": {
        "message": "Message pour le commit dans Bitbucket. Ce message n'apparaît pas dans Jira. Toujours, commencez le message avec soit (build:, ci:, docs:, feat:, fix:, perf:, refactor:, style:, test:) suivi d'un espace et du message (requis):",
        "errorNoInput": "commit message vide",
        "errorValidation": "Le commit message n'est pas valide. La première lettre du message doit être en aussi minuscule. Si vous utilisé le scope, il doit être en minuscule. Voir https://wiki.uqam.ca/display/infra/GitFlow"
      },
      "workflow": {
        "message": "Commande de transition pour la fermeture d'un billet par exemple (optionnelle):"
      },
      "time": {
        "message": "Temps passé (sans commentaire: 1w 2d 4h 30m) (avec commentaire: 1w 2d 4h 30m Total des travaux enregistrés) (optionnel):",
        "errorValidation": "Le temps est invalide. Vous devez entrer le temps dans ce format. (sans commentaire: 1w 2d 4h 30m) (avec commentaire: 1w 2d 4h 30m Total des travaux enregistrés)"
      },
      "comment": {
        "message": "Commentaire qui apparaît dans Jira (optionnel):"
      }
    }
  }
}



La variable <jiraPrefixIssue> est le préfix du billet.
La variable <commitMessageRegex> représente par quoi le client doit commencer son message de commit. Voir https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit
La variable <timeRegex> oblige le client à entrer les bonnes informations sur le temps de travaux.
La variable <commitTransition> représente les transitions du Workflow Jira pour changer le statut des billets.
Les variables <messages> donne des indications au client lors du commit.
```

### Travail au jour le jour

Au lieu d'utiliser `git commit -m 'Votre message'`, vous pouvez taper: `git cz` avec cet adaptateur et il vous invite à:

- Nom du billet Jira (Peut en avoir plusieurs)
- Message du commit
- transition du Workflow (Changer le statut du billet)
- Temps passé (Jira)
- Commentaire (Jira)

Ensuite un commit est génère avec ses information.