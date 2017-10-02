#!/usr/bin/env node
var jsonfile = require('jsonfile');
var path = require('path');
var shell = require('shelljs');
var inquirer = require('inquirer');
var program = require('commander');
var os = require('os');
var questions = require('./questions');
var util = require('./util');

var file = path.join(os.homedir(), '/.fatih.json');
var path_here  = shell.pwd().stdout;
var args = process.argv.slice(2);

var exec = require('child_process').exec;

var fatih_data = util.readFatih();


if (args[0] && fatih_data != null) {
    
    if(Object.keys(fatih_data.custom_commands).includes(args[0])){

        switch(args[0]) {
            case 'is':
                 shell.exec('start '+obj.github+'/issues');
                break;
            default:
                var selected_command = fatih_data.custom_commands[args[0]];
                shell.exec('start cmd /K "'+selected_command+'"');
                process.exit(1);
        }

    }
}

program.version('2.0.0');

// ADD COMMAND
program
.command('init')
.description('yeni bir proje ekleyin')
.action(function(env, options){

    inquirer.prompt(questions.init).then(function (answers) {
        
        return util.writeFatih({
            name:answers.project_name,
            github:answers.github_url,
            custom_commands : {
                "pull" : "git pull",
                "push" : "git push"
            }
        });

    }).then(function(){
        console.log('Bilgilerini başarıyla kaydettik');
    }).catch(function(err){
        console.log('Birşeyler oldu...', err)
    })
});

program.parse(process.argv);