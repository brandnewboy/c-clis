export function sayHello() {
    const App = document.getElementById('app')
    const h1 = document.createElement('h1')
    h1.innerHTML = `
    <span style="color: coral">
        hello c-build, this str is generated by utils/index.js -> sayHello()
    </span>
    `

    App.appendChild(h1)
}

export default function () {
    const App = document.getElementById('app')
    const h1 = document.createElement('h1')
    h1.innerHTML = `
    <span class="test">
        hello c-build, this str is generated by utils/index.js -> default function()
    </span>
    `

    App.appendChild(h1)
}