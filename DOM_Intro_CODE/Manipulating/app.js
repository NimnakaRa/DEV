const allLinks = document.querySelectorAll('a');

// for (let link of allLinks) {
//     link.innerText = 'I AM A LINK!!!!'
// }


for (let link of allLinks) {
    link.style.color = 'rgb(0, 108, 134)';
    link.style.textDecorationColor = 'magenta';
    link.style.textDecorationStyle = 'wavy'
}

const container = querySelector('#container');

for (let i = 0; i < 100; i++) {
    let newButton = document.createElement('button');
    newButton.innerText = 'Hey!';
    container.append(newButton);
}