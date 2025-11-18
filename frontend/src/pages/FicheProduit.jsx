import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axios";

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axiosClient.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!product) return <p>Chargement…</p>;

    return (
        <div>
            <img src={product.image} alt={product.name} />
            <h1>{product.name}</h1>
            <p>{product.millesime_produit}</p>
            <p>{product.pays_origine}</p>
            <strong>{product.price} $</strong>
        </div>
    );
}