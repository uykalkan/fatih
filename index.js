#!/usr/bin/env node
var jsonfile = require('jsonfile');
var path = require('path');
var shell = require('shelljs');
var inquirer = require('inquirer');
var program = require('commander');
var os = require('os');
var questions = require('./questions');
var util = require('./util');
var store = require('store');
var fs = require('fs');

var setting_file = path.join(os.homedir(), '/.fatih.setting.json');
var args = process.argv.slice(2);

var exec = require('child_process').exec;

var fatih_data = util.readFatih();
var fatih_settings = util.readSettingsFatih();

var default_fatih_settings = {
    editor: 'code',
    index: {},
};

// indexi döner ve configi yerinde olmayan varsa indexten kaldırır
if (!fatih_settings) {
    util.writeSettingsFatih(default_fatih_settings).then(function(){
        var fatih_settings = default_fatih_settings;
    });
} else {
    clearIndex();
}

if (args[0] && fatih_data != null) {

    switch (args[0]) {
        case 'is':
            shell.exec('start '+fatih_data.github+'/issues');
        break;

        case 'editor':
            shell.exec('code -n '+process.cwd());
        break;

        default:
            var selected_command = fatih_data.custom_commands[args[0]];
            if (selected_command) {
                shell.exec('start cmd /K "'+selected_command+'"');
                process.exit(1);                
            } else {
                //
            }
        break;
    }
    
}

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
        }).then(function(){
            fatih_settings.index[answers.project_name] = shell.pwd().stdout;
            util.writeSettingsFatih(fatih_settings).then(function(){

            });
        });

    }).then(function(){
        console.log('Bilgilerini başarıyla kaydettik');
    }).catch(function(err){
        console.log('Birşeyler oldu...', err)
    })
});

// GO COMMAND
program
.command('go')
.description('projenize gidin')
.action(function(env, options){

    var question = [
        {
            type: 'list',
            name: 'project',
            message: 'Hangi projeye gidiyoruz?',
            choices: Object.keys(fatih_settings.index)
        }
    ];

    if (Object.keys(fatih_settings.index).length) {
        inquirer.prompt(question).then(function (answers) {
            project_path = fatih_settings.index[answers.project];
            shell.exec('start "" "'+project_path+'"');
            clearIndex();
        });        
    } else {
        console.log('Hiç projeniz yok');
    }


});
program.parse(process.argv);

function clearIndex() {
    for (var key in fatih_settings.index) {
        var path = fatih_settings.index[key];
        if (!fs.existsSync(path+'/.fatih')) {
            console.log('naberrr');
            delete fatih_settings.index[key];
        }            
    }    

    util.writeSettingsFatih(fatih_settings).then(function(){
        
    });
}