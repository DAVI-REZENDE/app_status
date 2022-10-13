async function fetchData() {
  const response = await fetch('http://localhost:3333/flows').then(res => res.json())
  console.log(response);

  setTable(response);
}

async function fetchDataRest() {
  const response = await fetch('http://localhost:3333/rest_equipments').then(res => res.json())
  setServiceType(response.filters.serviceType)
  setTabs(response)
}

async function fetchDataTableId(){
  const response = await fetch('http://localhost:3333/infoTable').then(res => res.json())
  setTableEquipment(response);
}

function setTableEquipment(equipment){
  console.log(equipment);

  const body = document.querySelector('#table_equipment > tbody');
  const trRemove = document.querySelectorAll('#table_equipment > tbody > tr');

  trRemove.forEach(element => body.removeChild(element));

  equipment.forEach(element => {
    const tr = document.createElement('tr');

    const tdDate = document.createElement('td');
    tdDate.innerText = element.date;
    tr.append(tdDate);

    const tdHoursTotal = document.createElement('td');
    tdHoursTotal.innerText = element.hoursTotal;
    tr.append(tdHoursTotal);

    const tdHoursMetter = document.createElement('td');
    tdHoursMetter.innerText = element.hourMeter;
    tr.append(tdHoursMetter);

    const tdWeign = document.createElement('td');
    tdWeign.innerText = element.weightTotal;
    tr.append(tdWeign);

    const tdTrip = document.createElement('td');
    tdTrip.innerText = element.nTrip;
    tr.append(tdTrip);

    const tdDF = document.createElement('td');
    tdDF.innerText = element.DF;
    tr.append(tdDF);

    const tdEO = document.createElement('td');
    tdEO.innerText = element.EO;
    tr.append(tdEO);

    body.append(tr);
  })
}

function setTable(allItems) {
  setThead(allItems)
  setTbody(allItems)
}

function setThead(allItems) {
  const thead = document.querySelector('#my_table thead tr')

  const firstTh = document.createElement('th')
  firstTh.innerText = 'fluxos'
  thead.append(firstTh)

  const { title } = allItems.shift()

  if(allItems.length === 0) {
    const titleTh = document.createElement('th')
    titleTh.innerText = title
    thead.append(titleTh)

    return;
  }

  const [{ equipment }] = allItems
  const columns = Object.keys(equipment).map(column => column.replaceAll('_', ' '))

  columns.forEach(columnName => {
    const th = document.createElement('th')
    th.innerText = columnName
    thead.append(th)
  })

  return columns
}

function setTbody(allItems) {
  const tbody = document.querySelector('#my_table tbody')

  allItems.forEach(flow => {
    const tr = document.createElement('tr')
    const flowTd = document.createElement('td')

    const filial = document.createElement('span')
    filial.innerText = flow.header.from
    const iconOrigen = document.createElement('i');
    iconOrigen.classList.add('ph-crosshair');
    filial.append(iconOrigen);
    filial.classList.add('p-2.5', 'rounded-lg', 'bg-gray-200', 'text-zinc-800', 'uppercase')
    flowTd.append(filial)

    const i = document.createElement('i')
    i.classList.add('ph-arrow-fat-lines-right-fill', 'text-slate-500', 'text-2xl')
    flowTd.append(i)

    const locale = document.createElement('span')
    locale.innerText = flow.header.to
    locale.classList.add('p-2.5', 'rounded', 'bg-slate-300', 'text-zinc-800', 'uppercase');

    const iconDestiny = document.createElement('i');
    iconDestiny.classList.add('ph-map-pin');
    locale.append(iconDestiny);
    flowTd.append(locale)

    flowTd.classList.add('flex', 'gap-2', 'items-center')

    tr.append(flowTd)

    const tds = createEquipmentsTd(flow.equipment);

    tds.forEach(e => {
      tr.append(e);
    })

    tbody.append(tr)
  })

}

function createEquipmentsTd(equipment) {
  const values = Object.values(equipment)

  // console.log(equipment)

  return values.map(element => {
    const td = document.createElement("td");
    const container = document.createElement("div")
    container.classList.add('flex', 'gap-2', 'flex-wrap')

    // console.log(element);

    element.forEach(equipment => {
      const wrapper = document.createElement('div');
      wrapper.id = equipment.id;
      wrapper.classList.add('bg-blue-500','cursor-pointer', 'rounded-lg', 'flex', 'flex-col', 'gap-1', 'p-2', 'items-center')
      wrapper.addEventListener("click", (event) => addAnimationWrapper(equipment.id,event));

      const strong = document.createElement('strong')
      strong.innerText = equipment.id;
      strong.classList.add('uppercase', 'text-white', 'font-bold', 'text-xs')

      const image = document.createElement('img')
      image.src = equipment.imageUrl
      image.classList.add('rounded-lg', 'w-8')

      wrapper.append(strong);
      wrapper.append(image)

      container.append(wrapper);
    })

    td.append(container)

    return td
  })


}
let modalAnimation;
let wrapperAnimation;

async function addAnimationWrapper(id,event){
  await fetchDataTableId();
  let wrapper = document.getElementById(id);
  wrapper.style.position = "absolute";
  const modal = document.getElementById('modal')
  const modalContainer = document.getElementById('modalAnimation');
  modal.classList.remove('hidden');

  modalAnimation = anime({
    targets: '#modalAnimation',
    keyframes: [
    //{opacity: 0,translateX: 1000},
    {opacity: 0,delay:300},
    {opacity: 0.5},
    {opacity: 0.7},
    {opacity: 1,translateX: 0},
  ],
    backgroundColor: '#FFF',
    duration: 800,
    delay:300,
    easing: 'cubicBezier(.5, .05, .1, .3)'  
  });

  wrapperAnimation = anime({
    targets: '#'+id,
    //position: 'absolute',
    scale: 2,
    zIndex: 1000,
    // top: '50%',
    // right: '90%'
    left: function(el) {
      let height = el.getBoundingClientRect().height;
      let valueCal = (screen.width - modalContainer.clientWidth) / 2 - (height * 2 +  16 )
      return valueCal+'px';
    },
    top: function(el, i) {
      return (modalContainer.clientHeight * 1.3) + 'px';

    },
    //translate: ['50%','50%'],
    easing: 'linear'  
  });
  wrapperAnimation.id = id;
  modal.style = "";
  modalAnimation.play();
  wrapperAnimation.play();
}

function removeModal(id){
  modalAnimation.remove();
  wrapperAnimation.remove();
  let modal = document.getElementById('modalAnimation');
  let wrapper = document.getElementById(wrapperAnimation.id);
  document.getElementById('modal').classList.add('hidden');
  modal.removeAttribute('style');
  wrapper.removeAttribute('style');
}

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("bg-blue-200", "text-blue-900")
    tablinks[i].classList.add("bg-zinc-200", "text-zinc-800")
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "flex";
  evt.path[0].classList.remove("bg-zinc-200", "text-zinc-800")
  evt.path[0].classList.add("bg-blue-200", "text-blue-900")
}

function setServiceType(serviceType) {
  const categoriesContainer = document.getElementById('categories')
  console.log(serviceType);

  serviceType.forEach(category => {
    const categoryWrapper = document.createElement("button")
    categoryWrapper.classList.add(
      "flex",
      "items-center",
      "gap-2",
      "font-semibold",
      "disabled:cursor-not-allowed"
    )
    const dot = document.createElement("span")
    dot.classList.add(
      "w-4",
      "h-4",
      "rounded-full",
      "bg-[" + category.color + "]"
    )

    categoryWrapper.append(dot)
    categoryWrapper.append(category.name)

    categoryWrapper.addEventListener("click", (event) => {
      event.currentTarget.classList.toggle("underline")
      const allButtons = event.path[1].querySelectorAll("button")

      allButtons.forEach(button => {
        const isSelected = button === event.currentTarget
        if(!isSelected) {
          button.toggleAttribute('disabled')
        }
      })

      filterEquipments(category.id)
    })

    categoriesContainer.append(categoryWrapper)
  })
}

function filterEquipments(serviceId) {
  const allEquipments = document.querySelectorAll('.equipment')

  allEquipments.forEach(equipment => {
    const equipmentService = Number(equipment.getAttribute("data-service"))
    const equipmentIsFiltered = equipment.hasAttribute("filtered")
    // console.log(equipmentIsFiltered);

    // console.log(equipmentService, serviceId);
    if(equipmentService !== serviceId) {
      equipment.classList.toggle('hidden')
    }
  })
}

function setTabs(data) {
  const {filters: { categories }} = data;
  const {filters: { serviceType }} = data;

  if(screen.width <= 720) {
    const containerCollapse = document.getElementById("collapse");
    containerCollapse.classList.add(
      "bg-white",
      "p-6",
      "rounded-lg",
      "p-4",
      "flex",
      "flex-col",
      "gap-3"
    )

    console.log(data);
    categories.forEach((category, index) => {
      const detail = document.createElement("details")
      detail.classList.add(
        "rounded-lg",
        "bg-blue-100",
        "p-3",
        "open:ring-2",
        "open:ring-blue-900"
      )

      const summary = document.createElement("summary")
      summary.classList.add(
        "text-md",
        "leading-6",
        "uppercase",
        "text-blue-700",
        "font-bold",
        "select-none"
      )
      summary.innerText = category.description

      detail.append(summary)

      const contentDetail = document.createElement("div")
      contentDetail.classList.add(
        "mt-3",
        "text-sm",
        "leading-6",
        "text-slate-600",
        "flex",
        "overflow-x-auto",
        "gap-2"
      )

      data[category.id].forEach((equipment) => {
        const [{ color, id }] = serviceType.filter(service => service.id === equipment.serviceId)

        const currentColor = "bg-[" + color + "]"
        const wrapper = document.createElement('div');
        wrapper.id = equipment.id;
        wrapper.classList.add(
          currentColor,
          'rounded-lg',
          'flex',
          'flex-col',
          'gap-2',
          'p-2',
          'items-center',
          'equipment'
        )

        wrapper.setAttribute("data-service", id)
        wrapper.addEventListener("click", (event) => addAnimationWrapper(equipment.id,event));
        // wrapper.setAttribute("filtered", "")

        const strong = document.createElement('strong')
        strong.innerText = equipment.id;
        strong.classList.add('uppercase', 'text-white', 'font-bold', 'text-sm')

        const image = document.createElement('img')
        image.src = equipment.imageUrl
        image.classList.add('rounded-lg', 'w-10')

        wrapper.append(strong);
        wrapper.append(image)

        contentDetail.append(wrapper)
      })

      detail.append(contentDetail)
      containerCollapse.append(detail)
    })

  } else {
    const containerTabs = document.getElementById("container-tabs")
    const wrapperTabs = document.createElement("div")
    wrapperTabs.classList.add("flex", "gap-1")

    categories.forEach((category, index) => {
      const tab = document.createElement("button")
      tab.classList.add(
        "p-4",
        "rounded-t-2xl",
        "uppercase",
        "font-bold",
        "tablinks"
      )

      if(index === 0) {
        tab.classList.add("bg-blue-200", "text-blue-900")
      } else {
        tab.classList.add("bg-zinc-200", "text-zinc-800")
      }

      tab.innerText = category.description
      tab.setAttribute("data-tab", category.id)
      tab.addEventListener('click', (event) => openTab(event, category.id))

      wrapperTabs.append(tab)

      const tabContent = document.createElement("div")
      tabContent.classList.add(
        "tabcontent",
        "rounded-2xl",
        "rounded-tl-none",
        "bg-blue-200",
        "flex",
        "flex-wrap",
        "gap-2",
        "p-2"
      )

      if(index !== 0) {
        tabContent.classList.add("hidden")
      }

      tabContent.id = category.id

      data[category.id].forEach((equipment) => {
        const [{ color, id }] = serviceType.filter(service => service.id === equipment.serviceId)

        const currentColor = "bg-[" + color + "]"
        const wrapper = document.createElement('div');
        wrapper.id = equipment.id;
        wrapper.classList.add(
          currentColor,
          'rounded-lg',
          'flex',
          'flex-col',
          'gap-2',
          'p-2',
          'items-center',
          'equipment'
        )

        wrapper.setAttribute("data-service", id)
        wrapper.addEventListener("click", (event) => addAnimationWrapper(equipment.id,event));
        // wrapper.setAttribute("filtered", "")

        const strong = document.createElement('strong')
        strong.innerText = equipment.id;
        strong.classList.add('uppercase', 'text-white', 'font-bold', 'text-sm')

        const image = document.createElement('img')
        image.src = equipment.imageUrl
        image.classList.add('rounded-lg', 'w-10')

        wrapper.append(strong);
        wrapper.append(image)

        tabContent.append(wrapper)
      })

      containerTabs.append(tabContent)

    })

    containerTabs.prepend(wrapperTabs)
  }

  
}

fetchData();
fetchDataRest();