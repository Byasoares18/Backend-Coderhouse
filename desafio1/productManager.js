class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios");
        return;
      }
  
     
      if (this.products.some(product => product.code === code)) {
        console.error(" producto repetido ");
        return;
      }
  
      
      const newProduct = {
        id: this.productIdCounter++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
  
      this.products.push(newProduct);
      console.log("Producto agregado:", newProduct);
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
  
      if (!product) {
        console.error("Producto no encontrado");
      }
  
      return product;
    }
  }
  
 
  const productManager = new ProductManager();
  
  productManager.addProduct("Producto 1", "Pulsera", 1500, "img1.jpg", "C01", 100);
  productManager.addProduct("Producto 2", "Collar", 1500, "img2.jpg", "C02", 80);
  productManager.addProduct("Producto 3", "Anillo", 500, "img3.jpg", "C03", 90);

  const allProducts = productManager.getProducts();
  console.log("Todos los productos:", allProducts);
  
  const productById = productManager.getProductById(2);
  console.log("Producto por ID:", productById);
  
  const nonExistentProduct = productManager.getProductById(100);
 