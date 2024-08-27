"use client";

import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import { Spin } from "antd";

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
  const [allPokemonList, setAllPokemonList] = useState<PokemonDetails[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize] = useState<number>(20);

  useEffect(() => {
    fetchPokemonList();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterPokemonList();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, allPokemonList]);

  useEffect(() => {
    paginatePokemonList();
  }, [currentPage, pokemonList]);

  const fetchPokemonList = async () => {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=300`;

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
      setAllPokemonList(pokemonDetailsList);
      console.log("----", pokemonDetailsList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  const filterPokemonList = () => {
    const filteredList = allPokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery)
    );
    setPokemonList(filteredList);
    setCurrentPage(1);
  };

  const paginatePokemonList = () => {
    setTotalPages(Math.ceil(pokemonList.length / pageSize));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setIsLoading(true);
    }
  };

  const nextBt = ">";
  const backBt = "<";
  return (
    <div className="App" style={{ backgroundColor: "#f8f8f8" }}>
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
        <>
          <div className="pokemon-list">
            {pokemonList.length > 0 ? (
              pokemonList
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((pokemon) => (
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
          <div className="pagination-controls" style={{ marginTop: "20px" }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {backBt}
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {nextBt}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
