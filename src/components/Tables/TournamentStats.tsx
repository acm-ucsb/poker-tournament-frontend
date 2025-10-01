"use client";

export function TournamentStats() {
  return (
    <p className="text-gray-500">
      Tournament statistics will be displayed here in the future.
    </p>
  );
}



export function LiveFeed() { // Feed of interesting actions, rounds, events, etc. along right side + link to the table
    // Stub list of live actions (replace with websocket data in future)
    const actions = [
        { id: 1, type: "win", player: "Alice", amount: 1200, table: "Table 2", description: "won a high pot!" },
        { id: 2, type: "loss", player: "Bob", amount: 800, table: "Table 1", description: "lost a big hand." },
        { id: 3, type: "all-in", player: "Charlie", amount: 1500, table: "Table 3", description: "went all-in!" },
        { id: 4, type: "win", player: "Dana", amount: 900, table: "Table 4", description: "won with a flush!" },
        { id: 5, type: "loss", player: "Eve", amount: 500, table: "Table 5", description: "busted out." }
    ];

    return (
        <div
            className="w-full rounded-xl mb-4"
            style={{
                background: "var(--card)",
                color: "var(--card-foreground)",
                backdropFilter: "blur(8px)",
                padding: "1.5rem"
            }}
        >
            <h2 className="text-2xl font-extrabold mb-4 text-center tracking-wide" style={{textShadow: "0 2px 8px rgba(96,239,134,0.7), 0 0 2px #222"}}>Live Feed</h2>
            <ul className="space-y-3">
                {actions.map(action => (
                    <li
                        key={action.id}
                        className="flex flex-col w-full px-4 py-3 rounded-xl transition-all duration-200 bg-[rgba(0,0,0,0.10)] hover:bg-[rgba(96,239,134,0.10)]"
                    >
                        <div className="flex flex-wrap items-center w-full">
                            <span className="font-bold mr-2" style={{color: action.type === 'win' ? '#60ef86' : action.type === 'loss' ? '#ef6060' : '#f5c542'}}>
                                {action.type === 'win' && '🏆'}
                                {action.type === 'loss' && '💔'}
                                {action.type === 'all-in' && '🔥'}
                            </span>
                            <span className="font-semibold" style={{textShadow: "0 2px 8px rgba(96,239,134,0.4), 0 0 2px #222"}}>{action.player}</span>
                            <span className="mx-2 text-xs text-gray-400">at {action.table}</span>
                            <span className="ml-auto flex items-center gap-2 font-mono text-lg font-bold">
                                {action.amount.toLocaleString()}
                                <img src="/casino-chip.png" alt="Casino Chip" className="w-5 h-5 inline-block" />
                            </span>
                        </div>
                        <span className="mt-1 text-sm italic text-gray-300 w-full break-words">{action.description}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function TournamentDetails() { // Tournament name,start time, end time, buy in, current blind, etc.
    // Stub tournament details (replace with API data in future)
    const tournament = {
        name: "ACM Poker Tournament 2025",
        startTime: "Aug 20, 2025, 6:00 PM",
        endTime: "Aug 20, 2025, 11:00 PM",
        buyIn: 1000,
        currentBlind: "100 / 200",
        totalPlayers: 120,
        tables: 10,
        status: "In Progress"
    };

    // NOTE: This is a stub, dk if we want this here or what to display if so
    return (
        <div className="w-full mb-4">
            <h2 className="text-2xl font-extrabold mb-4 text-left tracking-wide" style={{textShadow: "0 2px 8px rgba(96,239,134,0.7), 0 0 2px #222"}}>
                {tournament.name}
            </h2>
            <div className="flex flex-col gap-2 text-lg">
                <div className="flex"><span className="font-semibold text-gray-400 w-40">Start Time:</span><span className="font-bold text-white">{tournament.startTime}</span></div>
                <div className="flex"><span className="font-semibold text-gray-400 w-40">End Time:</span><span className="font-bold text-white">{tournament.endTime}</span></div>
                <div className="flex items-center"><span className="font-semibold text-gray-400 w-40">Buy-In:</span><span className="font-bold text-[#60ef86]">{tournament.buyIn.toLocaleString()} <img src="/casino-chip.png" alt="Casino Chip" className="w-5 h-5 inline-block ml-1" /></span></div>
                <div className="flex"><span className="font-semibold text-gray-400 w-40">Current Blind:</span><span className="font-bold text-[#f5c542]">{tournament.currentBlind}</span></div>
                <div className="flex"><span className="font-semibold text-gray-400 w-40">Total Players:</span><span className="font-bold text-white">{tournament.totalPlayers}</span></div>
                <div className="flex"><span className="font-semibold text-gray-400 w-40">Tables:</span><span className="font-bold text-white">{tournament.tables}</span></div>
                <div className="flex"><span className="font-semibold text-gray-400 w-40">Status:</span><span className="font-bold text-[#60ef86]">{tournament.status}</span></div>
            </div>
        </div>
    );
}