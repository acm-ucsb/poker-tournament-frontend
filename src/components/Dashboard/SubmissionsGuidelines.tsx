import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SubmissionsGuidelines() {

  const sections = [
    { id: "interface", label: "1. Interface & Bot Behavior" },
    { id: "format", label: "2. Submission Format" },
    { id: "template", label: "3. Template & Schema" },
    { id: "functionality", label: "4. Functionality & Performance" },
    { id: "libraries", label: "5. Library Whitelist" },
    { id: "deadline", label: "6. Submission Deadline" },
    { id: "method", label: "7. Submission Method" },
    { id: "testing", label: "8. Testing Your Bot" },
    { id: "review", label: "9. Code Review" },
    { id: "disqualification", label: "10. Disqualification Criteria" },
    { id: "notes", label: "11. Things to Note" },
    { id: "contact", label: "12. Contact & Support" },
  ];
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen rounded-xl shadow-lg mb-16 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-400 tracking-tight mb-2 drop-shadow-lg">
          Poker Bot Tournament
        </h1>
  <h2 className="block text-xl md:text-2xl font-semibold text-center text-green-400 mb-4 drop-shadow">Submission Guidelines</h2>
        <p className="text-white mb-8 text-lg text-center">Welcome to the Poker Bot Tournament!<br />To ensure smooth gameplay and fair evaluation, all teams must follow the submission guidelines outlined below. Any submissions not adhering to these rules may be disqualified.</p>
      </motion.div>
      <ol className="space-y-6 text-white text-lg">
        {sections.map((section, idx) => (
          <li key={section.id} id={section.id}>
            <details open className="bg-transparent rounded-lg mb-2 border-none group">
              <summary className="flex items-center justify-between cursor-pointer py-2 px-2 font-semibold text-xl text-green-300 tracking-tight outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 hover:bg-gray-900 rounded">
                <span>{section.label}</span>
                <span className="ml-2 transition-transform duration-200 group-open:rotate-90">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 8L10 12L14 8" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </summary>
              <div className="px-2 py-2">
                {/* Section content here, preserve original content for each section */}
                {section.id === "interface" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>All participant bots will be executed on our backend servers.</li>
                      <li>Your bot will receive the current game state (using the template schemas provided) and is expected to return a single valid poker action on its turn.</li>
                      <li>The game engine will handle: progressing the game state, dealing cards, enforcing the rules.</li>
                      <li>Your code must not interact with external services or modify how the game state is provided.</li>
                    </ul>
                  </>
                )}
                {section.id === "format" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>Participants may use one of the official templates: <span className="font-mono">Python (.py)</span>, <span className="font-mono">C++ (.cpp)</span></li>
                      <li>Only one file may be submitted per team, except for ML-based bots (see below).</li>
                      <li>For ML-based bots:
                        <ul className="list-disc ml-6 text-white">
                          <li>Code must be in Python only.</li>
                          <li>You may use the whitelisted ML libraries (see Section 4).</li>
                          <li>The bot must still call the template function with the defined input and output formats.</li>
                        </ul>
                      </li>
                      <li>File naming convention:
                        <ul className="list-disc ml-6 text-white">
                          <li><span className="font-mono">[TeamName]_PokerBot.py</span></li>
                          <li><span className="font-mono">[TeamName]_PokerBot.cpp</span></li>
                        </ul>
                      </li>
                    </ul>
                  </>
                )}
                {section.id === "template" && (
                  <>
                    <ul className="list-disc ml-6 space-y-2 text-white">
                      <li>Do not modify the required function signatures or class definitions in the template.</li>
                      <li>Additional helper functions/classes are allowed as long as they don’t interfere with the interface.</li>
                      <li>Python Template Snippet:</li>
                    </ul>
                    <div className="my-2">
                      <pre className="bg-gray-900 rounded-lg p-4 text-base overflow-x-auto mb-2">
                        <code className="text-green-300">{`class Pot:
    value: int  # money in pot
    players: list[str]  # players vying for this pot, team_ids

# cards are defined as a 2 character string [value][suite]
# where 1st char: a(2-9)tjqk, 2nd char: s d c h
class GameState:
    index_to_action: int
    index_of_small_blind: int
    players: list[str]
    player_cards: list[str]
    held_money: list[int]
    bet_money: list[int]  # -1 for fold, 0 for check/hasn't bet
    community_cards: list[str]
    pots: list[Pot]
    small_blind: int
    big_blind: int`}</code>
                      </pre>
                    </div>
                    <ul className="list-disc ml-6 space-y-2 text-white">
                      <li>Example GameState:</li>
                    </ul>
                    <div className="my-2">
                      <pre className="bg-gray-900 rounded-lg p-4 text-base overflow-x-auto mb-2">
                        <code>
                          {`{
`}
                          <div className="flex flex-col pl-4">
                            <span><span className="text-green-400">"index_to_action"</span>: <span className="text-yellow-200">2</span>,</span>
                            <span><span className="text-green-400">"index_of_small_blind"</span>: <span className="text-yellow-200">0</span>,</span>
                            <span><span className="text-green-400">"players"</span>: <span className="text-yellow-200">["team_id0", "team_id1", "team_id2"]</span>,</span>
                            <span><span className="text-green-400">"player_cards"</span>: <span className="text-yellow-200">["2s", "7s"]</span>,</span>
                            <span><span className="text-green-400">"held_money"</span>: <span className="text-yellow-200">[100, 200, 300]</span>,</span>
                            <span><span className="text-green-400">"bet_money"</span>: <span className="text-yellow-200">[20, -1, 0]</span>,</span>
                            <span><span className="text-green-400">"community_cards"</span>: <span className="text-yellow-200">["ac", "2h", "2d"]</span>,</span>
                            <span><span className="text-green-400">"pots"</span>: <span className="text-yellow-200">{`[{ "value": 50, "players": ["team_id0", "team_id2"] }]`}</span>,</span>
                            <span><span className="text-green-400">"small_blind"</span>: <span className="text-yellow-200">5</span>,</span>
                            <span><span className="text-green-400">"big_blind"</span>: <span className="text-yellow-200">10</span></span>
                          </div>
                          {`}`}
                        </code>
                      </pre>
                    </div>
                    <ul className="list-disc ml-6 space-y-2 text-white">
                      <li>Example Interpretation:<br />Betting round after the flop.<br />Player 0 bet 20, Player 1 folded, action is on Player 2.<br />Player 2 has trips with 2s and 7s.</li>
                    </ul>
                  </>
                )}
                {section.id === "functionality" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>Bots must make legal poker moves according to the game rules.</li>
                      <li>No access to: Filesystem, Network, External resources.</li>
                      <li>Each bot has 5 seconds per move. Exceeding this limit may result in folding or disqualification.</li>
                    </ul>
                  </>
                )}
                {section.id === "libraries" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>Allowed Standard Libraries:
                        <ul className="list-disc ml-6 text-white">
                          <li>Python 3.x standard library</li>
                          <li>C++17 standard library</li>
                        </ul>
                      </li>
                      <li>Allowed External Python Libraries (for ML bots only):
                        <ul className="list-disc ml-6 text-white">
                          <li>PyTorch</li>
                          <li>TensorFlow</li>
                          <li>Pandas</li>
                          <li>NumPy</li>
                        </ul>
                      </li>
                      <li>Use of any other library is strictly prohibited and will result in disqualification during the code review.</li>
                    </ul>
                  </>
                )}
                {section.id === "deadline" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>All submissions must be received before <span className="font-bold">[DATE & TIME]</span>.</li>
                      <li>Late submissions will not be accepted.</li>
                    </ul>
                  </>
                )}
                {section.id === "method" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>Submit through the official tournament dashboard.</li>
                      <li>If not using ML, only .py or .cpp files are accepted.</li>
                      <li>If using ML, submit a GitHub repository containing:
                        <ul className="list-disc ml-6 text-white">
                          <li>All necessary code and model files</li>
                          <li>A clear README explaining setup (if required)</li>
                        </ul>
                      </li>
                      <li>Do not include:
                        <ul className="list-disc ml-6 text-white">
                          <li>Unrelated code</li>
                          <li>Personal data</li>
                          <li>System or binary files</li>
                        </ul>
                      </li>
                    </ul>
                  </>
                )}
                {section.id === "testing" && (
                  <>
                    <ul className="list-disc ml-6 space-y-2 text-white">
                      <li>A local tournament simulator will be provided for participants.</li>
                      <li>We strongly recommend testing your bot locally to ensure it:</li>
                      <ul className="list-disc ml-8 text-white">
                        <li>Runs without errors</li>
                        <li>Complies with the template interface</li>
                        <li>Performs within the time limit</li>
                      </ul>
                    </ul>
                  </>
                )}
                {section.id === "review" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>All submissions will undergo a code review.</li>
                      <li>Review checks for: Compliance with template and libraries, Illegal or unfair behavior, Runtime safety and performance.</li>
                      <li>Non-compliant bots will be disqualified.</li>
                    </ul>
                  </>
                )}
                {section.id === "disqualification" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>Your team may be disqualified if:
                        <ul className="list-disc ml-6 text-white">
                          <li>The bot throws errors or crashes during the game.</li>
                          <li>It fails to follow the required interface.</li>
                          <li>It uses illegal libraries or external resources.</li>
                          <li>It exceeds time limits repeatedly.</li>
                          <li>It makes illegal moves (see below).</li>
                        </ul>
                      </li>
                    </ul>
                  </>
                )}
                {section.id === "notes" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>Illegal moves will be automatically treated as folding.</li>
                      <li>Examples: Checking when a raise is required, Betting less than the required minimum.</li>
                      <li>If you have special requests (e.g., library whitelisting, accommodations), contact us through Discord before the submission deadline.</li>
                      <li>The tournament backend is designed for fairness — attempts to exploit the system will result in immediate disqualification.</li>
                      <li>Bots are called only during their own turn; they should not rely on global state or other bots’ internals.</li>
                    </ul>
                  </>
                )}
                {section.id === "contact" && (
                  <>
                    <ul className="list-disc ml-6 space-y-1 text-white">
                      <li>For technical issues, clarifications, or library accommodation requests:</li>
                        <li>Join our Discord server: <a href="https://discord.gg/p6rcUUjWaU" target="_blank" rel="noopener noreferrer" className="font-mono text-green-400 underline hover:text-green-300 transition-colors">https://discord.gg/p6rcUUjWaU</a></li>
                      <li>Or email us at: <a href="mailto:acm.dev.ucsb@gmail.com" className="font-mono text-green-400 underline hover:text-green-400 transition-colors">acm.dev.ucsb@gmail.com</a></li>
                    </ul>
                  </>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
