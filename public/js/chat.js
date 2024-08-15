
const url = 'http://localhost:8080/api/auth/';

let user = null;
let socket = null;

// HTML references
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUser = document.querySelector('#ulUser');
const ulMessage = document.querySelector('#ulMessage');
const btnExit = document.querySelector('#btnExit');

// Validate the local storage token
const validateJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10)  {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: {'x-token': token}
    });

    const {user: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;

    document.title = user.name;

    await conectSocket();

}

const conectSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('receive-messages', showMessages);

    socket.on('active-users', showUsers);

    socket.on('private-messages', (payload) => {
        console.log('Privado: ', payload)
    });

}

const showUsers = (users = []) => {

    let usersHtml = '';
    users.forEach(({name, uid}) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${name} </h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUser.innerHTML = usersHtml;

}

const showMessages = (messages = []) => {

    let messagesHtml = '';
    messages.forEach(({name, message}) => {

        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${name}: </span>
                    <span>${message}</span>
                </p>
            </li>
        `;
    });

    ulMessage.innerHTML = messagesHtml;

}

txtMessage.addEventListener('keyup', ({keyCode}) => {

    const uid = txtUid.value;
    const message = txtMessage.value;
    
    if (keyCode !== 13) {return;}

    if (message.length === 0) {return;}

    socket.emit('send-message', {uid, message});

    txtMessage.value = '';

});

const main = async() => {

    // Validate JWT
    await validateJWT();

}


main();