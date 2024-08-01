"use client";

import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import { Spin, Button } from "antd";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    back_default: string | undefined;
    front_default: string | undefined;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=50&offset=0`;

  const fetchPokemonList = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const results: Pokemon[] = data.results;

      const pokemonDetailsPromises = results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonDetails: PokemonDetails = await pokemonResponse.json();
        return pokemonDetails;
      });

      const pokemonDetailsList = await Promise.all(pokemonDetailsPromises);
      setPokemonList(pokemonDetailsList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="App" style={{ backgroundColor: "#f8f8f8;" }}>
      <h1>Pokémon List</h1>

      <input
        type="text"
        placeholder="Search Pokémon by name..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      {isLoading && pokemonList.length === 0 ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="pokemon-list">
          {filteredPokemonList.length > 0 ? (
            filteredPokemonList.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                name={pokemon.name}
                imageUrl={pokemon.sprites.front_default}
                types={pokemon.types.map((t) => t.type.name)}
                number={pokemon.id}
              />
            ))
          ) : (
            <p className="no-results">No Pokémon found.</p>
          )}
        </div>
      )}

      {/* <div style={{ marginTop: "20px" }}>
        <Button onClick={() => {}} type="primary">
          Load More
        </Button>
      </div> */}
    </div>
  );
}
