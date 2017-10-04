#!/usr/bin/env node
var jsonfile = require('jsonfile');
var path = require('path');
var exec = require('child_process').exec;
var inquirer = require('inquirer');
var program = require('commander');
var os = require('os');
var questions = require('./questions');
var util = require('./util');
var fs = require('fs');
var opn = require('opn');
var envEditor = require('env-editor');

var setting_file = path.join(os.homedir(), '/.fatih.setting.json');
var args = process.argv.slice(2);

var fatih_data = util.readFatih();
var fatih_settings = util.readSettingsFatih();

var default_fatih_settings = {
    index: {},
};

// indexi döner ve configi yerinde olmayan varsa indexten kaldırır
if (!fatih_settings) {
    util.writeSettingsFatih(default_fatih_settings).then(function(){
        fatih_settings = default_fatih_settings;
    });
} else {
    clearIndex();
}

program.version('2.1.1');

// INIT COMMAND
program
.command('init')
.description('Proje ekleyin')
.action(function(env, options){

    questions.init[2].choices = envEditor.all();
    inquirer.prompt(questions.init).then(function (answers) {
        
        fatih_settings.index[answers.project_name] = process.cwd()

        return Promise.all([
                 util.writeFatih({
                    name:answers.project_name,
                    config: {
                        github:answers.github_url,
                        editor:answers.editor,
                    },
                    commands : { }
                }), 
                util.writeSettingsFatih(fatih_settings)
        ]);
    }).then(function(){
        console.log('Bilgilerini başarıyla kaydettik');
    }).catch(function(err){
        console.log('Birşeyler oldu...', err)
    })

});

// GO COMMAND
program
.command('go')
.description('Proje gidin')
.action(function(env, options){

   questions.go[0].choices = Object.keys(fatih_settings.index)

    if (Object.keys(fatih_settings.index).length) {
        inquirer.prompt(questions.go).then(function (answers) {
            project_path = fatih_settings.index[answers.project];
            opn(project_path);
        }).then(function (answers) {
            // dizin açılmış olmalı
        })
    } else {
        console.log('Hiç projeniz yok');
    }


});

program
.command('*')
.description('Proje komutunuz')
.action(function(env, options){

    if (args[0] && fatih_data != null) {
        
            switch (args[0]) {
                case 'is':
                    opn(`${fatih_data.config.github}/issues`).then(function(){

                    })
                break;
        
                case 'code':
                    var editor = envEditor.get(fatih_data.config.editor);
                    if(editor.bin){
                        exec(`${editor.bin} ${process.cwd()}`);
                    }
                break;
        
                default:
                    try{
                        var selected_command = fatih_data.commands[args[0]];
                        if (selected_command) {
                            if(process.platform == 'win32'){
                                exec('start cmd /K "'+selected_command+'"');
                            } else {
                                exec(`${selected_command}`);
                            }
                            process.exit(1);                
                        } else {
                            console.log('Herhangi bir komut bulamadık')
                        }
                    }catch(err){
                        console.log('Herhangi bir komut bulamadık')
                    }
                break;
            }
            
    }

});

program.parse(process.argv);

function clearIndex() {
    for (var key in fatih_settings.index) {
        var path = fatih_settings.index[key];
        if (!fs.existsSync(path+'/.fatih')) {
            delete fatih_settings.index[key];
        }            
    }    

    util.writeSettingsFatih(fatih_settings).then(function(){
        
    });
}