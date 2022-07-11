
//creo elementos del Dom y seteo sus clases
const getCardContainter = () => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("col-lg-3", "col-md-4", "col-sm-6", "px-2", "mb-4");

    return cardContainer;
};

const getCard = () => {
    const card = document.createElement("div");
    card.classList.add("card", "h-100", "shadow-lg", "border-0");

    return card;
};

//Funcion que obtiene las imagenes
const getCardImg = (imageUrl = "", imageAlt = "Nothing") => {
    //Si la imagen no tiene URL no quiero que haga nada. 
    if (imageUrl === "") {
        console.error("No se puede crear una tarjeta sin imagen");
        return;
    }

    //Si no tiene alt, dejo que la funcion siga pero lanzo un warning.
    if (imageAlt === "Nothing") {
        console.warn(
            "Atención, una tarjeta sin atributo alt personalizado no es una buena práctica."
        );
    }
    const image = document.createElement("img");
    image.setAttribute("src", imageUrl);
    image.setAttribute("alt", imageAlt);
    image.classList.add("img-thumbnail", "img-fluid");
    return image;
};

//funcion que crea las tarjetas de productos
export const crearTarjeta = (content = {}) => {
    // Reviso si el content no tiene propiedades y lanzo un error si es asi.
    if (Object.keys(content).length === 0) {
        console.error("No se puede crear una tarjeta sin contenido");
        return;
    }
    
    // Desestructuro el contenido. 
    const { id, title, price, image } = content;

    // Crear el elemento, el contenedor general de la tarjeta
    const cardContainer = getCardContainter();
    cardContainer.setAttribute("id", id);

    // Estructuramos cada tarjeta
    const card = getCard();
    //Agrego el wrapper al contenedor del card
    cardContainer.appendChild(card);
    //Creo la imagen del producto
    const cardImg = getCardImg(image, title);
    card.appendChild(cardImg);

    //Creo el body, que esta misma funciona se encarga de llamar a las funciones que completan el body
    const cardBody = getCardBody(title, price);
    card.appendChild(cardBody);

    const cardFooter = getCardFooter(id);
    card.appendChild(cardFooter);

    return cardContainer;
};


// Funcion que crea el body. 
const getCardBody = (title, price) => {
    if (!title) {
        console.error("No se puede crear una tarjeta sin titulo");
        return;
    }

    if (!price) {
        console.error("No se puede crear una tarjeta sin precio");
        return;
    }


    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "row");

    const cardTitle = getCardTitle(title);
    cardBody.appendChild(cardTitle);

    const cardPrice = getCardPrice(price);
    cardBody.appendChild(cardPrice);
  
    return cardBody;
};

const getCardTitle = (title) => {
    if (!title) {
        console.error("No se puede crear un titulo sin un título.");
        return;
    }

    const cardTitleContainer = document.createElement("div");
    cardTitleContainer.classList.add();

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("fw-bolder", "text-center", "align-middle", "col");
    cardTitle.textContent = title;
    cardTitleContainer.appendChild(cardTitle);

    return cardTitleContainer;
};

const getCardPrice = (price) => {
    //Si no me llega ningun precio (puede ser undefined por ejemplo) lanzo error.
    if (!price) {
        console.error("No se puede crear un contenedor sin precio");
    }

    //Si me llega un precio, pero el número es negativo lanzo error.
    if (price < 0) {
        console.error("No se puede crear un precio negativo");
    }

    const cardPrice = document.createElement("div");
    cardPrice.classList.add("text-center", "h3", "col",
        "align-self-center", "justify-content-center", "text-success");
    // Si el precio es 0 ASUMO que es gratuito el producto.
    if (price === 0) {
        cardPrice.appendChild(document.createTextNode(`FREE`));
    }

    cardPrice.appendChild(document.createTextNode(`$${price}`));

    return cardPrice;
};


const getCardFooter = (id) => {
    

    //Creo el elemento contenedor del footer
    const cardFooter = document.createElement("div");
    cardFooter.classList.add(
        "card-footer",
        "p-4",
        "pt-0",
        "border-top-0",
        "bg-transparent"
    );

    // Creo el elemento contenedor del texto del footer.
    const cardFooterTextContainer = document.createElement("div");
    cardFooterTextContainer.classList.add("text-center");

    // Elemento anchor de HMTL.
    const cardButton = document.createElement("button");
    cardButton.classList.add("btn", "btn-outline-dark", "mt-auto");
    cardButton.setAttribute("id", id);
    cardButton.textContent = "Agregar al carrito";
    cardFooter.appendChild(cardFooterTextContainer);
    cardFooterTextContainer.appendChild(cardButton);

    // Retorno el footer.
    return cardFooter;
};



