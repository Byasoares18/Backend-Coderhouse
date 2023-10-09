const fs = require('fs/promises');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(productData) {
    
    const products = await this.readProductsFromFile();

    
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...productData,
    };

    
    products.push(newProduct);

    
    await this.writeProductsToFile(products);

    console.log('Producto agregado:', newProduct);

    return newProduct;
  }

  async getProducts() {
    
    const products = await this.readProductsFromFile();
    return products;
  }

  async getProductById(id) {
    
    const products = await this.readProductsFromFile();
    const product = products.find(p => p.id === id);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product;
  }

  async updateProduct (id, updatedData) {
    
    const products = await this.readProductsFromFile();

    
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

   
    const updatedProduct = { ...products[index], ...updatedData };
    products[index] = updatedProduct;

    
    await this.writeProductsToFile(products);

    console.log('Producto actualizado:', products[index]);
  }

  async deleteProduct(id) {
    
    const products = await this.readProductsFromFile();

    
    const updatedProducts = products.filter(p => p.id !== id);

    if (updatedProducts.length === products.length) {
      throw new Error('Producto no encontrado');
    }
    await this.writeProductsToFile(updatedProducts);

    console.log('Producto eliminado con ID:', id);
  }

  
  async readProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      
      if (error.code === 'ENOENT' || error.message === 'Unexpected end of JSON input') {
        return [];
      } else if (error instanceof SyntaxError) {
        
        console.error('JSON inválido no arquivo:', this.path);
        return [];
      } else {
        throw new Error('Error al leer el archivo de productos: ' + error.message);
      }
    }
  }
  

  async writeProductsToFile(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
      throw new Error('Error al escribir en el archivo de productos: ' + error.message);
    }
  }
}


(async () => {
  const productManager = new ProductManager('./desafio2/products.json');
  const initialProducts = await productManager.getProducts();
  console.log('Productos iniciales:', initialProducts);

  const newProductData = {
    id: 4,
    title: 'Product4',
    description: 'aros',
    price: 1500,
    thumbnail: 'img4.jpg',
    code: 'CO4',
    stock: 6000,
  };
  

  const addedProduct = await productManager.addProduct(newProductData);

  const allProducts = await productManager.getProducts();
  console.log('Todos los productos:', allProducts);
  
  const retrievedProduct = await productManager.getProductById(addedProduct.id);
  console.log('Producto recuperado por ID:', retrievedProduct);

  const updatedProductData = { price: 250 };
  const updatedProduct = await productManager.updateProduct(addedProduct.id, updatedProductData);

  const productIdToDelete = 1;
  await productManager.deleteProduct(productIdToDelete);

  const remainingProducts = await productManager.getProducts();
  console.log('Productos restantes:', remainingProducts);
})();
