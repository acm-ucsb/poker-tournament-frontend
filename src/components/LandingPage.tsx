"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Bot, Loader2Icon, Trophy, Users } from "lucide-react";
import { FannedCardsIcon } from "./FannedCardsIcon";
import { useAuth } from "@/providers/AuthProvider";

export default function MarketingPage() {
  const auth = useAuth();

  return (
    <div className="flex flex-col">
      <main className="">
        <section className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-gray-800 to-background">
          <div className="container px-8 md:px-10 flex flex-col items-center">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    UCSB ACM Development Branch Poker Tournament
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl mt-4">
                    Upload your poker bot, watch it compete in real-time, and
                    claim victory.
                  </p>
                </motion.div>
                <div className="flex flex-col justify-center gap-3 mt-6 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Link
                      href={auth.user ? "/dashboard" : "/auth/login"}
                      style={{
                        pointerEvents: auth.loadingAuth ? "none" : "auto",
                      }}
                    >
                      <Button size="xl" className="w-full">
                        {auth.loadingAuth ? (
                          <Loader2Icon
                            className="animate-spin"
                            style={{ width: 28, height: 28 }}
                          />
                        ) : auth.user ? (
                          <>Dashboard</>
                        ) : (
                          "Sign Up & Compete"
                        )}
                      </Button>
                    </Link>
                  </motion.div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Link href="#how-it-works">
                        <Button
                          variant={"outline"}
                          size="lg"
                          className="w-full"
                        >
                          How It Works
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Link href="#rules">
                        <Button
                          size="lg"
                          variant={"outline"}
                          className="w-full"
                        >
                          Rules & FAQ
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="hidden lg:flex justify-center items-center"
              >
                <FannedCardsIcon className="w-3/4 h-3/4" />
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="flex justify-center w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl">
              How It Works
            </h2>
            <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto text-center mt-4">
              A simple process to get your bot in the game.
            </p>
            <div className="grid items-stretch justify-center gap-3 sm:max-w-4xl sm:grid-cols-2 md:gap-4 lg:max-w-5xl lg:grid-cols-3 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex"
              >
                <Card className="h-full flex flex-col gap-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-6 h-6" /> Sign Up
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>
                      Create an account and get assigned to a random table and
                      seat.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex"
              >
                <Card className="h-full flex flex-col gap-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-6 h-6" /> Upload Your Bot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>
                      Upload your poker bot's code. We provide an API for your
                      bot to interact with the game.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex"
              >
                <Card className="h-full flex flex-col gap-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-6 h-6" /> Compete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>
                      Games start automatically when enough players have joined.
                      Watch the action in real-time!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="rules"
          className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container flex flex-col items-center w-full px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl">
              Rules & FAQ
            </h2>
            <div className="w-full max-w-3xl mt-10">
              <Tabs defaultValue="rules">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="rules">Tournament Rules</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                  <TabsTrigger value="prizes">Prizes</TabsTrigger>
                </TabsList>
                <TabsContent value="rules" className="pt-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Game Structure</AccordionTrigger>
                      <AccordionContent>
                        The tournament will be played as a series of No-Limit
                        Texas Hold'em games. Tables will automatically try to
                        maintain 9 players. As players are eliminated, tables
                        will be balanced until the final table is reached.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Bot API</AccordionTrigger>
                      <AccordionContent>
                        We provide a simple API for your bot to receive game
                        state information and submit actions (fold, call,
                        raise). Detailed documentation will be available upon
                        signing up.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Starting the Game</AccordionTrigger>
                      <AccordionContent>
                        A game at a table will automatically start once a
                        sufficient number of players at that table have uploaded
                        their bots.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                <TabsContent value="faq" className="pt-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        What programming languages can I use?
                      </AccordionTrigger>
                      <AccordionContent>
                        We currently support bots written in Python, and C++.
                        Bots should be created so that they can process a JSON
                        object representing the game state and return a JSON
                        object with the action to take.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        How do I upload my bot?
                      </AccordionTrigger>
                      <AccordionContent>
                        After signing up, you will have access to a dashboard
                        where you can upload your bot's code as a single file.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Can I update my bot during the tournament?
                      </AccordionTrigger>
                      <AccordionContent>
                        No, once the tournament starts, you cannot change your
                        bot.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                <TabsContent value="prizes" className="pt-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What are the prizes?</AccordionTrigger>
                      <AccordionContent>
                        Prizes will be awarded to the top three bots based on
                        their performance in the tournament. Details will be
                        announced closer to the tournament date.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="text-muted-foreground">
          UCSB ACM Development Branch Poker Tournament
        </p>
      </footer>
    </div>
  );
}
