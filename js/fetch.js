//Llamada a la api
export const APIURL = "https://fakestoreapi.com/products";

export const fetchAPI = async (URL) => {
    const result = await fetch(URL);
    const data = await result.json();
    return data;
};

export const getAllProducts = async () => {
    return await fetchAPI(APIURL);
};


export const getProductById = async (id) => {
    const product = await fetchAPI(`${APIURL}/${id}`);
    return product;
};
