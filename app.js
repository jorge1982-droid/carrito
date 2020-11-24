const templatecard = document.getElementById('template-card').content
const items = document.getElementById('items')
const footer=document.getElementById('footer')
const fragment= document.createDocumentFragment()
const cards = document.getElementById('cards')
const templatecarrito=document.getElementById('template-carrito').content
const templatefooter=document.getElementById('template-footer').content
let carrito ={}

document.addEventListener('DOMContentLoaded', e=>{
    fechData()
})
cards.addEventListener('click',e=>{
    addCarrito(e)
})
items.addEventListener('click',(e)=>{
    btnAccion(e)
})

const fechData= async ()=>{
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        
       pintacards(data)
    } catch (error) {
        console.log(error)
        
    }
}
const pintacards =data =>{ //pinta la tarjeta de datos
    data.forEach(producto =>{
        templatecard.querySelector('h5').textContent = producto.title
        templatecard.querySelector('p').textContent = producto.precio
        templatecard.querySelector('img').setAttribute("src",producto.thumbnailUrl)
        templatecard.querySelector('button').dataset.id = producto.id
        const clone = templatecard.cloneNode(true)
        fragment.appendChild(clone)

    })
    cards.appendChild(fragment)
}
const addCarrito = e =>{ //se hace el llamado al boton
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{ //se crea el objetro
    let producto={
        title:objeto.querySelector('h5').textContent,
        precio:objeto.querySelector('p').textContent,
        id:objeto.querySelector('button').dataset.id,
        cantidad:1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad=carrito[producto.id].cantidad +1
    }
    carrito[producto.id]= {...producto}
    pintarcarrito()
}
const pintarcarrito =()=>{ //se pinta en el html los datos de productos
    items.innerHTML=''
    Object.values(carrito).forEach(producto=>{
        templatecarrito.querySelector('th').textContent = producto.id
        templatecarrito.querySelectorAll('td')[0].textContent=producto.title,
        templatecarrito.querySelectorAll('td')[1].textContent=producto.cantidad,
        templatecarrito.querySelector('span').textContent=producto.precio * producto.cantidad
        //botones

        templatecarrito.querySelector('.btn-info').dataset.id=producto.id
        templatecarrito.querySelector('.btn-danger').dataset.id=producto.id
        const clone =templatecarrito.cloneNode(true)
        fragment.appendChild(clone)

    })
    items.appendChild(fragment)
    pintarfooter()
}
const pintarfooter=()=>{ //se pinta el footer
    footer.innerHTML=''
    if(Object.keys(carrito).length===0){
        footer.innerHTML=  `
        <th scope="row" colspan="5">Carrito vacío volver a comprar !!</th>
        `
    
    }
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=>acc + cantidad ,0)
    const Nprecio =Object.values(carrito).reduce((acc,{cantidad,precio})=>acc + cantidad *precio ,0)

    templatefooter.querySelectorAll('td')[0].textContent=nCantidad
    templatefooter.querySelector('span').textContent=Nprecio
    const clone = templatefooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito') //boton de limpiar
     boton.addEventListener('click',()=>{
     carrito={}
     pintarcarrito()
 })

}
const btnAccion =e =>{  //botones adentro de los datos sumar y restar
    if(e.target.classList.contains('btn-info')){
        const producto=carrito[e.target.dataset.id]
        producto.cantidad ++
        carrito[producto.id]= {...producto}
        pintarcarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad --
         if(producto.cantidad ==0){
             delete carrito[e.target.dataset.id]
         }else{
             carrito[producto.id]={...producto}
         }
         pintarcarrito()
    }
    e.stopPropagation()
}




