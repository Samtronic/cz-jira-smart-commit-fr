var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');

// Get info 
var configPath = path.join(process.cwd(), '.cz.json');
var file = fs.readFileSync(configPath);
var data = JSON.parse(file.toString('utf8'));
var jiraIssueRegex = `^${data.scopes.jiraPrefixIssue}-\\d+$`;
var commitBeginMessage = data.scopes.commitBeginMessage;
var commitTransition = data.scopes.commitTransition;
// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = {
  prompter: prompter,
  formatCommit: formatCommit
};

// When a user runs `git cz`, prompter will
// be executed. We pass you cz, which currently
// is just an instance of inquirer.js. Using
// this you can ask questions and get answers.
//
// The commit callback should be executed when
// you're ready to send back a commit template
// to git.
//
// By default, we'll de-indent your commit
// template and will keep empty lines.
function prompter(cz, commit) {

  // Let's ask some questions of the user
  // so that we can populate our commit
  // template.
  //
  // See inquirer.js docs for specifics.
  // You can also opt to use another input
  // collection library if you prefer.
  inquirer.prompt([
    {
      type: 'input',
      name: 'issues',
      message: 'Numéro de billet Jira ex:DR-1 DR-2 (requis):\n',
      validate: function(input) {
        if (!input) {
          return 'Vous devez spécifiez un ou des numéros de billet Jira valide. Sinon utilisez simplement un commit message normal (git commit)';
        } else {
          var array = input.split(' ');
          var regex = new RegExp(jiraIssueRegex);
          for (var i = 0; i < array.length; i++) {
            var found = array[i].match(regex);
            if (!found) {
              return 'Le numéro ou les numéros de billet(s) ne sont pas valide(s)'
            }
          }
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'message',
      message: 'Message pour le commit dans Bitbucket. Ce message n\'apparaît pas dans Jira. Toujours commencez le message avec soit (build:, ci:, docs:, feat:, fix:, perf:, refactor:, style:, test:,) suivi d\'un espace et du message (requis):\n',
      validate: function(input) {
        if (!input) {
          return 'commit message vide';
        } else {
          var validateMessage = false;
          for (let i = 0; i < commitBeginMessage.length; i++) {
            var found = input.startsWith(commitBeginMessage[i]);
            if (found) {
              validateMessage = true;
            }
          }
          
          if (validateMessage) {
            return true;
          } else {
            return 'Le commit message n\'est pas valide. Voir https://wiki.uqam.ca/display/infra/GitFlow';
          }
        }
      }
    },
    {
      type: 'input',
      name: 'workflow',
      message: 'Commande de transition pour la fermeture d\'un billet par exemple ('+ commitTransition + ') (optionnelle):\n',
      validate: function(input) {
        if (!input) {
          return true
        }
        
        for (let i = 0; i < commitTransition.length; i++) {
          if (input === commitTransition[i]) {
            return true
          }
        }

        return 'La commande de transition n\'existe pas'
      }
    },
    {
      type: 'input',
      name: 'time',
      message: 'Temps passé (sans commentaire: 1w 2d 4h 30m) (avec commentaire: 1w 2d 4h 30m Total des travaux enregistrés) (optionnel):\n'
    },
    {
      type: 'input',
      name: 'comment',
      message: 'Commentaire qui apparaît dans Jira (optionnel):\n'
    },
  ]).then((answers) => {
    formatCommit(commit, answers);
  });
}

function formatCommit(commit, answers) {
  commit(filter([
    answers.message,
    answers.issues,
    answers.workflow ? '#' + answers.workflow : undefined,
    answers.time ? '#time ' + answers.time : undefined,
    answers.comment ? '#comment ' + answers.comment : undefined,
  ]).join(' '));
}

function filter(array) {
  return array.filter(function(item) {
    return !!item;
  });
}
