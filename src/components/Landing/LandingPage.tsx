"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion, useAnimation } from "framer-motion";
import { Bot, Trophy, Users } from "lucide-react";
import { FannedCardsIcon } from "../FannedCardsIcon";
import { useAuth } from "@/providers/AuthProvider";
import { TEAM_MAX_MEMBERS } from "@/lib/constants";
import { IconUsersGroup } from "@tabler/icons-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { useData } from "@/providers/DataProvider";
import TournamentTimeline from "./TournamentTimeline";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { DEFAULT_SIGNIN_REDIRECT_URL } from "../../lib/constants";
import { useWindowScroll } from "@mantine/hooks";
import { MyTeam } from "../MyTeam/MyTeam";
import { AdminPanel } from "../AdminPanel/AdminPanel";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-white">
                  Mann vs. Machine: Poker Bot Tournament
                </h1>
                <p className="max-w-[600px] text-gray-300 md:text-xl mt-4">
                  Challenge friends at the table or put your poker bot to the
                  test. Compete, win prizes, and have fun!
                  <span className="block text-[0.85rem] text-[#b0b0b0] font-normal mt-2 tracking-wider italic">
                    Presented by ACM Dev @ UCSB & Poker Club @ UCSB
                  </span>
                </p>
              </motion.div>
              <div className="flex flex-col justify-center gap-3 mt-6 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {auth.user ? (
                    <Link
                      href="/dashboard"
                      style={{
                        pointerEvents: auth.loadingAuth ? "none" : "auto",
                      }}
                    >
                      <ButtonWrapper
                        size="xl"
                        className="w-full"
                        disabled={auth.loadingAuth}
                      >
                        {data?.is_admin ? "Admin Dashboard" : "Dashboard"}
                      </ButtonWrapper>
                    </Link>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <ButtonWrapper
                          size="xl"
                          className="w-full"
                          disabled={auth.loadingAuth}
                        >
                          Sign In & Compete
                        </ButtonWrapper>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Hey 👋, which bracket will you participate in?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You only need to register on this website if you're
                            participating in the bot bracket. If you're
                            interested in playing normal poker please fill out
                            our{" "}
                            <Link
                              className="underline text-blue-400"
                              href="https://forms.gle/i93xZK5awUF9N8Pw9"
                            >
                              RSVP form.
                            </Link>{" "}
                            We have limited capacity for the human bracket so
                            fill them out ASAP!
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Link href="https://forms.gle/i93xZK5awUF9N8Pw9">
                            <AlertDialogAction className="w-full">
                              Human Bracket
                            </AlertDialogAction>
                          </Link>
                          <Link
                            href="/auth/signin"
                            style={{
                              pointerEvents: auth.loadingAuth ? "none" : "auto",
                            }}
                          >
                            <AlertDialogAction className="w-full">
                              Bot Bracket
                            </AlertDialogAction>
                          </Link>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </motion.div>

                <div className="grid sm:grid-cols-3 gap-2 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Link href="#tournament-format">
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
                    <Link href="#tournament-timeline">
                      <Button variant={"outline"} size="lg" className="w-full">
                        Deadlines & Events
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
        id="tournament-format"
        className="flex justify-center w-full py-12 md:py-24 lg:py-32 px-6"
      >
        <div className="container md:px-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl">
            Tournament Format
          </h2>
          <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto text-center mt-4">
            A simple process to join and play.
          </p>
          <div className="flex flex-col md:flex-row w-full mt-12 items-stretch justify-center">
            {/* Human Bracket Column */}
            <div className="flex flex-col items-center md:mr-12 mb-12 md:mb-0">
              <h3 className="text-xl font-semibold text-center mb-2">
                Human Bracket
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  {
                    title: "Pull Up",
                    content:
                      "Check in at the registration desk @ Loma Pelona on Nov 8.",
                  },
                  {
                    title: "Get Seated",
                    content: "Wait to be seated at a table with other players.",
                  },
                  {
                    title: "Play Poker",
                    content:
                      "Compete in classic Texas Hold'em against other players.",
                  },
                  {
                    title: "Advance to Finals",
                    content:
                      "Top players move on to face the best bots in the final round.",
                  },
                ].map((card, idx) => (
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
            <div className="flex flex-col items-center md:ml-12">
              <h3 className="text-xl font-semibold text-center mb-2">
                Bot Bracket
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  {
                    title: "Sign In",
                    content:
                      "Create an account using your UCSB Google account.",
                  },
                  {
                    title: "Build Your Bot",
                    content:
                      "Develop your poker bot and upload it to the dashboard.",
                  },
                  {
                    title: "Compete",
                    content:
                      "Watch your bot play against other bots in real-time.",
                  },
                  {
                    title: "Advance to Finals",
                    content:
                      "Top bots move on to face the best humans in the final round.",
                  },
                ].map((card, idx) => (
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

      {/* Tournament Timeline */}
      <section
        className="flex flex-col items-center w-full py-24 lg:py-32"
        id="tournament-timeline"
      >
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl">
          Tournament Timeline
        </h2>
        <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto text-center mt-4">
          Deadlines & events throughout the week.
        </p>
        <div className="mb-12" />
        <TournamentTimeline
          events={[
            {
              time: "Oct 26, 12:00 AM",
              title: "Bot Registration & Team Formation Opens",
              description:
                "Sign in with your UCSB email and form teams (up to 4 members).",
            },
            {
              time: "Nov 3, 11:59 PM",
              title: "Bot Registration & Team Formation Closes",
              description: "All teams must be finalized by this time.",
            },
            {
              time: "Nov 6, 7:00 PM",
              title: "Poker Night & Bot Office Hours",
              description:
                "Get help with building your bot, or just come play poker!",
            },
            {
              time: "Nov 7, 11:59 PM",
              title: "Code Submission Deadline",
              description:
                "Upload your bot code to the dashboard by this time.",
            },
            {
              time: "Nov 8, 2:00 PM",
              title: "Human Bracket Registration",
              description: "Check in at the registration desk @ Loma Pelona",
            },
            {
              time: "Nov 8, 2:30 PM",
              title: "Tournament Begins",
              description:
                "First hands are dealt. Human and bot brackets start.",
            },
            {
              time: "Nov 8, 6:30 PM",
              title: "Finals",
              description: "Top humans and bots face off for the championship.",
            },
          ]}
        />
        <div className="mb-16" />
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
                      Both brackets of the tournament will be played as a series
                      of No-Limit Texas Hold'em games. Tables will try to
                      maintain 8 players. As players are eliminated, tables will
                      be reduced & balanced until the final table is reached.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Bracket Structure</AccordionTrigger>
                    <AccordionContent>
                      You may compete in both brackets, however prizes will only
                      be awarded once per individual/team. The top 3 players
                      from the human bracket and the top 3 bots will receieve
                      prizes. The final round will feature the top 3 humans and
                      top 3 bots competing against each other.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Bot Interface</AccordionTrigger>
                    <AccordionContent>
                      We provide a simple bot template to get you started. Your
                      bot will receive game state information and return
                      strictly actions (fold, call, raise). You may modify the
                      template as you see fit, but you may not use external APIs
                      or internet access during the tournament. External
                      libraries will be strictly defined in the submissions
                      guidelines documentation.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Use of AI</AccordionTrigger>
                    <AccordionContent>
                      You may use AI tools (like ChatGPT) to help you build your
                      bot. You are also allowed to create your own ML models to
                      assist your bot in making decisions. Use of fully trained
                      poker AI models is plagarism and strictly prohibited.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              <TabsContent value="faq" className="pt-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-0">
                    <AccordionTrigger>How do I run my bot?</AccordionTrigger>
                    <AccordionContent>
                      Your bot will run on our servers. You just need to upload
                      your code to the dashboard before the submission deadline,
                      and we'll take care of the rest. You will be able to watch
                      your bot compete in real-time through the dashboard.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I upload my bot?</AccordionTrigger>
                    <AccordionContent>
                      After signing up, you will have access to a dashboard
                      where you can upload your bot's code.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      What programming languages can I use?
                    </AccordionTrigger>
                    <AccordionContent>
                      We currently support bots written in Python, and C++. We
                      will provide a simple bot template which will contain a
                      core defined function you must implement.
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
                      Prizes will be awarded to the top three players & bots
                      based on their performance in the tournament. Details will
                      be announced closer to the tournament date.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Can I win both human and bot bracket prizes?
                    </AccordionTrigger>
                    <AccordionContent>
                      No, prizes will only be awarded once per individual/team.
                      You are still welcome to compete in both brackets, but can
                      only win prizes in one bracket.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      What does the winner of the final combined table get?
                    </AccordionTrigger>
                    <AccordionContent>
                      You get glory and bragging rights!
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
