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
    "commitBeginMessage": ["build: ", "ci: ", "docs: ", "feat: ", "fix: ", "perf: ", "refactor: ", "style: ", "test: "],
    "commitTransition": ["inprogress", "close", "déclencher-l'accueil"]
  }
}

La variable <jiraPrefixIssue> est le préfix du billet.
La variable <commitBeginMessage> représente par quoi le client doit commencer son message de commit. Voir https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit
La variable <commitTransition> représente les transitions du Workflow Jira pour changer le statut des billets.
```

### Travail au jour le jour

Au lieu d'utiliser `git commit -m 'Votre message'`, vous pouvez taper: `git cz` avec cet adaptateur et il vous invite à:

- Nom du billet Jira (Peut en avoir plusieurs)
- Message du commit
- transition du Workflow (Changer le statut du billet)
- Temps passé (Jira)
- Commentaire (Jira)

Ensuite un commit est génère avec ses information.