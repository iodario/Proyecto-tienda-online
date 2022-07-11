import { crearTarjeta } from "./tarjetas.js";
import { APIURL, fetchAPI } from "./fetch.js";

//declaracion variables y constantes, inicializaciones.

let carrito = {}
let productos = {}
let cantproduc = 0;
const templateCarrito = document.getElementById('template-carrito').content;
let btnCarrito = document.getElementById('cantCarrito');
const fragment = document.createDocumentFragment();
const templateFooter = document.getElementById('template-footer').content;
const items = document.getElementById('items');


//obtenemos elementos del Dom y los guardamos en un objeto
const domElements = {
    productsContainer: document.querySelector('#cards-container')
};

//funcion que renderiza la pagina y carga los productos
const renderProducts = (products = {}) => {
   
    domElements.productsContainer.innerHTML = "";

    //Voy a recorrer el objeto  y voy a crear una tarjeta para cada producto.
    Object.values(products).forEach((product) => {
        const result = crearTarjeta(product);
        domElements.productsContainer.appendChild(result);
    });
    
    return;
};

//Funcion anónima que se auto-ejecuta.
(() => {

    fetch(APIURL)
        .then((response) => response.json())
        .then((data) => {
            productos = data;
            renderProducts(data);
            // console.log(data);
        })
        .catch((err) => console.error(err));
})();


//Utilizamos DOMContentLoaded cuando toda la pagina esta cargada 
document.addEventListener('DOMContentLoaded', () => {
    let data = fetchAPI(APIURL);
    if (localStorage.getItem('carrito')) {       //si existe dentro del localStorage una clave 'carrito'
    carrito = JSON.parse(localStorage.getItem('carrito'));   //asignar a carrito, el parse a Objeto de localStorage.getItem
    renderProducts(data);
    pintarCarrito();
    
    pintarFooter();                          //mostrar carrito en el Dom
}}
)

//creo evento click para agregar al carrito
domElements.productsContainer.addEventListener('click', (e) => {
    addCarrito(e)
    
})


const addCarrito = e => {
    
     // valida si el elemento contiene la propiedad que pasamos por parametro
    if (e.target.classList.contains('btn-outline-dark')) {   
       
        setCarrito(e.target.id);
        Swal.fire('Producto agregado con exito')
    }
    e.stopPropagation()   //detenemos la propagacion del evento 

}


function setCarrito(id) {
    let productoSeleccionado = productos.find(element => element.id == id);

    let producto = {
        id: productoSeleccionado.id,   //identifica el id del elemento clickeado
        title: productoSeleccionado.title,     // el ttulo
        precio: productoSeleccionado.price,       // el precio
        cantidad: 1                                            // la cantidad la dejamos en 1, luego aumentara
    }

    //aumentar el numero de productos en el carrito, al presionar Comprar       //Carrito es toda nuestra coleccion de objetos. Estamos accediendo sólo al elemento que se está repitiendo. Una vez que accedemos, accedemos solamente a la cantidad, y la aumentamos en 1. Si este producto no exixte, por defecto la cantidad sera 1. 
    if (carrito.hasOwnProperty(producto.id)) {
        console.log(producto);
        producto.cantidad = carrito[producto.id].cantidad + 1

    }
    cantproduc += 1;
    //una vez que tenemos el objeto tenemos que pushearlo al carrito. Estamos haciendo una coleccion de objetos indexados. 
    carrito[producto.id] = { ...producto }    //spread operator, aqui estamos haciendo una 'copia' de producto
    pintarCarrito();
}

const pintarCarrito = () => {
   
    btnCarrito.textContent = cantproduc;
    items.innerHTML = ' '    //items debe partir vacio por cada vez que ejecutamos pintar Carrito(0)

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id  //editando contenido de tag 'th'
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        //clonando el carrito, utilizamos el fragment
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone);   // ?
    })
    //Pintamos la informacion
    items.appendChild(fragment)

    pintarFooter()   

    localStorage.setItem('carrito',JSON.stringify(carrito))    
   
}



//generamos los template, vamos a buscar el id guardado
const pintarFooter = () => {
    footer.innerHTML = ''    //iniciamos footer en 0
    //debemos preguntar si nuetro carrito esta vacio, si es true entra el if:

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = ` <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return   //no olvidar return para que se salga de la funcion
    }
    //si no esta vacio pintamos footer, sumando cantidades y totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)    //este acumuldador, por cada iteracion va a ir acumulando lo que nosotros hagamos como suma
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
    
    
    //pintamos la ultima funcionalidad en el footer(suma de cantidades y totales)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    //Evento vaciar carrito
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = [];
        cantproduc = 0;   //vaciamos el objeto carrito
        pintarCarrito();
    })
}

//Buscador
document.querySelector('#buscar').addEventListener('keyup', () => {
    let q = document.querySelector('#buscar').value;
    if (q.length >= 2) { // Filtra cuando hay al menos dos letras en el input
        buscar(q);
    } else if (q.length === 0) {
        // si no hay nada que buscar muestra todos los productos
        renderProducts(productos);
    }
})
//funcion que filtra resultados de busqueda por coincidencia
function buscar(q) { 
    let resultado = productos.filter(producto => producto.title.toLowerCase().includes(q.toLowerCase()));
    renderProducts(resultado);
}


//creamos evento para capturar click de botones de aumentar y disminuir  //no se por que lo saco de items
items.addEventListener('click', (e) => {
    btnAccion(e)
})


// botones aumentar y disminuir cantidad. Usaremos Event Delegation
const btnAccion = e => {
    console.log(e.target)  //vemos la info de los elementos en consola al presionar cualquier cosa 
    //Accion de aumentar
    if (e.target.classList.contains('btn-info')) {    //utilizamos objetos indexados
        console.log(carrito[e.target.dataset.id])    //esto que sale en console.log lo asigno a const producto
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++ // aumentamos la cantidad en 1.
        // ahora decimos 'este carrito' , en su id, va a ser una 'copia' de producto
        carrito[e.target.dataset.id] = { ...producto }    //con esto se van agregando elementos a productos

        pintarCarrito();
    }

    //Accion de disminuir
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        //cuando la cantidad sea 0, eliminar el elemento 
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito();
    }
    e.stopPropagation();
}














