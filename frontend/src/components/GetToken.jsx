const GetToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
} 
export default GetToken;