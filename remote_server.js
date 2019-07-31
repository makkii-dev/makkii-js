const qa = {
    app_server_static:'http://45.118.132.89',
    app_server_api:'http://45.118.132.89:8080',
};

const staging = {
    app_server_static:'http://45.118.132.89',
    app_server_api:'http://45.118.132.89:8080',
};

const prod = {
    app_server_static:'https://www.chaion.net',
    app_server_api:'https://www.chaion.net/makkii',
};

let app_server_static = qa.app_server_static;
let app_server_api = qa.app_server_api;

const setCurrentServer=(server)=>{
    if(typeof  server === 'string') {
        switch (server) {
            case 'qa':
                app_server_static = qa.app_server_static;
                app_server_api = qa.app_server_api;
                break;
            case 'prod':
                app_server_static = prod.app_server_static;
                app_server_api = prod.app_server_api;
                break;
            default:
                app_server_static = staging.app_server_static;
                app_server_api = staging.app_server_api;
        }
    }else if(typeof  server === 'object'){
        app_server_static = server.app_server_static;
        app_server_api = server.app_server_api;
    }else{
        throw "Parse error"
    }
};

export {
    app_server_api,
    app_server_static,
    setCurrentServer
}

