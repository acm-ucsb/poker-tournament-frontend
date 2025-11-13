export const pokerGuide = `
# Poker Bot Guide & Tournament Ruleset

## Texas Hold'em Basics

### Game Overview
Texas Hold'em is a community card poker game where players try to make the best 5-card poker hand using any combination of their 2 private cards which are dealt to you and the 5 community cards.

### Hand Rankings (Highest to Lowest)
1. **Royal Flush** - A, K, Q, J, 10 all of the same suit
2. **Straight Flush** - Five cards in sequence, all of the same suit
3. **Four of a Kind** - Four cards of the same rank
4. **Full House** - Three of a kind plus a pair
5. **Flush** - Five cards of the same suit, not in sequence
6. **Straight** - Five cards in sequence, not all the same suit
7. **Three of a Kind** - Three cards of the same rank
8. **Two Pair** - Two different pairs
9. **One Pair** - Two cards of the same rank
10. **High Card** - When no other hand is made, the highest card plays

### General Terms
- **Blinds**: Forced bets to start the pot (Small Blind and Big Blind). Always posted by two players to the left of the dealer button.
- **Dealer Button**: A marker that indicates the nominal dealer position; rotates clockwise after each hand.
- **Check**: To pass the action to the next player without betting
- **Call**: To match the current highest bet
- **Raise**: To increase the current highest bet
- **Fold**: To discard your hand and forfeit the pot
- **All-In**: To bet all your remaining chips

### Betting Rounds

#### 1. Pre-Flop
- Each player receives 2 cards for themselves
- First betting round begins with player left of big blind
- Players can fold, call, or raise

#### 2. Flop
- 3 community cards are dealt face-up
- Second betting round begins with player left of dealer button
- Players can check, bet, call, raise, or fold

#### 3. Turn
- 1 additional community card is dealt face-up (4 total)
- Third betting round, same actions as flop

#### 4. River
- Final community card is dealt face-up (5 total)
- Final betting round, same actions as turn

#### 5. Showdown
- Remaining players reveal their hands
- Best 5-card hand wins the pot

## Tournament Ruleset Specifications

### Game Format
- **Variant**: No-Limit Texas Hold'em (bets are uncapped)
- **Tournament Type**: Multi-table tournament with table balancing

### Starting Conditions
- **Starting Chips**: Varies by tournament (check tournament details on dashboard)
- **Players Per Table**: 2-8 players
- **Table Balancing**: Tables are balanced as players are eliminated

### Blind Structure
- **Small Blind**: Starts at a base value (e.g., 5 chips)
- **Big Blind**: Double the small blind (e.g., 10 chips)
- **Blind Position**: Rotates clockwise after each hand
- **Blind Increases**: Blinds increase by 2x at regular intervals to ensure tournament progression

### Betting Rules
- **No-Limit**: Players can bet any amount up to their entire stack
- **Minimum Bet**: Must be at least the size of the big blind
- **Minimum Raise**: Must be at least 2x the size of the previous largest bet or raise
- **Check**: Allowed when no bet has been made in the current round
- **All-In**: Player can bet their entire remaining stack at any time

### Action Rules
Your bot must return a valid bet amount on its turn:
- **Fold**: Return \`-1\` or any negative number
- **Check/Call**: Return \`0\` (when checking) or the amount needed to call
- **Raise/Bet**: Return an amount >= minimum bet/raise
- **All-In**: Return your entire remaining stack

### Illegal Actions
If your bot makes an illegal move, it will be treated as a **fold**:
- Checking when a bet is required (should call or raise)
- Betting less than the minimum required
- Returning invalid values
- Timing out (exceeding 5 seconds)
- Throwing errors or crashing

### Side Pots
When a player goes all-in with less than the current bet:
- A side pot is created for players with remaining chips
- Players are only eligible to win pots they contributed to
- Multiple side pots can exist in a single hand

### Card Notation
Cards are represented as 2-character strings:
- **First character**: Rank - \`2, 3, 4, 5, 6, 7, 8, 9, t, j, q, k, a\` (lowercase)
- **Second character**: Suit - \`s\` (spades), \`d\` (diamonds), \`c\` (clubs), \`h\` (hearts)
- **Example**: \`"as"\` = Ace of Spades, \`"kh"\` = King of Hearts, \`"2d"\` = 2 of Diamonds

## Strategies/Tips to Consider:

### Starting Hand Selection
- **Premium Hands**: AA, KK, QQ, AK - Always play these strongly
- **Strong Hands**: JJ, TT, AQ, AJ - Play these carefully based on position
- **Speculative Hands**: Small pairs, suited connectors - Play these in late position
- **Weak Hands**: Unconnected low cards - Usually fold these

### Position Importance
- **Early Position**: Play tighter (stronger hands only)
- **Late Position**: Play more hands, you have information advantage
- **Button (Dealer)**: Best position, play widest range of hands

### Pot Odds & Math
- Compare the size of the pot to the cost of calling
- If pot odds are better than odds of making your hand, call
- Example: Pot is 100, cost to call is 20, you need ~17% equity to call

### Reading Opponents
- Betting patterns reveal hand strength
- Aggressive players bet/raise frequently
- Passive players call more often
- Adapt your strategy based on opponent tendencies

### Bankroll Management
- Don't risk all chips on marginal hands
- Preserve chips for better opportunities
- Pay attention to stack sizes relative to blinds

## Bot-Specific Considerations

### State Management
- Bots themselves carry no memory (any stored variables will be lost) - track history if needed
- Don't rely on global variables or previous hand information
- Process all necessary information from the current game state

### Edge Cases
- Handle all-in situations correctly
- Deal with minimum bet/raise requirements
- Optionally: Handle edge cases like heads-up (1v1), short stacks (little chips left), etc.

## Need Help?

- Join the [ACM Discord server](https://discord.gg/p6rcUUjWaU)
- Email: acm.dev.ucsb@gmail.com

---

**Good luck at the tables!** 🃏♠️♥️♦️♣️
`;
