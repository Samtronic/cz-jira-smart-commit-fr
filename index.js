var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');
var branchName = require('current-git-branch');

// Get info 
var configPath = path.join(process.cwd(), '.cz.json');
var file = fs.readFileSync(configPath);
var data = JSON.parse(file.toString('utf8'));
var jiraIssueRegex = `^${data.scopes.jiraPrefixIssue}-\\d+$`;
var commitMessageRegex = data.scopes.commitMessageRegex;
var timeRegex = data.scopes.timeRegex

// Issues
var IssuesDefault = null;
// Get branch name
var branchName = branchName();
if (branchName) {
  var regexIssue = new RegExp(`(^.*)\\/${data.scopes.jiraPrefixIssue}-(\\d+)-`);
  var resIssue = regexIssue.exec(branchName);
  if (resIssue) {
    IssuesDefault = `${data.scopes.jiraPrefixIssue}-${resIssue[2]}`; // DR-17
  }
}

// List (Get Transition on branch name. Ex: (bugfix, release)
var commitTransition = data.scopes.commitTransition.filter(x => x.branch === null);
if (branchName === 'develop') {
  commitTransition = data.scopes.commitTransition.filter(x => x.branch === 'develop' || x.branch === null);
} else {
  if (resIssue) {
    commitTransition = data.scopes.commitTransition.filter(x => x.branch === resIssue[1] || x.branch === null);
  }
}

// Messages
var issuesMessages = data.scopes.messages.issues;
var commitMessages = data.scopes.messages.messageCommit;
var workflowMessages = data.scopes.messages.workflow;
var timeMessages = data.scopes.messages.time;
var commentMessages = data.scopes.messages.comment;
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
      default: IssuesDefault,
      message: `${issuesMessages.message}\n`,
      validate: function(input) {
        if (!input) {
          return issuesMessages.errorNoInput;
        } else {
          var array = input.split(' ');
          var regex = new RegExp(jiraIssueRegex);
          for (var i = 0; i < array.length; i++) {
            var found = array[i].match(regex);
            
            if (!found) {
              return issuesMessages.errorValidation
            }
          }
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'messageCommit',
      message: `${commitMessages.message}\n`,
      validate: function(input) {
        if (!input) {
          return commitMessages.errorNoInput;
        } else {
          var regex = new RegExp(commitMessageRegex);
          var found = input.match(regex);

          if (found) {
            return true;
          } else {
            return commitMessages.errorValidation;
          }
        }
      }
    },
    {
      type: 'list',
      name: 'workflow',
      message: `${workflowMessages.message}\n`,
      choices: commitTransition
    },
    {
      type: 'input',
      name: 'time',
      message: `${timeMessages.message}\n`,
      validate: function(input) {
        if (!input) {
          return true;
        } else {
          var regex = new RegExp(timeRegex);
          var found = input.match(regex);

          if (found) {
            return true;
          } else {
            return timeMessages.errorValidation;
          }
        }
      }
    },
    {
      type: 'input',
      name: 'comment',
      message: `${commentMessages.message}\n`,
    },
  ]).then((answers) => {
    formatCommit(commit, answers);
  });
}

function formatCommit(commit, answers) {
  commit(filter([
    answers.messageCommit,
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
