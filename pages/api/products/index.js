import data from './data.json';

export function getProducts() {
  return data.product_list;
}

export function getCategories() {
  return data.categories;
}

export function getCategoryDescription(category) {
    const item = data.category_list.find((item) => item.category === category.toLowerCase());
    console.log("Category is " + category + " - Item found is " + JSON.stringify(item));
    if (item) { 
        return(item.desc)
    }
    return(category)
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  } else {
    const products = getProducts();
    res.status(200).json(products);
  }
}
