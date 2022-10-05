function setTable(allItems) {
  const tbody = document.querySelector('#my_table tbody')

  const columns = setHead(allItems[0])

  allItems.forEach(element => {
    const tr = document.createElement('tr')
    if(Array.isArray(element)) {
      const td = createNewTd(element)

      tr.append(td)

      tbody.append(tr)
    }
  });
}

function generateListEquipaments(equipment) {
  const wrapper = document.createElement('div')
  wrapper.classList.add('bg-blue-800', 'rounded-lg', 'flex', 'flex-col', 'gap-2', 'p-2', 'items-center')

  const strong = document.createElement('strong')
  strong.innerText = equipment.id
  strong.classList.add('uppercase', 'text-white', 'font-bold', 'text-sm')
  wrapper.append(strong)

  const image = document.createElement('img')
  image.src = equipment.imageUrl
  image.classList.add('rounded-lg', 'w-10')
  wrapper.append(image)

  return wrapper
}

function createNewTd(items) {
  const tdTransportEquipament = document.createElement('td')
  const containerTransport = document.createElement('div')
  containerTransport.classList.add('flex', 'gap-2', 'max-w-[460px]', 'flex-wrap')
  tdTransportEquipament.append(containerTransport)

  items.forEach(item => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('bg-blue-800', 'rounded-lg', )
  })
}

function generateTds(item) {
  const tr = document.createElement('tr')
  const tdFilial = document.createElement('td')

  const filial = document.createElement('span')
  filial.innerText = item.from
  filial.classList.add('p-2.5', 'rounded', 'bg-blue-800', 'text-white', 'uppercase')
  tdFilial.append(filial)
  console.log(filial);

  const i = document.createElement('i')
  i.classList.add('ph-arrow-fat-lines-right-fill', 'text-blue-800', 'text-2xl')
  tdFilial.append(i)

  const locale = document.createElement('span')
  locale.innerText = item.to
  locale.classList.add('p-2.5', 'rounded', 'bg-blue-800', 'text-white', 'uppercase')
  tdFilial.append(locale)

  tdFilial.classList.add('flex', 'gap-2', 'items-center')
  tr.append(tdFilial)

  const tdLoadEquipament = document.createElement('td')
  const containerLoad = document.createElement('div')
  containerLoad.classList.add('flex', 'gap-2', 'max-w-[460px]', 'flex-wrap')
  tdLoadEquipament.append(containerLoad)

  const tdTransportEquipament = document.createElement('td')
  const containerTransport = document.createElement('div')
  containerTransport.classList.add('flex', 'gap-2', 'max-w-[460px]', 'flex-wrap')
  tdTransportEquipament.append(containerTransport)

  return { tr, tdLoadEquipament, tdTransportEquipament, containerLoad, containerTransport }
}

function setHead(headers) {
  const firstTh = document.createElement('th')
  firstTh.innerText = 'fluxos'
  const columns = [firstTh]

  Object.entries(headers).forEach(([name, value]) => {
    if(Array.isArray(value)) {
      const th = document.createElement('th')
      th.innerText = name.replaceAll('_', ' ')

      columns.push(th)
    }
  })

  const thead = document.querySelector('#my_table thead tr')
  columns.forEach(column => thead.append(column))
  return columns;
}


fetchData()