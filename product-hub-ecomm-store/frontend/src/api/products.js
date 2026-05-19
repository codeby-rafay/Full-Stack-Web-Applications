import axios from "axios";

const BASE_URL = "https://dummyjson.com";

export const getAllProducts = async (limit = 20, skip = 0) => {
  const response = await axios.get(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`,
  );
  return response.data;
};

export const getSingleProduct = async (id) => {
  const response = await axios.get(`${BASE_URL}/products/${id}`);
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await axios.get(`${BASE_URL}/products/search?q=${query}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await axios.get(`${BASE_URL}/products/categories`);
  return response.data;
};

export const getCategoryList = async () => {
  const response = await axios.get(`${BASE_URL}/products/category-list`);
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await axios.get(`${BASE_URL}/products/category/${category}`);
  return response.data;
};
