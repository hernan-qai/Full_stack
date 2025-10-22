import { useState, useEffect} from 'react';
import phonebookService from './services/phonebook';

// Notification component
const Notification = ({ message, isError}) => {
  if (!message) return null; // Don't render if message is null or empty 
  return (
    <div style={
      {
        backgroundColor: isError ? 'lightgrey': 'lightgreen',
        border: isError ? '2px solid red' : '2px solid green',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
      }
    }>
      {message}
    </div>
  );
};

// Filter component

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

// PersonForm component
const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

// Person component
const Person = ({ name, number, onDelete }) => {
  return (
  <li className='person'>
    {name} {number} <button onClick={onDelete}>delete</button>
  </li>
  );
};

// Persons component
const Persons = ({ persons, onDelete}) => {
  return (
    <ul>
      {persons.map(person => (
        <Person 
          key={person.id}
          name={person.name}
          number={person.number}
          onDelete={() => onDelete(person.id, person.name)}
        />
      ))}
    </ul>
  );
};

// App component
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null); //State for notifications
  const [isError, setIsError] = useState(false); //Error Flag
  
  // Helper to show notifications
  const showNotification = (message, isError = false) => {
    setNotification(message);
    setIsError(isError);
    setTimeout(() => {
      setNotification(null);
      setIsError(false);
    }, 5000); // Clear after 5 seconds
  };

  // Fetch initial data from the server
  useEffect(() => {
    phonebookService.getAll()
      .then(data => {
        console.log('Fetched persons from server:', data); //Debug log
        setPersons(data);
      })
      .catch(error => {
        showNotification(error.message, true); // Show error notification
      });
  }, []); // Empty dependency array means this effect runs once after the initial render
 
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    //if (!newName.trim() || !newNumber.trim()) {
      //showNotification('Name and number cannot be empty', true);
      //return;
    //}

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.trim().toLowerCase()
    );

    if (existingPerson) {
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber.trim() };
        phonebookService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            console.log('Person updated on server:', returnedPerson); // Debug log
            setPersons(
              persons.map(person =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            );
            setNewName('');
            setNewNumber('');
            showNotification(`Updated ${returnedPerson.name}'s number`);
          })
          .catch(error => {
            showNotification(error.message, true); // Show error notification
            // Remove from state if not found on server
            if (error.message.includes('not found')) {
              setPersons(persons.filter(person => person.id !== existingPerson.id));
            }
          });
      }
      return;
    }
    
    const newPerson = { name: newName.trim(), number: newNumber.trim() };
    
    //Add new person via server
    phonebookService.create(newPerson)
      .then(addedPerson => {
        console.log('Added person to the server:', addedPerson); //Debug log
        setPersons([...persons, addedPerson]);
        setNewName('');
        setNewNumber('');
        showNotification(`Added ${addedPerson.name} to phonebook`);
      })
      .catch(error => {
        showNotification(error.message, true); // Show error notification
      });
  };
  
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService.remove(id)
        .then(()=> {
          console.log('Person deleted:', {id, name}); //Debug log
          setPersons(persons.filter(person => person.id !== id));
          showNotification(`Deleted ${name} from phonebook`);
        })
        .catch(error => {
          showNotification(error.message, true); // Show error notification
          // Optionally remove from state if not found on server
          if (error.message.includes('not found')) {
            setPersons(persons.filter(person => person.id !== id));
          }
        });
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  // Footer component
  const Footer = () => {
    const footerStyle = {
      color: 'green',
      fontStyle: 'italic',
      fontSize: 16,
    };
    return (
      <div style={footerStyle}>
        <br />
        <em>Phonebook app. Department of Computer Science, University of Helsinki 2025</em>
      </div>
    );
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isError={isError} /> 
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new contact</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onDelete={deletePerson}/>
      { /* Debugging correct: Display current inputs */}
      <div>Debug - name input: {newName}</div>
      <div>Debug - number input: {newNumber}</div>
      <div>Debug - Persons: {JSON.stringify(persons)}</div>
      <Footer />
    </div>
  );
};

export default App;
