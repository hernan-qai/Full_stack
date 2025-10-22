import axios from "axios";

const baseUrl = 'http://localhost:3001/persons';

// Fetch all persons from the server

const getAll = () => {
    return axios
        .get(baseUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw new Error('Failed to fetch phonebook data from server');
        });
};

// Create a new person on the server
const create = (newPerson) => {
    return axios
        .post(baseUrl, newPerson)
        .then(response => response.data)
        .catch(error => {
            console.error('Error adding person:', error);
            throw new Error('Failed to add person to phonebook');
        });
};

//Update an existing person's number on the server
const update = (id, updatedPerson) => {
    return axios
        .put(`${baseUrl}/${id}`, updatedPerson)
        .then(response => response.data)
        .catch(error => {
            console.error('Error updating person:', error);
            if (error.response && error.response.status === 404) {
                throw new Error(`Person not found with ${id}. It may have already been removed from the server.`);
            }
            throw new Error('Failed to update person in phonebook');
        });
};

// Delete a person from the server
const remove = (id) => {
    return axios
        .delete(`${baseUrl}/${id}`)
        .then(() => id) // Return the id of the deleted person
        .catch(error => {
            console.error('Error deleting person:', error);
            if (error.response && error.response.status === 404) {
                throw new Error(`Person not found with ${id}. It may have already been removed from the server.`);
            }
            throw new Error('Failed to delete person from phonebook');
        });
};

export default { getAll, create, update, remove };