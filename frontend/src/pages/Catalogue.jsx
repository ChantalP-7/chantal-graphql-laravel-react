import { useEffect, useState } from "react";
import { getProducts } from "../api/products";

export default function Catalogue() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(res => {
        setProducts(res.data.data); // ← tableau de produits
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Catalogue</h1>
      <div>
        {products.map(p => (
          <div key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.couleur}</p>
            <p>{Number(p.price).toFixed(2)} $</p>
          </div>
        ))}
      </div>
    </div>
  );
}
