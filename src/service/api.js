// src/services/api.js
import axios from "axios";

const API = axios.create({
    baseURL: "https://simasn.pontianak.go.id/api/",
});

export const getPltPlh = (id) => API.get(`pltplh/${id}`);
