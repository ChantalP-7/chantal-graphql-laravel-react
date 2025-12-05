const GetUsager = () => {
    const infoUsager = localStorage.getItem("user") || sessionStorage.getItem("user");
    
    let usager = null;
    if (infoUsager) {
      try {
        usager = JSON.parse(infoUsager);
      } catch (error) {
        console.error("Erreur de l'analyse des données utilisateur :", error);
      }
    }
    
    return usager;
  
}
 export default GetUsager;