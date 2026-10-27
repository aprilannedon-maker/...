import React, { useState, useEffect } from 'react';

interface DogApiResponse {
  message: string;
  status: string;
}

interface BreedListResponse {
  message: Record<string, string[]>;
  status: string;
}

export const DogViewer: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('affenpinscher');
  const [dogImage, setDogImage] = useState<string>('');

  // 1. Fetch the full list of breeds on initial component mount using useEffect
  useEffect(() => {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((res) => res.json())
      .then((data: BreedListResponse) => {
        if (data.status === 'success') {
          const breedKeys = Object.keys(data.message);
          setBreeds(breedKeys);
          if (breedKeys.length > 0) {
            setSelectedBreed(breedKeys[0]);
          }
        }
      })
      .catch((err) => console.error('Error fetching breeds list:', err));
  }, []);

  // 2. Fetch a random dog image whenever the selected breed changes using useEffect
  useEffect(() => {
    if (!selectedBreed) return;

    fetch(`https://dog.ceo/api/breed/${selectedBreed}/images/random`)
      .then((res) => res.json())
      .then((data: DogApiResponse) => {
        if (data.status === 'success') {
          setDogImage(data.message);
        }
      })
      .catch((err) => console.error('Error fetching dog image:', err));
  }, [selectedBreed]);

  // 3. Handler for the "Fetch Again" button to get a new photo for the current breed
  const handleFetchAgain = () => {
    if (!selectedBreed) return;

    fetch(`https://dog.ceo/api/breed/${selectedBreed}/images/random`)
      .then((res) => res.json())
      .then((data: DogApiResponse) => {
        if (data.status === 'success') {
          setDogImage(data.message);
        }
      })
      .catch((err) => console.error('Error fetching dog image:', err));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      {/* Main Whiteboard Box Layout */}
      <div
        style={{
          border: '2px solid #333',
          padding: '25px',
          borderRadius: '8px',
          width: '320px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        {/* Dropdown with arrow for choosing the dog breed */}
        <div style={{ marginBottom: '20px' }}>
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
            }}
          >
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed.charAt(0).toUpperCase() + breed.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Dog Picture Display Box */}
        <div
          style={{
            border: '2px dashed #ccc',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#f1f3f5',
          }}
        >
          {dogImage ? (
            <img
              src={dogImage}
              alt={selectedBreed}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '14px', color: '#6c757d' }}>Loading...</span>
          )}
        </div>

        {/* Fetch Again Button */}
        <button
          onClick={handleFetchAgain}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Fetch Again
        </button>
      </div>
    </div>
  );
};