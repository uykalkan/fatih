#!/usr/bin/env node
var jsonfile = require('jsonfile');
var path = require('path');
var shell = require('shelljs');
var inquirer = require('inquirer');
var program = require('commander');
var os = require('os');

var setting_file = path.join(os.homedir(), '/.fatih.setting.json');
var path_here  = shell.pwd().stdout;
var args = process.argv.slice(2);

var exec = require('child_process').exec;

var default_settings = {
    "settings" : {
        "editor" : "code",
        "terminal" : "cmd"
    }, "index" : {
        
    }
}

jsonfile.readFile(setting_file, function(err, obj) {
    if (!obj) {
        jsonfile.writeFileSync(setting_file, default_settings, {spaces: 2});
        config = default_settings;
        fatihReady();
    } else {
        config = obj;
        fatihReady();
    }
})

// function index(project_name, project_path) {
//     jsonfile.readFile(setting_file, function(err, obj) {
//         if (obj) {
//             obj[project_name] = project_path;
//             jsonfile.writeFileSync(setting_file, obj, {spaces: 2});
//         } else {
//             jsonfile.writeFileSync(setting_file, default_settings, {spaces: 2});
//         }
//     })
// }

program.version('2.0.0');

// INIT COMMAND
program
.command('init')
.description('yeni bir proje ekleyin')
.action(function(env, options){
    var init_questions = [
        {
            type: 'input',
            name: 'project_name',
            message: 'Proje adı?'
        },
        {
            type: 'input',
            name: 'github_url',
            message: 'Github URL?'
        }
    ];

    inquirer.prompt(init_questions).then(function (answers) {
        var project_array = {
            name:answers.project_name,
            github:answers.github_url,
            custom_commands : {
                "pull" : "git pull",
                "push" : "git push"
            }
        };
        jsonfile.writeFileSync('./fatih.json', project_array, {spaces: 2});       
    });
});

function fatihReady() {   
    if (args[0]) {
        jsonfile.readFile('./fatih.json', function(err, obj) {
            try {
                if (obj.custom_commands[args[0]]) {
                    console.log('asdasdasd');
                    var selected_command = obj.custom_commands[args[0]];
                    shell.exec('start cmd /K "'+selected_command+'"');
                    process.exit(1);
                } else if (args[0] == 'is') {
                    shell.exec('start '+obj.github+'/issues');
                    process.exit(1);
                }    
            } catch(e){
                if(e){
                    
                }
            }         
        })    
    }    
}

program.parse(process.argv);