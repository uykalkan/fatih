module.exports = {
    init: [
        {
            type: 'input',
            name: 'project_name',
            message: 'Proje adı?'
        },
        {
            type: 'input',
            name: 'github_url',
            message: 'Github Proje Adresiniz?'
        },
        {
            type:'list',
            name:'editor',
            message: 'Kullanmak istediğiniz editör?'
        }
    ],
    go: [
        {
            type: 'list',
            name: 'project',
            message: 'Hangi projeye gidiyoruz?',
        }
    ]
}

