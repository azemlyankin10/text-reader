const KEY = 'texts'

const addTextForm = document.querySelector('#addTextForm')
addTextForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const area = e.target.elements[0]
  const value = area.value
  addToStorage(value)
  createGridCarts()
  area.value = ''
})

const lgSelect = document.querySelector('#lg')
responsiveVoice.getVoices().forEach(el => {
  const option = document.createElement('option')
  option.setAttribute('value', el.name)
  option.textContent = el.name
  lgSelect.append(option)
})


const grid = document.querySelector('#grid')
function createGridCarts() {
  grid.innerHTML = ""
  const cardsArray = getElementsFromStorage()
  cardsArray.forEach(({ text, time, id }) => {
    const { card, bodyText, btnRead, btnDelete, closeBtn } = createCard(text, time)
    let isOpen
    card.addEventListener('click', (e) => {
      e.stopPropagation()
      if (!isOpen) {
        card.classList.remove('not-active-card')
        card.classList.add('active-card')
        isOpen = true
      }
    })
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (isOpen) {
        closeCard(card)
        isOpen = false
      }
    })
    btnRead.addEventListener('click', () => {
      speakText(bodyText.textContent)
    })
    btnDelete.addEventListener('click', () => {
      deleteElementInStorage(id)
      createGridCarts()
    })
  
    grid.append(card)
  })
}
createGridCarts()


function closeCard($card) {
  $card.classList.add('not-active-card')
  $card.classList.remove('active-card')
}

document.querySelectorAll('.card-text').forEach(el => {
  readSelectedText(el)
})


function readSelectedText($el) {
  $el.addEventListener('mouseup', () => {
    speakText(getSelectedText())
  })
}

function speakText(text) {
  const lg = lgSelect.value
  if(text) {
    responsiveVoice.speak(text, lg, {onstart: startSpeak, onend: endSpeak})
  }
}


const { createCover, deleteCover} = cover()
function startSpeak() {
  createCover()
}
function endSpeak() {
  deleteCover()
}

function getSelectedText() {
  return window.getSelection().toString()
} 

function createCard(text, addTime) {
  const card = document.createElement('div')
  card.classList.add('card', 'not-active-card')
  const cardHeader = document.createElement('div')
  cardHeader.classList.add('card-header', 'text-end')
  const closeBtn = document.createElement('button')
  closeBtn.classList.add('btn-close', 'card-close')
  cardHeader.append(closeBtn)
  const body = document.createElement('div')
  body.classList.add('card-body')
  const bodyText = document.createElement('p')
  bodyText.classList.add('card-text')
  bodyText.textContent = text
  body.append(bodyText)
  const footer = document.createElement('div')
  footer.classList.add('card-footer', 'd-flex', 'justify-content-between', 'align-items-center')
  const time = document.createElement('small')
  time.classList.add('text-muted')
  time.textContent = dayjs(addTime).format('DD.MM.YYYY (HH:mm)')
  const btnRead = document.createElement('button')
  btnRead.classList.add('btn', 'btn-success', 'control')
  btnRead.textContent = 'Read'
  const btnDelete = document.createElement('button')
  btnDelete.classList.add('btn', 'btn-danger')
  btnDelete.textContent = 'Delete'
  footer.append(time)
  footer.append(btnRead)
  footer.append(btnDelete)
  card.append(cardHeader)
  card.append(body)
  card.append(footer)

  return { card, bodyText, btnRead, btnDelete, closeBtn }
}

function cover() {
  const cover = document.createElement('div')
  const createCover = () => {
    document.body.append(cover)
    cover.style.display = 'block'
    cover.style.position = 'fixed'
    cover.style.top = '0'
    cover.style.left = '0'
    cover.style.width = '100%'
    cover.style.height = '100%'
    cover.style.backgroundColor = '#989895a2'
  }

  const deleteCover = () => {
    cover.style.display = 'none'
  }

  return { createCover, deleteCover }
}



function addToStorage(text) {
  try {
    const task = {
      id: id(),
      text,
      time: Date()
    }
    const storage = JSON.parse(localStorage.getItem(KEY))
    storage 
    ? localStorage.setItem(KEY, JSON.stringify(storage.concat(task)))
    : localStorage.setItem(KEY, JSON.stringify([task]))
    
    return task
  } catch (error) {
    console.log(error)
  }
} 

function getElementsFromStorage() {
  try {
    return localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY)) : [];
  } catch (error) {
    console.log(error)
  }
}

function deleteElementInStorage(id) {
  try {
    const storage = JSON.parse(localStorage.getItem(KEY))
    const newStorage = storage.filter(el => el.id !== id)
    localStorage.setItem(KEY, JSON.stringify(newStorage))
    return true
  } catch (error) {
    console.log(error)
  }
}

function id () {
  return Math.random().toString(36).substring(2,8+2);
}