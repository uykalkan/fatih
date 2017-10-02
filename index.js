#!/usr/bin/env node
var jsonfile = require('jsonfile');
var path = require('path');
var shell = require('shelljs');
var inquirer = require('inquirer');
var program = require('commander');
var os = require('os');
var questions = require('./questions');
var util = require('./util');

var setting_file = path.join(os.homedir(), '/.fatih.setting.json');
var path_here  = shell.pwd().stdout;
var args = process.argv.slice(2);

var exec = require('child_process').exec;

var fatih_data = util.readFatih();


<<<<<<< HEAD
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
=======
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
>>>>>>> 96f155d746b1e911a3cbd6b16599ae5b29e68a12

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