"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import Loading from "../loading";

export default function GamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToCart, cart } = useCart();

  const [instaUser, setInstaUser] = useState("");
  const [hasEnteredInsta, setHasEnteredInsta] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [ballLeft, setBallLeft] = useState(0);

  const ballRef = useRef(null);
  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      endGame(score >= 5);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, timeLeft, score]);

  useEffect(() => {
    let speed = 20; // very fast
    let direction = 1;

    const animateBall = () => {
      if (!isPlaying || !gameAreaRef.current) return;

      setBallLeft((prev) => {
        let next = prev + speed * direction;
        if (next >= 100) {
          next = 100;
          direction = -1;
        } else if (next <= 0) {
          next = 0;
          direction = 1;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(animateBall);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateBall);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setIsWin(false);
    setIsPlaying(true);
  };

  const endGame = (win) => {
    setIsPlaying(false);
    setGameOver(true);
    setIsWin(win);
    cancelAnimationFrame(animationRef.current);
    clearTimeout(timerRef.current);

    if (win) {
      const REWARD_ID = "600000000000000000000000";
      const hasReward = cart.some((item) => item.id === REWARD_ID);
      if (!hasReward) {
        addToCart(REWARD_ID);
      }
    }
  };

  const handleAreaClick = (e) => {
    if (!isPlaying) return;

    // Check if the click is in the middle zone (40% to 60% of the game area)
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const rect = gameArea.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;

    // Center area is between 40% and 60%
    if (clickPercent >= 40 && clickPercent <= 60) {
      // Check if the ball is currently in the center area
      if (ballLeft >= 40 && ballLeft <= 60) {
        const newScore = score + 1;
        setScore(newScore);
        
        // Flash effect or sound could go here
        
        if (newScore >= 5) {
          endGame(true);
        }
      }
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        {!hasEnteredInsta ? (
          <div className="bg-white p-8 rounded-xl shadow-lg dark:bg-gray-800">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
              Fitness Challenge
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="insta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instagram Username
                </label>
                <input
                  type="text"
                  id="insta"
                  value={instaUser}
                  onChange={(e) => setInstaUser(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="@yourusername"
                />
              </div>
              <button
                onClick={() => {
                  if (instaUser.trim()) {
                    setHasEnteredInsta(true);
                  } else {
                    toast.error("Please enter your Instagram username");
                  }
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Hit the Ball 5 Times in 15 Seconds!
            </h2>

            {!isPlaying && !gameOver && (
              <button
                onClick={startGame}
                className="mt-4 bg-amber-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition"
              >
                Start Game
              </button>
            )}

            {isPlaying && (
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-medium text-gray-700 dark:text-gray-300 px-4">
                  <span>Score: {score} / 5</span>
                  <span>Time: {timeLeft}s</span>
                </div>
                
                {/* Game Area */}
                <div 
                  ref={gameAreaRef}
                  onClick={handleAreaClick}
                  className="relative w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-crosshair border-2 border-transparent"
                >
                  {/* Center Target Zone */}
                  <div className="absolute top-0 bottom-0 left-[40%] right-[40%] bg-amber-100 dark:bg-amber-900/30 border-x-2 border-dashed border-amber-400 pointer-events-none">
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-amber-600/50 uppercase tracking-widest whitespace-nowrap">
                      Click Here
                    </span>
                  </div>
                  
                  {/* The Ball */}
                  <div 
                    className="absolute top-1/2 w-10 h-10 bg-red-500 rounded-full shadow-lg transform -translate-y-1/2 transition-none pointer-events-none"
                    style={{ left: `calc(${ballLeft}% - 1.25rem)` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click inside the dashed middle area when the ball is there!
                </p>
              </div>
            )}

            {gameOver && (
              <div className="mt-6 space-y-6">
                {isWin ? (
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      CONGRATS!
                    </h3>
                    <p className="text-green-800 dark:text-green-300 font-medium text-lg">
                      You won free fuel for your fitness. 3-4 days of protein snacks and a bottle.
                    </p>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      Check your cart right now and order it!!!
                    </p>
                    <button
                      onClick={() => router.push("/Cart")}
                      className="mt-6 w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Go to Cart
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                      Better luck next time!
                    </h3>
                    <p className="text-red-800 dark:text-red-300">
                      You scored {score} out of 5.
                    </p>
                    <button
                      onClick={startGame}
                      className="mt-6 w-full bg-amber-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
