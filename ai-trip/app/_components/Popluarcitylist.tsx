"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function Popularcitylist() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Popular Destinations to visit
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DestinationContent = ({ highlights }: { highlights: string[] }) => {
  return (
    <>
      {highlights.map((text, index) => (
        <div
          key={index}
          className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
        >
          <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            {text}
          </p>
        </div>
      ))}
    </>
  );
};

const data = [
  {
    category: "Paris, France",
    title: "Explore the City of Lights – Eiffel Tower, Louvre & more",
    src: "https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DestinationContent highlights={["Visit the iconic Eiffel Tower and enjoy panoramic city views.", "Explore world-class art at the Louvre Museum.", "Stroll along the Champs-Élysées and relax at charming Parisian cafés."]} />,
  },
  {
    category: "New York, USA",
    title: "Experience NYC – Times Square, Central Park, Broadway",
    src: "https://images.unsplash.com/photo-1545328805-926d6a0950ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DestinationContent highlights={["Take in the dazzling lights and energy of Times Square.", "Enjoy a peaceful walk through Central Park's lush landscapes.", "Catch a world-famous Broadway show in the Theater District."]} />,
  },
  {
    category: "Tokyo, Japan",
    title: "Discover Tokyo – Shibuya, Cherry Blossoms, Temples",
    src: "https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DestinationContent highlights={["Cross the famous Shibuya Crossing, the busiest intersection in the world.", "Admire cherry blossoms in Ueno Park during spring.", "Visit the ancient Senso-ji Temple in Asakusa."]} />,
  },
  {
    category: "Rome, Italy",
    title: "Walk through History – Colosseum, Vatican, Roman Forum",
    src: "https://images.unsplash.com/photo-1555992828-ca4dbe41d294?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DestinationContent highlights={["Step inside the ancient Colosseum and imagine gladiator battles.", "Explore Vatican City and marvel at Michelangelo's Sistine Chapel.", "Walk through the ruins of the Roman Forum."]} />,
  },
  {
    category: "Dubai, UAE",
    title: "Luxury and Innovation – Burj Khalifa, Desert Safari",
    src: "https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DestinationContent highlights={["Ascend the Burj Khalifa for breathtaking views of the city skyline.", "Experience the thrill of a desert safari with dune bashing.", "Shop at the Dubai Mall, one of the largest malls in the world."]} />,
  },
  {
    category: "India",
    title: "Discover India – Taj Mahal, Jaipur, Kerala Backwaters",
    src: "https://images.unsplash.com/photo-1532664189809-02133fee698d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DestinationContent highlights={["Witness the breathtaking beauty of the Taj Mahal at sunrise.", "Explore the vibrant Pink City of Jaipur and its royal palaces.", "Cruise through Kerala's serene backwaters on a traditional houseboat."]} />,
  },
];

