const fs = require('fs/promises');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  
    async addProduct(productData) {
      const products = await this.leerProducts();
    
      const camposRequeridos = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    
      for (const field of camposRequeridos) {
        if (!(field in productData)) {
          throw new Error(`Falta el campo obligatorio: ${field}`);
        }
        if (field === 'price' && typeof productData[field] !== 'number') {
          throw new Error(`El campo ${field} debe ser un número`);
        }
      }

    const codigoRepetido = products.some(prod => prod.code === productData.code);
    if (codigoRepetido) {
      throw new Error('El código del producto ya existe');
    }

    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...productData,
    };

    products.push(newProduct);

    await this.escribirProduts(products);

    console.log('Producto agregado:', newProduct);

    return newProduct;
  }

  async getProducts() {
    const products = await this.leerProducts();
    return products;
  }

  async getProductById(id) {
    const products = await this.leerProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product;
  }

  async updateProduct(id, updatedData) {
    const products = await this.leerProducts();

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    const updatedProduct = { ...products[index], ...updatedData };
    products[index] = updatedProduct;

    await this.escribirProduts(products);

    console.log('Producto actualizado:', updatedProduct);

    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.leerProducts();

    const updatedProducts = products.filter(p => p.id !== id);

    if (updatedProducts.length === products.length) {
      throw new Error('Producto no encontrado');
    }

    await this.escribirProduts(updatedProducts);

    console.log('Producto eliminado con ID:', id);
  }

  async leerProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT' || error.message === 'Unexpected end of JSON input') {
        return [];
      } else if (error instanceof SyntaxError) {
        console.error(`JSON inválido en el archivo: ${this.path}`);
        return [];
      } else {
        throw new Error('Error al leer el archivo de productos: ' + error.message);
      }
    }
  }

  async escribirProduts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
      throw new Error('Error al escribir en el archivo de productos: ' + error.message);
    }
  }
}

(async () => {
  try {
    const productManager = new ProductManager('./products.json');
    const initialProducts = await productManager.getProducts();
    console.log('Productos iniciales:', initialProducts);

    const newProductData = {
      title: 'Product1',
      description: 'pulsera',
      price: 1500,
      thumbnail: 'img1.jpg',
      code: 'CO1',
      stock: 600,
    };

    const addedProduct = await productManager.addProduct(newProductData);
    console.log('Producto agregado:', addedProduct);

    const allProducts = await productManager.getProducts();
    console.log('Todos los productos:', allProducts);

    const retrievedProduct = await productManager.getProductById(addedProduct.id);
    console.log('Producto recuperado por ID:', retrievedProduct);

    const updatedProductData = { price: 250 };
    const updatedProduct = await productManager.updateProduct(addedProduct.id, updatedProductData);
    console.log('Producto actualizado:', updatedProduct);

    const productIdToDelete = addedProduct.id;
    await productManager.deleteProduct(productIdToDelete);
    console.log('Producto eliminado con ID:', productIdToDelete);

    const remainingProducts = await productManager.getProducts();
    console.log('Productos restantes:', remainingProducts);
  } catch (error) {
    console.error('Error en el programa principal:', error.message);
  }
})();
