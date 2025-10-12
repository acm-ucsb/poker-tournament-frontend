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
import { Bot, Trophy, Users } from "lucide-react";
import { FannedCardsIcon } from "./FannedCardsIcon";
import { useAuth } from "@/providers/AuthProvider";
import { TEAM_MAX_MEMBERS } from "@/lib/constants";
import { IconUsersGroup } from "@tabler/icons-react";
import { ButtonWrapper } from "./ButtonWrapper";
import { useData } from "@/providers/DataProvider";

export default function LandingPage() {
  const auth = useAuth();
  const { data } = useData();

  return (
    <div className="flex flex-col">
      <section className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#001509] to-background px-6">
        <div className="container md:px-10 flex flex-col items-center">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-white"
                  style={{
                    textShadow:
                      "4px 4px 3px rgba(244, 244, 244, 0.30), 8px 8px 10px rgba(255,255,255,0.3)",
                  }}
                >
                  Mann vs. Machine: Poker Bot Tournament
                </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl mt-4">
                    Challenge friends at the table or put your poker bot to the test. <br />
                    Compete, win prizes, and have fun! <br />
                    <span style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#b0b0b0",
                      fontWeight: 400,
                      marginTop: "0.5rem",
                      letterSpacing: "0.04em",
                      fontStyle: "italic",
                    }}>
                      Presented by ACM Dev & UCSB Poker Club
                    </span>
                  </p>
              </motion.div>
              <div className="flex flex-col justify-center gap-3 mt-6 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link
                    href={auth.user ? "/dashboard" : "/auth/signin"}
                    style={{
                      pointerEvents: auth.loadingAuth ? "none" : "auto",
                    }}
                  >
                    <ButtonWrapper
                      size="xl"
                      className="w-full"
                      disabled={auth.loadingAuth}
                    >
                      {auth.user
                        ? data?.is_admin
                          ? "Admin Dashboard"
                          : "Dashboard"
                        : "Sign In & Compete"}
                    </ButtonWrapper>
                  </Link>
                </motion.div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Link href="#how-it-works">
                      <Button variant={"outline"} size="lg" className="w-full">
                        Tournament Format
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Link href="#rules">
                      <Button size="lg" variant={"outline"} className="w-full">
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
        className="flex justify-center w-full py-12 md:py-24 lg:py-32 px-6"
      >
        <div className="container md:px-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl">
            Tournament Format
          </h2>
          <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto text-center mt-4">
            A simple process to join and play.
          </p>
          <div className="flex flex-row w-full mt-12 items-stretch justify-center">
            {/* Human Bracket Column */}
            <div className="flex flex-col items-center mr-12">
              <h3 className="text-xl font-semibold text-center mb-2">Human Bracket</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[{
                  title: "Pull Up",
                  content: "Check in at the registration desk @ Loma Pelona on Nov 8."
                }, {
                  title: "Get Seated",
                  content: "Wait to be seated at a table with other players."
                }, {
                  title: "Play Poker",
                  content: "Compete in classic Texas Hold'em against other players."
                }, {
                  title: "Advance to Finals",
                  content: "Top players move on to face the best bots in the final round."
                }].map((card, idx) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.2 * idx }}
                    className="flex justify-center"
                  >
                    <Card className="max-w-xs w-full">
                      <CardHeader>
                        <CardTitle>{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{card.content}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Vertical Divider for md+ screens */}
            <div className="hidden md:block md:col-span-1 md:self-stretch md:justify-center md:items-center">
              <div className="w-px h-[380px] bg-gray-500" />
            </div>
            {/* Bot Bracket Column */}
            <div className="flex flex-col items-center ml-12">
              <h3 className="text-xl font-semibold text-center mb-2">Bot Bracket</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[{
                  title: "Sign In",
                  content: "Create an account using your UCSB Google account."
                }, {
                  title: "Build Your Bot",
                  content: "Develop your poker bot and upload it to the dashboard."
                }, {
                  title: "Compete",
                  content: "Watch your bot play against other bots in real-time."
                }, {
                  title: "Advance to Finals",
                  content: "Top bots move on to face the best humans in the final round."
                }].map((card, idx) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.2 * idx }}
                    className="flex justify-center"
                  >
                    <Card className="max-w-xs w-full">
                      <CardHeader>
                        <CardTitle>{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{card.content}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section - moved below How It Works */}
      <section className="flex justify-center w-full py-12 md:py-20 lg:py-24 px-6 bg-background">
        <div className="container md:px-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl mb-8">
            Tournament Timeline
          </h2>
          <div className="w-full overflow-x-auto flex flex-col items-center">
            {/* Horizontal timeline line */}
            <div className="relative w-full flex justify-center mb-12" style={{ minWidth: '600px' }}>
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300" style={{ zIndex: 0 }} />
              <div className="flex w-full justify-between" style={{ position: 'relative', zIndex: 1 }}>
                {[
                  { day: "Monday", event: "Kickoff & Team Registration (stub)" },
                  { day: "Tuesday", event: "Bot Submission Opens (stub)" },
                  { day: "Wednesday", event: "Practice Games (stub)" },
                  { day: "Thursday", event: "Main Tournament Begins (stub)" },
                  { day: "Friday", event: "Finals: Top Humans vs Top Bots (stub)" },
                  { day: "Saturday", event: "Awards & Closing Ceremony (stub)" },
                ].map((item, idx) => (
                  <div key={item.day} className="flex flex-col items-center" style={{ minWidth: '100px' }}>
                    {/* Vertical line down to event */}
                    <div className="w-1 h-8 bg-gray-300" />
                  </div>
                ))}
              </div>
            </div>
            {/* Event titles below timeline, with numbers at the end of the vertical lines */}
            <div className="flex w-full justify-between" style={{ minWidth: '600px' }}>
              {[
                { day: "Monday", event: "Kickoff & Team Registration (stub)" },
                { day: "Tuesday", event: "Bot Submission Opens (stub)" },
                { day: "Wednesday", event: "Practice Games (stub)" },
                { day: "Thursday", event: "Main Tournament Begins (stub)" },
                { day: "Friday", event: "Finals: Top Humans vs Top Bots (stub)" },
                { day: "Saturday", event: "Awards & Closing Ceremony (stub)" },
              ].map((item, idx) => (
                <div key={item.day} className="flex flex-col items-center" style={{ minWidth: '100px' }}>
                  <div className="bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mb-2">
                    {idx + 1}
                  </div>
                  <div className="font-semibold text-lg text-center mb-1">{item.day}</div>
                  <div className="text-gray-400 text-center text-sm max-w-[160px]">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="rules"
        className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-muted/50 px-6"
      >
        <div className="container flex flex-col items-center w-full md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl">
            Rules & FAQ
          </h2>
          <div className="w-full max-w-3xl mt-10">
            <Tabs defaultValue="rules">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rules">Rules</TabsTrigger>
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
                      maintain 8 players. As players are eliminated, tables will
                      be balanced until the final table is reached.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Bot API</AccordionTrigger>
                    <AccordionContent>
                      We provide a simple API for your bot to receive game state
                      information and submit actions (fold, call, raise).
                      Detailed documentation will be available upon signing up.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Starting the Game</AccordionTrigger>
                    <AccordionContent>
                      A game at a table will automatically start once a
                      sufficient number of players have joined.
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
                      We currently support bots written in Python, and C++. Bots
                      should be created so that they can process a JSON object
                      representing the game state and return a JSON object with
                      the action to take.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I upload my bot?</AccordionTrigger>
                    <AccordionContent>
                      After signing up, you will have access to a dashboard
                      where you can upload your bot's code.
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
    </div>
  );
}
