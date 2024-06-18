"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Game = {
  id: number;
  image_background: string;
  rating: number;
  name: string;
};

const getGames = async (): Promise<Game[]> => {
  const url = "https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "0b38069837msh03e75509aef2473p11fcd6jsn880cb8f3c335",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  ///////////////////////////////////////////////
  const res = await fetch(
    `https://api.rawg.io/api/platforms?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
  );
  if (!res.ok) {
    throw new Error("Could not Fetch data");
  }
  const data: any = await res.json();
  return data.results;
};

export default function Home() {
  const [games, setGames] = useState<Game[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGames();
        console.log("gamesData", gamesData);
        setGames(gamesData);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchGames();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!games) {
    return <div>Loading...</div>;
  }

  return (
    <main className="m-24 rounded-md grid grid-cols-4 gap-12">
       
        {games.map((game) => (
          <div key={game.id}>
            <h1>{game.name}</h1>
            <p>{game.rating}</p>
            <div className="aspect-video relative">
            <Image
              src={game.image_background}
              alt={game.name}
              fill
              className="object-cover rounded-md"
            />
            </div>
          </div>
        ))}
    </main>
  );
}
