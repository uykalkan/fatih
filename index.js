#!/usr/bin/env node
var jsonfile = require('jsonfile');
var argv = require( 'argv' );
var path = require('path');
var shell = require('shelljs');
var inquirer = require('inquirer');
var program = require('commander');
var os = require('os');

var file = path.join(os.homedir(), '/.fatih.json');
var path_here  = shell.pwd().stdout;

config_default = {
    "editor": "code",
    "projects": {
        "fatih": {
          "location" : "C:\\xampp\\htdocs\\fatih"
        },
        "fastback": {
          "location" : "C:\\xampp\\htdocs\\fastback"
        }    
    }
}

jsonfile.readFile(file, function(err, obj) {
    if (!obj) {
        jsonfile.writeFileSync(file, config_default, {spaces: 2});
        config = config_default;
        fatihReady();
    } else {
        config = obj;
        fatihReady();
    }
})

class dbClass {
    set(key, value) {
        config[key] = value;
        jsonfile.writeFileSync(file, config, {spaces: 2})
    }

    get(key) {
       return config[key]; 
    }
}

function fatihReady () {
    db = new dbClass();
    editor_path = db.get('editor');
    projects = db.get('projects');
    program.parse(process.argv);  
}

// PROGRAM BAŞLAR
/////////////////
/////////////////

program.version('1.0.3');

// ADD COMMAND
program
.command('add')
.description('yeni bir proje ekleyin')
.action(function(env, options){
    var questions = [
        {
            type: 'input',
            name: 'project_name',
            message: 'Projenizin ismi ne olsun?',
        }
    ];

    inquirer.prompt(questions).then(function (answers) {
        projects[answers.project_name] = {
            "location": path_here
        };              
        db.set('projects',projects);             
    });
});

// ADD COMMAND
program
.command('config')
.description('Config dosyasını düzenleyin')
.action(function(env, options){
    shell.exec('"'+editor_path+'" -n "'+file+'"');
});

// ADD COMMAND
program
.command('set [file_name]')
.description('Editörünüzü seçin')
.action(function(env, options){
    if (env) {
        var editor_path = path.resolve(process.cwd(), env);
        db.set('editor',editor_path);        
    } else {
        console.log('Dosya seçmediniz');
    }

});

// ADD COMMAND
program
.command('editor [project_name]')
.description('Projenizi editörde açın')
.action(function(env, options){
    if (env) {
        console.log(env);
        if (!projects[env]) {
            console.log("Project not found");
            return;
        }

        var project_path = projects[env].location;
        shell.exec('"'+editor_path+'" -n "'+project_path+'"');
    } else {
        var questions = [
            {
                type: 'list',
                name: 'project',
                message: 'Hangi projeyi editorde açacaksınız?',
                choices: Object.keys(projects)
            }
        ];

        inquirer.prompt(questions).then(function (answers) {
            var project_path = projects[answers.project].location;
            shell.exec('"'+editor_path+'" -n "'+project_path+'"');                
        });
    }
});

// ADD COMMAND
program
.command('terminal [project_name]')
.description('Projenizi terminalde açın')
.action(function(env, options){
    if (env) {
        console.log(env);
        if (!projects[env]) {
            console.log("Project not found");
            return;
        }

        var project_path = projects[env].location;
        shell.exec('start cmd /K "cd '+project_path+'"');
    } else {
        var questions = [
            {
                type: 'list',
                name: 'project',
                message: 'Hangi projeyi editorde açacaksınız?',
                choices: Object.keys(projects)
            }
        ];

        inquirer.prompt(questions).then(function (answers) {
            var project_path = projects[answers.project].location;
            shell.exec('start cmd /K "cd '+project_path+'"');                
        });
    }
});

// ADD COMMAND
program
.command('folder [project_name]')
.description('Projenizi klasörde açın')
.action(function(env, options){
    if (env) {
        console.log(env);
        if (!projects[env]) {
            console.log("Project not found");
            return;
        }

        var project_path = projects[env].location;
        shell.exec('start "" "'+project_path+'"');
    } else {
        var questions = [
            {
                type: 'list',
                name: 'project',
                message: 'Hangi projeyi klasörde açacaksınız?',
                choices: Object.keys(projects)
            }
        ];

        inquirer.prompt(questions).then(function (answers) {
            var project_path = projects[answers.project].location;
            shell.exec('start "" "'+project_path+'"');               
        });
    }
});
