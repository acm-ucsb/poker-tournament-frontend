"use client";

export function TournamentStats() {
    return (
        <div className="flex-[1] min-w-0 pt-6 pb-8 md:pl-6 md:pr-10 mt-6">
            <div className="grid gap-4">
                {/* Main tournament header/detail box */}
                <div>
                    <TournamentDetails />
                </div>

                {/* Small stat boxes in a responsive grid to match table cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StatBox label="Players" value="120" sub="total players" />
                    <StatBox label="Blind" value="100 / 200" sub="current" />
                    <StatBox label="Buy-In" value="1,000" sub="entry amount" />
                    <StatBox label="Tables" value="10" sub="active tables" />
                </div>

                {/* Leaderboard and Live Feed as full-width boxes below the small stats */}
                <div className="grid grid-cols-1 gap-3">
                    <LeaderboardTracker />
                    <LiveFeed />
                </div>
            </div>
        </div>
    );
}

// Shared card wrapper class to keep a consistent, clean aesthetic
const cardBase = "w-full rounded-xl p-4 bg-[var(--card)] text-[var(--card-foreground)] backdrop-blur-sm";

export function LiveFeed() {
    // Stub list of live actions (replace with websocket data in future)
    const actions = [
        { id: 1, type: "win", player: "Alice", amount: 1200, table: "Table 2", description: "Won a high pot" },
        { id: 2, type: "loss", player: "Bob", amount: 800, table: "Table 1", description: "Lost a big hand" },
        { id: 3, type: "all-in", player: "Charlie", amount: 1500, table: "Table 3", description: "Went all-in" },
        { id: 4, type: "win", player: "Dana", amount: 900, table: "Table 4", description: "Won with a flush" },
        { id: 5, type: "loss", player: "Eve", amount: 500, table: "Table 5", description: "Busted out" },
    ];

    const typeColor = (t: string) =>
        t === "win" ? "text-[#60ef86]" : t === "loss" ? "text-[#ef6060]" : "text-[#f5c542]";

    return (
        <div className={`${cardBase} space-y-3`}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-wide">Live Feed</h3>
                <span className="text-sm text-gray-400">real-time highlights</span>
            </div>

            <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {actions.map((a) => (
                    <li
                        key={a.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-[rgba(96,239,134,0.06)] transition-colors"
                    >
                        <div className={`flex-shrink-0 mt-0.5 ${typeColor(a.type)}`}>{a.type === 'win' ? '🏆' : a.type === 'loss' ? '💔' : '🔥'}</div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{a.player}</span>
                                <span className="text-xs text-gray-400">• {a.table}</span>
                                <span className="ml-auto font-mono font-semibold text-sm text-gray-100">{a.amount.toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-300 truncate mt-1">{a.description}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function TournamentDetails() {
    // Stub tournament details (replace with API data in future)
    const tournament = {
        name: "ACM Poker Tournament 2025",
        startTime: "Aug 20, 2025, 6:00 PM",
        endTime: "Aug 20, 2025, 11:00 PM",
        buyIn: 1000,
        currentBlind: "100 / 200",
        totalPlayers: 120,
        tables: 10,
        status: "In Progress",
    };

    return (
        <div className={cardBase}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">{tournament.name}</h2>
                    <p className="text-sm text-gray-400 mt-1">{tournament.status} • {tournament.tables} tables</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">Buy-In</div>
                    <div className="font-semibold text-[#60ef86]">{tournament.buyIn.toLocaleString()} <img src="/casino-chip.png" alt="chip" className="inline-block w-4 h-4 ml-1"/></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-300">
                <div>
                    <div className="text-xs text-gray-400">Start</div>
                    <div className="font-medium text-white">{tournament.startTime}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-400">End</div>
                    <div className="font-medium text-white">{tournament.endTime}</div>
                </div>

            </div>
        </div>
    );
}

export function LeaderboardTracker() {
    // Stub list of players (replace with API data in future)
    const players = [
        { id: 1, name: "Alice", chips: 3200 },
        { id: 2, name: "Bob", chips: 2800 },
        { id: 3, name: "Charlie", chips: 1500 },
        { id: 4, name: "Dana", chips: 900 },
        { id: 5, name: "Eve", chips: 500 },
    ];

    return (
        <div className={cardBase}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Leaderboard</h3>
                <span className="text-sm text-gray-400">top stacks</span>
            </div>

            <ol className="mt-3 space-y-2">
                {players.map((p, i) => (
                    <li key={p.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-[rgba(96,239,134,0.04)]">
                        <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-800' : i === 2 ? 'bg-orange-400 text-orange-900' : 'bg-gray-700 text-white'}`}>
                            {i + 1}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{p.name}</div>
                            <div className="text-xs text-gray-400">Player</div>
                        </div>
                        <div className="ml-auto font-mono font-semibold text-sm flex items-center gap-2">
                            {p.chips.toLocaleString()}
                            <img src="/casino-chip.png" alt="chip" className="w-4 h-4 inline-block" />
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className={`${cardBase} flex flex-col justify-center items-start gap-1 p-4`}>
            <div className="flex items-center justify-between w-full">
                <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
                    <div className="text-lg font-semibold mt-1">{value}</div>
                </div>
                <div className="text-sm text-gray-400">{sub}</div>
            </div>
        </div>
    );
}